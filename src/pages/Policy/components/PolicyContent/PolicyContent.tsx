import { useState } from "react";
import { usePolicyList } from "@/hooks/usePolicyList";
import PolicyList from "./PolicyList";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Briefcase,
  Home,
  MapPin,
  Heart,
} from "lucide-react";

interface PolicyContentProps {
  policyBusan?: "부산내" | "부산외" | "공통";
}

const PolicyContent = ({ policyBusan = "부산내" }: PolicyContentProps) => {
  const [selectedCategory, setSelectedCategory] = useState<
    "work" | "house" | "busan" | "life"
  >("work");

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
    category: selectedCategory,
    policyBusan,
    initialPage: 1,
  });

  const categories = [
    { key: "work", label: "일자리", icon: Briefcase },
    { key: "house", label: "주거", icon: Home },
    { key: "busan", label: "부산", icon: MapPin },
    { key: "life", label: "생활", icon: Heart },
  ] as const;

  const selectedCategoryData = categories.find(
    (cat) => cat.key === selectedCategory
  );

  const handleCategoryChange = (
    category: "work" | "house" | "busan" | "life"
  ) => {
    setSelectedCategory(category);
  };

  const handleRemoveFilter = () => {
    setSelectedCategory("work"); // 기본값으로 리셋
  };

  return (
    <section className="flex flex-col gap-[50px] max-w-[1200px] mx-auto max-[1200px]:px-10">
      {/* 카테고리 드롭다운 필터 */}
      <div className="flex items-center gap-4 w-full justify-end">
        {/* 활성 필터 칩 표시 (기본값이 아닌 경우만) */}
        {selectedCategory !== "work" && selectedCategoryData && (
          <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full border border-blue-200 text-sm font-medium">
            <selectedCategoryData.icon className="h-3.5 w-3.5" />
            <span>{selectedCategoryData.label}</span>
            <button
              onClick={handleRemoveFilter}
              className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* 필터 드롭다운 버튼 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <Filter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[120px]">
            {categories.map((category) => (
              <DropdownMenuItem
                key={category.key}
                onClick={() => handleCategoryChange(category.key)}
                className="flex items-center gap-2"
              >
                <category.icon className="h-4 w-4" />
                {category.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 정책 리스트 */}
      <PolicyList
        policies={policies}
        loading={loading}
        error={error}
        category={selectedCategory}
      />

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

export default PolicyContent;
