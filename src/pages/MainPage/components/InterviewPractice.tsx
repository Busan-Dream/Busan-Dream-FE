import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  const [interviewType, setInterviewType] = useState<string>("");
  const [question, setQuestion] = useState<InterviewQuestionResponse | null>(
    null
  );
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [aiAnswer, setAiAnswer] = useState<InterviewAnswerResponse | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [aiLoading, setAiLoading] = useState<boolean>(false);

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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>면접 연습</CardTitle>
          <CardDescription>
            AI와 함께 면접 연습을 해보세요. 면접 타입을 선택하고 질문을 생성한
            후, 답변을 작성해보세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 면접 타입 선택 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">면접 타입</label>
            <Select value={interviewType} onValueChange={setInterviewType}>
              <SelectTrigger>
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
            <Button
              onClick={generateQuestion}
              disabled={!interviewType || loading}
              className="w-full"
            >
              {loading ? "질문 생성 중..." : "면접 질문 생성"}
            </Button>
          </div>

          {/* 직무 카테고리 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">직무 카테고리</label>
            <div className="p-3 bg-gray-50 rounded-md border">
              <span className="text-gray-700">기계직</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 면접 질문 표시 */}
      {question && (
        <Card>
          <CardHeader>
            <CardTitle>면접 질문</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">질문</label>
              <div className="p-4 bg-blue-50 rounded-md border-l-4 border-blue-500">
                <p className="text-gray-800">{question.question}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">핵심 포인트</label>
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-gray-700">{question.evaluation_criteria}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">키워드</label>
              <div className="flex flex-wrap gap-2">
                {question.keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 답변 입력 */}
      {question && (
        <Card>
          <CardHeader>
            <CardTitle>내 답변</CardTitle>
            <CardDescription>
              질문에 대한 답변을 작성해보세요. 답변은 자동으로 저장됩니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="여기에 답변을 작성하세요..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="min-h-[200px]"
            />
          </CardContent>
        </Card>
      )}

      {/* AI 답변 생성 버튼 */}
      {question && userAnswer && (
        <div className="text-center">
          <Button onClick={generateAIAnswer} disabled={aiLoading} size="lg">
            {aiLoading ? "AI 답변 생성 중..." : "AI 추천 답변 보기"}
          </Button>
        </div>
      )}

      {/* AI 답변 표시 */}
      {aiAnswer && (
        <Card>
          <CardHeader>
            <CardTitle>AI 추천 답변</CardTitle>
            <CardDescription>
              AI가 생성한 모범 답변입니다. 내 답변과 비교해보세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">AI 답변</label>
              <div className="p-4 bg-green-50 rounded-md border-l-4 border-green-500">
                <p className="text-gray-800">{aiAnswer.answer}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">핵심 포인트</label>
              <div className="space-y-2">
                {aiAnswer.key_points.map((point, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded-md">
                    <p className="text-gray-700">• {point}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">답변 팁</label>
              <div className="space-y-2">
                {aiAnswer.answer_tips.map((tip, index) => (
                  <div
                    key={index}
                    className="p-2 bg-yellow-50 rounded-md border-l-4 border-yellow-500"
                  >
                    <p className="text-gray-700">💡 {tip}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">평가 포인트</label>
              <div className="space-y-2">
                {aiAnswer.evaluation_focus.map((focus, index) => (
                  <div
                    key={index}
                    className="p-2 bg-blue-50 rounded-md border-l-4 border-blue-500"
                  >
                    <p className="text-gray-700">🎯 {focus}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InterviewPractice;
