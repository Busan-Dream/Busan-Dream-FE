import { useState, useCallback } from "react";
import { debugLog } from "@/utils/debug";

interface UseVideoUploadReturn {
  savedVideoUrl: string | null;
  saveVideoLocally: (videoBlob: Blob) => string;
  downloadVideo: (videoBlob?: Blob) => Promise<boolean>;
  restoreVideoFromSession: () => string | null;
}

export const useVideoUpload = (): UseVideoUploadReturn => {
  const [savedVideoUrl, setSavedVideoUrl] = useState<string | null>(null);

  // 영상을 로컬에 저장하고 URL 반환 (세션 스토리지에도 저장)
  const saveVideoLocally = useCallback((videoBlob: Blob): string => {
    const url = URL.createObjectURL(videoBlob);
    setSavedVideoUrl(url);

    // 세션 스토리지에 영상 메타데이터 저장
    try {
      const videoKey = `interview-video-${Date.now()}`;
      const videoData = {
        url: url,
        timestamp: Date.now(),
        size: videoBlob.size,
        type: videoBlob.type,
      };

      sessionStorage.setItem(videoKey, JSON.stringify(videoData));

      // 영상 데이터를 Base64로 변환하여 저장 (50MB 이하만)
      if (videoBlob.size < 50 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64Data = reader.result as string;
          sessionStorage.setItem(`${videoKey}-data`, base64Data);
          debugLog("영상 세션 스토리지 저장 완료:", videoKey);
        };
        reader.readAsDataURL(videoBlob);
      } else {
        debugLog(
          "영상 크기가 커서 세션 스토리지에 저장하지 않음:",
          videoBlob.size
        );
      }
    } catch (error) {
      debugLog("세션 스토리지 저장 실패:", error);
    }

    debugLog("영상 로컬 저장 완료:", url);
    return url;
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

        // Base64 데이터가 있으면 새로운 Blob URL 생성 (페이지 새로고침 후에도 작동)
        const base64Data = sessionStorage.getItem(`${latestKey}-data`);
        if (base64Data) {
          const videoData = JSON.parse(sessionStorage.getItem(latestKey)!);
          debugLog(
            "Base64 데이터에서 영상 복원 시작, MIME 타입:",
            videoData?.type
          );
          fetch(base64Data)
            .then((res) => res.blob())
            .then((blob) => {
              // 원본 MIME 타입으로 새로운 Blob 생성
              const typedBlob = videoData?.type
                ? new Blob([blob], { type: videoData.type })
                : blob;
              const url = URL.createObjectURL(typedBlob);
              setSavedVideoUrl(url);
              debugLog("세션 스토리지에서 영상 복원 완료 (Base64):", url);
            })
            .catch((error) => {
              debugLog("Base64에서 Blob 변환 실패:", error);
            });
          return base64Data;
        }

        // Base64 데이터가 없으면 기존 URL 사용 (새로고침 전에만 유효)
        const videoData = JSON.parse(sessionStorage.getItem(latestKey)!);
        if (videoData && videoData.url) {
          setSavedVideoUrl(videoData.url);
          debugLog(
            "세션 스토리지에서 영상 URL 복원 (새로고침 전):",
            videoData.url
          );
          return videoData.url;
        }
      }
    } catch (error) {
      debugLog("세션 스토리지에서 영상 복원 실패:", error);
    }
    return null;
  }, []);

  // 영상 다운로드
  const downloadVideo = useCallback(
    async (videoBlob?: Blob): Promise<boolean> => {
      if (!videoBlob && !savedVideoUrl) {
        console.error("다운로드할 영상이 없습니다.");
        return false;
      }

      try {
        if (videoBlob) {
          const url = URL.createObjectURL(videoBlob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `interview-${Date.now()}.mp4`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          debugLog("영상 다운로드 완료 (.mp4), 실제 타입:", videoBlob.type);
          return true;
        } else {
          // savedVideoUrl에서 Blob 가져오기
          const response = await fetch(savedVideoUrl!);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const blobData = await response.blob();
          const url = URL.createObjectURL(blobData);
          const link = document.createElement("a");
          link.href = url;
          link.download = `interview-${Date.now()}.mp4`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          debugLog("영상 다운로드 완료 (.mp4), 실제 타입:", blobData.type);
          return true;
        }
      } catch (error) {
        console.error("영상 다운로드 실패:", error);
        return false;
      }
    },
    [savedVideoUrl]
  );

  return {
    savedVideoUrl,
    saveVideoLocally,
    downloadVideo,
    restoreVideoFromSession,
  };
};
