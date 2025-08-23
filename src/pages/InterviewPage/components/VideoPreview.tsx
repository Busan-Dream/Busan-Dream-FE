import { RefObject } from "react";
import ShinyText from "@/components/ReactBits/ShinyText/ShinyText";
import { Camera, Mic } from "lucide-react";
import CheckboxLabel from "./checkboxLabel";
import guideUrl from "@/assets/icons/guide.svg?url";

interface VideoPreviewProps {
  isEnvironmentReady: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
  isCameraGranted: boolean;
  isMicrophoneGranted: boolean;
}

const VideoPreview = ({
  isEnvironmentReady,
  videoRef,
  isCameraGranted,
  isMicrophoneGranted,
}: VideoPreviewProps) => {
  return (
    <div className="flex-1 w-full bg-gray-800 rounded-lg aspect-video portrait:aspect-[3/4] max-sm:landscape:aspect-[4/3] flex items-center justify-center relative overflow-hidden">
      {!isEnvironmentReady ? (
        <div className="text-center px-4 max-sm:px-2 max-sm:h-full max-sm:landscape:h-full">
          <ShinyText
            text="화상 면접을 위한 환경을 구축하는 중입니다..."
            className="text-xl max-sm:text-lg max-sm:landscape:text-base font-medium"
            speed={3}
          />
        </div>
      ) : (
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover opacity-80"
          />
          <ShinyText
            text="상체를 화면 중앙에 위치시켜주세요."
            className="absolute left-1/2 -translate-x-1/2 max-w-[40%] bottom-8 -translate-y-1/2 pointer-events-none opacity-80 text-lg"
          />
          <img
            src={guideUrl}
            alt="가이드"
            className="absolute left-1/2 -translate-x-1/2 w-3/5 max-w-[40%] bottom-0 pointer-events-none opacity-40"
          />
        </div>
      )}

      {/* 권한 체크 영역 */}
      <div className="flex gap-2 p-2 max-sm:gap-1 max-sm:p-1 max-sm:landscape:gap-0.5 max-sm:landscape:p-1 absolute top-0 right-0 max-sm:left-0 max-sm:right-0 max-sm:justify-center max-sm:landscape:top-1 max-sm:landscape:right-1 max-sm:landscape:left-auto max-sm:landscape:justify-end">
        {/* 카메라 권한 */}
        <CheckboxLabel
          id="camera"
          label="카메라 사용 권한"
          description="화상 면접을 위해 카메라 접근이 필요합니다"
          checked={isCameraGranted}
          icon={
            <Camera className="w-4 h-4 max-sm:landscape:w-3 max-sm:landscape:h-3" />
          }
        />

        {/* 마이크 권한 */}
        <CheckboxLabel
          id="microphone"
          label="마이크 사용 권한"
          description="음성 면접을 위해 마이크 접근이 필요합니다"
          checked={isMicrophoneGranted}
          icon={
            <Mic className="w-4 h-4 max-sm:landscape:w-3 max-sm:landscape:h-3" />
          }
        />
      </div>
    </div>
  );
};

export default VideoPreview;
