import PolicyList from "./PolicyList";

const PolicyContent = () => {
  return (
    <div className="flex flex-col gap-[50px] max-w-[1200px] mx-auto max-[1200px]:px-10">
      <PolicyList category="work" policyBusan="부산내" />
      <PolicyList category="house" policyBusan="부산내" />
      <PolicyList category="busan" policyBusan="부산내" />
      <PolicyList category="life" policyBusan="부산내" />
    </div>
  );
};

export default PolicyContent;
