interface SearchTag {
  postingOrgan: string; // 기업
  postingPart: string[]; // 근무분야
  postingField: string[]; // 전형
  postingEmploymentType: string[]; // 고용형태
  postingEducation: string[]; // 학력
  keyword: string; // 검색 입력 키워드
  status: string[]; // 상태
  postingTag: string[]; // 요구조건
  page: number; // 페이지
}
