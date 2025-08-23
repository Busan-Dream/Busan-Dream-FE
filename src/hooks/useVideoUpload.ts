import { useState, useCallback } from "react";
import { axiosInstance } from "@/apis/api";
import { debugLog } from "@/utils/debug";

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

interface AnalysisResult {
  video?: any;
  audio?: any;
}

interface AnalysisTiming {
  videoStartTime?: number;
  videoEndTime?: number;
  audioStartTime?: number;
  audioEndTime?: number;
  videoDuration?: number;
  audioDuration?: number;
}

interface UseVideoUploadReturn {
  isUploading: boolean;
  uploadProgress: UploadProgress | null;
  uploadError: string | null;
  isAnalyzing: boolean;
  analysisResult: AnalysisResult;
  analysisError: string | null;
  analysisTiming: AnalysisTiming;
  savedVideoUrl: string | null;
  uploadVideo: (
    videoBlob: Blob,
    metadata?: Record<string, any>
  ) => Promise<any>;
  uploadAndAnalyze: (
    videoBlob: Blob,
    question: string,
    metadata?: Record<string, any>,
    onVideoAnalysis?: (result: any) => void,
    onAudioAnalysis?: (result: any) => void
  ) => Promise<any>;
  saveVideoLocally: (videoBlob: Blob) => string;
  downloadVideo: (videoBlob?: Blob) => void;
  restoreVideoFromSession: () => string | null;
  resetUpload: () => void;
  clearBackupData: () => void;
}

