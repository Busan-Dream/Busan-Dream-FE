import SectionTitle from "@/components/SectionTitle";
import TalkIcon from "@/assets/icons/talk-icon.svg";
import { useAnalysis } from "@/contexts/AnalysisContext";

const RepetitiveVocabulary = () => {
  const { analysisResults } = useAnalysis();
  const audioData = analysisResults.audio;

  // API에서 받은 자주 사용한 단어들
  const frequentWords = audioData?.FrequentlyUsedWords || [];

  const positions = [
    { left: 50, top: 50 },
    { left: 70, top: 20 },
    { left: 20, top: 70 },
    { left: 70, top: 70 },
  ];

  return (
    <div className="w-full mb-8 p-8 relative">
      {/* 배경 그라데이션 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(121.62deg, rgba(138, 163, 255, 0.15) 0.52%, rgba(117, 41, 255, 0.15) 34.3%, rgba(212, 0, 255, 0.15) 73.31%)",
        }}
      />
      {/* 흰색 그라데이션 오버레이 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #F4F6FA 0%, rgba(255, 255, 255, 0) 50%, #F4F6FA 100%)",
        }}
      />

      <SectionTitle
        title="반복적인 어휘"
        description="답변 중 음성의 분석 결과를 알려드려요!"
        className="mb-8 z-3 relative"
        titleClassName="text-2xl max-sm:text-xl"
        descriptionClassName="text-gray-500 font-light text-lg"
      />

      <div className="flex max-sm:flex-col max-sm:justify-center max-sm:items-center gap-8 justify-center items-end relative z-3">
        {/* 반복 어휘 원형 그래프 */}
        {frequentWords.length > 0 ? (
          <div className="flex flex-col gap-4 relative w-50 h-50">
            <img
              src={TalkIcon}
              alt="talk-icon"
              className="w-full h-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />
            {frequentWords.slice(0, 4).map((word: string, index: number) => {
              const position = positions[index];

              return (
                <div
                  key={word}
                  className="absolute"
                  style={{
                    left: `${position.left}%`,
                    top: `${position.top}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <span
                    className={`text-gray-600 ${
                      index === 0 ? "text-4xl" : "text-lg text-gray-100"
                    }`}
                  >
                    {word}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-2xl text-gray-700 mb-4">
              반복적인 어휘가 없어요!
            </h3>
            <p className="text-gray-500">
              언어 습관이 좋아요! 조금 더 전문적인 지원자로 보일 수 있어요.
            </p>
          </div>
        )}

        {/* 개선 추천 */}
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-2xl text-gray-700 mb-4">
            개선을 추천하는 습관
          </h3>
          <div className="flex flex-col gap-1">
            <p className="text-gray-500">
              {frequentWords.length > 0
                ? `${frequentWords.join(
                    ", "
                  )}와 같은 단어를 반복적으로 사용해요.`
                : "반복적인 어휘 사용이 적절해요."}
            </p>
            <p className="text-gray-500">
              맥락에 맞는 어휘로 바꾸면 조금 더 전문적인 지원자로 보일 수
              있어요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepetitiveVocabulary;
