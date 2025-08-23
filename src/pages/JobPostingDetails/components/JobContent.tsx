import { useNavigate } from "react-router-dom";
import JobContentDetails from "./JobContentDetails";
import GradientText from "@/components/ReactBits/GradientText/GradientText";
import InterviewPractice from "@/pages/MainPage/components/InterviewPractice";

interface JobContentProps {
  postingOrgan: string;
  postingField: string;
  postingPart: string;
  postingTitle: string;
  postingTag: string[];
  postingRecipt: string;
  postingPeriod: string;
  postingStartDate: string;
  postingEndDate: string;
  acceptStartDate: string;
  acceptEndDate: string;
  postingIncruit: string;
  postingFieldMethod: string;
  postingCondition: string;
}

const JobContent = ({
  postingOrgan,
  postingField,
  postingPart,
  postingTitle,
  postingTag,
  postingRecipt,
  postingPeriod,
  postingStartDate,
  postingEndDate,
  acceptStartDate,
  acceptEndDate,
  postingIncruit,
  postingFieldMethod,
  postingCondition,
}: JobContentProps) => {
  const navigate = useNavigate();

  // AI 면접 보기 페이지로 이동
  const handleClickAI = () => {
    navigate("/interview", {
      state: {
        postingOrgan: postingOrgan,
        postingField: postingField,
        postingPart: postingPart,
      },
    });
  };

  return (
    <div className="job_content space-y-8">
      <div className="flex flex-col space-y-5">
        <p className="text-lg text-gray-700">{postingOrgan}</p>
        <h1 className="text-2xl font-semibold">{postingTitle}</h1>
      </div>
      <div className="grid grid-cols-[1fr_220px]">
        {/* 태그 */}
        <ul className="flex flex-wrap items-center justify-start gap-[10px]">
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
          <button
            className="flex h-full w-full items-center justify-center rounded-[5px] bg-white transition-all duration-200 hover:bg-gray-50"
            onClick={handleClickAI}
          >
            <GradientText
              colors={["#E4007F", "#4079ff", "#E4007F", "#4079ff", "#E4007F"]}
              animationSpeed={5}
              className="p-2"
            >
              AI 면접 보기
            </GradientText>
          </button>
        </div>
      </div>
      <div>
        <div className="border-y-1 p-8">
          <ul className="grid grid-cols-2 gap-x-8 gap-y-6 text-base">
            <li className="space-x-8">
              <span className="text-gray-500">접수 방법</span>
              <span>{postingRecipt}</span>
            </li>
            <li className="space-x-8">
              <span className="text-gray-500">임용 시기</span>
              <span>{postingPeriod}</span>
            </li>
            <li className="space-x-8">
              <span className="text-gray-500">공고 기간</span>
              <span>
                {postingStartDate} ~ {postingEndDate}
              </span>
            </li>
            <li className="space-x-8">
              <span className="text-gray-500">접수 기간</span>
              <span>
                {acceptStartDate} ~ {acceptEndDate}
              </span>
            </li>
          </ul>
        </div>
      </div>
      <InterviewPractice postingPart={postingPart} />
      {/* 채용 공고 상세 내용 */}
      <div className="space-y-12 py-5">
        <JobContentDetails
          postingFieldMethod={postingFieldMethod}
          postingIncruit={postingIncruit}
          postingCondition={postingCondition}
        />
      </div>
    </div>
  );
};

export default JobContent;
