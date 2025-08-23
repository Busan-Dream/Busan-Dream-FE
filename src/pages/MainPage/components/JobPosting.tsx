import JobPostingList from "./JobPostingList";
import Pagination from "./Pagination";

const JobPosting = () => {
  return (
    <>
      <div className="title mb-[30px] flex items-center justify-between">
        <h2 className="text-2xl font-semibold">채용 공고</h2>
        <p className="text-sm text-gray-400">
          <span>업데이트 일시</span>
          <span>2025.08.20.</span>
        </p>
      </div>
      <JobPostingList />
      <Pagination />
    </>
  );
};

export default JobPosting;
