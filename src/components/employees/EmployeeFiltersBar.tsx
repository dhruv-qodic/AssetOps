import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  Check,
  X,
  Building2,
  Activity,
  UserCheck,
  ArrowUpDown,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import {
  EMPLOYEE_DEPARTMENTS,
  EMPLOYEE_STATUS_OPTIONS,
  EMPLOYEE_TYPE_OPTIONS,
  EMPLOYEE_SORT_OPTIONS,
} from '@/constans/employee.constants';
import type { EmployeeStatus, EmployeeType, EmployeeSortOption } from '@/types/employee';
import { cn } from '@/lib/utils';

// Reusable Filter Select Dropdown
interface FilterDropdownProps<T extends string> {
  label: string;
  icon?: React.ReactNode;
  value: T;
  options: { label: string; value: T }[];
  onChange: (val: T) => void;
}

function FilterDropdown<T extends string>({
  label,
  icon,
  value,
  options,
  onChange,
}: FilterDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const currentLabel = options.find((opt) => opt.value === value)?.label || value;

  return (
    <div className="flex-1 min-w-[130px] sm:min-w-[160px] space-y-1 text-left" ref={dropdownRef}>
      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
        {icon}
        <span>{label}</span>
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'w-full h-9.5 px-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-xs sm:text-sm font-normal text-slate-800 dark:text-slate-200 flex items-center justify-between shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#4C40F7]/20 focus:border-[#4C40F7]',
            isOpen && 'ring-2 ring-[#4C40F7]/20 border-[#4C40F7]'
          )}
        >
          <span className="truncate">{currentLabel}</span>
          <ChevronDown
            className={cn(
              'size-4 text-slate-400 shrink-0 ml-1.5 transition-transform duration-200',
              isOpen && 'rotate-180 text-[#4C40F7]'
            )}
          />
        </button>

        {isOpen && (
          <div className="absolute left-0 top-full mt-1.5 w-full min-w-[170px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-60 overflow-y-auto">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full px-3 py-2 text-xs sm:text-sm flex items-center justify-between text-left transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800',
                    isSelected
                      ? 'font-semibold text-[#4C40F7] bg-indigo-50/50 dark:bg-indigo-950/40'
                      : 'text-slate-700 dark:text-slate-300'
                  )}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <Check className="size-3.5 text-[#4C40F7] shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export const EmployeeFiltersBar: React.FC = () => {
  const {
    filters,
    setSearch,
    setDepartment,
    setStatus,
    setType,
    setSortBy,
    resetFilters,
  } = useEmployeeStore();

  const departmentOptions = [
    { label: 'All', value: 'All' },
    ...EMPLOYEE_DEPARTMENTS.map((dept) => ({ label: dept, value: dept })),
  ];

  const statusOptions = [
    { label: 'All', value: 'All' as EmployeeStatus | 'All' },
    ...EMPLOYEE_STATUS_OPTIONS.map((opt) => ({ label: opt.label, value: opt.value as EmployeeStatus | 'All' })),
  ];

  const typeOptions = [
    { label: 'All', value: 'All' as EmployeeType | 'All' },
    ...EMPLOYEE_TYPE_OPTIONS.map((opt) => ({ label: opt.label, value: opt.value as EmployeeType | 'All' })),
  ];

  const hasActiveFilters =
    filters.search !== '' ||
    filters.department !== 'All' ||
    filters.status !== 'All' ||
    filters.type !== 'All' ||
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
          placeholder="Search employees by name, email, department..."
          className="h-11 pl-10.5 pr-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 rounded-md shadow-2xs focus-visible:ring-2 focus-visible:ring-[#4C40F7]/20 focus-visible:border-[#4C40F7]"
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
          label="Department"
          icon={<Building2 className="size-3.5 text-slate-400 dark:text-slate-500" />}
          value={filters.department}
          options={departmentOptions}
          onChange={(val) => setDepartment(val)}
        />

        {/* Status Filter */}
        <FilterDropdown
          label="Status"
          icon={<Activity className="size-3.5 text-slate-400 dark:text-slate-500" />}
          value={filters.status}
          options={statusOptions}
          onChange={(val) => setStatus(val as EmployeeStatus | 'All')}
        />

        {/* Employment Type Filter */}
        <FilterDropdown
          label="Type"
          icon={<UserCheck className="size-3.5 text-slate-400 dark:text-slate-500" />}
          value={filters.type || 'All'}
          options={typeOptions}
          onChange={(val) => setType(val as EmployeeType | 'All')}
        />

        {/* Sort Filter */}
        <FilterDropdown
          label="Sort"
          icon={<ArrowUpDown className="size-3.5 text-slate-400 dark:text-slate-500" />}
          value={filters.sortBy}
          options={EMPLOYEE_SORT_OPTIONS}
          onChange={(val) => setSortBy(val as EmployeeSortOption)}
        />
      </div>

      {/* Active Filter Chips / Reset */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 pt-1">
          <span className="text-[11px] text-slate-500 font-medium">Active filters:</span>
          <button
            type="button"
            onClick={resetFilters}
            className="text-[11px] text-[#4C40F7] hover:underline font-medium cursor-pointer"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default EmployeeFiltersBar;
