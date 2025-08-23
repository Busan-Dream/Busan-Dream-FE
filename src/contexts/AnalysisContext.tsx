import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AnalysisResult {
  video?: any;
  audio?: any;
}

interface IndividualAnalysisStatus {
  video: "idle" | "analyzing" | "completed" | "error";
  audio: "idle" | "analyzing" | "completed" | "error";
}

interface AnalysisTiming {
  videoStartTime?: number;
  videoEndTime?: number;
  audioStartTime?: number;
  audioEndTime?: number;
  videoDuration?: number;
  audioDuration?: number;
}

interface AnalysisContextType {
  // 분석 상태
  isAnalyzing: boolean;
  analysisStatus: "idle" | "analyzing" | "completed" | "error";

  // 개별 분석 상태
  individualStatus: IndividualAnalysisStatus;

  // 분석 결과
  analysisResults: AnalysisResult;
  analysisTiming: AnalysisTiming;

  // 면접 질문
  interviewQuestion: string;

  // 에러 상태
  analysisError: string | null;

  // 분석 시작
  startAnalysis: (videoBlob: Blob, question: string) => void;

  // 상태 초기화
  resetAnalysis: () => void;

  // 개별 결과 업데이트
  updateVideoResult: (result: any) => void;
  updateAudioResult: (result: any) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(
  undefined
);

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error("useAnalysis must be used within an AnalysisProvider");
  }
  return context;
};

interface AnalysisProviderProps {
  children: ReactNode;
}

