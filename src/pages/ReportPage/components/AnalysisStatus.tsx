import { Badge } from "@/components/ui/badge";
import { useAnalysis } from "@/contexts/AnalysisContext";

interface AnalysisStatusProps {
  randomImage: string;
  isLoading: boolean;
}

const AnalysisStatus = ({ randomImage, isLoading }: AnalysisStatusProps) => {
  const { analysisStatus, analysisResults } = useAnalysis();

  const getStatusMessage = () => {
    if (analysisStatus === "error") {
      return "분석 중 오류가 발생했습니다";
    }

    if (analysisStatus === "completed") {
      return "분석이 완료되었습니다!";
    }

    if (isLoading) {
      const completedAnalyses = [];
      if (analysisResults.video) completedAnalyses.push("영상");
      if (analysisResults.audio) completedAnalyses.push("음성");

      if (completedAnalyses.length > 0) {
        return `${completedAnalyses.join(", ")} 분석 완료! 나머지 분석 중...`;
      }
      return "행동 자료를 분석하는 중...";
    }

    return "분석을 시작합니다...";
  };

  return (
    <div className="text-center py-8 flex flex-col items-center mb-12 relative">
      {randomImage && (
        <img
          src={randomImage}
          alt="분석 상태"
          className="w-[350px] h-[350px] object-contain"
        />
      )}
      <div className="flex flex-col items-center gap-2 absolute bottom-0 left-0 right-0">
        <p className="text-gray-700 text-xl pt-1">{getStatusMessage()}</p>
        <div className="flex justify-center gap-2 flex-wrap pt-1">
          <Badge className="text-sm">한국철도공사</Badge>
          <Badge className="text-sm">운영직</Badge>
          <Badge className="text-sm">일반</Badge>
        </div>
      </div>
    </div>
  );
};

export default AnalysisStatus;
