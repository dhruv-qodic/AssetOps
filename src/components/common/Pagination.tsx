import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PaginationProps {
  totalFiltered: number;
  startIndex: number;
  endIndex: number;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  entityLabel?: string;
  className?: string;
}

/**
 * @description: Reusable table and list pagination component providing page buttons, ellipsis intervals, and range indicator
 * @param {PaginationProps}props: PaginationProps containing record counts, current page, and change handlers
 * @return{JSX.Element}: React pagination bar element or null if totalFiltered is 0
 */
export const Pagination: React.FC<PaginationProps> = ({
  totalFiltered,
  startIndex,
  endIndex,
  totalPages,
  currentPage,
  onPageChange,
  entityLabel = 'items',
  className,
}) => {
  const { t: translatePagination } = useTranslation('setting');
  /**
   * @description: Validates and triggers a page change when a valid different page is requested
   * @param {number}newPage: Target page number to navigate to
   * @return: void
   */
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      onPageChange(newPage);
    }
  };

  /**
   * @description: Calculates an array of visible page numbers and ellipsis tokens based on the current page and total count
   * @return: Array of page numbers and ellipsis markers ('..')
   */
  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('..');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push('..');
      }

      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalFiltered === 0) return null;

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-3.5 border-t border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm select-none',
        className,
      )}
    >
      {/* Showing X to Y of Z {entityLabel} */}
      <div className="text-slate-500 dark:text-slate-400 font-medium">
        {translatePagination('common.showing')}{' '}
        <span className="font-semibold text-slate-700 dark:text-slate-200">{startIndex}</span>{' '}
        {translatePagination('common.to')}{' '}
        <span className="font-semibold text-slate-700 dark:text-slate-200">{endIndex}</span>{' '}
        {translatePagination('common.of')}{' '}
        <span className="font-semibold text-slate-700 dark:text-slate-200">
          {totalFiltered.toLocaleString()}
        </span>{' '}
        {entityLabel}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex size-7.5 items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label={translatePagination('common.previous')}
        >
          <ChevronLeft className="size-4" />
        </button>

        {/* Page Numbers */}
        {generatePageNumbers().map((pageItem, idx) => {
          if (pageItem === '..') {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="flex size-7.5 items-center justify-center text-slate-400 font-medium text-xs"
              >
                ..
              </span>
            );
          }

          const pageNum = pageItem as number;
          const isActive = pageNum === currentPage;

          return (
            <button
              key={`page-${pageNum}`}
              type="button"
              onClick={() => handlePageChange(pageNum)}
              className={cn(
                'flex size-7.5 items-center justify-center rounded-full font-medium text-xs sm:text-sm transition-all cursor-pointer',
                isActive
                  ? 'border border-primary text-primary bg-primary/10 font-semibold shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
              )}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          type="button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex size-7.5 items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label={translatePagination('common.next')}
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
