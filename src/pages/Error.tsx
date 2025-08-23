import FuzzyText from "@/components/ReactBits/FuzzyText/FuzzyText";

const Error = () => {
  const hoverIntensity = 0.5;
  const enableHover = true;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50">
      <div className="mb-8">
        <FuzzyText
          baseIntensity={0.3}
          hoverIntensity={hoverIntensity}
          enableHover={enableHover}
          fontSize="8rem"
          fontWeight={900}
          color="#1f2937"
        >
          404
        </FuzzyText>
      </div>
      <div>
        <FuzzyText
          baseIntensity={0.3}
          hoverIntensity={hoverIntensity}
          enableHover={enableHover}
          fontSize="4rem"
          fontWeight={900}
          color="#1f2937"
        >
          페이지를 찾을 수 없습니다.
        </FuzzyText>
      </div>
    </div>
  );
};

export default Error;
