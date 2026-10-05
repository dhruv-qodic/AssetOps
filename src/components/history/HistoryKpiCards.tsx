import React from 'react';
import { History, Users, GitCommit, TrendingUp, Clock, Package } from 'lucide-react';
import { HISTORY_KPI_SUMMARY } from '@/mocks/seed/history';

export const HistoryKpiCards: React.FC = () => {
  return (
    <div
      data-testid="history-kpi-cards"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full text-left"
    >
      {/* 1. Total History Card (Navy Dark Theme) */}
      <div
        className="relative overflow-hidden rounded-2xl p-5 sm:p-6 text-white transition-all duration-300 hover:shadow-xl group select-none border border-slate-800 flex flex-col justify-between"
        style={{ backgroundColor: '#090f25' }}
        data-testid="history-kpi-total"
      >
        {/* Ambient Glow */}
        <div className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-blue-500/15 blur-3xl transition-all duration-500 group-hover:bg-blue-500/25" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 size-40 rounded-full bg-indigo-500/10 blur-2xl" />

        <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-slate-800/90 text-blue-400 border border-slate-700/60 shadow-xs">
                <History className="size-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
                  Audit Logs
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Total History
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
              <TrendingUp className="size-3" />
              <span>{HISTORY_KPI_SUMMARY.totalHistoryGrowth}</span>
            </div>
          </div>

          <div className="pt-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {HISTORY_KPI_SUMMARY.totalHistory.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
              <Clock className="size-3.5 text-blue-400" />
              <span>All recorded system events & changes</span>
            </p>
          </div>
        </div>
      </div>

      {/* 2. Asset Actions Card */}
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all relative overflow-hidden group flex flex-col justify-between"
        data-testid="history-kpi-asset"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Package className="size-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
                Hardware
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Asset Actions
              </h3>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {HISTORY_KPI_SUMMARY.assetActions.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="inline-flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
              {HISTORY_KPI_SUMMARY.assetActionsRate}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              Created, updated & retired
            </span>
          </div>
        </div>
      </div>

      {/* 3. Employee Actions Card */}
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all relative overflow-hidden group flex flex-col justify-between"
        data-testid="history-kpi-employee"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
              <Users className="size-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
                Staff & Teams
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Employee Actions
              </h3>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {HISTORY_KPI_SUMMARY.employeeActions.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="inline-flex items-center text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-md">
              {HISTORY_KPI_SUMMARY.employeeActionsRate}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              Onboard, transfer & update
            </span>
          </div>
        </div>
      </div>

      {/* 4. Allocation Actions Card */}
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all relative overflow-hidden group flex flex-col justify-between"
        data-testid="history-kpi-allocation"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <GitCommit className="size-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
                Assignments
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Allocation Actions
              </h3>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {HISTORY_KPI_SUMMARY.allocationActions.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
              {HISTORY_KPI_SUMMARY.allocationActionsRate}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              Assigned, returned & replaced
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryKpiCards;
