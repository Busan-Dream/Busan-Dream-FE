import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface DeviceSelectorProps {
  videoDevices: MediaDeviceInfo[];
  audioDevices: MediaDeviceInfo[];
  selectedVideoDeviceId: string | undefined;
  selectedAudioDeviceId: string | undefined;
  onVideoDeviceChange: (deviceId: string) => void;
  onAudioDeviceChange: (deviceId: string) => void;
  onPermissionReset: () => void;
  micLevel: number;
  isListening: boolean;
  onMicTestToggle: () => void;
  isMicrophoneGranted: boolean;
  currentStream: MediaStream | null;
}

const DeviceSelector = ({
  videoDevices,
  audioDevices,
  selectedVideoDeviceId,
  selectedAudioDeviceId,
  onVideoDeviceChange,
  onAudioDeviceChange,
  onPermissionReset,
  micLevel,
  isListening,
  onMicTestToggle,
  isMicrophoneGranted,
  currentStream,
}: DeviceSelectorProps) => {
  return (
    <div className="flex items-center gap-2">
      {/* 마이크 테스트 */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <div
            className={`w-2 h-2 rounded-full transition-colors duration-200 ${
              isMicrophoneGranted &&
              currentStream &&
              currentStream.getAudioTracks().length > 0
                ? "bg-green-500"
                : "bg-gray-400"
            }`}
          ></div>
          <span className="text-xs text-gray-600">마이크</span>
        </div>
        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-0"
            style={{
              width: `${Math.min(100, micLevel * 100)}%`,
              opacity: micLevel > 0.001 ? 1 : 0.1,
            }}
          />
        </div>
        <button
          onClick={onMicTestToggle}
          className="px-2 py-1 text-xs rounded bg-gray-100 hover:bg-gray-200"
        >
          {isListening ? "중지" : "테스트"}
        </button>
      </div>

      <Select value={selectedVideoDeviceId} onValueChange={onVideoDeviceChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="카메라 선택" />
        </SelectTrigger>
        <SelectContent>
          {videoDevices.map((d) => (
            <SelectItem key={d.deviceId} value={d.deviceId}>
              {d.label || `Camera ${d.deviceId.slice(0, 4)}`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedAudioDeviceId} onValueChange={onAudioDeviceChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="마이크 선택" />
        </SelectTrigger>
        <SelectContent>
          {audioDevices.map((d) => (
            <SelectItem key={d.deviceId} value={d.deviceId}>
              {d.label || `Mic ${d.deviceId.slice(0, 4)}`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        onClick={onPermissionReset}
        className="px-3 py-2 w-fit rounded-md bg-gray-900 text-white text-sm"
      >
        카메라·마이크 재설정
      </Button>
    </div>
  );
};

export default DeviceSelector;
