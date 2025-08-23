import BiscoLogo from "@/assets/images/bisco-logo.svg?react";

const JobPostingCard = () => {
  return (
    <article className="grid h-67 cursor-pointer content-between rounded-[10px] bg-white px-5 py-7.5 drop-shadow-md">
      {/* 채용 정보 */}
      <div className="grid grid-cols-[auto_75px]">
        <div className="grid space-y-5">
          {/* 채용 공고 상태 */}
          <div>
            <span className="inline-flex h-[30px] items-center justify-center rounded-full bg-sky-100 px-[15px] text-sm font-bold text-sky-500">
              모집중
            </span>
          </div>
          {/* 공고 내용 */}
          <div className="grid space-y-[10px]">
            <span className="block text-sm text-gray-500">부산시설공단</span>
            <span className="text-base font-medium break-keep text-gray-800">
              2025년도 하반기 부산시설공단 일반직 공개채용 공고
            </span>
            <span className="block text-xs text-gray-400">
              2025&#45;07&#45;31 &#126; 2025&#45;08&#45;18
            </span>
          </div>
        </div>
        <div className="grid size-[75px] place-content-center rounded-full border-1 border-gray-100 bg-white">
          <BiscoLogo className="w-[55px]" />
        </div>
      </div>
      {/* 태그 */}
      <div className="tag_container">
        <ul className="flex items-center justify-start gap-[10px]">
          <li>
            <span className="inline-flex h-7 items-center justify-center rounded-full bg-blue-50 px-[15px] text-sm font-medium text-blue-500">
              &#35;부산 거주
            </span>
          </li>
          <li>
            <span className="inline-flex h-7 items-center justify-center rounded-full bg-blue-50 px-[15px] text-sm font-medium text-blue-500">
              &#35;만 18세 이상 만 60세 이하
            </span>
          </li>
        </ul>
      </div>
    </article>
  );
};

export default JobPostingCard;
