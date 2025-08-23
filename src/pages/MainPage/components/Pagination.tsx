import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

interface JobPaginationProps {
  page: number;
  maxPage: number;
  onPageChange: (page: number) => void;
}

const JobPagination = ({ page, maxPage, onPageChange }: JobPaginationProps) => {
  const canPrev = page > 1;
  const canNext = page < maxPage;

  const groupSize = 10;
  const groupIndex = Math.floor((page - 1) / groupSize);
  const start = groupIndex * groupSize + 1;
  const end = Math.min(start + groupSize - 1, maxPage);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const canPrevGroup = start > 1;
  const canNextGroup = end < maxPage;

  return (
    <Pagination className="my-10">
      {maxPage ? (
        <PaginationContent>
          {/* 이전 그룹 이동 */}
          {canPrevGroup && (
            <PaginationItem>
              <PaginationLink
                href="#"
                className="text-gray-700 hover:bg-gray-200"
                onClick={e => {
                  e.preventDefault();
                  onPageChange(Math.max(1, start - groupSize));
                }}
                aria-label="이전 10페이지"
              >
                <ChevronsLeft className="h-4 w-4" />
              </PaginationLink>
            </PaginationItem>
          )}
          {/* 이전(한 페이지) */}
          <PaginationItem>
            <PaginationLink
              href="#"
              aria-disabled={!canPrev}
              className={`${canPrev ? "text-gray-700 hover:bg-gray-200" : "text-gray-400 hover:bg-white hover:text-gray-400"}`}
              onClick={e => {
                e.preventDefault();
                if (canPrev) onPageChange(page - 1);
              }}
            >
              <IoChevronBack className="size-4" />
            </PaginationLink>
          </PaginationItem>
          {/* 현재 그룹 */}
          {pages.map(p => (
            <PaginationItem key={p}>
              <PaginationLink
                href="#"
                isActive={p === page}
                className={`font-medium text-gray-500 ${p === page ? "border-0 bg-blue-500 text-white hover:bg-blue-600 hover:text-white" : "bg-white hover:bg-gray-200 hover:text-gray-500"}`}
                onClick={e => {
                  e.preventDefault();
                  onPageChange(p);
                }}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}
          {/* 다음(한 페이지) */}
          <PaginationItem>
            <PaginationLink
              href="#"
              aria-disabled={!canNext}
              className={`${canNext ? "text-gray-700 hover:bg-gray-200" : "text-gray-400 hover:bg-white hover:text-gray-400"}`}
              onClick={e => {
                e.preventDefault();
                if (canNext) onPageChange(page + 1);
              }}
            >
              <IoChevronForward className="size-4" />
            </PaginationLink>
          </PaginationItem>
          {/* 다음 그룹 이동 */}
          {canNextGroup && (
            <PaginationItem>
              <PaginationLink
                href="#"
                className="text-gray-700 hover:bg-gray-200"
                onClick={e => {
                  e.preventDefault();
                  onPageChange(end + 1);
                }}
                aria-label="다음 10페이지"
              >
                <ChevronsRight className="h-4 w-4" />
              </PaginationLink>
            </PaginationItem>
          )}
        </PaginationContent>
      ) : (
        <></>
      )}
    </Pagination>
  );
};

export default JobPagination;
