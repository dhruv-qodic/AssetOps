import React, { useMemo } from 'react';
import { Sparkles, FileSpreadsheet, Calendar, Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { EMPLOYEE_DEPARTMENTS } from '@/constant/employee.constants';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { Select } from '@/components/ui/select';
import { REPORTS_FILTER_BAR_CONSTANTS } from './constants/ReportsFilterBar.constants';

// Reusable Filter Select Menu matching Assets section dropdown
interface FilterDropdownProps<T extends string> {
  id?: string;
  label: string;
  icon?: React.ReactNode;
  value: T;
  options: readonly { label: string; value: T }[];
  onChange: (val: T) => void;
}

/**
 * @description: Reusable filter dropdown component for report controls delegating to UI Select
 */
function FilterDropdown<T extends string>({
  id,
  label,
  icon,
  value,
  options,
  onChange,
}: FilterDropdownProps<T>) {
  const selectId = id || `filter-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="flex-1 min-w-[130px] sm:min-w-[160px] space-y-1 text-left">
      <label
        htmlFor={selectId}
        className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
      >
        {icon}
        <span>{label}</span>
      </label>
      <Select
        id={selectId}
        value={value}
        onValueChange={(val) => onChange(val as T)}
        options={options as unknown as { label: string; value: string }[]}
      />
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

/**
 * @description: Configuration toolbar for reports page with selectors for report type, time window, department, and generate trigger
 * @param {string}reportType: Active report type
 * @param {function(string): void}setReportType: Setter for report type
 * @param {string}timeRange: Active timeframe
 * @param {function(string): void}setTimeRange: Setter for timeframe
 * @param {string}department: Active department
 * @param {function(string): void}setDepartment: Setter for department
 * @param onGenerateReport: Callback to open report generation modal
 * @return : Reports filter bar component JSX
 */
export const ReportsFilterBar: React.FC<ReportsFilterBarProps> = ({
  reportType,
  setReportType,
  timeRange,
  setTimeRange,
  department,
  setDepartment,
  onGenerateReport,
}) => {
  const { t: translateReports } = useTranslation('report');
  const { t: translateEmployees } = useTranslation('employee');
  const { employees } = useEmployeeStore();

  const reportTypeOptions = useMemo(
    () => [
      {
        label: translateReports('types.assetOverview', { defaultValue: 'Asset Overview' }),
        value: 'Asset Overview',
      },
      {
        label: translateReports('types.allocationReport', {
          defaultValue: 'Allocation Report',
        }),
        value: 'Allocation Report',
      },
      {
        label: translateReports('types.maintenanceReport', {
          defaultValue: 'Maintenance Report',
        }),
        value: 'Maintenance Report',
      },
      {
        label: translateReports('types.departmentSummary', {
          defaultValue: 'Department Summary',
        }),
        value: 'Department Summary',
      },
      {
        label: translateReports('types.lifecycleReport', { defaultValue: 'Lifecycle Report' }),
        value: 'Lifecycle Report',
      },
    ],
    [translateReports],
  );

  const timeRangeOptions = useMemo(
    () => [
      {
        label: translateReports('timeRanges.last30Days', { defaultValue: 'Last 30 Days' }),
        value: 'Last 30 Days',
      },
      {
        label: translateReports('timeRanges.last7Days', { defaultValue: 'Last 7 Days' }),
        value: 'Last 7 Days',
      },
      {
        label: translateReports('timeRanges.last90Days', { defaultValue: 'Last 90 Days' }),
        value: 'Last 90 Days',
      },
      {
        label: translateReports('timeRanges.yearToDate', { defaultValue: 'Year to Date' }),
        value: 'Year to Date',
      },
      {
        label: translateReports('timeRanges.allTime', { defaultValue: 'All Time' }),
        value: 'All Time',
      },
    ],
    [translateReports],
  );

  // Dynamically resolve all active departments from employee store + constants
  const departmentOptions = useMemo(() => {
    const set = new Set<string>(EMPLOYEE_DEPARTMENTS);
    employees.forEach((emp) => {
      if (emp.department) set.add(emp.department);
    });
    return [
      {
        label: translateReports('filters.all', {
          defaultValue: REPORTS_FILTER_BAR_CONSTANTS.LABELS.ALL_DEPARTMENT,
        }),
        value: REPORTS_FILTER_BAR_CONSTANTS.LABELS.ALL_DEPARTMENT,
      },
      ...Array.from(set)
        .sort()
        .map((dept) => ({
          label: translateEmployees(`departments.${dept}`, { defaultValue: dept }),
          value: dept,
        })),
    ];
  }, [employees, translateReports, translateEmployees]);

  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 bg-white/50 dark:bg-slate-900/40 p-4 rounded-2xl">
      {/* Filters Group */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 flex-1 max-w-3xl">
        {/* Report Type */}
        <FilterDropdown
          id={REPORTS_FILTER_BAR_CONSTANTS.IDS.REPORT_TYPE}
          label={translateReports('filters.reportType', {
            defaultValue: REPORTS_FILTER_BAR_CONSTANTS.LABELS.REPORT_TYPE,
          })}
          icon={<FileSpreadsheet className="size-3.5 text-slate-400 dark:text-slate-500" />}
          value={reportType}
          options={reportTypeOptions}
          onChange={setReportType}
        />

        {/* Time Range */}
        <FilterDropdown
          id={REPORTS_FILTER_BAR_CONSTANTS.IDS.TIME_RANGE}
          label={translateReports('filters.timeRange', {
            defaultValue: REPORTS_FILTER_BAR_CONSTANTS.LABELS.TIME_RANGE,
          })}
          icon={<Calendar className="size-3.5 text-slate-400 dark:text-slate-500" />}
          value={timeRange}
          options={timeRangeOptions}
          onChange={setTimeRange}
        />

        {/* Department */}
        <FilterDropdown
          id={REPORTS_FILTER_BAR_CONSTANTS.IDS.DEPARTMENT}
          label={translateReports('filters.department', {
            defaultValue: REPORTS_FILTER_BAR_CONSTANTS.LABELS.DEPARTMENT,
          })}
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
          className="w-full sm:w-auto h-11 px-5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs sm:text-sm shadow-md shadow-primary/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
        >
          <Sparkles className="size-4" />
          <span>
            {translateReports('generateReport', {
              defaultValue: REPORTS_FILTER_BAR_CONSTANTS.LABELS.GENERATE_REPORT,
            })}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ReportsFilterBar;
