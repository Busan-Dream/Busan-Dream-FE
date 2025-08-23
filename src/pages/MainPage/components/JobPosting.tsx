import { useRef, useState } from "react";
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
  const headingRef = useRef<HTMLHeadingElement>(null);

  const scrollToHeading = () => {
    const el = headingRef.current;
    if (!el) return;

    const OFFSET = 100; // 헤더 높이 등
    const y = el.getBoundingClientRect().top + window.scrollY - OFFSET;
    window.scrollTo({ top: y });
  };

  // page 변경 핸들러
  const handlePageChange = (nextPage: number) => {
    setSearchKeywords(prev => ({ ...prev, page: nextPage }));
    scrollToHeading(); // ← 페이지 바뀔 때 헤딩으로 스크롤
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
          <h2
            ref={headingRef}
            className="scroll-mt-[80px] text-2xl font-semibold"
          >
            채용 공고
          </h2>
          <p className="space-x-1 text-sm text-gray-400">
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
