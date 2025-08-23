import { axiosInstance } from "./api";

// 정책 카테고리 타입
export type PolicyPart = "work" | "house" | "busan" | "life";

// 정책 태그 타입
export type PolicyTag =
  | "일자리"
  | "입사면접"
  | "만18세이상 만34세이하"
  | "거주"
  | "정착"
  | "생활";

// 개별 정책 데이터 타입
export interface Policy {
  policyTitle: string;
  policyBusan: string;
  policyTag: PolicyTag[];
  policyPart: PolicyPart;
  policyUrl: string;
  policyStartDate: string;
  policyDateDate: string | null;
  isCurrent: boolean;
}

// 정책 목록 응답 타입
export interface PolicyListResponse {
  maxPage: number;
  work: Policy[];
  house: Policy[];
  busan: Policy[];
  life: Policy[];
}

// 정책 목록 요청 타입
export interface PolicyListRequest {
  policyBusan: "부산내" | "부산외" | "공통";
  page: number;
}

// 정책 목록 조회 API
export const getPolicyList = async (
  params: PolicyListRequest
): Promise<PolicyListResponse> => {
  const response = await axiosInstance.post("/busan/policy/list", params);
  return response.data;
};

// 카테고리별 정책 목록 조회 (페이지네이션 포함)
export const getPolicyListByCategory = async (
  category: PolicyPart,
  params: PolicyListRequest
): Promise<{ policies: Policy[]; maxPage: number }> => {
  const response = await getPolicyList(params);
  const policies = response[category] || [];
  return {
    policies,
    maxPage: response.maxPage,
  };
};

// 다중 카테고리 정책 목록 조회
export const getPolicyListByCategories = async (
  categories: PolicyPart[],
  params: PolicyListRequest
): Promise<{ policies: Policy[]; maxPage: number }> => {
  const response = await getPolicyList(params);

  // 선택된 카테고리들의 정책을 모두 합치기
  const allPolicies: Policy[] = [];
  categories.forEach((category) => {
    const categoryPolicies = response[category] || [];
    allPolicies.push(...categoryPolicies);
  });

  return {
    policies: allPolicies,
    maxPage: response.maxPage,
  };
};
