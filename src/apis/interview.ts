import { axiosInstance } from "./api";

// 면접 질문 API
export const getInterviewQuestion = async (
  postingOrgan: string,
  postingPart: string
) => {
  try {
    const response = await axiosInstance.post("/busan/interview/question", {
      postingOrgan,
      postingPart,
    });
    return response.data;
  } catch (error) {
    console.error("면접 질문 API 호출 실패:", error);
    throw error;
  }
};
