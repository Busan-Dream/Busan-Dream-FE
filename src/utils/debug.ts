/**
 * 개발 환경에서만 콘솔 로그를 출력하는 유틸리티 함수
 */
export const debugLog = (...args: unknown[]) => {
  // 개발 환경 또는 localhost에서만 로그 출력
  if (import.meta.env.DEV || window.location.hostname === "localhost") {
    console.log(...args);
  }
};

export const debugWarn = (...args: unknown[]) => {
  if (import.meta.env.DEV || window.location.hostname === "localhost") {
    console.warn(...args);
  }
};

export const debugError = (...args: unknown[]) => {
  if (import.meta.env.DEV || window.location.hostname === "localhost") {
    console.error(...args);
  }
};
