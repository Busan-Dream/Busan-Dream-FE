import PolicyHeader from "./components/PolicyHeader";
import PolicyContent from "./components/PolicyContent/PolicyContent";
import PolicyFooter from "./components/PolicyFooter";
import Boogi from "@/assets/images/stangind-boogi.png";

const Policy = () => {
  return (
    <section>
      <PolicyHeader isFromBusan />
      <PolicyContent />
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
