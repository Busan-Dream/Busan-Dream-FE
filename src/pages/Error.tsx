import BlurText from "@/components/ReactBits/BlurText/BlurText";

const Error = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50">
      <BlurText
        text="404"
        delay={100}
        animateBy="letters"
        direction="top"
        className="text-[8rem] font-black text-gray-800 font-paperozi"
      />
      <BlurText
        text="페이지를 찾을 수 없습니다."
        delay={150}
        animateBy="words"
        direction="top"
        className="text-4xl font-black text-gray-800 font-paperozi"
      />
    </div>
  );
};

export default Error;
