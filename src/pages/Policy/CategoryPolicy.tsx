import { useParams } from "react-router-dom";
import PolicyHeader from "./components/PolicyHeader";
import CategoryPolicyContent from "./components/PolicyContent/CategoryPolicyContent";
import PolicyFooter from "./components/PolicyFooter";
import Boogi from "@/assets/images/stangind-boogi.png";

const CategoryPolicy = () => {
  const { location, category } = useParams<{
    location: "busan" | "others";
    category: "work" | "house" | "busan" | "life";
  }>();

  const policyBusan = location === "busan" ? "부산내" : "부산외";
  const isFromBusan = location === "busan";

  const categoryInfo = {
    work: "일자리",
    house: "주거",
    busan: "부산",
    life: "생활",
  };

  // 유효하지 않은 카테고리 처리
  if (!category || !["work", "house", "busan", "life"].includes(category)) {
    return (
      <section>
        <PolicyHeader
          isFromBusan={isFromBusan}
          category={category ? categoryInfo[category] : undefined}
        />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              잘못된 페이지입니다.
            </h2>
            <p className="text-gray-600">올바른 카테고리를 선택해주세요.</p>
          </div>
        </div>
        <PolicyFooter />
      </section>
    );
  }

  return (
    <section>
      <PolicyHeader
        isFromBusan={isFromBusan}
        category={categoryInfo[category]}
      />
      <CategoryPolicyContent category={category} policyBusan={policyBusan} />
      <div className="relative">
        <PolicyFooter />
        <img
          src={Boogi}
          alt="부기"
          className="w-[15vw] h-[15vw] absolute bottom-0 left-10"
        />
      </div>
    </section>
  );
};

export default CategoryPolicy;
