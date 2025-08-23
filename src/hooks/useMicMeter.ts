import { useRef, useState, useCallback, useEffect } from "react";

interface UseMicMeterReturn {
  micLevel: number; // 0~1
  isListening: boolean;
  startMicMeter: () => void;
  stopMicMeter: () => void;
}

export const useMicMeter = (stream: MediaStream | null): UseMicMeterReturn => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | NodeJS.Timeout | null>(null);
  const [micLevel, setMicLevel] = useState(0);
  const [isListening, setIsListening] = useState(false);

  const startMicMeter = useCallback(() => {
    if (!stream) {
      console.error("스트림이 없습니다.");
      return;
    }

    try {
      const ctx = new AudioContext();
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();

      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.0;
      src.connect(analyser);

      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
      setIsListening(true);

      const data = new Uint8Array(analyser.fftSize);

      const loop = () => {
        analyser.getByteTimeDomainData(data);
        let sum = 0;

        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128; // -1..1
          sum += v * v;
        }

        const rms = Math.sqrt(sum / data.length); // 0..1
        // 실시간 반응을 위한 즉시 증폭
        const amplified = Math.pow(rms * 12, 0.4); // 더 강한 증폭과 민감도
        const dynamicLevel = Math.min(1, amplified);
        setMicLevel(dynamicLevel);

        // requestAnimationFrame 대신 더 빠른 업데이트
        rafRef.current = setTimeout(() => loop(), 16); // ~60fps
      };

      rafRef.current = requestAnimationFrame(loop);
      console.log("마이크 미터 시작");
    } catch (error) {
      console.error("마이크 미터 시작 실패:", error);
    }
  }, [stream]);

  const stopMicMeter = useCallback(() => {
    if (rafRef.current) {
      if (typeof rafRef.current === "number") {
        cancelAnimationFrame(rafRef.current);
      } else {
        clearTimeout(rafRef.current);
      }
      rafRef.current = null;
    }

    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }

    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }

    setIsListening(false);
    setMicLevel(0);
    console.log("마이크 미터 중지");
  }, []);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      stopMicMeter();
    };
  }, [stopMicMeter]);

  return {
    micLevel,
    isListening,
    startMicMeter,
    stopMicMeter,
  };
};
