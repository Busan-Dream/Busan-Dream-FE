import SectionTitle from "@/components/SectionTitle";
import { useAnalysis } from "@/contexts/AnalysisContext";
import SplitText from "@/components/ReactBits/SplitText/SplitText";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    const numericValue = parseInt(value.replace("%", ""));
    return isNaN(numericValue) ? null : numericValue;
  };

  // 감정 분석 데이터를 차트 형식으로 변환
  const chartData = [
    {
      category: "자신감",
      value: processSentimentValue(sentimentData.confidence_level) || 0,
      color: "#3B82F6",
    },
    {
      category: "감정 안정성",
      value: processSentimentValue(sentimentData.emotional_stability) || 0,
      color: "#10B981",
    },
    {
      category: "전체 감정 점수",
      value: processSentimentValue(sentimentData.sentiment_score) || 0,
      color: "#8B5CF6",
    },
    {
      category: "스트레스 수준",
      value: processSentimentValue(sentimentData.stress_level) || 0,
      color: "#F59E0B",
    },
  ];

  // 유의미한 데이터가 있는지 확인
  const hasValidData = chartData.some(
    (item) => item.value !== null && item.value > 0
  );

  // 디버깅용 로그
  // console.log("DetailedFeedback - sentimentData:", sentimentData);
  // console.log("DetailedFeedback - chartData:", chartData);
  // console.log("DetailedFeedback - hasValidData:", hasValidData);

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
            <CardTitle className="text-bold">감정 분석 결과</CardTitle>
            <CardDescription className="text-gray-500 font-light text-md">
              면접 중 감정 상태와 스트레스 수준을 분석한 결과입니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hasValidData ? (
              <>
                {/* 대체 CSS 바 차트 */}
                <div className="w-full bg-gray-50 rounded border p-6">
                  <div className="space-y-4">
                    {chartData.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-24 text-sm font-medium text-gray-700 text-right">
                          {item.category}
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
                          <div
                            className="h-8 rounded-full flex items-center justify-end pr-3 text-white text-sm font-medium transition-all duration-1000"
                            style={{
                              backgroundColor: item.color,
                              width: `${item.value}%`,
                              minWidth: "40px",
                            }}
                          >
                            {item.value}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

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
