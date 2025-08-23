import { useState } from "react";
import Filter from "./Filter";
import JobPostingList from "./JobPostingList";

const JobPosting = () => {
  const [searchKeywords, setSearchKeywords] = useState<SearchTag>({
    postingOrgan: "전체",
    postingPart: [],
    postingField: [],
    postingEmploymentType: [],
    postingEducation: [],
    keyword: "",
    status: [],
    postingTag: [],
    page: 1,
  });

  // page 변경 핸들러
  const handlePageChange = (nextPage: number) => {
    setSearchKeywords(prev => ({ ...prev, page: nextPage }));
    // 페이지 바뀌면 상단으로 스크롤
    // window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div>
        <Filter
          searchKeywords={searchKeywords}
          setSearchKeyword={setSearchKeywords}
        />
      </div>
      {/* 채용 공고 */}
      <section>
        <div className="title mb-[30px] flex items-center justify-between">
          <h2 className="text-2xl font-semibold">채용 공고</h2>
          <p className="text-sm text-gray-400">
            <span>업데이트 일시</span>
            <span>2025.08.20.</span>
          </p>
        </div>
        <JobPostingList
          searchKeywords={searchKeywords}
          onPageChange={handlePageChange}
        />
      </section>
    </>
  );
};

export default JobPosting;
