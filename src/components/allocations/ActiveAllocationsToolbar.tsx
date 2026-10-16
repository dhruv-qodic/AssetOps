import React from 'react';
import { Search, List, LayoutGrid, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import AssetFilterDropdown from '@/components/assets/AssetFilterDropdown';
import type { Employee } from '@/types/employee';
import { useTranslation } from 'react-i18next';
import { ACTIVE_ALLOCATIONS_TOOLBAR_TEXT } from './constants/ActiveAllocationsToolbar.constants';

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

/**
 * @description: Toolbar for active allocations with live search input, filter popover trigger, results counter, and view mode switcher
 * @param {ActiveAllocationViewMode}props: ActiveAllocationViewMode containing search, onSearchChange, onFilterChange, viewMode, onViewModeChange, totalCount, and employees
 * @return: Active allocations toolbar JSX
 */
export const ActiveAllocationsToolbar: React.FC<ActiveAllocationsToolbarProps> = ({
  search,
  onSearchChange,
  onFilterChange,
  viewMode,
  onViewModeChange,
  totalCount,
}) => {
  const { t: translateAllocations } = useTranslation('allocation');
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
      {/* Left: Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <Input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={translateAllocations('filters.searchPlaceholder', {
            defaultValue: ACTIVE_ALLOCATIONS_TOOLBAR_TEXT.SEARCH_PLACEHOLDER,
          })}
          aria-label={ACTIVE_ALLOCATIONS_TOOLBAR_TEXT.SEARCH_ARIA_LABEL}
          className="h-9.5 pl-9.5 pr-9 bg-slate-50/80 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 rounded-xl shadow-2xs focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            aria-label={ACTIVE_ALLOCATIONS_TOOLBAR_TEXT.CLEAR_SEARCH_ARIA_LABEL}
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
          {totalCount}{' '}
          {totalCount === 1
            ? translateAllocations('pagination.allocation', {
                defaultValue: ACTIVE_ALLOCATIONS_TOOLBAR_TEXT.ALLOCATION_SINGULAR,
              })
            : translateAllocations('pagination.allocations', {
                defaultValue: ACTIVE_ALLOCATIONS_TOOLBAR_TEXT.ALLOCATION_PLURAL,
              })}
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
            aria-label={ACTIVE_ALLOCATIONS_TOOLBAR_TEXT.LIST_VIEW_LABEL}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none',
              viewMode === 'list'
                ? 'bg-primary text-white shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200',
            )}
            title={ACTIVE_ALLOCATIONS_TOOLBAR_TEXT.LIST_VIEW_TITLE}
          >
            <List className="size-3.5" />
            <span>
              {translateAllocations('views.list', {
                defaultValue: ACTIVE_ALLOCATIONS_TOOLBAR_TEXT.LIST_VIEW_LABEL,
              })}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onViewModeChange('card')}
            aria-label={ACTIVE_ALLOCATIONS_TOOLBAR_TEXT.CARD_VIEW_LABEL}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none',
              viewMode === 'card'
                ? 'bg-primary text-white shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200',
            )}
            title={ACTIVE_ALLOCATIONS_TOOLBAR_TEXT.CARD_VIEW_TITLE}
          >
            <LayoutGrid className="size-3.5" />
            <span>
              {translateAllocations('views.cards', {
                defaultValue: ACTIVE_ALLOCATIONS_TOOLBAR_TEXT.CARD_VIEW_LABEL,
              })}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActiveAllocationsToolbar;
