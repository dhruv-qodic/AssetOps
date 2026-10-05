import React from 'react';
import { Search, List, LayoutGrid, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import AssetFilterDropdown from '@/components/assets/AssetFilterDropdown';
import type { Employee } from '@/types/employee';

export type ActiveAllocationViewMode = 'list' | 'card';

interface ActiveAllocationsToolbarProps {
  search: string;
  onSearchChange: (val: string) => void;
  onFilterChange?: () => void;
  viewMode: ActiveAllocationViewMode;
  onViewModeChange: (mode: ActiveAllocationViewMode) => void;
  totalCount: number;
  employees?: Employee[];
}

export const ActiveAllocationsToolbar: React.FC<ActiveAllocationsToolbarProps> = ({
  search,
  onSearchChange,
  onFilterChange,
  viewMode,
  onViewModeChange,
  totalCount,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
      {/* Left: Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <Input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by asset, employee, or department..."
          aria-label="Search active allocations"
          className="h-9.5 pl-9.5 pr-9 bg-slate-50/80 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 rounded-xl shadow-2xs focus-visible:ring-2 focus-visible:ring-[#155DFC]/20 focus-visible:border-[#155DFC]"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            aria-label="Clear search input"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {/* Right: Results Count + Filter Button/Popup + View Switcher */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 flex-wrap justify-between sm:justify-end">
        {/* Results Badge */}
        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
          {totalCount} {totalCount === 1 ? 'allocation' : 'allocations'}
        </span>

        {/* Filter Popup Component Reused from Assets */}
        <AssetFilterDropdown mode="allocations" onFilterChange={onFilterChange} />

        {/* View Switcher: List View vs Card View */}
        <div
          data-testid="view-switcher"
          className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/60 shrink-0"
        >
          <button
            type="button"
            onClick={() => onViewModeChange('list')}
            aria-label="List View"
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none',
              viewMode === 'list'
                ? 'bg-[#155DFC] text-white shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200',
            )}
            title="Switch to List View"
          >
            <List className="size-3.5" />
            <span>List View</span>
          </button>

          <button
            type="button"
            onClick={() => onViewModeChange('card')}
            aria-label="Card View"
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none',
              viewMode === 'card'
                ? 'bg-[#155DFC] text-white shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200',
            )}
            title="Switch to Card View"
          >
            <LayoutGrid className="size-3.5" />
            <span>Card View</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActiveAllocationsToolbar;
