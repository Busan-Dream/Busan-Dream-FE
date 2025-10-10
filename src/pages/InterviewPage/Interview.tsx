import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Square, Circle, Upload } from "lucide-react";

// hooks
import { useInterviewSetup } from "@/hooks/useInterviewSetup";
import { useInterviewModals } from "@/hooks/useInterviewModals";
import { useVideoUpload } from "@/hooks/useVideoUpload";
import { useAnalysis } from "@/contexts/AnalysisContext";

// components
import SectionTitle from "@/components/SectionTitle";
import DeviceSelector from "./components/DeviceSelector";
import VideoPreview from "./components/VideoPreview";
import ConfirmModal from "@/components/modals/ConfirmModal";
import AlertModal from "@/components/modals/AlertModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// apis & constants
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

  // 통합 훅 사용
  const {
    isCameraGranted,
    isMicrophoneGranted,
    currentStream,
    videoRef,
    isEnvironmentReady,
    videoDevices,
    audioDevices,
    selectedVideoDeviceId,
    selectedAudioDeviceId,
    setSelectedVideoDeviceId,
    setSelectedAudioDeviceId,
    restartStream,
    isRecording,
    recordingTime,
    startRecording,
    stopRecording,
    micLevel,
    isListening,
    startMicMeter,
    stopMicMeter,
    canStartInterview,
    cannotStartReason,
    isSupportedBrowser,
  } = useInterviewSetup();

  // 모달 관리
  const {
    showBrowserModal,
    openBrowserModal,
    closeBrowserModal,
    showPermissionDeniedModal,
    closePermissionDeniedModal,
    showPermissionGuideModal,
    permissionGuideMessage,
    openPermissionGuideModal,
    closePermissionGuideModal,
    showTimeLimitModal,
    timeLimitBlob,
    openTimeLimitModal,
    closeTimeLimitModal,
  } = useInterviewModals();

  // 영상 저장
  const { saveVideoLocally } = useVideoUpload();

  // 면접 질문
  const [interviewQuestion, setInterviewQuestion] = useState(
    DEFAULT_INTERVIEW_QUESTION
  );

  // 영상 업로드
  const [uploadedVideoBlob, setUploadedVideoBlob] = useState<Blob | null>(null);
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

  // 필수 데이터 검증
  useEffect(() => {
    if (!postingOrgan || !postingPart) {
      toast.error("면접 정보가 부족합니다.", {
        description: "공고를 다시 선택해주세요.",
      });
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 2000);
    }
  }, [postingOrgan, postingPart, navigate]);

  // 면접 질문 가져오기
  useEffect(() => {
    const fetchInterviewQuestion = async () => {
      if (!postingOrgan || !postingPart) return;

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

  // 브라우저 호환성 체크
  useEffect(() => {
    if (!isSupportedBrowser) {
      openBrowserModal();
    }
  }, [isSupportedBrowser, openBrowserModal]);

  // 권한 안내 토스트
  useEffect(() => {
    if (!isCameraGranted || !isMicrophoneGranted) {
      toast("브라우저 설정 안내", {
        description:
          "권한 요청이 실패하면 브라우저 주소창의 자물쇠 아이콘을 클릭하여 직접 설정할 수 있습니다.",
        action: {
          label: "설정 방법 자세히",
          onClick: openPermissionGuideModal,
        },
        duration: 10000,
      });
    }
  }, [isCameraGranted, isMicrophoneGranted, openPermissionGuideModal]);

  const handleTimeLimit = useCallback(async () => {
    try {
      const blob = await stopRecording();
      if (blob) {
        openTimeLimitModal(blob);
      }
    } catch {
      toast.error("녹화 중지 중 오류가 발생했습니다.");
    }
  }, [stopRecording, openTimeLimitModal]);

  // 시간 제한 체크
  useEffect(() => {
    if (isRecording && recordingTime >= INTERVIEW_TIME_LIMIT_SECONDS) {
      handleTimeLimit();
    }
  }, [isRecording, recordingTime, handleTimeLimit]);

  // 영상 업로드 처리
  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error(
        `파일 크기가 너무 큽니다. 최대 ${
          MAX_FILE_SIZE / (1024 * 1024)
        }MB까지 업로드 가능합니다.`
      );
      return;
    }

    if (file.type !== "video/mp4") {
      toast.error("MP4 형식의 영상 파일만 업로드 가능합니다.");
      return;
    }

    setUploadedVideoBlob(file);
    toast.success("영상이 업로드되었습니다!", { duration: 5000 });
  };

  // 면접 시작/제출 핸들러
  const handleInterviewToggle = async () => {
    if (isRecording) {
      const blob = await stopRecording();
      if (blob) {
        saveVideoLocally(blob);
        toast.info("분석을 시작합니다", {
          description: "리포트 페이지로 이동합니다.",
          duration: 2000,
        });

        try {
          startAnalysis(blob, interviewQuestion);
          navigate("/report", { state: { postingOrgan, postingPart } });
        } catch {
          toast.error("분석을 시작할 수 없습니다.");
        }
      }
    } else {
      if (!canStartInterview) {
        toast.error("면접을 시작할 수 없습니다.", {
          description: cannotStartReason || "알 수 없는 오류",
          duration: 4000,
        });
        return;
      }

      await startRecording();
      toast.info("면접이 시작되었습니다", {
        description: "질문에 대한 답변을 시작해주세요.",
        duration: 3000,
      });
    }
  };

  // 업로드된 영상 분석 시작
  const handleUploadedVideoAnalysis = () => {
    if (!uploadedVideoBlob) return;

    saveVideoLocally(uploadedVideoBlob);
    toast.info("업로드된 영상으로 분석을 시작합니다", {
      description: "리포트 페이지로 이동합니다.",
      duration: 2000,
    });

    try {
      startAnalysis(uploadedVideoBlob, interviewQuestion);
      navigate("/report", { state: { postingOrgan, postingPart } });
    } catch (error) {
      console.error("분석 시작 실패:", error);
      toast.error("분석을 시작할 수 없습니다.");
    }
  };

  // 시간 제한 모달 확인 핸들러
  const handleTimeLimitConfirm = async () => {
    if (timeLimitBlob) {
      saveVideoLocally(timeLimitBlob);

      try {
        toast.info("분석을 시작합니다", {
          description: "리포트 페이지로 이동합니다.",
          duration: 2000,
        });

        startAnalysis(timeLimitBlob, interviewQuestion);
        navigate("/report", { state: { postingOrgan, postingPart } });
      } catch (error) {
        console.error("분석 시작 실패:", error);
        toast.error("분석을 시작할 수 없습니다.", {
          description: "다시 시도해주세요.",
        });
      }
    }
  };

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
              onPermissionReset={restartStream}
              micLevel={micLevel}
              isListening={isListening}
              onMicTestToggle={isListening ? stopMicMeter : startMicMeter}
              isMicrophoneGranted={isMicrophoneGranted}
              currentStream={currentStream}
            />

            {/* 면접 및 업로드 버튼 */}
            <div className="flex gap-2">
              <button
                onClick={handleInterviewToggle}
                disabled={!canStartInterview && !isRecording}
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
              {!isRecording && !canStartInterview && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-yellow-800 text-xs">
                    <strong>대기 중:</strong> {cannotStartReason}
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
                  onClick={handleUploadedVideoAnalysis}
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
        onOpenChange={closeBrowserModal}
        title="브라우저 호환성 안내"
        description="원활한 화상 면접을 위해 Chrome 또는 Safari 브라우저를 사용해주세요."
      />

      {/* 권한 거부 모달 */}
      <ConfirmModal
        open={showPermissionDeniedModal}
        onOpenChange={closePermissionDeniedModal}
        title="서비스 사용 불가"
        description="카메라와 마이크 권한이 필요합니다. 권한을 허용하지 않으면 화상 면접 서비스를 이용할 수 없습니다.\n\n브라우저 설정에서 권한을 허용한 후 페이지를 새로고침해주세요."
        confirmText="확인"
        cancelText="페이지 새로고침"
        variant="error"
        onConfirm={closePermissionDeniedModal}
        onCancel={() => window.location.reload()}
      />

      {/* 권한 설정 방법 안내 Dialog */}
      <Dialog
        open={showPermissionGuideModal}
        onOpenChange={closePermissionGuideModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>권한 설정 방법</DialogTitle>
            <DialogDescription className="whitespace-pre-line text-left">
              {permissionGuideMessage}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end mt-4">
            <Button onClick={closePermissionGuideModal}>확인</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 시간 제한 강제 중지 모달 */}
      <ConfirmModal
        open={showTimeLimitModal}
        onOpenChange={closeTimeLimitModal}
        title="면접 시간 제한"
        description={`
          면접 시간이 2분 30초에 도달했습니다.
          현재까지의 답변으로 분석을 진행하시겠습니까?
          확인을 클릭하면 일일 소모량 중 1회를 소모하고 분석을 시작합니다. (일일 소모량 3회)`}
        confirmText="확인"
        cancelText="취소"
        variant="warning"
        onConfirm={handleTimeLimitConfirm}
        onCancel={() => {
          closeTimeLimitModal();
          toast.info("면접이 취소되었습니다.");
        }}
      />

      {/* 면접 질문 표시 (면접 시작 시에만) */}
      {isRecording && (
        <div className="fixed top-[60px] left-0 right-0 z-50 bg-white shadow-lg border-b border-gray-200 animate-slideDown">
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
