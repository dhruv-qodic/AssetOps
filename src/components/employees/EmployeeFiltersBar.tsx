import React from 'react';
import { Search, X, Building2, Activity, UserCheck, ArrowUpDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useEmployeeStore } from '@/store/useEmployeeStore';
// Reusable Filter Select Dropdown
interface FilterDropdownProps<T extends string> {
  label: string;
  icon?: React.ReactNode;
  value: T;
  options: { label: string; value: T }[];
  onChange: (val: T) => void;
}

/**
 * @description: Dropdown selector for employee filters delegating to UI Select.
 */
function FilterDropdown<T extends string>({
  label,
  icon,
  value,
  options,
  onChange,
}: FilterDropdownProps<T>) {
  return (
    <div className="flex-1 min-w-[130px] sm:min-w-[160px] space-y-1 text-left">
      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
        {icon}
        <span>{label}</span>
      </label>
      <Select value={value} onValueChange={(val) => onChange(val as T)} options={options} />
    </div>
  );
}

import {
  EMPLOYEE_FILTERS_PLACEHOLDERS,
  EMPLOYEE_FILTERS_LABELS,
} from './constants/EmployeeFiltersBar.constants';
import {
  EMPLOYEE_DEPARTMENTS,
  EMPLOYEE_STATUS_OPTIONS,
  EMPLOYEE_TYPE_OPTIONS,
  EMPLOYEE_SORT_OPTIONS,
} from '@/constant/employee.constants';

/**
 * @description: Filter toolbar for employees table containing search input, department/status/type dropdowns, and sorting
 * @returns {JSX.Element} Employee filters bar component JSX
 */
export const EmployeeFiltersBar: React.FC = () => {
  const { t: translateEmployees } = useTranslation('employee');
  const filters = useEmployeeStore((s) => s.filters);
  const setSearch = useEmployeeStore((s) => s.setSearch);
  const setDepartment = useEmployeeStore((s) => s.setDepartment);
  const setStatus = useEmployeeStore((s) => s.setStatus);
  const setType = useEmployeeStore((s) => s.setType);
  const setSortBy = useEmployeeStore((s) => s.setSortBy);
  const resetFilters = useEmployeeStore((s) => s.resetFilters);

  const allLabel = translateEmployees('filters.all', {
    defaultValue: EMPLOYEE_FILTERS_LABELS.ALL,
  });

  const departmentOptions = [
    { label: allLabel, value: EMPLOYEE_FILTERS_LABELS.ALL },
    ...EMPLOYEE_DEPARTMENTS.map((dept) => ({
      label: translateEmployees(`departments.${dept}`, { defaultValue: dept }),
      value: dept,
    })),
  ];

  const statusOptions = [
    { label: allLabel, value: EMPLOYEE_FILTERS_LABELS.ALL },
    ...EMPLOYEE_STATUS_OPTIONS.map((st) => ({
      label: translateEmployees(`statuses.${st.value}`, { defaultValue: st.label }),
      value: st.value,
    })),
  ];

  const typeOptions = [
    { label: allLabel, value: EMPLOYEE_FILTERS_LABELS.ALL },
    ...EMPLOYEE_TYPE_OPTIONS.map((tp) => ({
      label: translateEmployees(`types.${tp.value === 'full-time' ? 'fullTime' : tp.value}`, {
        defaultValue: tp.label,
      }),
      value: tp.value,
    })),
  ];

  const sortKeyMap: Record<string, string> = {
    recently_added: 'recentlyAdded',
    name_asc: 'nameAsc',
    name_desc: 'nameDesc',
    employee_id_asc: 'employeeIdAsc',
    employee_id_desc: 'employeeIdDesc',
    date_created_desc: 'dateCreatedDesc',
  };

  const sortOptions = EMPLOYEE_SORT_OPTIONS.map((opt) => ({
    label: translateEmployees(`sort.${sortKeyMap[opt.value] || opt.value}`, {
      defaultValue: opt.label,
    }),
    value: opt.value,
  }));

  const hasActiveFilters =
    filters.search !== '' ||
    filters.department !== EMPLOYEE_FILTERS_LABELS.ALL ||
    filters.status !== EMPLOYEE_FILTERS_LABELS.ALL ||
    filters.type !== EMPLOYEE_FILTERS_LABELS.ALL ||
    filters.sortBy !== 'recently_added';

  return (
    <div className="space-y-3.5 select-none">
      {/* Search Bar Input */}
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <Search className="size-4.5" />
        </div>
        <Input
          type="text"
          value={filters.search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={translateEmployees('searchPlaceholder', {
            defaultValue: EMPLOYEE_FILTERS_PLACEHOLDERS.SEARCH,
          })}
          className="h-11 pl-10.5 pr-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 rounded-md shadow-2xs focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary"
        />
        {filters.search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Filter Dropdowns Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 items-end">
        {/* Department Filter */}
        <FilterDropdown
          label={translateEmployees('filters.department', {
            defaultValue: EMPLOYEE_FILTERS_LABELS.DEPARTMENT,
          })}
          icon={<Building2 className="size-3.5 text-slate-400 dark:text-slate-500" />}
          value={filters.department}
          options={departmentOptions}
          onChange={(val) => setDepartment(val)}
        />

        {/* Status Filter */}
        <FilterDropdown
          label={translateEmployees('filters.status', {
            defaultValue: EMPLOYEE_FILTERS_LABELS.STATUS,
          })}
          icon={<Activity className="size-3.5 text-slate-400 dark:text-slate-500" />}
          value={filters.status}
          options={statusOptions}
          onChange={(val) => setStatus(val)}
        />

        {/* Employment Type Filter */}
        <FilterDropdown
          label={translateEmployees('filters.type', {
            defaultValue: EMPLOYEE_FILTERS_LABELS.TYPE,
          })}
          icon={<UserCheck className="size-3.5 text-slate-400 dark:text-slate-500" />}
          value={filters.type || EMPLOYEE_FILTERS_LABELS.ALL}
          options={typeOptions}
          onChange={(val) => setType(val)}
        />

        {/* Sort Filter */}
        <FilterDropdown
          label={translateEmployees('sort.label', {
            defaultValue: EMPLOYEE_FILTERS_LABELS.SORT,
          })}
          icon={<ArrowUpDown className="size-3.5 text-slate-400 dark:text-slate-500" />}
          value={filters.sortBy}
          options={sortOptions}
          onChange={(val) => setSortBy(val)}
        />
      </div>

      {/* Active Filter Chips / Reset */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 pt-1">
          <span className="text-[11px] text-slate-500 font-medium">
            {translateEmployees('filters.activeFilters', {
              defaultValue: EMPLOYEE_FILTERS_LABELS.ACTIVE_FILTERS,
            })}
          </span>
          <button
            type="button"
            onClick={resetFilters}
            className="text-[11px] text-primary hover:underline font-medium cursor-pointer"
          >
            {translateEmployees('filters.clearAll', {
              defaultValue: EMPLOYEE_FILTERS_LABELS.CLEAR_ALL,
            })}
          </button>
        </div>
      )}
    </div>
  );
};

export default EmployeeFiltersBar;
