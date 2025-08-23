import BtcLogo from "@/assets/images/btc-logo.svg?react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface CompanyInfoProps {
  postingOrgan: string;
  postingDepartment: string;
  postingTel: string;
  postingURL: string;
}

const organizations = [
  {
    name: "부산교통공사",
    address: "부산광역시 부산진구 중앙대로 644번길 20",
    homepage: "https://www.humetro.busan.kr/default/main.do",
  },
  {
    name: "부산도시공사",
    address: "부산광역시 부산진구 신천대로 156",
    homepage: "https://www.bmc.busan.kr/bmc/main.do",
  },
  {
    name: "부산시설공단",
    address: "부산광역시 부산진구 새싹로 174",
    homepage: "https://www.bisco.or.kr/",
  },
  {
    name: "부산환경공단",
    address: "부산광역시 동래구 온천천남로 185",
    homepage: "https://www.beco.or.kr/kor/Main.do",
  },
  {
    name: "부산관광공사",
    address: "부산광역시 부산진구 자유평화로 11, 누리엔빌딩 14층",
    homepage: "https://www.bto.or.kr/kor/Main.do",
  },
];

const CompanyInfo = ({
  postingOrgan,
  postingDepartment,
  postingTel,
  postingURL,
}: CompanyInfoProps) => {
  const [organAddress, setOrganAddress] = useState<string>("");
  const [organHomepage, setOrganHomepage] = useState<string>("");

  useEffect(() => {
    const org = organizations.find(o => o.name === postingOrgan);

    if (org) {
      setOrganAddress(org.address);
      setOrganHomepage(org.homepage);
    } else {
      setOrganAddress(""); // 기본값 처리
      setOrganHomepage("");
    }
  }, [postingOrgan]);

  return (
    <div className="company_info relative mt-10 rounded-[10px] border-1 border-gray-300 px-8 pt-13 pb-8">
      <div>
        <div className="absolute -top-10 left-8 size-20 rounded-lg border-1 border-gray-200 bg-white p-2">
          <BtcLogo className="size-full" />
        </div>
        <div>
          <p className="text-xl font-bold">{postingOrgan}</p>
        </div>
      </div>
      <div className="mt-4 border-t-1 border-gray-300">
        <ul className="space-y-5 pt-[30px] pb-[50px] text-sm">
          <li className="flex">
            <span className="w-20 text-gray-500">주소</span>
            <span>{organAddress}</span>
          </li>
          <li className="flex">
            <span className="w-20 text-gray-500">담당 부서</span>
            <span>{postingDepartment}</span>
          </li>
          <li className="flex">
            <span className="w-20 text-gray-500">문의 전화</span>
            <a href={`tel:${postingTel}`} className="underline">
              {postingTel}
            </a>
          </li>
          <li className="flex">
            <span className="w-20 text-gray-500">홈페이지</span>
            <Link
              to={organHomepage}
              target="_blank"
              className="text-blue-500 underline"
            >
              {organHomepage}
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <Link
          to={`${postingURL}`}
          target="_blank"
          className="flex h-[50px] w-full items-center justify-center rounded-[5px] border-1 border-gray-300 bg-white text-base font-bold text-gray-500 transition-all duration-200 hover:bg-gray-50"
        >
          공고 내용 상세보기
        </Link>
      </div>
    </div>
  );
};

export default CompanyInfo;
