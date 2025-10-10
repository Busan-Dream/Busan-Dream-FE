import Boogi from "@/assets/images/thinking-boogi.png";

const description = {
  busan: "현재 법적 주소지가 부산광역시인 청년을 위한 정책을 소개해드립니다",
  notBusan:
    "부산광역시에 정착을 고민중인 타 시/군/구 청년을 위한 정책을 소개해드립니다",
};

interface PolicyHeaderProps {
  isFromBusan: boolean;
  category?: string;
}

const PolicyHeader = ({ isFromBusan, category }: PolicyHeaderProps) => {
  return (
    <section
      className="w-full mx-auto flex justify-center px-10 max-sm:px-5  pt-10 relative h-fit"
      style={{
        background:
          "linear-gradient(to top, rgba(233, 87, 155, 0) 0%, rgba(233, 87, 155, 0.08) 50%, rgba(166, 0, 255, 0.2) 100%)",
      }}
    >
      <div className="max-w-[1200px] w-full flex justify-between items-end border-b border-gray-200">
        <div className="header-wrapper pt-10 pb-6 flex flex-col gap-2">
          <h2 className="text-2xl font-semibold flex items-center relative z-10">
            부산
            <p
              style={{
                color: isFromBusan ? "#EA5C9D" : "#611A86",
                opacity: 0.6,
              }}
              className="font-bold"
            >
              {isFromBusan ? "의" : "\u00A0외"}
            </p>
            &nbsp;청년 정책
            {category && (
              <>
                <span className="text-gray-700">&nbsp;|&nbsp;{category}</span>
              </>
            )}
          </h2>
          <p className="text-gray-500 relative z-10">
            {description[isFromBusan ? "busan" : "notBusan"]}
          </p>
        </div>

        <img src={Boogi} alt="부기" className="w-[10vw] translate-y-[20px]" />
      </div>
    </section>
  );
};

export default PolicyHeader;
