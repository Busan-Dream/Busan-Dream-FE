import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  getAIInterviewQuestion,
  getAIInterviewAnswer,
  InterviewQuestionResponse,
  InterviewAnswerResponse,
} from "@/apis/interview";
import { Badge } from "@/components/ui/badge";

const InterviewPractice = () => {
  const [interviewType, setInterviewType] = useState<string>("토론면접");
  const [question, setQuestion] = useState<InterviewQuestionResponse | null>(
    null
  );
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [aiAnswer, setAiAnswer] = useState<InterviewAnswerResponse | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [jobCategory, setJobCategory] = useState<string>("기계직");

  const interviewTypes = [
    { value: "토론면접", label: "토론면접" },
    { value: "상황면접", label: "상황면접" },
    { value: "발표면접", label: "발표면접" },
    { value: "경험면접", label: "경험면접" },
  ];

  // 세션 스토리지에서 답변 불러오기
  useEffect(() => {
    const savedAnswer = sessionStorage.getItem("interviewAnswer");
    if (savedAnswer) {
      setUserAnswer(savedAnswer);
    }
  }, []);

  // 답변을 세션 스토리지에 저장
  useEffect(() => {
    if (userAnswer) {
      sessionStorage.setItem("interviewAnswer", userAnswer);
    }
  }, [userAnswer]);

  // 면접 질문 생성
  const generateQuestion = async () => {
    if (!interviewType) return;

    setLoading(true);
    try {
      const questionData = await getAIInterviewQuestion({
        interview_type: interviewType as
          | "토론면접"
          | "상황면접"
          | "발표면접"
          | "경험면접",
        job_category: "기계직",
      });
      setQuestion(questionData);
      setAiAnswer(null); // 새로운 질문이 생성되면 AI 답변 초기화
    } catch (error) {
      console.error("면접 질문 생성 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // AI 답변 생성
  const generateAIAnswer = async () => {
    if (!question) return;

    setAiLoading(true);
    try {
      const answerData = await getAIInterviewAnswer({
        question: question.question,
        interview_type: question.interview_type,
        job_category: question.job_category,
        evaluation_criteria: question.evaluation_criteria,
        keywords: question.keywords,
        topic: question.topic,
        is_trending: question.is_trending,
        source_document: question.source_document,
      });
      setAiAnswer(answerData);
    } catch (error) {
      console.error("AI 답변 생성 실패:", error);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="interview_practice space-y-8 mt-8">
      {/* 면접 타입 선택 및 직무 카테고리 */}
      <div className="flex flex-col gap-6">
        {/* 면접 타입 선택 */}
        <h3 className="flex gap-2 items-center text-xl font-semibold">
          <span>{jobCategory}</span>
          <Select value={interviewType} onValueChange={setInterviewType}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="면접 타입을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {interviewTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          을 준비하고 계신가요?
        </h3>

        {/* 질문 생성 버튼 */}
        <Button
          onClick={generateQuestion}
          disabled={!interviewType || loading}
          className="w-full h-12 transition-bg bg-gradient-to-r from-[#E4007F]/60 to-[#4079ff]/60 hover:from-[#D4007F] hover:to-[#3079ff]"
        >
          {loading ? "질문 생성 중..." : "면접 질문 생성"}
        </Button>
      </div>

      {/* 면접 질문 표시 */}
      {question && (
        <div className="space-y-6">
          {/* 질문 */}
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-lg font-medium text-gray-700">질문</label>
              <div className="p-6 bg-gray-50 rounded-lg border-gray-500">
                <p className="text-gray-800 text-lg leading-relaxed">
                  {question.question}
                </p>
              </div>
            </div>

            {/* 핵심 포인트 */}
            <div className="flex flex-col gap-2">
              <label className="text-lg font-medium text-gray-700">
                핵심 포인트
              </label>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 leading-relaxed">
                  {question.evaluation_criteria}
                </p>
              </div>
            </div>

            {/* 키워드 */}
            <div className="flex flex-col gap-2">
              <label className="text-lg font-medium text-gray-700">
                키워드
              </label>
              <div className="flex flex-wrap gap-2">
                {question.keywords.map((keyword, index) => (
                  <Badge key={index} className="h-7 px-3 text-md">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 답변 비교 섹션 */}
      {question && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">답변 작성 및 비교</h2>

          <div className="grid grid-cols-2 gap-8">
            {/* 내 답변 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">내 답변</h3>
              <Textarea
                placeholder="여기에 답변을 작성하세요..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="min-h-[300px] text-base leading-relaxed resize-none"
              />
            </div>

            {/* AI 답변 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                AI 추천 답변
              </h3>
              {!aiAnswer ? (
                <div className="min-h-[300px] flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-center text-gray-500">
                    <p className="mb-2">답변을 작성한 후</p>
                    <p>"AI 추천 답변 보기" 버튼을 클릭하세요</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-gray-800 leading-relaxed">
                      {aiAnswer.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* AI 답변 생성 버튼 */}
      {question && userAnswer && !aiAnswer && (
        <div className="text-center">
          <Button
            onClick={generateAIAnswer}
            disabled={aiLoading}
            size="lg"
            className="h-12 px-8 bg-gradient-to-r from-[#E4007F] to-[#4079ff] hover:from-[#D4007F] hover:to-[#3079ff]"
          >
            {aiLoading ? "AI 답변 생성 중..." : "AI 추천 답변 보기"}
          </Button>
        </div>
      )}

      {/* AI 답변 표시 */}
      {aiAnswer && (
        <div className="space-y-6">
          {/* 핵심 포인트 */}
          <div className="flex flex-col gap-2">
            <label className="text-lg font-medium text-gray-700">
              핵심 포인트
            </label>
            <div className="flex gap-2">
              {aiAnswer.key_points.map((point, index) => (
                <div key={index} className="p-3 rounded-lg bg-gray-100">
                  <p className="text-gray-700">{point}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 답변 팁 */}
          <div className="flex flex-col gap-2">
            <label className="text-lg font-medium text-gray-700">답변 팁</label>
            <div className="flex gap-2">
              {aiAnswer.answer_tips.map((tip, index) => (
                <div key={index} className="p-3 rounded-lg bg-gray-100">
                  <p className="text-gray-700"> {tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 평가 포인트 */}
          <div className="flex flex-col gap-2">
            <label className="text-lg font-medium text-gray-700">
              평가 포인트
            </label>
            <div className="flex gap-2">
              {aiAnswer.evaluation_focus.map((focus, index) => (
                <div key={index} className="p-3 rounded-lg bg-gray-100">
                  <p className="text-gray-700"> {focus}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewPractice;
