import axiosInstance from "@/apis/api";
import axios from "axios";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type AnalysisStatus = "idle" | "analyzing" | "completed" | "error";
export type IndividualStatus = "idle" | "analyzing" | "completed" | "error";

interface VideoAnalysisResult {
  Score?: string | number;
  Posture?: string;
  FacialExpressions?: string;
  Gestures?: string;
  DetailedFeedback?: string;
  SentimentAnalysis?: {
    confidence_level?: string;
    emotional_stability?: string;
    sentiment_score?: string;
    stress_level?: string;
  };
  [key: string]: unknown;
}

interface AudioAnalysisResult {
  Score?: string | number;
  Clarity?: string;
  Logicality?: string;
  Expertise?: string;
  FrequentlyUsedWords?: string[];
  [key: string]: unknown;
}

export interface AnalysisResult {
  video?: VideoAnalysisResult;
  audio?: AudioAnalysisResult;
}

export interface IndividualAnalysisStatus {
  video: IndividualStatus;
  audio: IndividualStatus;
}

export interface AnalysisTiming {
  videoStartTime?: number;
  videoEndTime?: number;
  audioStartTime?: number;
  audioEndTime?: number;
  videoDuration?: number;
  audioDuration?: number;
}

export interface InterviewTarget {
  postingOrgan: string;
  postingField?: string;
  postingPart: string;
}

interface AnalysisStore {
  isAnalyzing: boolean;
  analysisStatus: AnalysisStatus;
  individualStatus: IndividualAnalysisStatus;
  analysisResults: AnalysisResult;
  analysisTiming: AnalysisTiming;
  interviewQuestion: string;
  analysisError: string | null;
  interviewTarget: InterviewTarget | null;
  setInterviewTarget: (target: InterviewTarget) => void;
  startAnalysis: (videoBlob: Blob, question: string) => void;
  resetAnalysis: () => void;
  updateVideoResult: (result: VideoAnalysisResult) => void;
  updateAudioResult: (result: AudioAnalysisResult) => void;
}

type AnalysisChannel = keyof IndividualAnalysisStatus;

const initialAnalysisState = {
  isAnalyzing: false,
  analysisStatus: "idle" as AnalysisStatus,
  individualStatus: {
    video: "idle",
    audio: "idle",
  } as IndividualAnalysisStatus,
  analysisResults: {} as AnalysisResult,
  analysisTiming: {} as AnalysisTiming,
  interviewQuestion: "",
  analysisError: null as string | null,
};

const getAggregateState = (individualStatus: IndividualAnalysisStatus) => {
  const statuses = Object.values(individualStatus);

  if (statuses.every((status) => status === "completed")) {
    return { analysisStatus: "completed" as const, isAnalyzing: false };
  }

  if (statuses.some((status) => status === "error")) {
    return {
      analysisStatus: "error" as const,
      isAnalyzing: statuses.some((status) => status === "analyzing"),
    };
  }

  if (statuses.some((status) => status === "analyzing")) {
    return { analysisStatus: "analyzing" as const, isAnalyzing: true };
  }

  return { analysisStatus: "idle" as const, isAnalyzing: false };
};

const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || fallback;
  }

  return error instanceof Error ? error.message : fallback;
};

