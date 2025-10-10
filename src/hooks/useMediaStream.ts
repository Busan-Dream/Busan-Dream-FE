import { useRef, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

interface UseMediaStreamProps {
  isCameraGranted: boolean;
  isMicrophoneGranted: boolean;
  setPermissionsDirectly: (permissions: {
    camera?: "granted" | "denied";
    microphone?: "granted" | "denied";
  }) => void;
}

interface UseMediaStreamReturn {
  currentStream: MediaStream | null;
  videoRef: React.RefObject<HTMLVideoElement>;
  videoDevices: MediaDeviceInfo[];
  audioDevices: MediaDeviceInfo[];
  selectedVideoDeviceId: string | undefined;
  selectedAudioDeviceId: string | undefined;
  isEnvironmentReady: boolean;
  setSelectedVideoDeviceId: (deviceId: string | undefined) => void;
  setSelectedAudioDeviceId: (deviceId: string | undefined) => void;
  refreshDevices: () => Promise<void>;
  restartStream: () => Promise<void>;
}

export const useMediaStream = ({
  isCameraGranted,
  isMicrophoneGranted,
  setPermissionsDirectly,
}: UseMediaStreamProps): UseMediaStreamReturn => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [currentStream, setCurrentStream] = useState<MediaStream | null>(null);
  const [isEnvironmentReady, setIsEnvironmentReady] = useState(false);

  // 장치 선택 상태
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedVideoDeviceId, setSelectedVideoDeviceId] = useState<
    string | undefined
  >(undefined);
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] = useState<
    string | undefined
  >(undefined);

  // 장치 목록 새로고침
  const refreshDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter((d) => d.kind === "videoinput");
      const audioInputs = devices.filter((d) => d.kind === "audioinput");

      const videos = videoInputs.filter(
        (d) => d.deviceId && d.deviceId.trim() !== ""
      );
      const audios = audioInputs.filter(
        (d) => d.deviceId && d.deviceId.trim() !== ""
      );

      setVideoDevices(videos);
      setAudioDevices(audios);

      const hasSelectedVideo = videos.some(
        (v) => v.deviceId === selectedVideoDeviceId
      );
      const hasSelectedAudio = audios.some(
        (a) => a.deviceId === selectedAudioDeviceId
      );
      setSelectedVideoDeviceId(
        hasSelectedVideo ? selectedVideoDeviceId : videos[0]?.deviceId
      );
      setSelectedAudioDeviceId(
        hasSelectedAudio ? selectedAudioDeviceId : audios[0]?.deviceId
      );
    } catch {
      // 장치 목록 조회 실패 시 무시
    }
  }, [selectedVideoDeviceId, selectedAudioDeviceId]);

  // 스트림 시작
  const startStream = useCallback(async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }

      const baseVideo: MediaTrackConstraints = selectedVideoDeviceId
        ? {
            deviceId: { exact: selectedVideoDeviceId },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          }
        : { width: { ideal: 1280 }, height: { ideal: 720 } };

      const baseAudio: MediaTrackConstraints | boolean = selectedAudioDeviceId
        ? { deviceId: { exact: selectedAudioDeviceId } }
        : true;

      const tries: Array<MediaStreamConstraints> = [
        { video: baseVideo, audio: baseAudio },
        {
          video: selectedVideoDeviceId
            ? { deviceId: { exact: selectedVideoDeviceId } }
            : true,
          audio: baseAudio,
        },
      ];

      let media: MediaStream | null = null;
      let lastError: unknown = null;

      for (const constraints of tries) {
        try {
          media = await navigator.mediaDevices.getUserMedia(constraints);
          break;
        } catch (err) {
          lastError = err;
        }
      }

      if (!media) {
        const errName = (() => {
          if (
            lastError &&
            typeof lastError === "object" &&
            "name" in lastError
          ) {
            const n = (lastError as { name: string }).name;
            return typeof n === "string" ? n : "UnknownError";
          }
          return "UnknownError";
        })();

        let description = "브라우저에서 카메라/마이크 시작에 실패했습니다.";
        if (errName === "NotAllowedError" || errName === "SecurityError") {
          description =
            "권한이 거부되어 카메라/마이크를 시작할 수 없습니다. 브라우저 권한을 허용해주세요.";
        } else if (
          errName === "NotFoundError" ||
          errName === "OverconstrainedError"
        ) {
          description =
            "선택한 장치를 찾을 수 없거나 제약 조건이 맞지 않습니다. 다른 장치를 선택해보세요.";
        } else if (errName === "NotReadableError") {
          description =
            "다른 앱이 카메라/마이크를 사용 중일 수 있습니다. 해당 앱을 종료한 뒤 다시 시도해주세요.";
        }

        toast.error("카메라/마이크 시작 실패", { description });
        throw lastError instanceof Error
          ? lastError
          : new Error("getUserMedia failed");
      }

      streamRef.current = media;
      setCurrentStream(media);

      setPermissionsDirectly({
        camera: media.getVideoTracks().length > 0 ? "granted" : "denied",
        microphone: media.getAudioTracks().length > 0 ? "granted" : "denied",
      });

      setIsEnvironmentReady(true);

      // 비디오 요소 설정
      const setupVideoElement = (retryCount = 0) => {
        if (videoRef.current) {
          const el = videoRef.current;
          el.srcObject = media;

          el.onloadedmetadata = () => {
            // 비디오 메타데이터 로드 완료
          };

          el.play().catch(() => {
            // 비디오 재생 실패 시 무시
          });
        } else {
          if (retryCount < 3) {
            setTimeout(() => setupVideoElement(retryCount + 1), 100);
          }
        }
      };

      setTimeout(setupVideoElement, 50);
    } catch {
      // 카메라/마이크 스트림 시작 실패 시 무시
    }
  }, [selectedVideoDeviceId, selectedAudioDeviceId, setPermissionsDirectly]);

  // 스트림 재시작 (권한 재요청 시)
  const restartStream = useCallback(async () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setCurrentStream(null);
    }

    setTimeout(async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        stream.getTracks().forEach((t) => t.stop());
        await refreshDevices();
        await startStream();
      } catch {
        toast.error("권한 요청 실패", {
          description: "브라우저에서 카메라/마이크 권한을 허용해주세요.",
        });
      }
    }, 100);
  }, [refreshDevices, startStream]);

  // 권한 변경 시 스트림 재생성
  useEffect(() => {
    if (isCameraGranted && isMicrophoneGranted) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        setCurrentStream(null);
      }

      setTimeout(() => {
        refreshDevices()
          .then(() => startStream())
          .catch(() => {
            // 장치 새로고침 또는 스트림 시작 실패 시 무시
          });
      }, 500);
    }
  }, [isCameraGranted, isMicrophoneGranted, refreshDevices, startStream]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

  return {
    currentStream,
    videoRef,
    videoDevices,
    audioDevices,
    selectedVideoDeviceId,
    selectedAudioDeviceId,
    isEnvironmentReady,
    setSelectedVideoDeviceId,
    setSelectedAudioDeviceId,
    refreshDevices,
    restartStream,
  };
};

