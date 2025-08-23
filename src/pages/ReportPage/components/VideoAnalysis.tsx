import SectionTitle from "@/components/SectionTitle";
import VideoIcon from "@/assets/icons/video-icon.png";
import AnalysisCard from "./AnalysisCard";
import { useAnalysis } from "@/contexts/AnalysisContext";

const VideoAnalysis = () => {
  const { analysisResults } = useAnalysis();
  const videoData = analysisResults.video;

  const videoItems = [
    {
      title: "자세",
      description: videoData?.Posture || "분석 데이터가 없습니다.",
    },
    {
      title: "표정",
      description: videoData?.FacialExpressions || "분석 데이터가 없습니다.",
    },
    {
      title: "제스처",
      description: videoData?.Gestures || "분석 데이터가 없습니다.",
    },
  ];

  return (
    <div className="p-8">
      <SectionTitle
        icon={<img src={VideoIcon} alt="video-icon" className="w-10 h-10" />}
        title="영상 분석 결과"
        className="mb-8"
        titleClassName="text-2xl max-sm:text-xl"
        description="답변 중 영상의 분석 결과를 알려드려요!"
        descriptionClassName="text-gray-500 font-light text-lg"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {videoItems.map((item, index) => (
          <AnalysisCard
            key={index}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoAnalysis;
