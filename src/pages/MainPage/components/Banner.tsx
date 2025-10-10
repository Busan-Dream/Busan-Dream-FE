import BannerImageEng from "@/assets/images/logo-header-en.svg";
import BlurText from "@/components/ReactBits/BlurText/BlurText";

const Banner = () => {
  return (
    <div
      className="flex h-full flex-grow items-center pl-15 2xl:w-full 2xl:rounded-[20px] rounded-2xl"
      style={{
        background:
          "linear-gradient(to bottom right, rgba(0, 229, 255, 0.05) 0%, rgba(0, 229, 255, 0.06) 43%, rgba(0, 153, 255, 0.3) 100%)",
      }}
    >
      <div className="flex flex-col gap-2">
        <BlurText direction="top" delay={100}>
          <img src={BannerImageEng} alt="banner" className="w-100" />
        </BlurText>
        <BlurText
          text="채용 정보를 한 곳에, 취업 준비를 한 번에"
          delay={150}
          animateBy="words"
          direction="top"
          className="text-3xl font-medium font-paperozi"
        />
      </div>
    </div>
  );
};

export default Banner;
