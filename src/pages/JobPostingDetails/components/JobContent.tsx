import { Link } from "react-router-dom";
import JobContentDetails from "./JobContentDetails";
import GradientText from "@/components/ReactBits/GradientText/GradientText";

const JobContent = () => {
  const postingTag = ["운영직", "44명 채용", "호봉제", "3차 면접사항"];

  return (
    <div className="job_content space-y-8">
      <div className="flex flex-col space-y-5">
        <p className="text-lg text-gray-700">부산교통공사</p>
        <h1 className="text-2xl font-semibold">
          2025년 상반기 부산교통공사 신입사원 공개채용 공고
        </h1>
      </div>
      <div className="grid grid-cols-[1fr_220px]">
        {/* 태그 */}
        <ul className="flex items-center justify-start gap-[10px]">
          {postingTag.map((tag, index) => (
            <li key={index}>
              <span className="inline-flex h-7 items-center justify-center rounded-full bg-blue-500 px-[15px] text-sm font-medium text-white">
                {tag}
              </span>
            </li>
          ))}
        </ul>
        {/* AI 면접 버튼 */}
        <div className="relative inline-flex h-[50px] items-center justify-center rounded-[5px] bg-gradient-to-r from-[#E4007F] to-[#4079ff] p-[2px]">
          <Link
            to="/interview"
            state={{
              postingOrgan: "부산교통공사",
              postingPart: "운영직",
            }}
            className="flex h-full w-full items-center justify-center rounded-[5px] bg-white transition-all duration-200 hover:bg-gray-50"
          >
            <GradientText
              colors={["#E4007F", "#4079ff", "#E4007F", "#4079ff", "#E4007F"]}
              animationSpeed={5}
              className="p-2"
            >
              AI 면접 보기
            </GradientText>
          </Link>
        </div>
      </div>
      <div>
        <div className="border-y-1 p-8">
          <ul className="grid grid-cols-2 gap-x-8 gap-y-6 text-base">
            <li className="space-x-8">
              <span className="text-gray-500">접수 방법</span>
              <span>인터넷 접수</span>
            </li>
            <li className="space-x-8">
              <span className="text-gray-500">임용 시기</span>
              <span>추후 공개 예정</span>
            </li>
            <li className="space-x-8">
              <span className="text-gray-500">공고 기간</span>
              <span>2025-04-09 ~ 2025-04-29</span>
            </li>
            <li className="space-x-8">
              <span className="text-gray-500">접수 기간</span>
              <span>2025-04-22 ~ 2025-04-29</span>
            </li>
          </ul>
        </div>
      </div>
      {/* 채용 공고 상세 내용 */}
      <div className="space-y-12 py-5">
        <JobContentDetails />
      </div>
    </div>
  );
};

export default JobContent;
