import SectionTitle from "@/components/SectionTitle";
import AudioIcon from "@/assets/icons/audio-icon.svg";
import AnalysisCard from "./AnalysisCard";
import { useAnalysis } from "@/contexts/AnalysisContext";

const VoiceAnalysis = () => {
  const { analysisResults } = useAnalysis();
  const audioData = analysisResults.audio;

  const voiceItems = [
    {
      title: "명확성",
      description: audioData?.Clarity || "분석 데이터가 없습니다.",
    },
    {
      title: "논리성",
      description: audioData?.Logicality || "분석 데이터가 없습니다.",
    },
    {
      title: "전문성",
      description: audioData?.Expertise || "분석 데이터가 없습니다.",
    },
  ];

  return (
    <div className="p-8">
      <SectionTitle
        icon={<img src={AudioIcon} alt="audio-icon" className="w-10 h-10" />}
        title="음성 분석 결과"
        className="mb-8"
        titleClassName="text-2xl max-sm:text-xl"
        description="답변 중 음성의 분석 결과를 알려드려요!"
        descriptionClassName="text-gray-500 font-light text-lg"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {voiceItems.map((item, index) => (
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

export default VoiceAnalysis;
