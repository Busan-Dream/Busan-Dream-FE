// 면접 시간 제한 (2분 30초)
export const INTERVIEW_TIME_LIMIT_SECONDS = 150;

// 등급 기준
export const GRADE_THRESHOLDS = {
  A_PLUS: 95,
  A: 85,
  B: 75,
  C: 65,
  D: 55,
  F: 0,
} as const;

// 등급 계산 함수
export const calculateGrade = (score: number): string => {
  if (score >= GRADE_THRESHOLDS.A_PLUS) return "A+";
  if (score >= GRADE_THRESHOLDS.A) return "A";
  if (score >= GRADE_THRESHOLDS.B) return "B";
  if (score >= GRADE_THRESHOLDS.C) return "C";
  if (score >= GRADE_THRESHOLDS.D) return "D";
  return "F";
};

// 기본 면접 질문
export const DEFAULT_INTERVIEW_QUESTION =
  "면접관은 지원자의 경험과 역량에 대해 질문합니다.";

// 최대 점수
export const MAX_SCORE = 100; // 영상 50점 + 음성 50점
