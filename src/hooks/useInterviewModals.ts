import { useState, useCallback } from "react";

interface UseInterviewModalsReturn {
  // 브라우저 모달
  showBrowserModal: boolean;
  openBrowserModal: () => void;
  closeBrowserModal: () => void;

  // 권한 거부 모달
  showPermissionDeniedModal: boolean;
  openPermissionDeniedModal: () => void;
  closePermissionDeniedModal: () => void;

  // 권한 설정 안내 모달
  showPermissionGuideModal: boolean;
  permissionGuideMessage: string;
  openPermissionGuideModal: () => void;
  closePermissionGuideModal: () => void;

  // 시간 제한 모달
  showTimeLimitModal: boolean;
  timeLimitBlob: Blob | null;
  openTimeLimitModal: (blob: Blob) => void;
  closeTimeLimitModal: () => void;
}

export const useInterviewModals = (): UseInterviewModalsReturn => {
  const [showBrowserModal, setShowBrowserModal] = useState(false);
  const [showPermissionDeniedModal, setShowPermissionDeniedModal] =
    useState(false);
  const [showPermissionGuideModal, setShowPermissionGuideModal] =
    useState(false);
  const [permissionGuideMessage, setPermissionGuideMessage] = useState("");
  const [showTimeLimitModal, setShowTimeLimitModal] = useState(false);
  const [timeLimitBlob, setTimeLimitBlob] = useState<Blob | null>(null);

  const openBrowserModal = useCallback(() => {
    setShowBrowserModal(true);
  }, []);

  const closeBrowserModal = useCallback(() => {
    setShowBrowserModal(false);
  }, []);

  const openPermissionDeniedModal = useCallback(() => {
    setShowPermissionDeniedModal(true);
  }, []);

  const closePermissionDeniedModal = useCallback(() => {
    setShowPermissionDeniedModal(false);
  }, []);

  const openPermissionGuideModal = useCallback(() => {
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
      message += "Safari: Safari > 환경설정 > 웹사이트 → 카메라/마이크 허용";
    } else {
      message +=
        "브라우저 설정 → 개인정보 보호 → 카메라/마이크 권한 허용";
    }

    setPermissionGuideMessage(message);
    setShowPermissionGuideModal(true);
  }, []);

  const closePermissionGuideModal = useCallback(() => {
    setShowPermissionGuideModal(false);
  }, []);

  const openTimeLimitModal = useCallback((blob: Blob) => {
    setTimeLimitBlob(blob);
    setShowTimeLimitModal(true);
  }, []);

  const closeTimeLimitModal = useCallback(() => {
    setTimeLimitBlob(null);
    setShowTimeLimitModal(false);
  }, []);

  return {
    showBrowserModal,
    openBrowserModal,
    closeBrowserModal,
    showPermissionDeniedModal,
    openPermissionDeniedModal,
    closePermissionDeniedModal,
    showPermissionGuideModal,
    permissionGuideMessage,
    openPermissionGuideModal,
    closePermissionGuideModal,
    showTimeLimitModal,
    timeLimitBlob,
    openTimeLimitModal,
    closeTimeLimitModal,
  };
};

