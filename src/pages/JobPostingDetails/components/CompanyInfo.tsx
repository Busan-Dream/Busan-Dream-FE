import BtcLogo from "@/assets/images/btc-logo.svg?react";
import { Link } from "react-router-dom";

const CompanyInfo = () => {
  return (
    <div className="company_info relative mt-10 rounded-[10px] border-1 border-gray-300 px-8 pt-13 pb-8">
      <div>
        <div className="absolute -top-10 left-8 size-20 rounded-lg border-1 border-gray-200 bg-white p-2">
          <BtcLogo className="size-full" />
        </div>
        <div>
          <p className="text-xl font-bold">부산교통공사</p>
        </div>
      </div>
      <div className="mt-4 border-t-1 border-gray-300">
        <ul className="space-y-5 pt-[30px] pb-[50px] text-sm">
          <li className="flex">
            <span className="w-20 text-gray-500">주소</span>
            <span>부산광역시 부산진구 중앙대로 644번길 20</span>
          </li>
          <li className="flex">
            <span className="w-20 text-gray-500">담당 부서</span>
            <span>경영지원처</span>
          </li>
          <li className="flex">
            <span className="w-20 text-gray-500">문의 전화</span>
            <a href="tel:051-640-7196">051-640-7196</a>
          </li>
          <li className="flex">
            <span className="w-20 text-gray-500">홈페이지</span>
            <Link
              to="https://www.humetro.busan.kr/default/main.do"
              target="_blank"
              className="text-blue-500 underline"
            >
              https://www.humetro.busan.kr/default/main.do
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <Link
          to=""
          className="flex h-[50px] w-full items-center justify-center rounded-[5px] border-1 border-gray-300 bg-white text-base font-bold text-gray-500 transition-all duration-200 hover:bg-gray-50"
        >
          공고 내용 상세보기
        </Link>
      </div>
    </div>
  );
};

export default CompanyInfo;
