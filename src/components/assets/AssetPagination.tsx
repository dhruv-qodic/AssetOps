import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAssetStore } from '@/store/useAssetStore';
import { cn } from '@/lib/utils';

interface AssetPaginationProps {
  totalFiltered: number;
  startIndex: number;
  endIndex: number;
  totalPages: number;
  currentPage: number;
}

export const AssetPagination: React.FC<AssetPaginationProps> = ({
  totalFiltered,
  startIndex,
  endIndex,
  totalPages,
  currentPage,
}) => {
  const { setPage } = useAssetStore();

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setPage(newPage);
    }
  };

  // Generate page numbers with ellipses
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
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalFiltered === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-3.5 border-t border-slate-200/80 dark:border-slate-800 text-xs select-none">
      {/* Showing X to Y of Z assets */}
      <div className="text-slate-500 dark:text-slate-400 font-medium">
        Showing{' '}
        <span className="font-semibold text-slate-700 dark:text-slate-200">
          {startIndex}
        </span>{' '}
        to{' '}
        <span className="font-semibold text-slate-700 dark:text-slate-200">
          {endIndex}
        </span>{' '}
        of{' '}
        <span className="font-semibold text-slate-700 dark:text-slate-200">
          {totalFiltered.toLocaleString()}
        </span>{' '}
        assets
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={cn(
            'flex size-7.5 items-center justify-center rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed'
          )}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </button>

        {/* Page Numbers */}
        {generatePageNumbers().map((pageItem, idx) => {
          if (pageItem === '...') {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="flex size-7.5 items-center justify-center text-slate-400 font-medium text-xs"
              >
                ...
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
                'flex size-7.5 items-center justify-center rounded-lg font-medium text-xs transition-all cursor-pointer',
                isActive
                  ? 'border border-[#4C40F7] text-[#4C40F7] bg-indigo-50/50 dark:bg-indigo-950/40 font-bold shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
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
          className={cn(
            'flex size-7.5 items-center justify-center rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed'
          )}
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
};

export default AssetPagination;
