import { useSearchParams } from "react-router-dom";
import PolicyHeader from "./components/PolicyHeader";
import PolicyContent from "./components/PolicyContent/PolicyContent";
import PolicyFooter from "./components/PolicyFooter";
import Boogi from "@/assets/images/stangind-boogi.png";

const Policy = () => {
  const [searchParams] = useSearchParams();
  const location =
    (searchParams.get("location") as "부산내" | "부산외" | "공통") || "부산내";
  const isFromBusan = location === "부산내";

  return (
    <section>
      <PolicyHeader isFromBusan={isFromBusan} />
      <PolicyContent policyBusan={location} />
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
