import BannerImageEng from "@/assets/images/logo-header-en.svg";
import Boogie from "@/assets/images/thinking-boogi.png";
import BlurText from "@/components/ReactBits/BlurText/BlurText";
import LogoLoop from "@/components/ReactBits/LogoLoop/LogoLoop";

import LogoBeco from "@/assets/images/beco-logo.svg";
import LogoBisco from "@/assets/images/bisco-logo.svg";
import LogoBmc from "@/assets/images/bmc-logo.svg";
import LogoBtc from "@/assets/images/btc-logo.svg";
import LogoBto from "@/assets/images/bto-logo.svg";

const partnerLogos = [
  { src: LogoBeco, alt: "BECO", href: "https://www.beco.or.kr/kor/Main.do" },
  { src: LogoBisco, alt: "BISCO", href: "http://bisco.or.kr/" },
  { src: LogoBmc, alt: "BMC", href: "https://www.bmc.busan.kr/bmc/main.do" },
  {
    src: LogoBtc,
    alt: "BTC",
    href: "https://www2.humetro.busan.kr/default/main.do",
  },
  { src: LogoBto, alt: "BTO", href: "https://bto.or.kr/kor/Main.do" },
];

const Banner = () => {
  return (
    <div
      className="flex h-full flex-grow justify-between items-center gap-8 pl-15 2xl:w-full 2xl:rounded-[20px] rounded-2xl"
      style={{
        background:
          "linear-gradient(to bottom right, rgba(0, 229, 255, 0.05) 0%, rgba(0, 229, 255, 0.06) 43%, rgba(0, 153, 255, 0.3) 100%)",
      }}
    >
      <div className="flex flex-col gap-2 flex-shrink-0">
        {/* 로고 + 슬로건 */}
        <div className="flex flex-col gap-2">
          <BlurText direction="top" delay={100}>
            <img src={BannerImageEng} alt="banner" className="w-90" />
          </BlurText>
          <BlurText
            text="채용 정보를 한 곳에, 취업 준비를 한 번에"
            delay={150}
            animateBy="words"
            direction="top"
            className="text-2xl font-medium font-paperozi text-gray-800"
          />
        </div>
        <div className="mt-8 max-w-[600px] overflow-hidden">
          <LogoLoop
            logos={partnerLogos}
            speed={150}
            direction="left"
            logoHeight={18}
            gap={40}
            pauseOnHover
            scaleOnHover
            fadeOut
            fadeOutColorLeft="#F4FDFE"
            fadeOutColorRight="#DBEFFE"
            ariaLabel="부산 파트너 기관"
          />
        </div>
      </div>
      <img
        src={Boogie}
        alt="부기"
        className="w-[15vw] translate-y-[20px] flex-shrink-0"
      />
    </div>
  );
};

export default Banner;
