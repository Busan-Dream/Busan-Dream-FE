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
          debugLog("영상 다운로드 완료");
          return true;
        } else {
          // savedVideoUrl에서 Blob 가져오기
          const response = await fetch(savedVideoUrl!);
          const blobData = await response.blob();
          const url = URL.createObjectURL(blobData);
          const link = document.createElement("a");
          link.href = url;
          link.download = `interview-${Date.now()}.mp4`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          debugLog("영상 다운로드 완료");
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
