import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PolicyCardHeader from "./PolicyCardHeader";
import PolicyCard from "./PolicyCard";
import DecryptedText from "@/components/ReactBits/DecryptedText/DecryptedText";
import { getPolicyList, Policy } from "@/apis/policy";

interface PolicyContentProps {
  policyBusan?: "부산 내" | "부산 외" | "공통";
}

interface CategoryPolicies {
  work: Policy[];
  house: Policy[];
  busan: Policy[];
  life: Policy[];
}

const PolicyContent = ({ policyBusan = "부산 내" }: PolicyContentProps) => {
  const navigate = useNavigate();
  const [policies, setPolicies] = useState<CategoryPolicies>({
    work: [],
    house: [],
    busan: [],
    life: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { key: "work", label: "일자리", path: "work" },
    { key: "house", label: "주거", path: "house" },
    { key: "busan", label: "부산", path: "busan" },
    { key: "life", label: "생활", path: "life" },
  ] as const;

  // 정책 데이터 가져오기
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getPolicyList({
          policyBusan,
          page: 1,
        });

        setPolicies({
          work: response.work.slice(0, 4), // 각 카테고리별로 4개씩만
          house: response.house.slice(0, 4),
          busan: response.busan.slice(0, 4),
          life: response.life.slice(0, 4),
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "정책 목록을 가져오는데 실패했습니다."
        );
        console.error("정책 목록 조회 오류:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, [policyBusan]);

  const handleMoreClick = (categoryPath: string) => {
    const basePath =
      policyBusan === "부산 내" ? "/policy/busan" : "/policy/others";
    navigate(`${basePath}/${categoryPath}`);
  };

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
      {categories.map((category) => {
        const categoryPolicies = policies[category.key];

        return (
          <div key={category.key} className="space-y-6">
            {/* 카테고리 헤더 */}
            <PolicyCardHeader
              category={category.key}
              onMoreClick={handleMoreClick}
            />

            {/* 정책 카드 목록 */}
            {categoryPolicies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {categoryPolicies.map((policy, index) => (
                  <PolicyCard
                    key={`${policy.policyTitle}-${index}`}
                    policy={policy}
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-8 text-gray-500">
                해당 카테고리에 정책이 없습니다.
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
};

export default PolicyContent;
