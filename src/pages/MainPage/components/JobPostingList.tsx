import { useQueries } from "@tanstack/react-query";
import JobPostingCard from "./JobPostingCard";
import axiosInstance from "@/apis/api";
import { useNavigate } from "react-router-dom";
import JobPagination from "./JobPagination";

interface JobPostingListProps {
  searchKeywords: SearchTag;
  onPageChange: (page: number) => void;
}

interface JobPostingListData {
  postingId: number;
  postingOrgan: string;
  postingTitle: string;
  acceptStartDate: string;
  acceptEndDate: string;
  postingTag: string[];
}

const JobPostingList = ({
  searchKeywords,
  onPageChange,
}: JobPostingListProps) => {
  const navigate = useNavigate();

  // 채용 공고 가져오기
  const results = useQueries({
    queries: [
      {
        queryKey: ["postingList", searchKeywords],
        queryFn: async () => {
          const res = await axiosInstance.post(
            "/busan/posting",
            searchKeywords
          );
          return res.data as JobPostingListData[];
        },
      },
      {
        queryKey: ["postingMaxPage", searchKeywords],
        queryFn: async () => {
          const res = await axiosInstance.post(
            "/busan/posting/page-info",
            searchKeywords
          );
          return res.data as { maxPage: number };
        },
      },
    ],
  });

  const postingList = results[0].data;
  const maxPage = results[1].data?.maxPage ?? 1;
  const isLoading = results.some((r) => r.isLoading);

  // 채용 공고 상세 조회
  const handleClickJobPostingDetail = (postingId: number) => {
    navigate(`/jobs/${postingId}`);
  };

  if (results[0].error) return <div>불러오는 중 오류가 발생했습니다.</div>;

  return (
    <>
      {isLoading && <div className="h-[300px] w-full"></div>}
      {(postingList ?? []).length ? (
        <ul className="grid grid-cols-1 gap-x-6 gap-y-[30px] md:grid-cols-2 lg:grid-cols-3">
          {(postingList ?? []).map(
            ({
              postingId,
              postingOrgan,
              postingTitle,
              acceptStartDate,
              acceptEndDate,
              postingTag,
            }) => (
              <li
                key={postingId}
                onClick={() => handleClickJobPostingDetail(postingId)}
              >
                <JobPostingCard
                  postingOrgan={postingOrgan}
                  postingTitle={postingTitle}
                  acceptStartDate={acceptStartDate}
                  acceptEndDate={acceptEndDate}
                  postingTag={postingTag.slice(0, 2)}
                />
              </li>
            )
          )}
        </ul>
      ) : (
        <div className="flex h-[300px] w-full items-center justify-center">
          <span className="text-lg text-gray-500">
            검색 결과에 대한 공고가 없습니다.
          </span>
        </div>
      )}
      <JobPagination
        page={searchKeywords.page}
        maxPage={maxPage}
        onPageChange={onPageChange}
      />
    </>
  );
};

export default JobPostingList;