export const useAnalysisStore = create<AnalysisStore>()(
  persist(
    (set, get) => {
      const updateResult = (
        channel: AnalysisChannel,
        result: VideoAnalysisResult | AudioAnalysisResult
      ) => {
        set((state) => {
          const individualStatus = {
            ...state.individualStatus,
            [channel]: "completed" as const,
          };

          return {
            analysisResults: {
              ...state.analysisResults,
              [channel]: result,
            },
            individualStatus,
            ...getAggregateState(individualStatus),
          };
        });
      };

      const updateTiming = (channel: AnalysisChannel, startTime: number) => {
        const endTime = performance.now();
        const duration = endTime - startTime;

        set((state) => ({
          analysisTiming: {
            ...state.analysisTiming,
            [`${channel}EndTime`]: endTime,
            [`${channel}Duration`]: duration,
          },
        }));
      };

      const failChannel = (channel: AnalysisChannel, message: string) => {
        set((state) => {
          const individualStatus = {
            ...state.individualStatus,
            [channel]: "error" as const,
          };

          return {
            individualStatus,
            analysisError: state.analysisError
              ? `${state.analysisError}, ${message}`
              : message,
            ...getAggregateState(individualStatus),
          };
        });
      };

      return {
        ...initialAnalysisState,
        interviewTarget: null,

        setInterviewTarget: (interviewTarget) => set({ interviewTarget }),

        resetAnalysis: () =>
          set({
            ...initialAnalysisState,
            interviewTarget: null,
          }),

        updateVideoResult: (result) => updateResult("video", result),
        updateAudioResult: (result) => updateResult("audio", result),

        startAnalysis: (videoBlob, question) => {
          const analysisStartTime = performance.now();

          set({
            isAnalyzing: true,
            analysisStatus: "analyzing",
            individualStatus: { video: "analyzing", audio: "analyzing" },
            analysisResults: {},
            analysisTiming: {
              videoStartTime: analysisStartTime,
              audioStartTime: analysisStartTime,
            },
            interviewQuestion: question,
            analysisError: null,
          });

          const formData = new FormData();
          formData.append("file", videoBlob, `interview-${Date.now()}.mp4`);

          void (async () => {
            try {
              const uploadResponse = await axiosInstance.post(
                "/ai/upload",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
              );
              const videoUrl = uploadResponse.data.fileName;

              if (!videoUrl) {
                throw new Error("업로드 응답에서 파일 URL을 찾을 수 없습니다.");
              }

              await Promise.all([
                axiosInstance
                  .post("/ai/video", { link: videoUrl })
                  .then((response) => {
                    updateTiming("video", analysisStartTime);
                    get().updateVideoResult(response.data);
                  })
                  .catch((error: unknown) => {
                    updateTiming("video", analysisStartTime);
                    failChannel(
                      "video",
                      getApiErrorMessage(
                        error,
                        "영상 분석 중 오류가 발생했습니다."
                      )
                    );
                  }),
                axiosInstance
                  .post("/ai/voice", { link: videoUrl, question })
                  .then((response) => {
                    updateTiming("audio", analysisStartTime);
                    get().updateAudioResult(response.data);
                  })
                  .catch((error: unknown) => {
                    updateTiming("audio", analysisStartTime);
                    failChannel(
                      "audio",
                      getApiErrorMessage(
                        error,
                        "음성 분석 중 오류가 발생했습니다."
                      )
                    );
                  }),
              ]);
            } catch (error) {
              const message = getApiErrorMessage(
                error,
                "영상 업로드 중 오류가 발생했습니다."
              );

              set({
                isAnalyzing: false,
                analysisStatus: "error",
                individualStatus: { video: "error", audio: "error" },
                analysisError: message,
              });
            }
          })();
        },
      };
    },
    {
      name: "analysis-store",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        analysisStatus: state.analysisStatus,
        individualStatus: state.individualStatus,
        analysisResults: state.analysisResults,
        analysisTiming: state.analysisTiming,
        interviewQuestion: state.interviewQuestion,
        analysisError: state.analysisError,
        interviewTarget: state.interviewTarget,
      }),
      merge: (persistedState, currentState) => {
        const saved = persistedState as Partial<AnalysisStore>;
        const savedIndividualStatus =
          saved.individualStatus ?? currentState.individualStatus;
        const wasInterrupted =
          saved.analysisStatus === "analyzing" ||
          Object.values(savedIndividualStatus).some(
            (status) => status === "analyzing"
          );

        if (!wasInterrupted) {
          return { ...currentState, ...saved };
        }

        return {
          ...currentState,
          ...saved,
          isAnalyzing: false,
          analysisStatus: "error",
          individualStatus: {
            video:
              savedIndividualStatus.video === "analyzing"
                ? "error"
                : savedIndividualStatus.video,
            audio:
              savedIndividualStatus.audio === "analyzing"
                ? "error"
                : savedIndividualStatus.audio,
          },
          analysisError:
            "페이지 새로고침으로 분석 요청이 중단되었습니다. 면접을 다시 진행해주세요.",
        };
      },
    }
  )
);
