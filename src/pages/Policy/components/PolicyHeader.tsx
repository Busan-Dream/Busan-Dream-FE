import Boogi from "@/assets/images/thinking-boogi.png";

const description = {
  busan: "현재 법적 주소지가 부산광역시인 청년을 위한 정책을 소개해드립니다",
  notBusan:
    "부산광역시에 정착을 고민중인 타 시/군/구 청년을 위한 정책을 소개해드립니다",
};

const PolicyHeader = ({ isFromBusan }: { isFromBusan: boolean }) => {
  return (
    <section
      className="w-full mx-auto flex justify-center px-10 max-sm:px-5  py-10 relative h-fit"
      style={{
        background: `url('/src/assets/images/policy-gradient-bg.png') no-repeat center center`,
        backgroundSize: "cover",
      }}
    >
      <div className="max-w-[1200px] w-full flex justify-between items-end border-b border-gray-200">
        <div className="header-wrapper pt-10 pb-6">
          <h2 className="text-2xl font-semibold flex items-center relative z-10">
            부산
            <p
              style={{
                color: isFromBusan ? "#EA5C9D" : "#611A86",
                opacity: 0.6,
              }}
              className="font-bold"
            >
              {isFromBusan ? "의" : "&nbsp;외"}
            </p>
            &nbsp;청년 정책
          </h2>
          <p className="text-gray-500 relative z-10">
            {description[isFromBusan ? "busan" : "notBusan"]}
          </p>
        </div>

        <img
          src={Boogi}
          alt="부기"
          className="w-[10vw] absolute right-0 -translate-x-full translate-y-[20px]"
        />
      </div>
    </section>
  );
};

export default PolicyHeader;
