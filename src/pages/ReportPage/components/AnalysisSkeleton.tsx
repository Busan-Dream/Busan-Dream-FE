import SectionTitle from "@/components/SectionTitle";
import AudioIcon from "@/assets/icons/audio-icon.svg";
import VideoIcon from "@/assets/icons/video-icon.png";

interface AnalysisSkeletonProps {
  type: "audio" | "video" | "feedback" | "vocabulary";
}

const AnalysisSkeleton = ({ type }: AnalysisSkeletonProps) => {
  // 타입별 설정
  const config = {
    audio: {
      icon: <img src={AudioIcon} alt="audio-icon" className="w-10 h-10" />,
      title: "음성 분석 결과",
      description: "답변 중 음성의 분석 결과를 알려드려요!",
      cards: 3,
    },
    video: {
      icon: <img src={VideoIcon} alt="video-icon" className="w-10 h-10" />,
      title: "영상 분석 결과",
      description: "답변 중 영상의 분석 결과를 알려드려요!",
      cards: 3,
    },
    feedback: {
      icon: null,
      title: "상세 피드백",
      description: "AI가 분석한 면접의 상세한 피드백을 확인해보세요!",
      cards: 0,
    },
    vocabulary: {
      icon: null,
      title: "반복적인 어휘",
      description: "답변 중 음성의 분석 결과를 알려드려요!",
      cards: 0,
    },
  };

  const currentConfig = config[type];

  if (type === "vocabulary") {
    return (
      <div className="w-full mb-8 p-8 relative animate-pulse">
        {/* 배경 그라데이션 */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(121.62deg, rgba(138, 163, 255, 0.15) 0.52%, rgba(117, 41, 255, 0.15) 34.3%, rgba(212, 0, 255, 0.15) 73.31%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #F4F6FA 0%, rgba(255, 255, 255, 0) 50%, #F4F6FA 100%)",
          }}
        />

        <SectionTitle
          title={currentConfig.title}
          description={currentConfig.description}
          className="mb-8 z-3 relative"
          titleClassName="text-2xl max-sm:text-xl"
          descriptionClassName="text-gray-500 font-light text-lg"
        />

        <div className="flex max-sm:flex-col max-sm:justify-center max-sm:items-center gap-8 justify-center items-end relative z-3">
          {/* 원형 그래프 영역 스켈레톤 */}
          <div className="w-50 h-50 bg-gray-200 rounded-full"></div>

          {/* 개선 추천 영역 스켈레톤 */}
          <div className="flex flex-col gap-2">
            <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="flex flex-col gap-2">
              <div className="h-4 bg-gray-100 rounded w-64"></div>
              <div className="h-4 bg-gray-100 rounded w-56"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "feedback") {
    return (
      <div className="p-8 animate-pulse">
        <SectionTitle
          title={currentConfig.title}
          description={currentConfig.description}
          className="mb-8"
          titleClassName="text-2xl max-sm:text-xl"
          descriptionClassName="text-gray-500 font-light text-lg"
        />

        {/* 상세 피드백 스켈레톤 */}
        <div className="mb-8 p-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg h-32"></div>

        {/* 감정 분석 카드 스켈레톤 */}
        <div className="mb-8">
          <div className="mb-4">
            <div className="h-6 bg-gray-200 rounded w-40 mb-2"></div>
            <div className="h-4 bg-gray-100 rounded w-64"></div>
          </div>
          <div className="w-full bg-gray-50 rounded border p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-24 h-4 bg-gray-200 rounded"></div>
                  <div className="flex-1 bg-gray-200 rounded-full h-8"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 animate-pulse">
      <SectionTitle
        icon={currentConfig.icon}
        title={currentConfig.title}
        className="mb-8"
        titleClassName="text-2xl max-sm:text-xl"
        description={currentConfig.description}
        descriptionClassName="text-gray-500 font-light text-lg"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: currentConfig.cards }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-6 border border-gray-200"
          >
            {/* 타이틀 스켈레톤 */}
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            {/* 설명 스켈레톤 */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-100 rounded"></div>
              <div className="h-4 bg-gray-100 rounded w-5/6"></div>
              <div className="h-4 bg-gray-100 rounded w-4/6"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalysisSkeleton;
