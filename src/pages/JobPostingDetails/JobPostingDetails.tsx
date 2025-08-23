import { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import HireChart from "./components/Charts/HireChart";
import CompanyInfo from "./components/CompanyInfo";
import JobContent from "./components/JobContent";
import CompetitionChart from "./components/Charts/CompetitionChart";
import WrittenTestChart from "./components/Charts/WrittenTestChart";
import { useNavigate } from "react-router-dom";

type OrgKey = "BTC" | "BMC" | "BISCO" | "BECO" | "BTO";

const organizations = [
  { name: "부산교통공사", key: "BTC" },
  { name: "부산도시공사", key: "BMC" },
  { name: "부산시설공단", key: "BISCO" },
  { name: "부산환경공단", key: "BECO" },
  { name: "부산관광공사", key: "BTO" },
];

const JobPostingDetails = () => {
  const [organ, setOrgan] = useState<OrgKey>("BECO");

  const navigate = useNavigate();

  const handleClickBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <div className="flex h-20 items-center justify-between">
        <button onClick={handleClickBack}>
          <IoIosArrowRoundBack className="-ml-[10px] size-12 text-gray-700" />
        </button>
      </div>
      <div className="job_posting_details relative grid grid-cols-[1fr_464px] gap-25">
        <section>
          <JobContent />
        </section>
        <aside className="sticky top-[70px] right-0 w-[464px] space-y-[50px]">
          <CompanyInfo />
          {/* 차트 */}
          <div className="charts space-y-[50px]">
            <CompetitionChart />
            <WrittenTestChart />
            <HireChart organization={organ} />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default JobPostingDetails;
