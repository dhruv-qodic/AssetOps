import React, { useMemo } from 'react';
import {
  ArrowUpRight,
  ArrowDownRight,
  Package,
  UserCheck,
  CheckCircle2,
  Wrench,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAssetStore } from '@/store/useAssetStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { getAssetDepartment } from '@/utils/assetDepartment';
import { REPORTS_KPI_CARDS_CONSTANTS } from './constants/ReportsKpiCards.constants';

interface ReportsKpiCardsProps {
  departmentFilter?: string;
  timeRange?: string;
  reportType?: string;
}

/**
 * @description: Displays top-level report KPI metrics (total, allocated, available, maintenance) with comparative deltas
 * @param {string}departmentFilter: Optional department filter
 * @param {string}timeRange: Optional timeframe filter
 * @param {string}reportType: Optional report type identifier
 * @returns {JSX.Element} Report KPI cards component JSX
 */
export const ReportsKpiCards: React.FC<ReportsKpiCardsProps> = ({
  departmentFilter = REPORTS_KPI_CARDS_CONSTANTS.DEFAULTS.DEPARTMENT,
  timeRange = REPORTS_KPI_CARDS_CONSTANTS.DEFAULTS.TIME_RANGE,
  reportType = REPORTS_KPI_CARDS_CONSTANTS.DEFAULTS.REPORT_TYPE,
}) => {
  const { t: translateReports } = useTranslation('report');
  const { t: translateAssets } = useTranslation('asset');

  const assets = useAssetStore((s) => s.assets);
  const employees = useEmployeeStore((s) => s.employees);

  /**
   * @description: Filters asset records according to canonical department resolution
   * @return {Asset[]}: Filtered asset items array
   */
  const departmentFilteredAssets = useMemo(() => {
    if (departmentFilter === REPORTS_KPI_CARDS_CONSTANTS.DEFAULTS.DEPARTMENT) return assets;
    return assets.filter((asset) => {
      const dept = getAssetDepartment(asset, employees);
      return dept.toLowerCase() === departmentFilter.toLowerCase();
    });
  }, [assets, employees, departmentFilter]);

  // Calculate live counts directly from Zustand store
  const liveTotal = departmentFilteredAssets.length;
  const liveAllocated = departmentFilteredAssets.filter((a) => a.status === 'Allocated').length;
  const liveAvailable = departmentFilteredAssets.filter((a) => a.status === 'Available').length;
  const liveMaintenance = departmentFilteredAssets.filter((a) => a.status === 'Maintenance').length;

  // Real-time actual data strictly based on assets available in the system
  const totalCount = liveTotal;
  const allocatedCount = liveAllocated;
  const availableCount = liveAvailable;
  const maintenanceCount = liveMaintenance;

  /**
   * @description: Resolves comparative delta text based on the selected time window
   * @return {string}: Comparative suffix label string
   */
  const getTimeDeltaLabel = () => {
    switch (timeRange) {
      case REPORTS_KPI_CARDS_CONSTANTS.TIME_RANGES.LAST_7_DAYS:
        return translateReports('kpi.vsLastWeek', {
          defaultValue: REPORTS_KPI_CARDS_CONSTANTS.TIME_DELTAS.VS_LAST_WEEK,
        });
      case REPORTS_KPI_CARDS_CONSTANTS.TIME_RANGES.LAST_90_DAYS:
        return translateReports('kpi.vsLastQuarter', {
          defaultValue: REPORTS_KPI_CARDS_CONSTANTS.TIME_DELTAS.VS_LAST_QUARTER,
        });
      case REPORTS_KPI_CARDS_CONSTANTS.TIME_RANGES.YEAR_TO_DATE:
      case REPORTS_KPI_CARDS_CONSTANTS.TIME_RANGES.ALL_TIME:
        return translateReports('kpi.vsLastYear', {
          defaultValue: REPORTS_KPI_CARDS_CONSTANTS.TIME_DELTAS.VS_LAST_YEAR,
        });
      default:
        return translateReports('kpi.vsLastMonth', {
          defaultValue: REPORTS_KPI_CARDS_CONSTANTS.TIME_DELTAS.VS_LAST_MONTH,
        });
    }
  };

  const deltaPeriod = getTimeDeltaLabel();

  const kpis = [
    {
      title: translateAssets('kpi.totalAssets', {
        defaultValue: REPORTS_KPI_CARDS_CONSTANTS.TITLES.TOTAL_ASSETS,
      }),
      value: totalCount.toLocaleString(),
      change: `12% ${deltaPeriod}`,
      isPositive: true,
      icon: Package,
      iconBg: 'bg-primary/10 text-primary',
      borderColor: 'border-primary/30 dark:border-primary/30',
    },
    {
      title: translateAssets('statuses.Allocated', {
        defaultValue: REPORTS_KPI_CARDS_CONSTANTS.TITLES.ALLOCATED,
      }),
      value: allocatedCount.toLocaleString(),
      change: `8% ${deltaPeriod}`,
      isPositive: true,
      icon: UserCheck,
      iconBg: 'bg-primary/10 text-primary',
      borderColor: 'border-slate-200/80 dark:border-slate-800',
    },
    {
      title: translateAssets('statuses.Available', {
        defaultValue: REPORTS_KPI_CARDS_CONSTANTS.TITLES.AVAILABLE,
      }),
      value: availableCount.toLocaleString(),
      change: `4% ${deltaPeriod}`,
      isPositive: false,
      icon: CheckCircle2,
      iconBg: 'bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400',
      borderColor: 'border-slate-200/80 dark:border-slate-800',
    },
    {
      title: translateAssets('statuses.Maintenance', {
        defaultValue: REPORTS_KPI_CARDS_CONSTANTS.TITLES.MAINTENANCE,
      }),
      value: maintenanceCount.toLocaleString(),
      change: `6% ${deltaPeriod}`,
      isPositive: true,
      icon: Wrench,
      iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
      borderColor: 'border-slate-200/80 dark:border-slate-800',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.title}
            className={`bg-white dark:bg-slate-900 rounded-2xl border ${kpi.borderColor} p-5 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group`}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                {kpi.title}
              </p>
              <div
                className={`p-2.5 rounded-xl ${kpi.iconBg} transition-transform group-hover:scale-110 duration-200`}
              >
                <Icon className="size-4.5" />
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2">
              {kpi.value}
            </h3>

            <div className="flex items-center gap-1.5 mt-2.5">
              {kpi.isPositive ? (
                <span className="flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <ArrowUpRight className="size-3.5 stroke-[2.5]" />
                  <span>{kpi.change}</span>
                </span>
              ) : (
                <span className="flex items-center text-xs font-semibold text-rose-500 dark:text-rose-400">
                  <ArrowDownRight className="size-3.5 stroke-[2.5]" />
                  <span>{kpi.change}</span>
                </span>
              )}
              {reportType !== REPORTS_KPI_CARDS_CONSTANTS.DEFAULTS.REPORT_TYPE && (
                <span className="text-[10px] text-slate-400 font-normal ml-auto">
                  {reportType.split(' ')[0]}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReportsKpiCards;
