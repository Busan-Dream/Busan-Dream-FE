import ScrollVelocity from "@/components/ReactBits/ScrollVelocity/ScrollVelocity";

const PolicyFooter = () => {
  return (
    <figure className="w-full flex flex-col gap-2">
      <ScrollVelocity
        texts={["Busan is good", "Busan is good", "Busan is good"]}
        className="text-[rgba(0,0,0,0.03)]"
      />
    </figure>
  );
};

export default PolicyFooter;
