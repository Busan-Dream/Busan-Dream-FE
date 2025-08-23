import { useState, useEffect, useCallback } from "react";
import {
  Policy,
  PolicyPart,
  PolicyListRequest,
  getPolicyListByCategory,
} from "@/apis/policy";

interface UsePolicyListReturn {
  policies: Policy[];
  loading: boolean;
  error: string | null;
  maxPage: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  fetchPolicies: (page?: number) => Promise<void>;
  goToNextPage: () => void;
  goToPrevPage: () => void;
  goToPage: (page: number) => void;
}

interface UsePolicyListProps {
  category: PolicyPart;
  policyBusan?: "부산내" | "부산외" | "공통";
  initialPage?: number;
}

export const usePolicyList = ({
  category,
  policyBusan = "부산내",
  initialPage = 1,
}: UsePolicyListProps): UsePolicyListReturn => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [maxPage, setMaxPage] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  const fetchPolicies = useCallback(
    async (page: number = currentPage) => {
      try {
        setLoading(true);
        setError(null);

        const params: PolicyListRequest = {
          policyBusan,
          page,
        };

        const result = await getPolicyListByCategory(category, params);

        setPolicies(result.policies);
        setMaxPage(result.maxPage);
        setCurrentPage(page);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "정책 목록을 가져오는데 실패했습니다."
        );
        console.error("정책 목록 조회 오류:", err);
      } finally {
        setLoading(false);
      }
    },
    [category, policyBusan, currentPage]
  );

  const goToNextPage = useCallback(() => {
    if (currentPage < maxPage) {
      fetchPolicies(currentPage + 1);
    }
  }, [currentPage, maxPage, fetchPolicies]);

  const goToPrevPage = useCallback(() => {
    if (currentPage > 1) {
      fetchPolicies(currentPage - 1);
    }
  }, [currentPage, fetchPolicies]);

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= maxPage) {
        fetchPolicies(page);
      }
    },
    [maxPage, fetchPolicies]
  );

  // 초기 로딩
  useEffect(() => {
    fetchPolicies(initialPage);
  }, [category, policyBusan, initialPage]);

  // 카테고리나 지역이 변경될 때 페이지 초기화
  useEffect(() => {
    setCurrentPage(1);
    fetchPolicies(1);
  }, [category, policyBusan]);

  return {
    policies,
    loading,
    error,
    maxPage,
    currentPage,
    hasNextPage: currentPage < maxPage,
    hasPrevPage: currentPage > 1,
    fetchPolicies,
    goToNextPage,
    goToPrevPage,
    goToPage,
  };
};
