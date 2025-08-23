import React, { useState } from "react";
import BtcLogo from "@/assets/images/btc-logo.svg?react";
import BtoLogo from "@/assets/images/bto-logo.svg?react";
import BmcLogo from "@/assets/images/bmc-logo.svg?react";
import BiscoLogo from "@/assets/images/bisco-logo.svg?react";
import BecoLogo from "@/assets/images/beco-logo.svg?react";
import { IoIosSearch } from "react-icons/io";
import { IoRefreshOutline } from "react-icons/io5";

interface FilterProps {
  searchKeywords: SearchTag;
  setSearchKeyword: React.Dispatch<React.SetStateAction<SearchTag>>;
}

const organizations = [
  { name: "부산교통공사", Icon: BtcLogo },
  { name: "부산관광공사", Icon: BtoLogo },
  { name: "부산도시공사", Icon: BmcLogo },
  { name: "부산시설공단", Icon: BiscoLogo },
  { name: "부산환경공단", Icon: BecoLogo },
];
const parts = [
  "일반직",
  "행정직",
  "경영직",
  "사무직",
  "관리직",
  "연구직",
  "기술직",
  "시설직",
  "전산직",
  "운영직",
  "기능직",
  "공무직",
  "안전직",
  "전문직",
  "환경직",
  "토목직",
  "기계직",
  "운전직",
  "계약직",
  "경력직",
  "기타",
];
const fields = [
  "일반",
  "경력",
  "장애인",
  "기록물관리",
  "2종면허",
  "보훈",
  "기능인재",
  "취업지원대상",
];
const employmentTypes = ["정규직", "무기계약직", "비정규직", "청년인턴"];
const education = [
  "학력무관",
  "중졸이상",
  "고졸이상",
  "초대졸이상",
  "대졸이상",
];
const status = ["모집예정", "모집중", "마감"];
const postingTags = [
  "지역제한",
  "대학제한",
  "어학점수",
  "자격증",
  "나이제한",
  "블라인드",
];

