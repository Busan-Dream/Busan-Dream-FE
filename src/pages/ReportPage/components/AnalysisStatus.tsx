import { Badge } from "@/components/ui/badge";

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
  return (
    <div className="text-center py-8 flex flex-col items-center mb-12">
      {/* 캐릭터 이미지 */}
      <img
        src={characterImage}
        alt="분석 캐릭터"
        className="w-[350px] h-[350px] object-contain mb-6"
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
