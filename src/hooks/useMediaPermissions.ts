import { useState, useEffect, useCallback } from "react";
import { debugLog, debugWarn, debugError } from "@/utils/debug";

type PermissionStatus = PermissionState | "unsupported";

interface MediaPermissions {
  camera: PermissionStatus;
  microphone: PermissionStatus;
}

export const useMediaPermissions = () => {
  const [permissions, setPermissions] = useState<MediaPermissions>({
    camera: "prompt",
    microphone: "prompt",
  });

  /**
   * 권한 상태 확인 (지원되는 브라우저 한정)
   */
  const checkPermissions = useCallback(async () => {
    if (!("permissions" in navigator)) {
      // Safari 등 미지원 브라우저
      setPermissions({
        camera: "unsupported",
        microphone: "unsupported",
      });
      return;
    }

    try {
      const camera = await navigator.permissions.query({
        name: "camera" as PermissionName,
      });
      const microphone = await navigator.permissions.query({
        name: "microphone" as PermissionName,
      });

      setPermissions({
        camera: camera.state,
        microphone: microphone.state,
      });

      // 권한 상태 변경 감지
      camera.onchange = () =>
        setPermissions((prev) => ({ ...prev, camera: camera.state }));
      microphone.onchange = () =>
        setPermissions((prev) => ({ ...prev, microphone: microphone.state }));
    } catch (error) {
      debugWarn("permissions API 미지원 또는 오류:", error);
      setPermissions({
        camera: "unsupported",
        microphone: "unsupported",
      });
    }
  }, []);

  /**
   * 실제 권한 요청 (사용자 액션에서 호출해야 함)
   */
  const requestPermissions = useCallback(async () => {
    if (!("mediaDevices" in navigator)) {
      debugError("이 브라우저는 getUserMedia를 지원하지 않습니다.");
      setPermissions({
        camera: "unsupported",
        microphone: "unsupported",
      });
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: { ideal: 48000 },
          channelCount: { ideal: 1 },
        },
      });

      // 성공 → tracks 정리
      stream.getTracks().forEach((track) => track.stop());

      // 권한 상태 즉시 업데이트
      setPermissions({
        camera: "granted",
        microphone: "granted",
      });

      debugLog("권한 요청 성공: camera=granted, microphone=granted");

      // 권한 상태 안정화를 위해 약간의 지연 후 재확인
      setTimeout(() => {
        checkPermissions();
      }, 100);

      return true;
    } catch (err: unknown) {
      debugError("Media permission denied:", err);

      setPermissions({
        camera: "denied",
        microphone: "denied",
      });

      return false;
    }
  }, []);

  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  // 권한 상태를 직접 설정하는 함수 (스트림이 활성화되었을 때 사용)
  const setPermissionsDirectly = useCallback(
    (newPermissions: Partial<MediaPermissions>) => {
      setPermissions((prev) => ({ ...prev, ...newPermissions }));
    },
    []
  );

  return {
    permissions,
    checkPermissions,
    requestPermissions,
    setPermissionsDirectly,
  };
};
