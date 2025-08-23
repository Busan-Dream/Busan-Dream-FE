import type { ComponentType, SVGProps } from "react";
import BtcLogo from "@/assets/images/btc-logo.svg?react";
import BtoLogo from "@/assets/images/bto-logo.svg?react";
import BmcLogo from "@/assets/images/bmc-logo.svg?react";
import BiscoLogo from "@/assets/images/bisco-logo.svg?react";
import BecoLogo from "@/assets/images/beco-logo.svg?react";

interface JobPostingCardProps {
  postingOrgan: string;
  postingTitle: string;
  acceptStartDate: string;
  acceptEndDate: string;
  postingTag: string[];
}

type SvgComp = ComponentType<SVGProps<SVGSVGElement>>;

const organLogos: Record<string, SvgComp> = {
  부산교통공사: BtcLogo,
  부산도시공사: BmcLogo,
  부산시설공단: BiscoLogo,
  부산환경공단: BecoLogo,
  부산관광공사: BtoLogo,
};

const JobPostingCard = ({
  postingOrgan,
  postingTitle,
  acceptStartDate,
  acceptEndDate,
  postingTag,
}: JobPostingCardProps) => {
  // 오늘 날짜 (시간 제거)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 시작일, 마감일
  const startDate = new Date(acceptStartDate);
  const endDate = new Date(acceptEndDate);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  // 상태 계산
  let statusLabel = "";
  let statusColor = "";

  if (today < startDate) {
    statusLabel = "모집예정";
    statusColor = "bg-gray-100 text-gray-500";
  } else if (today > endDate) {
    statusLabel = "마감";
    statusColor = "bg-red-100 text-red-500";
  } else {
    statusLabel = "모집중";
    statusColor = "bg-sky-100 text-sky-500";
  }

  const OrganLogo = organLogos[postingOrgan] ?? BiscoLogo;

  return (
    <article className="grid h-67 cursor-pointer content-between rounded-[10px] border-1 border-gray-100 bg-white px-5 py-7.5 drop-shadow-md drop-shadow-gray-300 transition-all duration-200 hover:border-blue-100 hover:drop-shadow-blue-200">
      {/* 채용 정보 */}
      <div className="grid grid-cols-[auto_75px]">
        <div className="grid space-y-5">
          {/* 채용 공고 상태 */}
          <div>
            <span
              className={`inline-flex h-[30px] items-center justify-center rounded-full px-[15px] text-sm font-bold ${statusColor}`}
            >
              {statusLabel}
            </span>
          </div>
          {/* 공고 내용 */}
          <div className="grid space-y-[10px]">
            <span className="block text-sm text-gray-500">{postingOrgan}</span>
            <span className="text-base font-medium break-keep text-gray-800">
              {postingTitle}
            </span>
            <span className="block text-xs text-gray-400">
              {acceptStartDate} &#126; {acceptEndDate}
            </span>
          </div>
        </div>
        <div className="grid size-[75px] place-content-center rounded-full border-1 border-gray-200 bg-white">
          <OrganLogo className="w-[55px]" />
        </div>
      </div>
      {/* 태그 */}
      <div className="tag_container">
        <ul className="flex flex-wrap items-center justify-start gap-[10px]">
          {postingTag.map((tag, index) => (
            <li key={index}>
              <span className="inline-flex h-7 items-center justify-center rounded-full bg-blue-50 px-[15px] text-sm font-medium text-blue-500">
                {tag}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
};

export default JobPostingCard;
