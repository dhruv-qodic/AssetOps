import React from 'react';
import { Search, X, User, Package, Tag, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { ASSET_CATEGORIES, ASSET_LOCATIONS } from '@/constant/asset.constants';
import type { Employee } from '@/types/employee';
import {
  ALLOCATION_FILTERS_LABELS,
  ALLOCATION_FILTER_STATUS_OPTIONS,
} from './constants/AllocationFiltersBar.constants';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface FilterSelectProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  options: { label: string; value: string }[];
  onChange: (val: string) => void;
}

/**
 * @description: Reusable select dropdown trigger delegating to Select component
 */
function FilterSelect({ label, value, icon, options, onChange }: FilterSelectProps) {
  return (
    <div className="flex-1 min-w-[120px] sm:min-w-[140px] space-y-1 text-left">
      <div className="flex items-center gap-1">
        {icon && (
          <span className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary">
            {icon}
          </span>
        )}
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
          {label}
        </label>
      </div>
      <Select value={value} onValueChange={onChange} options={options} />
    </div>
  );
}

interface AllocationFiltersBarProps {
  search: string;
  onSearchChange: (search: string) => void;
  assetCategory: string;
  onAssetCategoryChange: (category: string) => void;
  employeeFilter: string;
  onEmployeeFilterChange: (emp: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  locationFilter: string;
  onLocationFilterChange: (location: string) => void;
  onClearFilters: () => void;
  employees: Employee[];
}

/**
 * @description: Filter toolbar for allocations page with text search and category, employee, status, location dropdowns
 * @param search: Current search query
 * @param onSearchChange: Search change callback
 * @param assetCategory: Selected category filter
 * @param onAssetCategoryChange: Category filter callback
 * @param employeeFilter: Selected employee filter
 * @param onEmployeeFilterChange: Employee filter callback
 * @param statusFilter: Selected status filter
 * @param onStatusFilterChange: Status filter callback
 * @param locationFilter: Selected location filter
 * @param onLocationFilterChange: Location filter callback
 * @param onClearFilters: Clear all filters callback
 * @param employees: Array of available employee records
 * @return: Allocation filter controls component JSX
 */
export const AllocationFiltersBar: React.FC<AllocationFiltersBarProps> = ({
  search,
  onSearchChange,
  assetCategory,
  onAssetCategoryChange,
  employeeFilter,
  onEmployeeFilterChange,
  statusFilter,
  onStatusFilterChange,
  locationFilter,
  onLocationFilterChange,
  onClearFilters,
  employees,
}) => {
  const { t: translateAllocations } = useTranslation('allocation');
  const { t: translateAssets } = useTranslation('asset');

  const allLabel = translateAllocations('filters.all', {
    defaultValue: ALLOCATION_FILTERS_LABELS.ALL_OPTION,
  });

  const assetOptions = [
    { label: allLabel, value: ALLOCATION_FILTERS_LABELS.ALL_OPTION },
    ...ASSET_CATEGORIES.map((cat) => ({
      label: translateAssets(`categories.${cat}`, { defaultValue: cat }),
      value: cat,
    })),
  ];

  const employeeOptions = [
    { label: allLabel, value: ALLOCATION_FILTERS_LABELS.ALL_OPTION },
    ...Array.from(new Set(employees.map((e) => `${e.firstName} ${e.lastName}`.trim())))
      .filter(Boolean)
      .map((name) => ({ label: name, value: name })),
  ];

  const statusOptions = ALLOCATION_FILTER_STATUS_OPTIONS.map((opt) => ({
    label:
      opt.value === 'All'
        ? allLabel
        : translateAllocations(`statuses.${opt.value}`, { defaultValue: opt.label }),
    value: opt.value,
  }));

  const locationOptions = [
    { label: allLabel, value: ALLOCATION_FILTERS_LABELS.ALL_OPTION },
    ...ASSET_LOCATIONS.map((loc) => ({
      label: translateAssets(`locations.${loc}`, { defaultValue: loc }),
      value: loc,
    })),
  ];

  const hasFilters =
    search !== '' ||
    assetCategory !== ALLOCATION_FILTERS_LABELS.ALL_OPTION ||
    employeeFilter !== ALLOCATION_FILTERS_LABELS.ALL_OPTION ||
    statusFilter !== ALLOCATION_FILTERS_LABELS.ALL_OPTION ||
    locationFilter !== ALLOCATION_FILTERS_LABELS.ALL_OPTION;

  return (
    <div className="space-y-3.5 select-none">
      {/* Top Filter Selects Row with Clear Filters button */}
      <div className="flex flex-wrap items-end gap-3 sm:gap-4">
        {/* Asset Filter */}
        <FilterSelect
          label={translateAllocations('columns.asset', {
            defaultValue: ALLOCATION_FILTERS_LABELS.ASSET,
          })}
          icon={
            <Package className="size-3.5 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary" />
          }
          value={assetCategory}
          options={assetOptions}
          onChange={onAssetCategoryChange}
        />

        {/* Employee Filter */}
        <FilterSelect
          label={translateAllocations('columns.employee', {
            defaultValue: ALLOCATION_FILTERS_LABELS.EMPLOYEE,
          })}
          icon={
            <User className="size-3.5 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary" />
          }
          value={employeeFilter}
          options={employeeOptions}
          onChange={onEmployeeFilterChange}
        />

        {/* Status Filter */}
        <FilterSelect
          label={translateAllocations('filters.status', {
            defaultValue: ALLOCATION_FILTERS_LABELS.STATUS,
          })}
          icon={
            <Tag className="size-3.5 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary" />
          }
          value={statusFilter}
          options={statusOptions}
          onChange={onStatusFilterChange}
        />

        {/* Location Filter */}
        <FilterSelect
          label={translateAllocations('filters.location', {
            defaultValue: ALLOCATION_FILTERS_LABELS.LOCATION,
          })}
          icon={
            <MapPin className="size-3.5 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary" />
          }
          value={locationFilter}
          options={locationOptions}
          onChange={onLocationFilterChange}
        />

        {/* Clear Filters Link */}
        <div className="pb-1.5 shrink-0">
          <button
            type="button"
            onClick={onClearFilters}
            className={cn(
              'text-xs font-semibold transition-colors cursor-pointer',
              hasFilters
                ? 'text-primary hover:underline hover:text-primary/80'
                : 'text-slate-400 hover:text-slate-600',
            )}
          >
            {translateAllocations('filters.clearFilters', {
              defaultValue: ALLOCATION_FILTERS_LABELS.CLEAR_FILTERS,
            })}
          </button>
        </div>
      </div>

      {/* Bottom Full-Width Search Input */}
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <Search className="size-4" />
        </div>
        <Input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={translateAllocations('filters.searchPlaceholder', {
            defaultValue: ALLOCATION_FILTERS_LABELS.SEARCH_PLACEHOLDER,
          })}
          className="h-10 pl-9.5 pr-9 bg-slate-50/80 dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 rounded-xl shadow-2xs focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default AllocationFiltersBar;
