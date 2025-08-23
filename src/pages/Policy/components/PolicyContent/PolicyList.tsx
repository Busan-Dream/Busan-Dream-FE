import { usePolicyList } from "@/hooks/usePolicyList";
import PolicyCardHeader from "./PolicyCardHeader";
import PolicyCard from "./PolicyCard";
import DecryptedText from "@/components/ReactBits/DecryptedText/DecryptedText";

interface PolicyListProps {
  category: "work" | "house" | "busan" | "life";
  policyBusan?: "부산내" | "부산외" | "공통";
}

const PolicyList = ({ category, policyBusan = "부산내" }: PolicyListProps) => {
  const {
    policies,
    loading,
    error,
    maxPage,
    currentPage,
    hasNextPage,
    hasPrevPage,
    goToNextPage,
    goToPrevPage,
  } = usePolicyList({
    category,
    policyBusan,
    initialPage: 1,
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">정책 목록을 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[500px] flex flex-col items-center justify-center py-8 px-10">
        <DecryptedText
          text="데이터를 불러오는 중 오류가 발생했습니다."
          animateOn="both"
          speed={100}
          className="text-2xl text-gray-800"
        />
        <DecryptedText
          text={error}
          animateOn="both"
          speed={100}
          className="text-2xl text-gray-800"
        />
      </div>
    );
  }

  return (
    <div>
      <PolicyCardHeader category={category} />

      {/* 정책 카드 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {policies.map((policy, index) => (
          <PolicyCard key={`${policy.policyTitle}-${index}`} policy={policy} />
        ))}
      </div>

      {/* 페이지네이션 */}
      {maxPage > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={goToPrevPage}
            disabled={!hasPrevPage}
            className="px-3 py-2 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            이전
          </button>

          <span className="px-3 py-2 text-sm text-gray-600">
            {currentPage} / {maxPage}
          </span>

          <button
            onClick={goToNextPage}
            disabled={!hasNextPage}
            className="px-3 py-2 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default PolicyList;
