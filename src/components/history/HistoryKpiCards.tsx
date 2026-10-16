import React, { useMemo } from 'react';
import { History, Users, GitCommit, TrendingUp, Clock, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useActivityStore } from '@/store/useActivityStore';
import { HISTORY_KPI_CARDS_CONSTANTS } from './constants/HistoryKpiCards.constants';

/**
 * @description: Displays summary KPI cards for overall history actions, asset logs, employee logs, and allocation events
 * @return {JSX.element}: History KPI metrics grid component JSX
 */
export const HistoryKpiCards: React.FC = () => {
  const { t: translateHistory } = useTranslation('history');
  const activities = useActivityStore((s) => s.activities);

  const rateSuffix = translateHistory('kpi.rateSuffix', {
    defaultValue: HISTORY_KPI_CARDS_CONSTANTS.RATES.SUFFIX,
  });

  /**
   * @description: Calculates total history counts, category distributions, and proportion rates
   * @return {object}: KPI metrics calculations object
   */
  const kpi = useMemo(() => {
    const totalHistory = activities.length;
    const assetActions = activities.filter(
      (a) => a.category === HISTORY_KPI_CARDS_CONSTANTS.CATEGORIES.ASSET,
    ).length;
    const employeeActions = activities.filter(
      (a) => a.category === HISTORY_KPI_CARDS_CONSTANTS.CATEGORIES.EMPLOYEE,
    ).length;
    const allocationActions = activities.filter(
      (a) => a.category === HISTORY_KPI_CARDS_CONSTANTS.CATEGORIES.ALLOCATION,
    ).length;

    const assetRate =
      totalHistory > 0
        ? `${((assetActions / totalHistory) * 100).toFixed(1)}${rateSuffix}`
        : `0.0${rateSuffix}`;
    const empRate =
      totalHistory > 0
        ? `${((employeeActions / totalHistory) * 100).toFixed(1)}${rateSuffix}`
        : `0.0${rateSuffix}`;
    const allocRate =
      totalHistory > 0
        ? `${((allocationActions / totalHistory) * 100).toFixed(1)}${rateSuffix}`
        : `0.0${rateSuffix}`;

    return {
      totalHistory,
      totalHistoryGrowth: HISTORY_KPI_CARDS_CONSTANTS.CARDS.TOTAL.GROWTH,
      assetActions,
      assetActionsRate: assetRate,
      employeeActions,
      employeeActionsRate: empRate,
      allocationActions,
      allocationActionsRate: allocRate,
    };
  }, [activities, rateSuffix]);

  return (
    <div
      data-testid="history-kpi-cards"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full text-left"
    >
      {/* 1. Total History Card (Navy Dark Theme) */}
      <div
        className="relative overflow-hidden rounded-2xl p-5 sm:p-6 text-white transition-all duration-300 hover:shadow-xl group select-none border border-slate-800 flex flex-col justify-between"
        style={{ backgroundColor: HISTORY_KPI_CARDS_CONSTANTS.CARDS.TOTAL.BG_COLOR }}
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
                  {translateHistory('kpi.auditLogs', {
                    defaultValue: HISTORY_KPI_CARDS_CONSTANTS.CARDS.TOTAL.OVERLINE,
                  })}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  {translateHistory('kpi.totalHistory', {
                    defaultValue: HISTORY_KPI_CARDS_CONSTANTS.CARDS.TOTAL.TITLE,
                  })}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
              <TrendingUp className="size-3" />
              <span>
                {translateHistory('kpi.totalHistoryGrowth', {
                  defaultValue: kpi.totalHistoryGrowth,
                })}
              </span>
            </div>
          </div>

          <div className="pt-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {kpi.totalHistory.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
              <Clock className="size-3.5 text-blue-400" />
              <span>
                {translateHistory('kpi.totalHistoryDesc', {
                  defaultValue: HISTORY_KPI_CARDS_CONSTANTS.CARDS.TOTAL.DESCRIPTION,
                })}
              </span>
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
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <Package className="size-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
                {translateHistory('kpi.hardware', {
                  defaultValue: HISTORY_KPI_CARDS_CONSTANTS.CARDS.ASSET.OVERLINE,
                })}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
                {translateHistory('kpi.assetActions', {
                  defaultValue: HISTORY_KPI_CARDS_CONSTANTS.CARDS.ASSET.TITLE,
                })}
              </h3>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {kpi.assetActions.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="inline-flex items-center text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
              {kpi.assetActionsRate}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              {translateHistory('kpi.assetActionsDesc', {
                defaultValue: HISTORY_KPI_CARDS_CONSTANTS.CARDS.ASSET.DESCRIPTION,
              })}
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
                {translateHistory('kpi.staffTeams', {
                  defaultValue: HISTORY_KPI_CARDS_CONSTANTS.CARDS.EMPLOYEE.OVERLINE,
                })}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
                {translateHistory('kpi.employeeActions', {
                  defaultValue: HISTORY_KPI_CARDS_CONSTANTS.CARDS.EMPLOYEE.TITLE,
                })}
              </h3>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {kpi.employeeActions.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="inline-flex items-center text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-md">
              {kpi.employeeActionsRate}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              {translateHistory('kpi.employeeActionsDesc', {
                defaultValue: HISTORY_KPI_CARDS_CONSTANTS.CARDS.EMPLOYEE.DESCRIPTION,
              })}
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
                {translateHistory('kpi.assignments', {
                  defaultValue: HISTORY_KPI_CARDS_CONSTANTS.CARDS.ALLOCATION.OVERLINE,
                })}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
                {translateHistory('kpi.allocationActions', {
                  defaultValue: HISTORY_KPI_CARDS_CONSTANTS.CARDS.ALLOCATION.TITLE,
                })}
              </h3>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {kpi.allocationActions.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
              {kpi.allocationActionsRate}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              {translateHistory('kpi.allocationActionsDesc', {
                defaultValue: HISTORY_KPI_CARDS_CONSTANTS.CARDS.ALLOCATION.DESCRIPTION,
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryKpiCards;
