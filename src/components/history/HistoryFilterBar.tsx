import React from 'react';
import {
  Layers,
  Package,
  Users,
  GitCommit,
  Search,
  X,
  ArrowUpDown,
  UserPlus,
  CornerDownLeft,
  PlusCircle,
  Edit3,
  Wrench,
  UserCheck,
  Trash2,
  Activity,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { HistoryCategory } from '@/mocks/seed/history';
import { HISTORY_KPI_SUMMARY } from '@/mocks/seed/history';

interface HistoryFilterBarProps {
  activeTab: HistoryCategory;
  onTabChange: (tab: HistoryCategory) => void;
  search: string;
  onSearchChange: (search: string) => void;
  actionFilter: string;
  onActionFilterChange: (action: string) => void;
  sortOrder: 'newest' | 'oldest';
  onSortOrderChange: (order: 'newest' | 'oldest') => void;
}

const ACTION_OPTIONS = [
  {
    label: 'All Actions',
    value: 'All',
    icon: <Activity className="size-3.5 text-slate-400" />,
  },
  {
    label: 'Allocated',
    value: 'Allocated',
    icon: <UserPlus className="size-3.5 text-indigo-500" />,
  },
  {
    label: 'Returned',
    value: 'Returned',
    icon: <CornerDownLeft className="size-3.5 text-blue-500" />,
  },
  {
    label: 'Created',
    value: 'Created',
    icon: <PlusCircle className="size-3.5 text-emerald-500" />,
  },
  {
    label: 'Updated',
    value: 'Updated',
    icon: <Edit3 className="size-3.5 text-slate-500" />,
  },
  {
    label: 'Maintenance',
    value: 'Maintenance',
    icon: <Wrench className="size-3.5 text-amber-500" />,
  },
  {
    label: 'Onboarded',
    value: 'Onboarded',
    icon: <UserPlus className="size-3.5 text-emerald-500" />,
  },
  {
    label: 'Transferred',
    value: 'Transferred',
    icon: <UserCheck className="size-3.5 text-purple-500" />,
  },
  {
    label: 'Retired',
    value: 'Retired',
    icon: <Trash2 className="size-3.5 text-rose-500" />,
  },
];

export const HistoryFilterBar: React.FC<HistoryFilterBarProps> = ({
  activeTab,
  onTabChange,
  search,
  onSearchChange,
  actionFilter,
  onActionFilterChange,
  sortOrder,
  onSortOrderChange,
}) => {
  const tabs = [
    {
      id: 'all' as HistoryCategory,
      label: 'All History',
      icon: Layers,
      badgeCount: HISTORY_KPI_SUMMARY.unreadCounts.all,
    },
    {
      id: 'asset' as HistoryCategory,
      label: 'Asset History',
      icon: Package,
      badgeCount: HISTORY_KPI_SUMMARY.unreadCounts.asset,
    },
    {
      id: 'employee' as HistoryCategory,
      label: 'Employee History',
      icon: Users,
      badgeCount: HISTORY_KPI_SUMMARY.unreadCounts.employee,
    },
    {
      id: 'allocation' as HistoryCategory,
      label: 'Allocation History',
      icon: GitCommit,
      badgeCount: HISTORY_KPI_SUMMARY.unreadCounts.allocation,
    },
  ];

  return (
    <div className="space-y-4">
      {/* 1. History Navigation Tabs with Unread Badges */}
      <div
        data-testid="history-tabs"
        className="flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 overflow-x-auto select-none"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0 select-none',
                isActive
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs border border-slate-200/60 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50',
              )}
            >
              <Icon className="size-4" />
              <span>{tab.label}</span>
              {tab.badgeCount > 0 && (
                <span
                  className={cn(
                    'text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors',
                    isActive
                      ? 'bg-[#155DFC] text-white'
                      : 'bg-blue-100 text-[#155DFC] dark:bg-blue-950/80 dark:text-blue-300',
                  )}
                >
                  {tab.badgeCount} New
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 2. Search and Filter Controls Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <Input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search history by action, asset, employee, or actor..."
            aria-label="Search history logs"
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

        {/* Right Filter Dropdowns */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap justify-between sm:justify-end">
          {/* Shadcn Action Select Filter */}
          <div className="w-[160px] sm:w-[175px]">
            <Select
              value={actionFilter}
              onValueChange={onActionFilterChange}
              options={ACTION_OPTIONS}
              className="h-9.5 rounded-xl text-xs font-medium"
            />
          </div>

          {/* Sort Order */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onSortOrderChange(sortOrder === 'newest' ? 'oldest' : 'newest')}
              className="h-9.5 px-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-xl shadow-2xs flex items-center gap-1.5 cursor-pointer select-none transition-all active:scale-[0.98]"
              title="Toggle Sort Direction"
            >
              <ArrowUpDown className="size-3.5 text-slate-400" />
              <span>{sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryFilterBar;
