import { useRef, useState, useCallback } from "react";

interface UseMediaRecorderReturn {
  isRecording: boolean;
  recordingTime: number;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Blob | null>;
  getSupportedMimeType: () => string;
}

export const useMediaRecorder = (
  stream: MediaStream | null
): UseMediaRecorderReturn => {
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const getSupportedMimeType = useCallback(() => {
    const candidates = [
      "video/mp4;codecs=avc1,mp4a.40.2", // H.264 + AAC (가장 호환성 좋음)
      "video/mp4;codecs=h264,aac",
      "video/mp4;codecs=avc1",
      "video/mp4",
      "video/webm;codecs=h264,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm",
    ];

    console.log("🔍 브라우저 지원 MIME 타입 확인:");
    candidates.forEach((type) => {
      const supported = MediaRecorder.isTypeSupported(type);
      console.log(`  ${supported ? "✅" : "❌"} ${type}`);
    });

    const supported = candidates.find((type) =>
      MediaRecorder.isTypeSupported(type)
    );

    if (supported) {
      console.log("✅ 최종 선택된 MIME 타입:", supported);

      // Opus 오디오 코덱 경고
      if (supported.includes("opus")) {
        console.warn(
          "⚠️ Opus 오디오 코덱으로 녹화됩니다.",
          "\n일부 플레이어에서 재생이 안 될 수 있습니다.",
          "\n백엔드에서 AAC 변환이 필요할 수 있습니다."
        );
      }

      // WebM이 선택된 경우 경고
      if (supported.includes("webm")) {
        console.warn(
          "⚠️ 브라우저가 MP4를 지원하지 않아 WebM으로 녹화됩니다.",
          "\n백엔드 AI 분석이 제대로 작동하지 않을 수 있습니다.",
          "\nSafari 또는 Edge 브라우저 사용을 권장합니다."
        );
      }
    } else {
      console.warn("지원하는 MIME 타입이 없습니다. 기본 형식 사용");
    }

    return supported || "";
  }, []);

  const startRecording = useCallback(async () => {
    if (!stream) {
      console.error("스트림이 없습니다.");
      return;
    }

    // 스트림에 오디오 트랙이 있는지 확인
    const audioTracks = stream.getAudioTracks();
    const videoTracks = stream.getVideoTracks();

    console.log("녹화 시작 전 트랙 확인:", {
      audioTracks: audioTracks.length,
      videoTracks: videoTracks.length,
      audioTrackEnabled: audioTracks[0]?.enabled,
      audioTrackMuted: audioTracks[0]?.muted,
    });

    if (audioTracks.length === 0) {
      console.error("오디오 트랙이 없습니다. 녹화를 시작할 수 없습니다.");
      return;
    }

    try {
      const mimeType = getSupportedMimeType();
      const options = mimeType ? { mimeType } : undefined;

      const recorder = new MediaRecorder(stream, options);
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstart = () => {
        setIsRecording(true);
        setRecordingTime(0);

        // 녹화 시간 타이머 시작
        timerRef.current = setInterval(() => {
          setRecordingTime((prev) => prev + 1);
        }, 1000);
      };

      recorder.onstop = () => {
        setIsRecording(false);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };

      recorder.start();
      recorderRef.current = recorder;

      console.log("녹화 시작:", mimeType);
    } catch (error) {
      console.error("녹화 시작 실패:", error);
    }
  }, [stream, getSupportedMimeType]);

  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!recorderRef.current || recorderRef.current.state !== "recording") {
        resolve(null);
        return;
      }

      recorderRef.current.onstop = () => {
        setIsRecording(false);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }

        const mimeType = recorderRef.current?.mimeType || "video/mp4";
        const blob = new Blob(chunksRef.current, { type: mimeType });

        console.log("녹화 완료:", blob.size, "bytes");
        resolve(blob);
      };

      recorderRef.current.stop();
    });
  }, []);

  return {
    isRecording,
    recordingTime,
    startRecording,
    stopRecording,
    getSupportedMimeType,
  };
};