const Filter = ({ searchKeywords, setSearchKeyword }: FilterProps) => {
  const [keyword, setKeyword] = useState<string>("");
  const [tagList, setTagList] = useState<string[]>([]);

  // 비교용 전처리(공백/대소문자 통일)
  const norm = (s: string) => s.trim().toLowerCase();

  // 화면 표시용 태그 추가 (중복/빈값 방지)
  const addTag = (raw: string) => {
    const tag = raw.trim();
    if (!tag) return;
    setTagList(prev => {
      const exists = prev.some(t => norm(t) === norm(tag));
      return exists ? prev : [...prev, tag];
    });
  };

  // 키워드(단일) → 부모 상태에 반영
  const addKeyword = () => {
    const k = keyword.trim();
    if (!k) return;
    setSearchKeyword(prev => ({ ...prev, keyword: k, page: 1 }));
    setKeyword("");
    // 화면 태그에도 추가(원하면)
    addTag(k);
  };

  // 배열 항목 토글 → 부모 상태에 반영
  const addPartKeyword = (field: keyof SearchTag, value: string) => {
    setSearchKeyword(prev => {
      // 배열 필드만 허용
      const list = (prev[field] as unknown as string[]) ?? [];
      const exists = list.includes(value);
      return {
        ...prev,
        [field]: exists ? list.filter(v => v !== value) : [...list, value],
        page: 1, // 필터 바뀔 때 페이지 초기화 권장
      };
    });
  };

  // 기관 전체 선택
  const handleClickAllOrgan = () => {
    setSearchKeyword(prev => ({ ...prev, postingOrgan: "전체", page: 1 }));
  };

  // 기관 선택
  const handleClickOrgan = (organ: string) => {
    setSearchKeyword(prev => ({
      ...prev,
      postingOrgan: prev.postingOrgan === organ ? "전체" : organ,
      page: 1,
    }));
  };

  // 선택 여부 계산(초기값이 비었을 가능성 대비)
  const isAllSelected =
    !searchKeywords.postingOrgan || searchKeywords.postingOrgan === "전체";

  // 키워드 입력
  const handleChangeKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  // 키워드 엔터 추가
  const handleAddTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      addKeyword();
    }
  };

  // 추천 태그/옵션 클릭 → 화면 태그 + 부모 상태 동시 반영
  const handleClickPart = (value: string) => {
    addTag(value);
    addPartKeyword("postingPart", value);
  };
  const handleClickField = (value: string) => {
    addTag(value);
    addPartKeyword("postingField", value);
  };
  const handleClickEmployment = (value: string) => {
    addTag(value);
    addPartKeyword("postingEmploymentType", value);
  };
  const handleClickEducation = (value: string) => {
    addTag(value);
    addPartKeyword("postingEducation", value);
  };
  const handleClickStatus = (value: string) => {
    addTag(value);
    addPartKeyword("status", value);
  };
  const handleClickPostingTag = (value: string) => {
    addTag(value);
    addPartKeyword("postingTag", value);
  };

  // 화면 태그 삭제
  const handleRemoveTag = (tag: string) => {
    setSearchKeyword(prevKW => {
      const removeFrom = (arr: string[]) =>
        arr.filter(v => norm(v) !== norm(tag));
      return {
        ...prevKW,
        postingPart: removeFrom(prevKW.postingPart),
        postingField: removeFrom(prevKW.postingField),
        postingEmploymentType: removeFrom(prevKW.postingEmploymentType),
        postingEducation: removeFrom(prevKW.postingEducation),
        status: removeFrom(prevKW.status),
        postingTag: removeFrom(prevKW.postingTag),
        keyword: norm(prevKW.keyword) === norm(tag) ? "" : prevKW.keyword,
        page: 1,
      };
    });
    setTagList(prev => prev.filter(t => norm(t) !== norm(tag)));
  };

  // 초기화 (부모 상태도 초기화)
  const handleClickSearchReset = () => {
    setTagList([]);
    setSearchKeyword(prev => ({
      ...prev,
      postingPart: [],
      postingField: [],
      postingEmploymentType: [],
      postingEducation: [],
      status: [],
      postingTag: [],
      keyword: "",
      page: 1,
    }));
  };

  return (
    <div className="flex flex-col space-y-[50px]">
      <ul className="grid grid-cols-3 gap-6 lg:grid-cols-6">
        <li>
          <button
            type="button"
            className={`grid h-25 w-full place-content-center rounded-[10px] transition-all duration-200 ${
              isAllSelected
                ? "bg-linear-330 from-[#0072D6] to-[#00A7C9] text-white"
                : "border-1 border-gray-200 text-gray-500 hover:bg-gray-100"
            }`}
            onClick={handleClickAllOrgan}
          >
            <span className="text-xl font-bold">전체</span>
          </button>
        </li>
        {organizations.map(({ name, Icon }, index) => {
          const selected = searchKeywords.postingOrgan === name;

          return (
            <li key={index}>
              <button
                type="button"
                className={`flex h-25 w-full items-center justify-center rounded-[10px] border-1 px-[10px] transition-all duration-200 ${
                  selected
                    ? "border-2 border-blue-300 bg-blue-100 hover:bg-blue-200"
                    : "border-1 border-gray-200 hover:bg-gray-100"
                }`}
                onClick={() => handleClickOrgan(name)}
              >
                <Icon className="h-auto max-h-full w-[clamp(130px,12vw,180px)]" />
              </button>
            </li>
          );
        })}
      </ul>
      <div className="h-auto w-full rounded-[10px] border-1 border-gray-200 bg-white">
        {/* 키워드 검색 */}
        <div className="keyword-search grid h-[50px] grid-cols-[1fr_70px] items-center gap-5 border-b-1 border-gray-200 pr-5">
          <div className="relative flex h-full items-center gap-5">
            <IoIosSearch className="absolute top-[13px] left-[12px] size-6 fill-gray-400" />
            <input
              className="w-full rounded-t-[10px] pr-5 pl-11 placeholder:text-gray-400 focus:outline-0"
              id="keyword"
              name="keyword"
              type="text"
              value={keyword}
              placeholder="키워드로 검색해 보세요."
              onChange={handleChangeKeyword}
              onKeyDown={handleAddTag}
            />
          </div>
          <button
            className="w-[70px] rounded-[5px] bg-blue-500 px-5 py-[5px] font-semibold text-white transition-all duration-200 hover:bg-blue-600"
            onClick={addKeyword}
          >
            검색
          </button>
        </div>

        {/* 근무분야 */}
        <div className="flex h-auto w-full items-center space-x-5 border-b-1 border-b-gray-200 px-[30px] py-5">
          <span className="w-20 text-center text-base">근무분야</span>
          <div className="flex flex-wrap gap-[10px]">
            {parts.map(part => {
              const isSelected =
                tagList.includes(part) ||
                searchKeywords.postingPart.includes(part); // 시각 상태와 부모 상태 둘 다 참조(선택사항)
              return (
                <span
                  key={part}
                  className={`inline-flex h-[30px] cursor-pointer items-center justify-center rounded-full px-[15px] font-semibold ${
                    isSelected
                      ? "bg-blue-500 text-white"
                      : "border-1 border-gray-300 text-gray-400"
                  }`}
                  onClick={() => handleClickPart(part)}
                >
                  {part}
                </span>
              );
            })}
          </div>
        </div>

        {/* 전형/고용형태 */}
        <div className="grid grid-cols-2 border-b-1 border-b-gray-200">
          <div className="flex h-auto w-full items-center space-x-5 border-r-1 border-r-gray-200 px-[30px] py-5">
            <span className="w-20 text-center text-base">전형</span>
            <div className="flex flex-wrap gap-[10px]">
              {fields.map(field => {
                const isSelected =
                  tagList.includes(field) ||
                  searchKeywords.postingField.includes(field);
                return (
                  <span
                    key={field}
                    className={`inline-flex h-[30px] cursor-pointer items-center justify-center rounded-full px-[15px] font-semibold ${
                      isSelected
                        ? "bg-blue-500 text-white"
                        : "border-1 border-gray-300 text-gray-400"
                    }`}
                    onClick={() => handleClickField(field)}
                  >
                    {field}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="flex h-auto w-full items-center space-x-5 border-r-1 border-r-gray-200 px-[30px] py-5">
            <span className="w-20 text-center text-base">고용형태</span>
            <div className="flex flex-wrap gap-[10px]">
              {employmentTypes.map(type => {
                const isSelected =
                  tagList.includes(type) ||
                  searchKeywords.postingEmploymentType.includes(type);
                return (
                  <span
                    key={type}
                    className={`inline-flex h-[30px] cursor-pointer items-center justify-center rounded-full px-[15px] font-semibold ${
                      isSelected
                        ? "bg-blue-500 text-white"
                        : "border-1 border-gray-300 text-gray-400"
                    }`}
                    onClick={() => handleClickEmployment(type)}
                  >
                    {type}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* 학력/상태 */}
        <div className="grid grid-cols-2 border-b-1 border-b-gray-200">
          <div className="flex h-auto w-full items-center space-x-5 border-r-1 border-r-gray-200 px-[30px] py-5">
            <span className="w-20 text-center text-base">학력</span>
            <div className="flex flex-wrap gap-[10px]">
              {education.map(edu => {
                const isSelected =
                  tagList.includes(edu) ||
                  searchKeywords.postingEducation.includes(edu);
                return (
                  <span
                    key={edu}
                    className={`inline-flex h-[30px] cursor-pointer items-center justify-center rounded-full px-[15px] font-semibold ${
                      isSelected
                        ? "bg-blue-500 text-white"
                        : "border-1 border-gray-300 text-gray-400"
                    }`}
                    onClick={() => handleClickEducation(edu)}
                  >
                    {edu}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="flex h-auto w-full items-center space-x-5 border-r-1 border-r-gray-200 px-[30px] py-5">
            <span className="w-20 text-center text-base">상태</span>
            <div className="flex flex-wrap gap-[10px]">
              {status.map(stat => {
                const isSelected =
                  tagList.includes(stat) ||
                  searchKeywords.status.includes(stat);
                return (
                  <span
                    key={stat}
                    className={`inline-flex h-[30px] cursor-pointer items-center justify-center rounded-full px-[15px] font-semibold ${
                      isSelected
                        ? "bg-blue-500 text-white"
                        : "border-1 border-gray-300 text-gray-400"
                    }`}
                    onClick={() => handleClickStatus(stat)}
                  >
                    {stat}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* 요구조건 */}
        <div className="flex h-auto w-full items-center space-x-5 border-b-1 border-b-gray-200 px-[30px] py-5">
          <span className="w-20 text-center text-base">요구조건</span>
          <div className="flex flex-wrap gap-[10px]">
            {postingTags.map(tag => {
              const isSelected =
                tagList.includes(tag) ||
                searchKeywords.postingTag.includes(tag);
              return (
                <span
                  key={tag}
                  className={`inline-flex h-[30px] cursor-pointer items-center justify-center rounded-full px-[15px] font-semibold ${
                    isSelected
                      ? "bg-blue-500 text-white"
                      : "border-1 border-gray-300 text-gray-400"
                  }`}
                  onClick={() => handleClickPostingTag(tag)}
                >
                  {tag}
                </span>
              );
            })}
          </div>
        </div>

        {/* 검색 태그(화면 표시용) */}
        <div className="grid h-[70px] grid-cols-[1fr_88px] items-center gap-5 pr-5 pl-[30px]">
          <div className="flex flex-wrap gap-[10px]">
            {tagList.map((tag, index) => (
              <span
                key={index}
                className="inline-flex h-[30px] cursor-pointer items-center justify-center rounded-full border-1 border-blue-500 px-[15px] font-semibold text-blue-500"
                onClick={() => handleRemoveTag(tag)}
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="w-22">
            <button
              className="flex w-full items-center justify-between rounded-[5px] border-1 border-gray-200 px-[10px] py-2"
              onClick={handleClickSearchReset}
            >
              <IoRefreshOutline className="size-5 text-gray-500" />
              <span className="text-base font-semibold text-gray-400">
                초기화
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