export const AnalysisProvider: React.FC<AnalysisProviderProps> = ({
  children,
}) => {
  // 세션스토리지에서 초기 데이터 로드
  const getInitialData = () => {
    try {
      const stored = sessionStorage.getItem("analysisData");
      if (stored) {
        const data = JSON.parse(stored);
        return {
          isAnalyzing: data.isAnalyzing || false,
          analysisStatus: data.analysisStatus || "idle",
          individualStatus: data.individualStatus || {
            video: "idle",
            audio: "idle",
          },
          analysisResults: data.analysisResults || {},
          analysisTiming: data.analysisTiming || {},
          interviewQuestion: data.interviewQuestion || "",
          analysisError: data.analysisError || null,
        };
      }
    } catch (error) {
      console.error("세션스토리지 데이터 로드 실패:", error);
    }
    return {
      isAnalyzing: false,
      analysisStatus: "idle" as const,
      individualStatus: { video: "idle", audio: "idle" },
      analysisResults: {},
      analysisTiming: {},
      interviewQuestion: "",
      analysisError: null,
    };
  };

  const initialData = getInitialData();

  const [isAnalyzing, setIsAnalyzing] = useState(initialData.isAnalyzing);
  const [analysisStatus, setAnalysisStatus] = useState<
    "idle" | "analyzing" | "completed" | "error"
  >(initialData.analysisStatus);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult>(
    initialData.analysisResults
  );
  const [analysisTiming, setAnalysisTiming] = useState<AnalysisTiming>(
    initialData.analysisTiming
  );
  const [interviewQuestion, setInterviewQuestion] = useState<string>(
    initialData.interviewQuestion
  );
  const [analysisError, setAnalysisError] = useState<string | null>(
    initialData.analysisError
  );
  const [individualStatus, setIndividualStatus] =
    useState<IndividualAnalysisStatus>(initialData.individualStatus);

  // 세션스토리지에 데이터 저장
  const saveToSessionStorage = (data: any) => {
    try {
      sessionStorage.setItem("analysisData", JSON.stringify(data));
    } catch (error) {
      console.error("세션스토리지 저장 실패:", error);
    }
  };

  const resetAnalysis = () => {
    setIsAnalyzing(false);
    setAnalysisStatus("idle");
    setIndividualStatus({ video: "idle", audio: "idle" });
    setAnalysisResults({});
    setAnalysisTiming({});
    setInterviewQuestion("");
    setAnalysisError(null);
    // 세션스토리지도 클리어
    sessionStorage.removeItem("analysisData");
  };

  const updateVideoResult = (result: any) => {
    setAnalysisResults((prev) => ({ ...prev, video: result }));
    setIndividualStatus((prev) => ({ ...prev, video: "completed" }));
  };

  const updateAudioResult = (result: any) => {
    setAnalysisResults((prev) => ({ ...prev, audio: result }));
    setIndividualStatus((prev) => ({ ...prev, audio: "completed" }));
  };

  // 분석 결과가 업데이트될 때마다 완료 상태 체크
  useEffect(() => {
    if (analysisStatus === "analyzing") {
      if (
        individualStatus.video === "completed" &&
        individualStatus.audio === "completed"
      ) {
        // 둘 다 완료된 경우
        setAnalysisStatus("completed");
      } else if (analysisError) {
        // 에러가 있는 경우
        setAnalysisStatus("error");
      }
    }
  }, [individualStatus, analysisStatus, analysisError]);

  // 상태가 변경될 때마다 세션스토리지에 저장
  useEffect(() => {
    const dataToSave = {
      isAnalyzing,
      analysisStatus,
      individualStatus,
      analysisResults,
      analysisTiming,
      interviewQuestion,
      analysisError,
    };
    saveToSessionStorage(dataToSave);
  }, [
    isAnalyzing,
    analysisStatus,
    individualStatus,
    analysisResults,
    analysisTiming,
    interviewQuestion,
    analysisError,
  ]);

  const startAnalysis = (videoBlob: Blob, question: string) => {
    // 분석 상태 초기화
    setIsAnalyzing(true);
    setAnalysisStatus("analyzing");
    setIndividualStatus({ video: "analyzing", audio: "analyzing" });
    setAnalysisError(null);
    setAnalysisResults({});
    setInterviewQuestion(question);

    const analysisStartTime = performance.now();
    setAnalysisTiming({
      videoStartTime: analysisStartTime,
      audioStartTime: analysisStartTime,
    });

    // FormData 생성
    const formData = new FormData();
    const fileName = `interview-${Date.now()}.mp4`;
    formData.append("file", videoBlob, fileName);

    // 비동기로 분석 시작
    import("@/apis/api")
      .then(({ axiosInstance }) => {
        // 1. 영상 업로드
        axiosInstance
          .post("/ai/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((uploadResponse) => {
            const videoUrl = uploadResponse.data.fileName;

            if (!videoUrl) {
              setAnalysisError("업로드 응답에서 파일 URL을 찾을 수 없습니다.");
              return;
            }

            // 2. 영상 분석 요청
            axiosInstance
              .post("/ai/video", { link: videoUrl })
              .then((response) => {
                const videoEndTime = performance.now();
                const videoDuration = videoEndTime - analysisStartTime;

                setAnalysisTiming((prev) => ({
                  ...prev,
                  videoEndTime,
                  videoDuration,
                }));

                updateVideoResult(response.data);
              })
              .catch((error) => {
                const videoEndTime = performance.now();
                const videoDuration = videoEndTime - analysisStartTime;

                setAnalysisTiming((prev) => ({
                  ...prev,
                  videoEndTime,
                  videoDuration,
                }));

                const errorMessage =
                  error.response?.data?.message ||
                  "영상 분석 중 오류가 발생했습니다.";
                setIndividualStatus((prev) => ({ ...prev, video: "error" }));
                setAnalysisError((prev) =>
                  prev ? `${prev}, ${errorMessage}` : errorMessage
                );
              });

            // 3. 음성 분석 요청
            axiosInstance
              .post("/ai/voice", {
                link: videoUrl,
                question: question,
              })
              .then((response) => {
                const audioEndTime = performance.now();
                const audioDuration = audioEndTime - analysisStartTime;

                setAnalysisTiming((prev) => ({
                  ...prev,
                  audioEndTime,
                  audioDuration,
                }));

                updateAudioResult(response.data);
              })
              .catch((error) => {
                const audioEndTime = performance.now();
                const audioDuration = audioEndTime - analysisStartTime;

                setAnalysisTiming((prev) => ({
                  ...prev,
                  audioEndTime,
                  audioDuration,
                }));

                const errorMessage =
                  error.response?.data?.message ||
                  "음성 분석 중 오류가 발생했습니다.";
                setIndividualStatus((prev) => ({ ...prev, audio: "error" }));
                setAnalysisError((prev) =>
                  prev ? `${prev}, ${errorMessage}` : errorMessage
                );
              });
          })
          .catch((error) => {
            const errorMessage =
              error.response?.data?.message || "업로드 중 오류가 발생했습니다.";
            setAnalysisError(errorMessage);
          });
      })
      .catch((error) => {
        setAnalysisError("API 모듈을 불러올 수 없습니다.");
      });
  };

  const value: AnalysisContextType = {
    isAnalyzing,
    analysisStatus,
    individualStatus,
    analysisResults,
    analysisTiming,
    interviewQuestion,
    analysisError,
    startAnalysis,
    resetAnalysis,
    updateVideoResult,
    updateAudioResult,
  };

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
};
