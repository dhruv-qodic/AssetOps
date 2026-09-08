import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ASSET_CATEGORIES, ASSET_LOCATIONS } from '@/constans/asset.constants';
import { cn } from '@/lib/utils';
import type { Employee } from '@/types/employee';

interface FilterSelectProps {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (val: string) => void;
}

function FilterSelect({ label, value, options, onChange }: FilterSelectProps) {
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
    <div className="flex-1 min-w-[120px] sm:min-w-[140px] space-y-1 text-left" ref={dropdownRef}>
      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'w-full h-9 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-xs sm:text-sm font-normal text-slate-800 dark:text-slate-200 flex items-center justify-between shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#4C40F7]/20 focus:border-[#4C40F7]',
            isOpen && 'border-[#4C40F7] ring-2 ring-[#4C40F7]/20'
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
          <div className="absolute left-0 top-full mt-1.5 w-full min-w-[160px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-56 overflow-y-auto">
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
                      ? 'font-semibold text-[#4C40F7] bg-indigo-50/60 dark:bg-indigo-950/40'
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
  const assetOptions = [
    { label: 'All', value: 'All' },
    ...ASSET_CATEGORIES.map((cat) => ({ label: cat, value: cat })),
  ];

  const employeeOptions = [
    { label: 'All', value: 'All' },
    ...Array.from(new Set(employees.map((e) => `${e.firstName} ${e.lastName}`.trim())))
      .filter(Boolean)
      .map((name) => ({ label: name, value: name })),
  ];

  const statusOptions = [
    { label: 'All', value: 'All' },
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' },
    { label: 'Returned', value: 'Returned' },
    { label: 'Maintenance', value: 'Maintenance' },
    { label: 'Terminated', value: 'Terminated' },
  ];

  const locationOptions = [
    { label: 'All', value: 'All' },
    ...ASSET_LOCATIONS.map((loc) => ({ label: loc, value: loc })),
  ];

  const hasFilters =
    search !== '' ||
    assetCategory !== 'All' ||
    employeeFilter !== 'All' ||
    statusFilter !== 'All' ||
    locationFilter !== 'All';

  return (
    <div className="space-y-3.5 select-none">
      {/* Top Filter Selects Row with Clear Filters button */}
      <div className="flex flex-wrap items-end gap-3 sm:gap-4">
        {/* Asset Filter */}
        <FilterSelect
          label="Asset"
          value={assetCategory}
          options={assetOptions}
          onChange={onAssetCategoryChange}
        />

        {/* Employee Filter */}
        <FilterSelect
          label="Employee"
          value={employeeFilter}
          options={employeeOptions}
          onChange={onEmployeeFilterChange}
        />

        {/* Status Filter */}
        <FilterSelect
          label="Status"
          value={statusFilter}
          options={statusOptions}
          onChange={onStatusFilterChange}
        />

        {/* Location Filter */}
        <FilterSelect
          label="Location"
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
                ? 'text-[#4C40F7] hover:underline hover:text-[#3D31E5]'
                : 'text-slate-400 hover:text-slate-600'
            )}
          >
            Clear Filters
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
          placeholder="Search by asset, employee, or department..."
          className="h-10 pl-9.5 pr-9 bg-slate-50/80 dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 rounded-xl shadow-2xs focus-visible:ring-2 focus-visible:ring-[#4C40F7]/20 focus-visible:border-[#4C40F7]"
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
