import { Lightbulb } from "lucide-react";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";
import { useAnalysis } from "@/contexts/AnalysisContext";
import { calculateGrade, MAX_SCORE } from "@/constants/interview";

const ScoreSection = () => {
  const { analysisResults, interviewQuestion, individualStatus } =
    useAnalysis();
  const videoData = analysisResults.video;
  const audioData = analysisResults.audio;

  // 점수 계산 (영상 + 음성 분석 점수)
  const videoScore = Number(videoData?.Score) || 0;
  const audioScore = Number(audioData?.Score) || 0;
  const totalScore = videoScore + audioScore;

  // 분석 상태에 따른 메시지
  const getScoreMessage = () => {
    // 분석 진행 중인 경우
    if (
      individualStatus.video === "analyzing" &&
      individualStatus.audio === "analyzing"
    ) {
      return "분석 중...";
    }
    if (individualStatus.video === "analyzing") {
      return "영상 분석 중...";
    }
    if (individualStatus.audio === "analyzing") {
      return "음성 분석 중...";
    }

    // 분석이 완료된 경우
    if (
      individualStatus.video === "completed" &&
      individualStatus.audio === "completed"
    ) {
      const grade = calculateGrade(totalScore);

      // 1. 종합 점수가 C등급 이상인가?
      if (grade === "A+" || grade === "A" || grade === "B" || grade === "C") {
        // 1-1. videoScore ↔ audioScore 5점 이상 차이 나는지 확인
        const scoreDifference = Math.abs(videoScore - audioScore);

        if (scoreDifference >= 5) {
          // 1-1-1. 5점 이상 차이가 남
          if (videoScore < audioScore) {
            return "언어적 영역이 더 우수해요!";
          } else {
            return "비언어적 영역이 더 우수해요!";
          }
        } else {
          // 1-1-2. 5점 미만으로 차이가 남
          return "균형잡힌 면접 결과예요!";
        }
      } else {
        // 1-2. False (D, F 등급)
        return "개선이 필요해요.";
      }
    }

    return "분석을 시작합니다...";
  };

  const getScoreDescription = () => {
    // 분석 진행 중인 경우
    if (
      individualStatus.video === "analyzing" ||
      individualStatus.audio === "analyzing"
    ) {
      return "잠시만 기다려주세요.";
    }

    // 분석이 완료된 경우
    if (
      individualStatus.video === "completed" &&
      individualStatus.audio === "completed"
    ) {
      const grade = calculateGrade(totalScore);

      // 1. 종합 점수가 C등급 이상인가?
      if (grade === "A+" || grade === "A" || grade === "B" || grade === "C") {
        // 1-1. videoScore ↔ audioScore 5점 이상 차이 나는지 확인
        const scoreDifference = Math.abs(videoScore - audioScore);

        if (scoreDifference >= 5) {
          // 1-1-1. 5점 이상 차이가 남
          if (videoScore < audioScore) {
            return "언어적 피드백에서 더 좋은 점수를 얻었어요!";
          } else {
            return "비언어적 피드백에서 더 좋은 점수를 얻었어요!";
          }
        } else {
          // 1-1-2. 5점 미만으로 차이가 남
          return "언어적, 비언어적으로 균형잡힌 지원자예요!";
        }
      } else {
        // 1-2. False (D, F 등급)
        return "분석이 완료되었지만 점수가 낮습니다. 개선이 필요한 부분이 있어요.";
      }
    }

    return "분석을 시작합니다.";
  };

  const data = [
    { name: "점수", value: totalScore, color: "#CB559A" },
    {
      name: "남은 점수",
      value: MAX_SCORE - totalScore,
      color: "rgba(203, 85, 154, 0.6)",
    },
  ];

  const chartConfig = {
    점수: {
      label: "점수",
      color: "#CB559A",
    },
    "남은 점수": {
      label: "남은 점수",
      color: "rgba(203, 85, 154, 0.6)",
    },
  };

  return (
    <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 bg-[#CB559A]/60">
      {/* 전체 점수 */}
      <figure className="lg:col-span-1 flex flex-col items-center">
        <div className="relative w-[200px] h-[200px] mb-4">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={0}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              {payload[0].name}
                            </span>
                            <span className="font-bold text-muted-foreground">
                              {payload[0].value}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ChartContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-white">
              {calculateGrade(totalScore)}
            </span>
            <span className="text-sm text-white/60">등급</span>
          </div>

          <div className="text-center absolute bottom-0 right-0">
            <p className="text-3xl text-white mr-4">{Number(totalScore)}</p>
            <p className="text-xl font-light text-white/60 ml-4">/100</p>
          </div>
        </div>
      </figure>

      {/* 언어적 피드백 및 면접 질문 */}
      <div className="lg:col-span-2 text-white flex flex-col gap-4">
        <div className="flex flex-col gap-2 px-2">
          <h3 className="text-2xl">{getScoreMessage()}</h3>
          <div className="flex flex-col text-lg font-light text-white/60">
            <p>{getScoreDescription()}</p>
            {videoScore > 0 && audioScore > 0 && (
              <p>다음과 같은 점을 개선하면 더 좋은 결과가 있을 것 같아요.</p>
            )}
          </div>
        </div>

        <div className="bg-[#F2F1FD]/20 w-fit rounded-lg py-6 px-8 text-lg font-light flex items-start gap-4">
          <Lightbulb className="w-5 h-5 flex-shrink-0" />
          <div className="flex flex-col gap-2 mb-2">
            <p className="text-base text-white/60">
              사용자님이 답변한 질문은...
            </p>
            <p>{interviewQuestion || "면접 질문을 불러올 수 없습니다."}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreSection;
