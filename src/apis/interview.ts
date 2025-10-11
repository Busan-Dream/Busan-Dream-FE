import { axiosInstance } from "./api";

// 면접 질문 요청 타입
export interface InterviewQuestionRequest {
  interview_type: "토론면접" | "상황면접" | "발표면접" | "경험면접";
  job_category: string;
}

// 면접 질문 응답 타입
export interface InterviewQuestionResponse {
  question: string;
  interview_type: string;
  job_category: string;
  evaluation_criteria: string;
  keywords: string[];
  topic: string;
  is_trending: boolean;
  source_document: string;
}

// 면접 답변 요청 타입
export interface InterviewAnswerRequest {
  question: string;
  interview_type: string;
  job_category: string;
  evaluation_criteria: string;
  keywords: string[];
  topic: string;
  is_trending: boolean;
  source_document: string;
}

// 면접 답변 응답 타입
export interface InterviewAnswerResponse {
  answer: string;
  key_points: string[];
  answer_tips: string[];
  evaluation_focus: string[];
  sample_experience: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  question_info: {
    question: string;
    interview_type: string;
    job_category: string;
    evaluation_criteria: string;
    keywords: string[];
    topic: string;
    is_trending: boolean;
    source_document: string;
  };
}

// 면접 질문 API (기존)
export const getInterviewQuestion = async (
  postingOrgan: string,
  postingPart: string
) => {
  try {
    const response = await axiosInstance.post("/busan/interview", {
      postingOrgan,
      postingPart,
    });
    return response.data;
  } catch (error) {
    console.error("면접 질문 API 호출 실패:", error);
    throw error;
  }
};

// AI 면접 질문 생성 API
export const getAIInterviewQuestion = async (
  params: InterviewQuestionRequest
): Promise<InterviewQuestionResponse> => {
  try {
    const response = await axiosInstance.post("/ai/interview/question", params);
    return response.data;
  } catch (error) {
    console.error("AI 면접 질문 생성 API 호출 실패:", error);
    throw error;
  }
};

// AI 면접 답변 생성 API
export const getAIInterviewAnswer = async (
  params: InterviewAnswerRequest
): Promise<InterviewAnswerResponse> => {
  try {
    const response = await axiosInstance.post("/ai/interview/answer", params);
    return response.data;
  } catch (error) {
    console.error("AI 면접 답변 생성 API 호출 실패:", error);
    throw error;
  }
};
