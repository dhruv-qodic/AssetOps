import React from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';

interface ReportsFilterBarProps {
  reportType: string;
  setReportType: (value: string) => void;
  timeRange: string;
  setTimeRange: (value: string) => void;
  department: string;
  setDepartment: (value: string) => void;
  onGenerateReport: () => void;
}

export const ReportsFilterBar: React.FC<ReportsFilterBarProps> = ({
  reportType,
  setReportType,
  timeRange,
  setTimeRange,
  department,
  setDepartment,
  onGenerateReport,
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 bg-white/50 dark:bg-slate-900/40 p-1 rounded-2xl">
      {/* Filters Group */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 flex-1 max-w-3xl">
        {/* Report Type */}
        <div className="space-y-1.5">
          <label
            htmlFor="report-type"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            Report Type
          </label>
          <div className="relative">
            <select
              id="report-type"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full h-11 pl-3.5 pr-9 text-xs sm:text-sm font-medium bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl appearance-none text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4C40F7]/20 focus:border-[#4C40F7] shadow-2xs cursor-pointer transition-colors"
            >
              <option value="Asset Overview">Asset Overview</option>
              <option value="Allocation Report">Allocation Report</option>
              <option value="Maintenance Report">Maintenance Report</option>
              <option value="Department Summary">Department Summary</option>
              <option value="Lifecycle Report">Lifecycle Report</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Time Range */}
        <div className="space-y-1.5">
          <label
            htmlFor="time-range"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            Time Range
          </label>
          <div className="relative">
            <select
              id="time-range"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full h-11 pl-3.5 pr-9 text-xs sm:text-sm font-medium bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl appearance-none text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4C40F7]/20 focus:border-[#4C40F7] shadow-2xs cursor-pointer transition-colors"
            >
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 90 Days">Last 90 Days</option>
              <option value="Year to Date">Year to Date</option>
              <option value="All Time">All Time</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Department */}
        <div className="space-y-1.5">
          <label
            htmlFor="department"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            Department
          </label>
          <div className="relative">
            <select
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full h-11 pl-3.5 pr-9 text-xs sm:text-sm font-medium bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl appearance-none text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4C40F7]/20 focus:border-[#4C40F7] shadow-2xs cursor-pointer transition-colors"
            >
              <option value="All">All</option>
              <option value="IT">IT</option>
              <option value="Operations">Operations</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
              <option value="HR">HR</option>
              <option value="Engineering">Engineering</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Generate Report Action Button */}
      <div className="self-stretch sm:self-auto flex items-end">
        <button
          type="button"
          onClick={onGenerateReport}
          className="w-full sm:w-auto h-11 px-5 rounded-xl bg-[#4C40F7] hover:bg-[#3f34e3] text-white font-medium text-xs sm:text-sm shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
        >
          <Sparkles className="size-4" />
          <span>Generate Report</span>
        </button>
      </div>
    </div>
  );
};

export default ReportsFilterBar;
