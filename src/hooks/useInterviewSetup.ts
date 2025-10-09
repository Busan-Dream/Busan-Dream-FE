import { useRef, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useMediaPermissions } from "./useMediaPermissions";
import { useMediaRecorder } from "./useMediaRecorder";
import { useMicMeter } from "./useMicMeter";

interface UseInterviewSetupReturn {
  // 권한
  isCameraGranted: boolean;
  isMicrophoneGranted: boolean;
  requestPermissions: () => Promise<boolean>;

  // 스트림 & 비디오
  currentStream: MediaStream | null;
  videoRef: React.RefObject<HTMLVideoElement>;
  isEnvironmentReady: boolean;

  // 장치
  videoDevices: MediaDeviceInfo[];
  audioDevices: MediaDeviceInfo[];
  selectedVideoDeviceId: string | undefined;
  selectedAudioDeviceId: string | undefined;
  setSelectedVideoDeviceId: (deviceId: string | undefined) => void;
  setSelectedAudioDeviceId: (deviceId: string | undefined) => void;
  refreshDevices: () => Promise<void>;
  restartStream: () => Promise<void>;

  // 녹화
  isRecording: boolean;
  recordingTime: number;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Blob | null>;

  // 마이크 테스트
  micLevel: number;
  isListening: boolean;
  startMicMeter: () => void;
  stopMicMeter: () => void;

  // 면접 시작 가능 여부
  canStartInterview: boolean;
  cannotStartReason: string | null;

  // 브라우저 호환성
  isSupportedBrowser: boolean;
}

export const useInterviewSetup = (): UseInterviewSetupReturn => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const hasAutoRequestedRef = useRef(false);
  const [currentStream, setCurrentStream] = useState<MediaStream | null>(null);
  const [isEnvironmentReady, setIsEnvironmentReady] = useState(false);

  // 권한 관리
  const { permissions, requestPermissions, setPermissionsDirectly } =
    useMediaPermissions();
  const isCameraGranted = permissions.camera === "granted";
  const isMicrophoneGranted = permissions.microphone === "granted";

  // 녹화 및 마이크 테스트
  const { isRecording, recordingTime, startRecording, stopRecording } =
    useMediaRecorder(currentStream);
  const { micLevel, isListening, startMicMeter, stopMicMeter } =
    useMicMeter(currentStream);

  // 브라우저 감지
  const isChrome =
    /Chrome/.test(navigator.userAgent) && !/Edge/.test(navigator.userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const isSupportedBrowser = isChrome || isSafari;

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
          el.onloadedmetadata = () => {};
          el.play().catch(() => {});
        } else {
          if (retryCount < 3) {
            setTimeout(() => setupVideoElement(retryCount + 1), 100);
          }
        }
      };

      setTimeout(setupVideoElement, 50);
    } catch {
      // 스트림 시작 실패 시 무시
    }
  }, [selectedVideoDeviceId, selectedAudioDeviceId, setPermissionsDirectly]);

  // 스트림 재시작 (권한 재요청)
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
          .catch(() => {});
      }, 500);
      return;
    }

    const isSecure =
      window.location.protocol === "https:" ||
      window.location.hostname === "localhost";

    if (!hasAutoRequestedRef.current && isSecure && !isSafari) {
      hasAutoRequestedRef.current = true;
      requestPermissions()
        .then(() => refreshDevices())
        .then(() => startStream())
        .catch(() => {});
    } else {
      refreshDevices().finally(() => startStream());
    }

    const timer = setTimeout(() => {
      setIsEnvironmentReady(true);
    }, 3000);

    return () => {
      clearTimeout(timer);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [
    isCameraGranted,
    isMicrophoneGranted,
    requestPermissions,
    isSafari,
    refreshDevices,
    startStream,
  ]);

  // 면접 시작 가능 여부 체크
  const canStartInterview = useCallback(() => {
    if (!isCameraGranted || !isMicrophoneGranted) return false;
    if (!currentStream || !isEnvironmentReady) return false;

    const videoTracks = currentStream.getVideoTracks();
    const audioTracks = currentStream.getAudioTracks();

    if (videoTracks.length === 0 || audioTracks.length === 0) return false;

    const hasActiveVideo = videoTracks.some(
      (track) => track.readyState === "live"
    );
    const hasActiveAudio = audioTracks.some(
      (track) => track.readyState === "live"
    );

    return hasActiveVideo && hasActiveAudio;
  }, [isCameraGranted, isMicrophoneGranted, currentStream, isEnvironmentReady]);

  // 면접 시작 불가능 이유
  const getCannotStartReason = useCallback((): string | null => {
    if (!isCameraGranted) return "카메라 권한이 필요합니다.";
    if (!isMicrophoneGranted) return "마이크 권한이 필요합니다.";
    if (!currentStream) return "미디어 스트림이 활성화되지 않았습니다.";
    if (!isEnvironmentReady) return "환경 설정이 완료되지 않았습니다.";

    const videoTracks = currentStream.getVideoTracks();
    const audioTracks = currentStream.getAudioTracks();

    if (videoTracks.length === 0) return "비디오 트랙을 찾을 수 없습니다.";
    if (audioTracks.length === 0) return "오디오 트랙을 찾을 수 없습니다.";

    const hasActiveVideo = videoTracks.some(
      (track) => track.readyState === "live"
    );
    const hasActiveAudio = audioTracks.some(
      (track) => track.readyState === "live"
    );

    if (!hasActiveVideo) return "비디오가 활성화되지 않았습니다.";
    if (!hasActiveAudio) return "오디오가 활성화되지 않았습니다.";

    return null;
  }, [isCameraGranted, isMicrophoneGranted, currentStream, isEnvironmentReady]);

  return {
    // 권한
    isCameraGranted,
    isMicrophoneGranted,
    requestPermissions,

    // 스트림 & 비디오
    currentStream,
    videoRef,
    isEnvironmentReady,

    // 장치
    videoDevices,
    audioDevices,
    selectedVideoDeviceId,
    selectedAudioDeviceId,
    setSelectedVideoDeviceId,
    setSelectedAudioDeviceId,
    refreshDevices,
    restartStream,

    // 녹화
    isRecording,
    recordingTime,
    startRecording,
    stopRecording,

    // 마이크 테스트
    micLevel,
    isListening,
    startMicMeter,
    stopMicMeter,

    // 면접 시작 가능 여부
    canStartInterview: canStartInterview(),
    cannotStartReason: getCannotStartReason(),

    // 브라우저 호환성
    isSupportedBrowser,
  };
};
