import { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import HireChart from "./components/Charts/HireChart";
import CompanyInfo from "./components/CompanyInfo";
import JobContent from "./components/JobContent";
import CompetitionChart from "./components/Charts/CompetitionChart";
import WrittenTestChart from "./components/Charts/WrittenTestChart";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/apis/api";

type OrgInitial = "BTC" | "BMC" | "BISCO" | "BECO" | "BTO";

const organizations = [
  { name: "부산교통공사", initial: "BTC" },
  { name: "부산도시공사", initial: "BMC" },
  { name: "부산시설공단", initial: "BISCO" },
  { name: "부산환경공단", initial: "BECO" },
  { name: "부산관광공사", initial: "BTO" },
];

const JobPostingDetails = () => {
  const [organ, setOrgan] = useState<OrgInitial>("BECO");

  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const { data } = useQuery({
    queryKey: ["job-content", id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/busan/posting/${id}`);

      return response.data;
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (data?.postingOrgan) {
      const found = organizations.find(org => org.name === data.postingOrgan);
      if (found) {
        setOrgan(found.initial as OrgInitial);
      }
    }
  }, [data?.postingOrgan]);

  // 뒤로 가기
  const handleClickBack = () => {
    navigate(-1);
  };

  if (!data) return null;

  const {
    postingOrgan,
    postingYear,
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
    postingDepartment,
    postingTel,
    postingURL,
  } = data;

  return (
    <div className="pb-25">
      <div className="flex h-20 items-center justify-between">
        <button onClick={handleClickBack}>
          <IoIosArrowRoundBack className="-ml-[10px] size-12 text-gray-700" />
        </button>
      </div>
      <div className="job_posting_details relative grid grid-cols-[1fr_464px] gap-25">
        <section>
          <JobContent
            postingOrgan={postingOrgan}
            postingField={postingField}
            postingPart={postingPart}
            postingTitle={postingTitle}
            postingTag={postingTag}
            postingRecipt={postingRecipt}
            postingPeriod={postingPeriod}
            postingStartDate={postingStartDate}
            postingEndDate={postingEndDate}
            acceptStartDate={acceptStartDate}
            acceptEndDate={acceptEndDate}
            postingIncruit={postingIncruit}
            postingFieldMethod={postingFieldMethod}
            postingCondition={postingCondition}
          />
        </section>
        <aside className="sticky top-[70px] right-0 w-[464px] space-y-[50px]">
          <CompanyInfo
            postingOrgan={postingOrgan}
            postingDepartment={postingDepartment}
            postingTel={postingTel}
            postingURL={postingURL}
          />
          {/* 차트 */}
          <div className="charts space-y-[50px]">
            <CompetitionChart
              postingOrgan={postingOrgan}
              postingYear={postingYear}
              postingField={postingField}
              postingPart={postingPart}
            />
            <WrittenTestChart
              postingOrgan={postingOrgan}
              postingYear={postingYear}
              postingField={postingField}
              postingPart={postingPart}
            />
            <HireChart organization={organ} />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default JobPostingDetails;
