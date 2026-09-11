import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Check, Sparkles, FileSpreadsheet, Calendar, Building2 } from 'lucide-react';
import { EMPLOYEE_DEPARTMENTS } from '@/constans/employee.constants';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { cn } from '@/lib/utils';

// Reusable Filter Select Menu matching Assets section dropdown
interface FilterDropdownProps<T extends string> {
  id?: string;
  label: string;
  icon?: React.ReactNode;
  value: T;
  options: { label: string; value: T }[];
  onChange: (val: T) => void;
}

function FilterDropdown<T extends string>({
  id,
  label,
  icon,
  value,
  options,
  onChange,
}: FilterDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectId = id || `filter-${label.toLowerCase().replace(/\s+/g, '-')}`;

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
      <label
        htmlFor={selectId}
        className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
      >
        {icon}
        <span>{label}</span>
      </label>
      <div className="relative">
        <button
          id={selectId}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'w-full h-9.5 px-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-xs sm:text-sm font-normal text-slate-800 dark:text-slate-200 flex items-center justify-between shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#4C40F7]/20 focus:border-[#4C40F7]',
            isOpen && 'ring-2 ring-[#4C40F7]/20 border-[#4C40F7]',
          )}
        >
          <span className="truncate">{currentLabel}</span>
          <ChevronDown
            className={cn(
              'size-4 text-slate-400 shrink-0 ml-1.5 transition-transform duration-200',
              isOpen && 'rotate-180 text-[#4C40F7]',
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
                      : 'text-slate-700 dark:text-slate-300',
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

interface ReportsFilterBarProps {
  reportType: string;
  setReportType: (value: string) => void;
  timeRange: string;
  setTimeRange: (value: string) => void;
  department: string;
  setDepartment: (value: string) => void;
  onGenerateReport: () => void;
}

const REPORT_TYPE_OPTIONS = [
  { label: 'Asset Overview', value: 'Asset Overview' },
  { label: 'Allocation Report', value: 'Allocation Report' },
  { label: 'Maintenance Report', value: 'Maintenance Report' },
  { label: 'Department Summary', value: 'Department Summary' },
  { label: 'Lifecycle Report', value: 'Lifecycle Report' },
];

const TIME_RANGE_OPTIONS = [
  { label: 'Last 30 Days', value: 'Last 30 Days' },
  { label: 'Last 7 Days', value: 'Last 7 Days' },
  { label: 'Last 90 Days', value: 'Last 90 Days' },
  { label: 'Year to Date', value: 'Year to Date' },
  { label: 'All Time', value: 'All Time' },
];

export const ReportsFilterBar: React.FC<ReportsFilterBarProps> = ({
  reportType,
  setReportType,
  timeRange,
  setTimeRange,
  department,
  setDepartment,
  onGenerateReport,
}) => {
  const { employees } = useEmployeeStore();

  // Dynamically resolve all active departments from employee store + constants
  const departmentOptions = useMemo(() => {
    const set = new Set<string>(EMPLOYEE_DEPARTMENTS);
    employees.forEach((emp) => {
      if (emp.department) set.add(emp.department);
    });
    return ['All', ...Array.from(set).sort()].map((dept) => ({ label: dept, value: dept }));
  }, [employees]);

  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 bg-white/50 dark:bg-slate-900/40 p-4 rounded-2xl">
      {/* Filters Group */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 flex-1 max-w-3xl">
        {/* Report Type */}
        <FilterDropdown
          id="report-type"
          label="Report Type"
          icon={<FileSpreadsheet className="size-3.5 text-slate-400 dark:text-slate-500" />}
          value={reportType}
          options={REPORT_TYPE_OPTIONS}
          onChange={setReportType}
        />

        {/* Time Range */}
        <FilterDropdown
          id="time-range"
          label="Time Range"
          icon={<Calendar className="size-3.5 text-slate-400 dark:text-slate-500" />}
          value={timeRange}
          options={TIME_RANGE_OPTIONS}
          onChange={setTimeRange}
        />

        {/* Department */}
        <FilterDropdown
          id="department"
          label="Department"
          icon={<Building2 className="size-3.5 text-slate-400 dark:text-slate-500" />}
          value={department}
          options={departmentOptions}
          onChange={setDepartment}
        />
      </div>

      {/* Generate Report Action Button */}
      <div className="self-stretch sm:self-auto flex items-end">
        <button
          type="button"
          onClick={onGenerateReport}
          className="w-full sm:w-auto h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
        >
          <Sparkles className="size-4" />
          <span>Generate Report</span>
        </button>
      </div>
    </div>
  );
};

export default ReportsFilterBar;
