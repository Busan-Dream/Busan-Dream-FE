import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// ui
import { toast } from "sonner";
import { Square, Circle, Upload } from "lucide-react";

// hooks
import { useMediaPermissions } from "@/hooks/useMediaPermissions";
import { useMediaRecorder } from "@/hooks/useMediaRecorder";
import { useMicMeter } from "@/hooks/useMicMeter";
import { useVideoUpload } from "@/hooks/useVideoUpload";

// contexts
import { useAnalysis } from "@/contexts/AnalysisContext";

// components
import SectionTitle from "@/components/SectionTitle";
import DeviceSelector from "./components/DeviceSelector";
import VideoPreview from "./components/VideoPreview";
import ConfirmModal from "@/components/modals/ConfirmModal";
import AlertModal from "@/components/modals/AlertModal";

import { getInterviewQuestion } from "@/apis/interview";
import {
  INTERVIEW_TIME_LIMIT_SECONDS,
  DEFAULT_INTERVIEW_QUESTION,
} from "@/constants/interview";

const Interview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { postingOrgan, postingPart } = location.state || {};
  const { startAnalysis } = useAnalysis();
  const { permissions, requestPermissions, setPermissionsDirectly } =
    useMediaPermissions();
  const isCameraGranted = permissions.camera === "granted";
  const isMicrophoneGranted = permissions.microphone === "granted";
  const [isEnvironmentReady, setIsEnvironmentReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const hasAutoRequestedRef = useRef(false);

  // 스트림 상태 관리 (훅에 최신 값 전달용)
  const [currentStream, setCurrentStream] = useState<MediaStream | null>(null);

  // 녹화 및 마이크 테스트 훅
  const { isRecording, recordingTime, startRecording, stopRecording } =
    useMediaRecorder(currentStream);
  const { micLevel, isListening, startMicMeter, stopMicMeter } =
    useMicMeter(currentStream);

  // 영상 저장 훅
  const { saveVideoLocally } = useVideoUpload();

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

  // 브라우저 안내 모달 상태
  const [showBrowserModal, setShowBrowserModal] = useState(false);
  const [browserModalMessage, setBrowserModalMessage] = useState("");

  // 권한 거부 모달 상태
  const [showPermissionDeniedModal, setShowPermissionDeniedModal] =
    useState(false);

  // 면접 진행 상태
  const [interviewQuestion, setInterviewQuestion] = useState(
    DEFAULT_INTERVIEW_QUESTION
  );
  const [questionToastId, setQuestionToastId] = useState<
    string | number | null
  >(null);

  // 면접 시작 가능 여부 확인
  const canStartInterview = () => {
    // 필수 데이터 검증
    if (!postingOrgan || !postingPart) return false;

    // 권한 검증
    if (!isCameraGranted || !isMicrophoneGranted) return false;

    // 스트림 상태 검증
    if (!currentStream || !isEnvironmentReady) return false;

    // 스트림에 비디오와 오디오 트랙이 모두 있는지 확인
    const videoTracks = currentStream.getVideoTracks();
    const audioTracks = currentStream.getAudioTracks();

    if (videoTracks.length === 0 || audioTracks.length === 0) return false;

    // 트랙이 활성 상태인지 확인
    const hasActiveVideo = videoTracks.some(
      (track) => track.readyState === "live"
    );
    const hasActiveAudio = audioTracks.some(
      (track) => track.readyState === "live"
    );

    return hasActiveVideo && hasActiveAudio;
  };

  // 면접 시작 불가능 이유 반환
  const getCannotStartReason = () => {
    if (!postingOrgan || !postingPart) {
      return "공고 정보가 부족합니다.";
    }

    if (!isCameraGranted) {
      return "카메라 권한이 필요합니다.";
    }

    if (!isMicrophoneGranted) {
      return "마이크 권한이 필요합니다.";
    }

    if (!currentStream) {
      return "미디어 스트림이 활성화되지 않았습니다.";
    }

    if (!isEnvironmentReady) {
      return "환경 설정이 완료되지 않았습니다.";
    }

    const videoTracks = currentStream.getVideoTracks();
    const audioTracks = currentStream.getAudioTracks();

    if (videoTracks.length === 0) {
      return "비디오 트랙을 찾을 수 없습니다.";
    }

    if (audioTracks.length === 0) {
      return "오디오 트랙을 찾을 수 없습니다.";
    }

    const hasActiveVideo = videoTracks.some(
      (track) => track.readyState === "live"
    );
    const hasActiveAudio = audioTracks.some(
      (track) => track.readyState === "live"
    );

    if (!hasActiveVideo) {
      return "비디오가 활성화되지 않았습니다.";
    }

    if (!hasActiveAudio) {
      return "오디오가 활성화되지 않았습니다.";
    }

    return null; // 모든 조건이 충족됨
  };

  // 필수 데이터 검증
  useEffect(() => {
    if (!postingOrgan || !postingPart) {
      toast.error("면접 정보가 부족합니다.", {
        description: "공고를 다시 선택해주세요.",
      });
      // 2초 후 메인 페이지로 이동
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 2000);
    }
  }, [postingOrgan, postingPart, navigate]);

  // 면접 질문 가져오기
  useEffect(() => {
    const fetchInterviewQuestion = async () => {
      if (!postingOrgan || !postingPart) {
        return;
      }

      try {
        const response = await getInterviewQuestion(postingOrgan, postingPart);
        if (response.question) {
          setInterviewQuestion(response.question);
        }
      } catch (error) {
        console.error("면접 질문 가져오기 실패:", error);
        toast.error("면접 질문을 가져올 수 없습니다.", {
          description: "기본 질문으로 진행합니다.",
        });
      }
    };

    fetchInterviewQuestion();
  }, [postingOrgan, postingPart]);

  // 시간 제한 및 강제 중지 모달 상태
  const [showTimeLimitModal, setShowTimeLimitModal] = useState(false);
  const [timeLimitBlob, setTimeLimitBlob] = useState<Blob | null>(null);

  // 영상 업로드 관련 상태
  const [uploadedVideoBlob, setUploadedVideoBlob] = useState<Blob | null>(null);

  // 용량 제한 (100MB)
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

  // 시간 제한 체크
  useEffect(() => {
    if (isRecording && recordingTime >= INTERVIEW_TIME_LIMIT_SECONDS) {
      handleTimeLimit();
    }
  }, [isRecording, recordingTime]);

  const handleTimeLimit = async () => {
    try {
      // 녹화 중지
      const blob = await stopRecording();
      setTimeLimitBlob(blob);

      // 질문 토스트 제거
      if (questionToastId) {
        toast.dismiss(questionToastId);
        setQuestionToastId(null);
      }

      // 강제 중지 모달 표시
      setShowTimeLimitModal(true);
    } catch {
      toast.error("녹화 중지 중 오류가 발생했습니다.");
    }
  };

  // 영상 파일 업로드 처리
  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 용량 체크
    if (file.size > MAX_FILE_SIZE) {
      toast.error(
        `파일 크기가 너무 큽니다. 최대 ${
          MAX_FILE_SIZE / (1024 * 1024)
        }MB까지 업로드 가능합니다.`
      );
      return;
    }

    // 파일 타입 체크 (MP4만 허용)
    if (file.type !== "video/mp4") {
      toast.error("MP4 형식의 영상 파일만 업로드 가능합니다.");
      return;
    }

    setUploadedVideoBlob(file);
    toast.success("영상이 업로드되었습니다!", {
      duration: 5000,
    });
  };

  const refreshDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter((d) => d.kind === "videoinput");
      const audioInputs = devices.filter((d) => d.kind === "audioinput");

      // 권한 미허용 시 deviceId가 공백일 수 있어 필터링
      const videos = videoInputs.filter(
        (d) => d.deviceId && d.deviceId.trim() !== ""
      );
      const audios = audioInputs.filter(
        (d) => d.deviceId && d.deviceId.trim() !== ""
      );

      setVideoDevices(videos);
      setAudioDevices(audios);

      // 현재 선택값이 목록에 없으면 해제
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
  };

  const startStream = async () => {
    try {
      // 기존 스트림 정리 후 재요청 (브라우저 팝업 유도)
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
      // 간단하게 오디오 요청 (권한 상태와 관계없이)
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

      // 스트림 트랙 확인
      const audioTracks = media.getAudioTracks();

      if (audioTracks.length === 0) {
        // 권한 거부 모달 표시
        setShowPermissionDeniedModal(true);
      }

      streamRef.current = media;
      setCurrentStream(media); // 훅에 최신 스트림 전달

      // 스트림이 성공적으로 시작되면 권한 상태를 직접 업데이트 (기존 스트림을 방해하지 않음)
      setPermissionsDirectly({
        camera: media.getVideoTracks().length > 0 ? "granted" : "denied",
        microphone: media.getAudioTracks().length > 0 ? "granted" : "denied",
      });

      // 스트림이 성공적으로 생성되면 환경을 준비 상태로 변경 (비디오 요소 존재 여부와 무관)
      setIsEnvironmentReady(true);

      // 비디오 요소가 렌더링될 때까지 대기하고 재시도 (최대 3번)
      const setupVideoElement = (retryCount = 0) => {
        if (videoRef.current) {
          const el = videoRef.current;
          el.srcObject = media;

          el.onloadedmetadata = () => {
            // 비디오 메타데이터 로드 완료
          };

          el.play()
            .then(() => {
              // 비디오 재생 시작 성공
            })
            .catch(() => {
              // 비디오 재생 실패 시 무시
            });
        } else {
          if (retryCount < 3) {
            setTimeout(() => setupVideoElement(retryCount + 1), 100);
          }
        }
      };

      // 비디오 요소 설정 시도 (React 렌더링 완료 대기)
      setTimeout(setupVideoElement, 50);
    } catch {
      // 카메라/마이크 스트림 시작 실패 시 무시
    }
  };

  useEffect(() => {
    // 지원되지 않는 브라우저인 경우 안내 모달
    if (!isSupportedBrowser) {
      setBrowserModalMessage(
        "원활한 화상 면접을 위해 Chrome 또는 Safari 브라우저를 사용해주세요."
      );
      setShowBrowserModal(true);
    }

    // 권한이 변경되면 스트림 재생성
    if (isCameraGranted && isMicrophoneGranted) {
      // 기존 스트림 정리
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        setCurrentStream(null); // 훅에 null 전달
      }
      // 약간의 지연 후 장치 목록 새로고침 및 스트림 시작 (권한 상태 안정화 대기)
      setTimeout(() => {
        refreshDevices()
          .then(() => {
            return startStream();
          })
          .catch(() => {
            // 장치 새로고침 또는 스트림 시작 실패 시 무시
          });
      }, 500);
      return;
    }

    const toastId = toast("카메라와 마이크 권한을 확인해주세요!", {
      description:
        "화상 면접을 진행하기 위해 카메라와 마이크 권한이 필수입니다.",
      action: {
        label: "권한 요청",
        onClick: async () => {
          try {
            console.log("권한 요청 시작...");
            console.log("현재 권한 상태:", permissions);

            // 브라우저 권한 팝업을 다시 띄우기 위해 getUserMedia 직접 호출
            const stream = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: true,
            });

            console.log("권한 요청 성공, 스트림:", stream);

            // 성공 시 스트림 정리 후 새로 시작
            stream.getTracks().forEach((t) => t.stop());
            await refreshDevices();
            await startStream();
            toast.dismiss(toastId);

            toast.success("권한이 허용되었습니다!");
          } catch (error) {
            console.error("권한 요청 실패:", error);
            if (error instanceof Error && error.name === "NotAllowedError") {
              toast.error("권한이 차단되었습니다", {
                description:
                  "브라우저 주소창의 자물쇠 아이콘을 클릭하여 권한을 허용해주세요. 또는 아래 '브라우저 설정 안내' 버튼을 클릭하세요.",
                duration: 10000,
              });
            } else {
              toast.error("권한 요청 실패", {
                description: `에러: ${
                  error instanceof Error ? error.message : "알 수 없는 오류"
                }`,
              });
            }
          }
        },
      },
      duration: Infinity,
    });

    // 브라우저 설정 안내 토스트도 함께 표시
    toast("브라우저 설정 안내", {
      description:
        "권한 요청이 실패하면 브라우저 주소창의 자물쇠 아이콘을 클릭하여 직접 설정할 수 있습니다.",
      action: {
        label: "설정 방법 자세히",
        onClick: () => {
          // 브라우저별 설정 방법 안내
          const isChrome = /Chrome/.test(navigator.userAgent);
          const isSafari = /^((?!chrome|android).)*safari/i.test(
            navigator.userAgent
          );

          let message =
            "브라우저 설정에서 카메라와 마이크 권한을 허용해주세요.\n\n";

          if (isChrome) {
            message +=
              "Chrome: 주소창 왼쪽 자물쇠 아이콘 클릭 → 카메라/마이크 허용\n\n";
            message += "또는 주소창에 입력:\n";
            message += "• 카메라: chrome://settings/content/camera\n";
            message += "• 마이크: chrome://settings/content/microphone";
          } else if (isSafari) {
            message +=
              "Safari: Safari > 환경설정 > 웹사이트 → 카메라/마이크 허용";
          } else {
            message +=
              "브라우저 설정 → 개인정보 보호 → 카메라/마이크 권한 허용";
          }

          toast.info("권한 설정 방법", {
            description: message,
            duration: 15000,
          });
        },
      },
      duration: 10000,
    });

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
      // 권한 자동요청이 불가능한 환경(Safari 등)에서는 장치 목록만 동기화
      refreshDevices().finally(() => startStream());
    }

    const timer = setTimeout(() => {
      setIsEnvironmentReady(true);
    }, 3000);

    return () => {
      clearTimeout(timer);
      toast.dismiss(toastId);
      // 스트림 정리
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [
    isCameraGranted,
    isMicrophoneGranted,
    requestPermissions,
    isSupportedBrowser,
    isSafari,
  ]);

  // 필수 데이터가 없으면 로딩 상태 표시
  if (!postingOrgan || !postingPart) {
    return (
      <section className="min-h-screen py-6 max-sm:py-4 max-sm:landscape:py-2">
        <div className="max-w-7xl px-6 max-sm:px-4 max-sm:landscape:px-2">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">면접 정보를 확인하는 중...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen py-6 max-sm:py-4 max-sm:landscape:py-2">
      <div className="max-w-7xl px-6 max-sm:px-4 max-sm:landscape:px-2">
        {/* 헤더 섹션 */}
        <SectionTitle
          title="AI 화상면접"
          className="py-8"
          description={`${postingOrgan} - ${postingPart} 공고에 대한 모의 면접을 진행합니다.`}
          subDescription="화상 면접은 하루 최대 3회 진행이 가능하며, 면접 질문은 '시작하기' 버튼을 누르면 랜덤으로 생성돼요."
        />

        {/* 메인 콘텐츠 영역 */}
        <figure className="flex flex-col w-full gap-6 max-lg:flex-col max-lg:gap-4 max-sm:landscape:gap-2">
          {/* 공고 정보 표시 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              <strong>면접 공고:</strong> {postingOrgan} - {postingPart}
            </p>
          </div>

          {/* 비디오 영역 */}
          <VideoPreview
            isEnvironmentReady={isEnvironmentReady}
            videoRef={videoRef}
            isCameraGranted={isCameraGranted}
            isMicrophoneGranted={isMicrophoneGranted}
          />

          <div className="flex items-center gap-2 justify-between">
            {/* 권한/장치 제어 영역 */}
            <DeviceSelector
              videoDevices={videoDevices}
              audioDevices={audioDevices}
              selectedVideoDeviceId={selectedVideoDeviceId}
              selectedAudioDeviceId={selectedAudioDeviceId}
              onVideoDeviceChange={setSelectedVideoDeviceId}
              onAudioDeviceChange={setSelectedAudioDeviceId}
              onPermissionReset={async () => {
                // 기존 스트림 완전 정리 (브라우저 팝업 유도)
                if (streamRef.current) {
                  streamRef.current.getTracks().forEach((t) => t.stop());
                  streamRef.current = null;
                  setCurrentStream(null);
                }

                // 약간의 지연 후 권한 요청 (브라우저가 스트림 정리를 인식할 시간)
                setTimeout(async () => {
                  try {
                    // 직접 getUserMedia 호출로 브라우저 팝업 유도
                    const stream = await navigator.mediaDevices.getUserMedia({
                      video: true,
                      audio: true,
                    });

                    // 성공 시 스트림 정리 후 새로 시작
                    stream.getTracks().forEach((t) => t.stop());
                    await refreshDevices();
                    await startStream();
                  } catch {
                    toast.error("권한 요청 실패", {
                      description:
                        "브라우저에서 카메라/마이크 권한을 허용해주세요.",
                    });
                  }
                }, 100);
              }}
              micLevel={micLevel}
              isListening={isListening}
              onMicTestToggle={isListening ? stopMicMeter : startMicMeter}
              isMicrophoneGranted={isMicrophoneGranted}
              currentStream={currentStream}
            />

            {/* 면접 및 업로드 버튼 */}
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  if (isRecording) {
                    // 면접 제출
                    const blob = await stopRecording();

                    // 질문 토스트 제거
                    if (questionToastId) {
                      toast.dismiss(questionToastId);
                      setQuestionToastId(null);
                    }

                    if (blob) {
                      // 영상을 로컬에 저장 (사용자가 나중에 다운로드 가능)
                      saveVideoLocally(blob);

                      // 분석 시작 토스트 (자동으로 사라짐)
                      toast.info("분석을 시작합니다", {
                        description: "리포트 페이지로 이동합니다.",
                        duration: 2000,
                      });

                      try {
                        // 분석 시작 (비동기로 실행)
                        startAnalysis(blob, interviewQuestion);

                        // 바로 리포트 페이지로 이동
                        navigate("/report");
                      } catch {
                        toast.error("분석을 시작할 수 없습니다.");
                      }
                    }
                  } else {
                    // 면접 시작 전 조건 확인
                    const cannotStartReason = getCannotStartReason();
                    if (cannotStartReason) {
                      toast.error("면접을 시작할 수 없습니다.", {
                        description: cannotStartReason,
                        duration: 4000,
                      });
                      return;
                    }

                    // 면접 시작
                    await startRecording();

                    // 면접 질문 토스트 표시 (사용자가 지울 수 없음)
                    const toastId = toast(interviewQuestion, {
                      duration: Infinity,
                      dismissible: false,
                      position: "top-center",
                      style: {
                        backgroundColor: "#000000",
                        color: "white",
                        border: "none",
                        fontSize: "16px",
                        fontWeight: "500",
                      },
                    });
                    setQuestionToastId(toastId);

                    toast.info("면접이 시작되었습니다", {
                      description: "질문에 대한 답변을 시작해주세요.",
                      duration: 3000,
                    });
                  }
                }}
                disabled={!canStartInterview()}
                className={`px-3 py-2 w-fit rounded-md text-white text-sm flex items-center gap-2 ${
                  isRecording
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
                }`}
              >
                {isRecording ? (
                  <>
                    <Square className="w-4 h-4" />
                    면접 제출 ({Math.floor(recordingTime / 60)}:
                    {(recordingTime % 60).toString().padStart(2, "0")})
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4" />
                    면접 시작
                  </>
                )}
              </button>

              {/* 면접 시작 상태 표시 */}
              {!isRecording && !canStartInterview() && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-yellow-800 text-xs">
                    <strong>대기 중:</strong> {getCannotStartReason()}
                  </p>
                </div>
              )}

              {/* 영상 업로드 버튼 */}
              <div className="relative">
                <input
                  type="file"
                  accept="video/mp4"
                  onChange={handleVideoUpload}
                  className="hidden"
                  id="video-upload"
                  disabled={isRecording}
                />
                <label
                  htmlFor="video-upload"
                  className={`px-3 py-2 w-fit rounded-md text-sm flex items-center gap-2 cursor-pointer transition-colors ${
                    isRecording
                      ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  영상 업로드
                </label>
              </div>

              {/* 업로드된 영상으로 분석 시작 버튼 */}
              {uploadedVideoBlob && (
                <button
                  onClick={() => {
                    // 영상을 로컬에 저장
                    saveVideoLocally(uploadedVideoBlob);

                    // 분석 시작 토스트
                    toast.info("업로드된 영상으로 분석을 시작합니다", {
                      description: "리포트 페이지로 이동합니다.",
                      duration: 2000,
                    });

                    try {
                      // 분석 시작 (비동기로 실행)
                      startAnalysis(uploadedVideoBlob, interviewQuestion);

                      // 바로 리포트 페이지로 이동
                      navigate("/report");
                    } catch (error) {
                      console.error("분석 시작 실패:", error);
                      toast.error("분석을 시작할 수 없습니다.");
                    }
                  }}
                  className="px-3 py-2 w-fit rounded-md bg-purple-600 hover:bg-purple-700 text-white text-sm flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  업로드 영상 분석
                </button>
              )}
            </div>
          </div>
        </figure>
      </div>

      {/* 브라우저 안내 모달 */}
      <AlertModal
        open={showBrowserModal}
        onOpenChange={setShowBrowserModal}
        title="브라우저 호환성 안내"
        description={browserModalMessage}
      />

      {/* 권한 거부 모달 */}
      <ConfirmModal
        open={showPermissionDeniedModal}
        onOpenChange={setShowPermissionDeniedModal}
        title="서비스 사용 불가"
        description="카메라와 마이크 권한이 필요합니다. 권한을 허용하지 않으면 화상 면접 서비스를 이용할 수 없습니다.\n\n브라우저 설정에서 권한을 허용한 후 페이지를 새로고침해주세요."
        confirmText="확인"
        cancelText="페이지 새로고침"
        variant="error"
        onConfirm={() => setShowPermissionDeniedModal(false)}
        onCancel={() => window.location.reload()}
      />

      {/* 시간 제한 강제 중지 모달 */}
      <ConfirmModal
        open={showTimeLimitModal}
        onOpenChange={setShowTimeLimitModal}
        title="면접 시간 제한"
        description={`
          면접 시간이 2분 30초에 도달했습니다.
          현재까지의 답변으로 분석을 진행하시겠습니까?
          확인을 클릭하면 일일 소모량 중 1회를 소모하고 분석을 시작합니다. (일일 소모량 3회)`}
        confirmText="확인"
        cancelText="취소"
        variant="warning"
        onConfirm={async () => {
          if (timeLimitBlob) {
            // 영상을 로컬에 저장 (사용자가 나중에 다운로드 가능)
            saveVideoLocally(timeLimitBlob);

            try {
              toast.info("분석을 시작합니다", {
                description: "리포트 페이지로 이동합니다.",
                duration: 2000,
              });

              // 분석 시작 (비동기로 실행)
              startAnalysis(timeLimitBlob, interviewQuestion);

              // 바로 리포트 페이지로 이동
              navigate("/report");
            } catch (error) {
              console.error("분석 시작 실패:", error);
              toast.error("분석을 시작할 수 없습니다.", {
                description: "다시 시도해주세요.",
              });
            }
          }
        }}
        onCancel={() => {
          setTimeLimitBlob(null);
          toast.info("면접이 취소되었습니다.");
        }}
      />

      {/* 면접 질문 표시 (면접 시작 시에만) */}
      {isRecording && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b border-gray-200 animate-slideDown">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  면접 질문
                </h3>
                <p className="text-gray-700 text-base">{interviewQuestion}</p>
                <div className="mt-2 text-sm text-gray-500">
                  <span className="font-medium">공고:</span> {postingOrgan} -{" "}
                  {postingPart}
                </div>
              </div>
              <div className="ml-4 text-sm text-gray-500">면접 진행 중...</div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Interview;
