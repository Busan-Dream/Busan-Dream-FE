import { useLocation } from "react-router-dom";
import PolicyHeader from "./components/PolicyHeader";
import PolicyContent from "./components/PolicyContent/PolicyContent";
import PolicyFooter from "./components/PolicyFooter";
import Boogi from "@/assets/images/stangind-boogi.png";

const Policy = () => {
  const location = useLocation();
  const pathname = location.pathname;

  // URL 경로에 따라 지역 결정
  const policyBusan = pathname.includes("/policy/others")
    ? "부산 외"
    : "부산 내";
  const isFromBusan = policyBusan === "부산 내";

  return (
    <section>
      <PolicyHeader isFromBusan={isFromBusan} />
      <PolicyContent policyBusan={policyBusan} />
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

export default Policy;