export const useVideoUpload = (): UseVideoUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(
    null
  );
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>({});
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisTiming, setAnalysisTiming] = useState<AnalysisTiming>({});
  const [savedVideoUrl, setSavedVideoUrl] = useState<string | null>(null);

  const uploadVideo = useCallback(async (videoBlob: Blob, metadata = {}) => {
    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(null);

    try {
      // FormData 생성
      const formData = new FormData();

      const fileName = `interview-${Date.now()}.mp4`;
      formData.append("file", videoBlob, fileName);

      // 메타데이터 추가 (필요시)
      if (Object.keys(metadata).length > 0) {
        formData.append("metadata", JSON.stringify(metadata));
      }

      // 업로드 요청
      const response = await axiosInstance.post("/ai/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = {
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage: Math.round(
                (progressEvent.loaded / progressEvent.total) * 100
              ),
            };
            setUploadProgress(progress);
          }
        },
      });

      console.log("영상 업로드 성공:", response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "업로드 중 오류가 발생했습니다.";
      setUploadError(errorMessage);
      console.error("영상 업로드 실패:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const uploadAndAnalyze = useCallback(
    async (
      videoBlob: Blob,
      question: string,
      metadata = {},
      onVideoAnalysis?: (result: any) => void,
      onAudioAnalysis?: (result: any) => void
    ) => {
      try {
        // 1. 영상 업로드
        const uploadResult = await uploadVideo(videoBlob, metadata);
        const videoUrl = uploadResult.fileName;

        if (!videoUrl) {
          throw new Error("업로드 응답에서 파일 URL을 찾을 수 없습니다.");
        }

        // 2. 분석 요청 (각각 독립적으로 처리)
        setIsAnalyzing(true);
        setAnalysisError(null);
        setAnalysisResult({});

        // 분석 시작 시간 기록
        const analysisStartTime = performance.now();
        setAnalysisTiming({
          videoStartTime: analysisStartTime,
          audioStartTime: analysisStartTime,
        });

        // 영상 분석 요청
        const videoAnalysisPromise = axiosInstance
          .post("/ai/video", { link: videoUrl })
          .then((response) => {
            const videoEndTime = performance.now();
            const videoDuration = videoEndTime - analysisStartTime;

            debugLog(
              `영상 분석 완료: ${(videoDuration / 1000).toFixed(2)}초 소요`
            );
            setAnalysisResult((prev) => ({ ...prev, video: response.data }));
            setAnalysisTiming((prev) => ({
              ...prev,
              videoEndTime,
              videoDuration,
            }));
            onVideoAnalysis?.(response.data);
            return response.data;
          })
          .catch((error) => {
            const videoEndTime = performance.now();
            const videoDuration = videoEndTime - analysisStartTime;

            debugLog(
              `영상 분석 실패: ${(videoDuration / 1000).toFixed(2)}초 후 실패`
            );
            setAnalysisTiming((prev) => ({
              ...prev,
              videoEndTime,
              videoDuration,
            }));
            const errorMessage =
              error.response?.data?.message ||
              "영상 분석 중 오류가 발생했습니다.";
            setAnalysisError((prev) =>
              prev ? `${prev}, ${errorMessage}` : errorMessage
            );
            throw error;
          });

        // 음성 분석 요청
        const audioAnalysisPromise = axiosInstance
          .post("/ai/voice", {
            link: videoUrl,
            question: question,
          })
          .then((response) => {
            const audioEndTime = performance.now();
            const audioDuration = audioEndTime - analysisStartTime;

            debugLog(
              `음성 분석 완료: ${(audioDuration / 1000).toFixed(2)}초 소요`
            );
            setAnalysisResult((prev) => ({ ...prev, audio: response.data }));
            setAnalysisTiming((prev) => ({
              ...prev,
              audioEndTime,
              audioDuration,
            }));
            onAudioAnalysis?.(response.data);
            return response.data;
          })
          .catch((error) => {
            const audioEndTime = performance.now();
            const audioDuration = audioEndTime - analysisStartTime;

            debugLog(
              `음성 분석 실패: ${(audioDuration / 1000).toFixed(2)}초 후 실패`
            );
            setAnalysisTiming((prev) => ({
              ...prev,
              audioEndTime,
              audioDuration,
            }));
            const errorMessage =
              error.response?.data?.message ||
              "음성 분석 중 오류가 발생했습니다.";
            setAnalysisError((prev) =>
              prev ? `${prev}, ${errorMessage}` : errorMessage
            );
            throw error;
          });

        // 두 분석이 모두 완료되기를 기다림 (에러가 있어도 계속 진행)
        const [videoResult, audioResult] = await Promise.allSettled([
          videoAnalysisPromise,
          audioAnalysisPromise,
        ]);

        return {
          upload: uploadResult,
          videoUrl,
          analysis: {
            video:
              videoResult.status === "fulfilled" ? videoResult.value : null,
            audio:
              audioResult.status === "fulfilled" ? audioResult.value : null,
          },
        };
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "처리 중 오류가 발생했습니다.";
        setAnalysisError(errorMessage);
        throw error;
      } finally {
        setIsAnalyzing(false);
      }
    },
    [uploadVideo]
  );

  // 영상을 로컬에 저장하고 URL 반환 (세션 스토리지에도 저장)
  const saveVideoLocally = useCallback((videoBlob: Blob): string => {
    const url = URL.createObjectURL(videoBlob);
    setSavedVideoUrl(url);

    // 세션 스토리지에 영상 저장
    try {
      const videoKey = `interview-video-${Date.now()}`;
      const videoData = {
        url: url,
        timestamp: Date.now(),
        size: videoBlob.size,
        type: videoBlob.type,
      };

      // 세션 스토리지에 메타데이터 저장
      sessionStorage.setItem(videoKey, JSON.stringify(videoData));

      // 영상 데이터를 Base64로 변환하여 저장 (용량 제한 고려)
      if (videoBlob.size < 50 * 1024 * 1024) {
        // 50MB 이하만 저장
        const reader = new FileReader();
        reader.onload = () => {
          const base64Data = reader.result as string;
          sessionStorage.setItem(`${videoKey}-data`, base64Data);
          debugLog("영상 세션 스토리지 저장 완료:", videoKey);
        };
        reader.readAsDataURL(videoBlob);
      } else {
        debugLog(
          "영상 크기가 너무 커서 세션 스토리지에 저장하지 않습니다:",
          videoBlob.size
        );
      }
    } catch (error) {
      debugLog("세션 스토리지 저장 실패:", error);
    }

    debugLog("영상 로컬 저장 완료:", url);
    return url;
  }, []);

  // 영상 다운로드 기능
  const downloadVideo = useCallback(
    (videoBlob?: Blob) => {
      if (!videoBlob && !savedVideoUrl) {
        console.error("다운로드할 영상이 없습니다.");
        return;
      }

      try {
        let blob: Blob;
        let fileName: string;

        if (videoBlob) {
          blob = videoBlob;
          fileName = `interview-${Date.now()}.mp4`;
        } else {
          // savedVideoUrl에서 Blob 가져오기
          fetch(savedVideoUrl!)
            .then((response) => response.blob())
            .then((blobData) => {
              const downloadUrl = URL.createObjectURL(blobData);
              const link = document.createElement("a");
              link.href = downloadUrl;
              link.download = `interview-${Date.now()}.mp4`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(downloadUrl);
              debugLog("영상 다운로드 완료");
            })
            .catch((error) => {
              console.error("영상 다운로드 실패:", error);
            });
          return;
        }

        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
        debugLog("영상 다운로드 완료");
      } catch (error) {
        console.error("영상 다운로드 실패:", error);
      }
    },
    [savedVideoUrl]
  );

  const resetUpload = useCallback(() => {
    setIsUploading(false);
    setUploadProgress(null);
    setUploadError(null);
    setIsAnalyzing(false);
    setAnalysisResult({});
    setAnalysisError(null);
    setAnalysisTiming({});
  }, []);

  // 세션 스토리지에서 저장된 영상 복원
  const restoreVideoFromSession = useCallback(() => {
    try {
      const videoKeys = Object.keys(sessionStorage).filter(
        (key) => key.startsWith("interview-video-") && !key.endsWith("-data")
      );

      if (videoKeys.length > 0) {
        // 가장 최근 영상 찾기
        const latestKey = videoKeys.sort().pop()!;
        const videoData = JSON.parse(sessionStorage.getItem(latestKey)!);

        if (videoData && videoData.url) {
          setSavedVideoUrl(videoData.url);
          debugLog("세션 스토리지에서 영상 복원 완료:", videoData.url);
          return videoData.url;
        }
      }
    } catch (error) {
      debugLog("세션 스토리지에서 영상 복원 실패:", error);
    }
    return null;
  }, []);

  const clearBackupData = useCallback(() => {
    debugLog("백업 데이터 정리 시작");

    // IndexedDB에서 백업 데이터 삭제 (만약 사용 중이라면)
    if ("indexedDB" in window) {
      const request = indexedDB.deleteDatabase("interview-backup");
      request.onsuccess = () => {
        debugLog("IndexedDB 백업 데이터 삭제 완료");
      };
      request.onerror = () => {
        debugLog("IndexedDB 백업 데이터 삭제 실패");
      };
    }

    // localStorage에서 백업 데이터 삭제
    try {
      const backupKeys = Object.keys(localStorage).filter(
        (key) =>
          key.startsWith("interview-backup-") ||
          key.startsWith("video-chunk-") ||
          key.startsWith("audio-chunk-")
      );

      backupKeys.forEach((key) => {
        localStorage.removeItem(key);
        debugLog(`백업 데이터 삭제: ${key}`);
      });

      debugLog(`총 ${backupKeys.length}개의 백업 데이터 삭제 완료`);
    } catch (error) {
      debugLog("localStorage 백업 데이터 삭제 중 오류:", error);
    }

    // 세션 스토리지에서 영상 데이터 삭제
    try {
      const sessionKeys = Object.keys(sessionStorage).filter((key) =>
        key.startsWith("interview-video-")
      );

      sessionKeys.forEach((key) => {
        sessionStorage.removeItem(key);
        debugLog(`세션 스토리지 데이터 삭제: ${key}`);
      });

      debugLog(`총 ${sessionKeys.length}개의 세션 스토리지 데이터 삭제 완료`);
    } catch (error) {
      debugLog("세션 스토리지 데이터 삭제 중 오류:", error);
    }

    // 메모리에서 백업 데이터 정리
    setAnalysisResult({});
    setAnalysisTiming({});
    setSavedVideoUrl(null);
    debugLog("메모리 백업 데이터 정리 완료");
  }, []);

  return {
    isUploading,
    uploadProgress,
    uploadError,
    isAnalyzing,
    analysisResult,
    analysisError,
    analysisTiming,
    savedVideoUrl,
    uploadVideo,
    uploadAndAnalyze,
    saveVideoLocally,
    downloadVideo,
    restoreVideoFromSession,
    resetUpload,
    clearBackupData,
  };
};
