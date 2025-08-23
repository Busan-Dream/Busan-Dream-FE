import { Badge } from "@/components/ui/badge";
import { Policy } from "@/apis/policy";

interface PolicyCardProps {
  policy: Policy;
}

const PolicyCard = ({ policy }: PolicyCardProps) => {
  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 상태 텍스트 생성
  const getStatusText = () => {
    if (policy.isCurrent) {
      return `계속(${formatDate(policy.policyStartDate)} ~ 현재)`;
    }
    return `~ ${
      policy.policyDateDate ? formatDate(policy.policyDateDate) : "상시"
    }`;
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 max-w-sm cursor-pointer flex flex-col justify-between gap-4">
      {/* 맨 위 - 부산 내/외 배지 */}
      <Badge
        variant="secondary"
        className="bg-black text-white hover:bg-black/90"
      >
        {policy.policyBusan || "지역 정보 없음"}
      </Badge>

      <div className="flex flex-col gap-1">
        {/* 메인 제목 */}
        <h3 className="text-lg text-black mb-2 leading-tight">
          {policy.policyTitle || "제목 없음"}
        </h3>

        {/* 날짜/상태 */}
        <p className="text-sm text-gray-500">{getStatusText()}</p>
      </div>

      {/* 맨 아래 - 태그들 */}
      <div className="flex flex-wrap gap-2">
        {policy.policyTag && policy.policyTag.length > 0 ? (
          policy.policyTag.map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="bg-gray-100 text-black border-gray-200 hover:bg-gray-200"
            >
              {tag}
            </Badge>
          ))
        ) : (
          <span className="text-sm text-gray-400">태그 없음</span>
        )}
      </div>
    </div>
  );
};

export default PolicyCard;
