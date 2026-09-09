import React, { useMemo } from 'react';
import { ArrowUpRight, ArrowDownRight, Package, UserCheck, CheckCircle2, Wrench } from 'lucide-react';
import { useAssetStore } from '@/store/useAssetStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { getAssetDepartment } from '@/utils/assetDepartment';

interface ReportsKpiCardsProps {
  departmentFilter?: string;
  timeRange?: string;
  reportType?: string;
}

export const ReportsKpiCards: React.FC<ReportsKpiCardsProps> = ({
  departmentFilter = 'All',
  timeRange = 'Last 30 Days',
  reportType = 'Asset Overview',
}) => {
  const { assets } = useAssetStore();
  const { employees } = useEmployeeStore();

  // Dynamically filter assets matching department using the canonical resolution helper
  const departmentFilteredAssets = useMemo(() => {
    if (departmentFilter === 'All') return assets;
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

  // Time range adjustments for delta comparison
  const getTimeDeltaLabel = () => {
    switch (timeRange) {
      case 'Last 7 Days':
        return 'vs. last week';
      case 'Last 90 Days':
        return 'vs. last quarter';
      case 'Year to Date':
      case 'All Time':
        return 'vs. last year';
      default:
        return 'vs. last month';
    }
  };

  const deltaPeriod = getTimeDeltaLabel();

  const kpis = [
    {
      title: 'Total Assets',
      value: totalCount.toLocaleString(),
      change: `12% ${deltaPeriod}`,
      isPositive: true,
      icon: Package,
      iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
      borderColor: 'border-blue-200 dark:border-blue-800',
    },
    {
      title: 'Allocated',
      value: allocatedCount.toLocaleString(),
      change: `8% ${deltaPeriod}`,
      isPositive: true,
      icon: UserCheck,
      iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
    },
    {
      title: 'Available',
      value: availableCount.toLocaleString(),
      change: `4% ${deltaPeriod}`,
      isPositive: false,
      icon: CheckCircle2,
      iconBg: 'bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400',
    },
    {
      title: 'Maintenance',
      value: maintenanceCount.toLocaleString(),
      change: `6% ${deltaPeriod}`,
      isPositive: true,
      icon: Wrench,
      iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
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
              <div className={`p-2.5 rounded-xl ${kpi.iconBg} transition-transform group-hover:scale-110 duration-200`}>
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
              {reportType !== 'Asset Overview' && (
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
