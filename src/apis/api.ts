import axios from "axios";

const API_BASE_URL = "https://busan-dream.co.kr";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 600000, // 백엔드 -> LLM 분석 -> 프론트엔드까지 최대 10분 소요될 수 있으므로 타임아웃을 10분으로 설정
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
