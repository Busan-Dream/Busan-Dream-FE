import { Badge } from "@/components/ui/badge";
import { useAnalysis } from "@/contexts/AnalysisContext";
import SplitText from "@/components/ReactBits/SplitText/SplitText";

interface AnalysisStatusProps {
  postingOrgan?: string;
  postingPart?: string;
  characterImage: string;
}

const AnalysisStatus = ({
  postingOrgan,
  postingPart,
  characterImage,
}: AnalysisStatusProps) => {
  const { analysisStatus, individualStatus } = useAnalysis();

  // 상태에 따른 메시지 결정
  const getStatusMessage = () => {
    if (analysisStatus === "error") {
      return "분석 중 오류가 발생했습니다";
    }

    if (
      analysisStatus === "completed" ||
      (individualStatus.audio === "completed" &&
        individualStatus.video === "completed")
    ) {
      return "모든 분석이 완료되었습니다 🎉";
    }

    // 부분 완료 상태
    if (
      individualStatus.audio === "completed" &&
      individualStatus.video === "analyzing"
    ) {
      return "음성 분석이 완료되었습니다. 영상 분석을 진행합니다 🎬";
    }

    if (
      individualStatus.video === "completed" &&
      individualStatus.audio === "analyzing"
    ) {
      return "영상 분석이 완료되었습니다. 음성 분석을 진행합니다 🎤";
    }

    // 분석 시작/진행 중
    return "분석 결과를 불러오는 중입니다 ⏳";
  };

  return (
    <div className="text-center py-8 flex flex-col items-center mb-12">
      {/* 캐릭터 이미지 */}
      <img
        src={characterImage}
        alt="분석 캐릭터"
        className="w-[350px] h-[350px] object-contain mb-6"
      />

      {/* 상태 메시지 */}
      <SplitText
        text={getStatusMessage()}
        className="text-lg text-gray-700 mb-4 font-medium"
      />

      {/* 타이틀 */}
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        AI 분석 결과 리포트
      </h2>

      {/* 배지 */}
      {(postingOrgan || postingPart) && (
        <div className="flex justify-center gap-2 flex-wrap">
          {postingOrgan && <Badge className="text-sm">{postingOrgan}</Badge>}
          {postingPart && <Badge className="text-sm">{postingPart}</Badge>}
        </div>
      )}
    </div>
  );
};

export default AnalysisStatus;
