import SectionTitle from "@/components/SectionTitle";
import { useAnalysis } from "@/contexts/AnalysisContext";
import SplitText from "@/components/ReactBits/SplitText/SplitText";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";

const DetailedFeedback = () => {
  const { analysisResults } = useAnalysis();
  const videoData = analysisResults.video;

  if (!videoData) {
    return null;
  }

  const sentimentData = videoData.SentimentAnalysis || {};
  const detailedFeedback = videoData.DetailedFeedback || "";

  // 감정 분석 데이터 처리 함수
  const processSentimentValue = (value: string | undefined) => {
    if (!value || value === "알 수 없음" || value === "0%") {
      return null;
    }
    return parseInt(value.replace("%", ""));
  };

  // 감정 분석 데이터를 차트 형식으로 변환
  const chartData = [
    {
      category: "자신감",
      value: processSentimentValue(sentimentData.confidence_level),
      color: "#3B82F6", // blue-500
    },
    {
      category: "감정 안정성",
      value: processSentimentValue(sentimentData.emotional_stability),
      color: "#10B981", // emerald-500
    },
    {
      category: "전체 감정 점수",
      value: processSentimentValue(sentimentData.sentiment_score),
      color: "#8B5CF6", // violet-500
    },
    {
      category: "스트레스 수준",
      value: processSentimentValue(sentimentData.stress_level),
      color: "#F59E0B", // amber-500
    },
  ];

  // 유의미한 데이터가 있는지 확인
  const hasValidData = chartData.some(
    (item) => item.value !== null && item.value > 0
  );

  const chartConfig = {
    value: {
      label: "점수",
      color: "var(--chart-1)",
    },
    label: {
      color: "var(--foreground)",
    },
  } satisfies ChartConfig;

  return (
    <div className="p-8">
      <SectionTitle
        title="상세 피드백"
        description="AI가 분석한 면접의 상세한 피드백을 확인해보세요!"
        className="mb-8"
        titleClassName="text-2xl max-sm:text-xl"
        descriptionClassName="text-gray-500 font-light text-lg"
      />

      {/* 상세 피드백 */}
      {detailedFeedback && (
        <div className="mb-8 p-6 bg-gradient-to-r from-[#7f5af7] to-[#c9baff] rounded-lg text-white">
          <h3 className="text-lg font-semibold mb-3">전체적인 피드백</h3>
          <p className="leading-relaxed text-white/60">{detailedFeedback}</p>
        </div>
      )}

      {/* 감정 분석 결과 */}
      {Object.keys(sentimentData).length > 0 && (
        <Card className="mb-8 !bg-transparent !border-0 !shadow-none">
          <CardHeader>
            <CardTitle className="text-lg">감정 분석 결과</CardTitle>
            <CardDescription className="text-gray-500 font-light text-md">
              면접 중 감정 상태와 스트레스 수준을 분석한 결과입니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hasValidData ? (
              <>
                <ChartContainer config={chartConfig}>
                  <BarChart
                    accessibilityLayer
                    data={chartData}
                    layout="horizontal"
                    margin={{
                      top: 16,
                      right: 16,
                      bottom: 16,
                      left: 16,
                    }}
                  >
                    <CartesianGrid horizontal={false} />
                    <YAxis
                      dataKey="category"
                      type="category"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      fontSize={12}
                      fontWeight={500}
                    />
                    <XAxis
                      dataKey="value"
                      type="number"
                      domain={[0, 100]}
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      fontSize={12}
                      tickFormatter={(value: number) => `${value}%`}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-muted-foreground">
                                  {data.category}
                                </span>
                                <span className="text-lg font-bold">
                                  {data.value}%
                                </span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                      <LabelList
                        dataKey="value"
                        position="right"
                        offset={8}
                        className="fill-foreground"
                        fontSize={12}
                        fontWeight={500}
                        formatter={(value: number) => `${value}%`}
                      />
                    </Bar>
                  </BarChart>
                </ChartContainer>

                {/* 범례 */}
                <div className="mt-6 flex flex-wrap gap-4 justify-center">
                  {chartData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-muted-foreground">
                        {item.category}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <SplitText
                  text="유의미한 데이터가 없어서 차트를 표시할 수 없어요 😢"
                  className="text-gray-500 text-lg"
                  delay={50}
                  duration={0.4}
                  ease="power2.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 20 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-50px"
                  textAlign="center"
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DetailedFeedback;
