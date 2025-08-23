import { usePolicyList } from "@/hooks/usePolicyList";
import PolicyCard from "./PolicyCard";
import DecryptedText from "@/components/ReactBits/DecryptedText/DecryptedText";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Home,
  Heart,
  MapPin,
} from "lucide-react";

interface CategoryPolicyContentProps {
  category: "work" | "house" | "busan" | "life";
  policyBusan?: "부산내" | "부산외" | "공통";
}

const categoryInfo = {
  work: { label: "일자리", icon: Calendar },
  house: { label: "주거", icon: Home },
  busan: { label: "부산", icon: MapPin },
  life: { label: "생활", icon: Heart },
};

const CategoryPolicyContent = ({
  category,
  policyBusan = "부산내",
}: CategoryPolicyContentProps) => {
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
    goToPage,
  } = usePolicyList({
    category,
    policyBusan,
    initialPage: 1,
  });

  const categoryData = categoryInfo[category];
  const IconComponent = categoryData.icon;
  const locationText = policyBusan === "부산내" ? "부산의" : "부산 외";

  if (loading) {
    return (
      <section className="flex flex-col gap-[50px] max-w-[1200px] mx-auto max-[1200px]:px-10">
        <div className="flex justify-center items-center py-16">
          <div className="text-gray-500 text-lg">
            정책 목록을 불러오는 중...
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex flex-col gap-[50px] max-w-[1200px] mx-auto max-[1200px]:px-10">
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
            className="text-lg text-gray-600 mt-2"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-[50px] max-w-[1200px] mx-auto max-[1200px]:px-10">
      {/* 카테고리 헤더 */}
      <div className="flex items-center gap-3 border-b border-blue-300 pb-4">
        <IconComponent className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">
          {locationText} 청년 정책 | {categoryData.label}
        </h1>
      </div>

      {/* 정책 카드 목록 */}
      {policies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {policies.map((policy, index) => (
            <PolicyCard
              key={`${policy.policyTitle}-${index}`}
              policy={policy}
            />
          ))}
        </div>
      ) : (
        <div className="w-full min-h-[500px] flex flex-col items-center justify-center py-8 px-10">
          <DecryptedText
            text="해당 조건에 맞는 정책이 없습니다."
            animateOn="both"
            speed={100}
            className="text-2xl text-gray-800"
          />
        </div>
      )}

      {/* 페이지네이션 */}
      {maxPage > 1 && (
        <div className="flex items-center justify-center space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevPage}
            disabled={!hasPrevPage}
          >
            <ChevronLeft className="h-4 w-4" />
            이전
          </Button>

          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(maxPage, 10) }, (_, i) => {
              const startPage = Math.max(1, currentPage - 5);
              const endPage = Math.min(maxPage, startPage + 9);
              const adjustedPage = startPage + i;

              if (adjustedPage > endPage) return null;

              return (
                <Button
                  key={adjustedPage}
                  variant={currentPage === adjustedPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(adjustedPage)}
                  className="w-8 h-8 p-0"
                >
                  {adjustedPage}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={!hasNextPage}
          >
            다음
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* 페이지 정보 */}
      {maxPage > 1 && (
        <div className="text-center text-sm text-gray-500">
          {currentPage} / {maxPage} 페이지
        </div>
      )}
    </section>
  );
};

export default CategoryPolicyContent;
