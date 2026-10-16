import React, { useMemo } from 'react';
import { TrendingUp, ShieldCheck, CheckCircle2, Users, Building2, UserCheck } from 'lucide-react';
import { useAssetStore } from '@/store/useAssetStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { cn } from '@/lib/utils';
import { useCurrency } from '@/hooks/useCurrency';
import { useTranslation } from 'react-i18next';

export interface AllocationOverviewKpiCardProps {
  className?: string;
  testId?: string;
  title?: string;
  overline?: string;
  icon?: React.ElementType;
  deptIcon?: React.ElementType;
  statusText?: string;
  syncText?: string;
  backgroundColor?: string;
}

/**
 * Shared summary KPI metric card for allocation pages detailing deployment rate,
 * active valuation, assigned staff, and departmental distribution.
 */
export const AllocationOverviewKpiCard: React.FC<AllocationOverviewKpiCardProps> = ({
  className,
  testId = 'active-allocations-kpi-card',
  title = 'Active Assets',
  overline = 'Allocation Summary',
  icon: HeaderIcon = UserCheck,
  deptIcon: DeptIcon = Building2,
  statusText = 'Real-time Tracking',
  syncText = 'Live Sync',
  backgroundColor = '#101726',
}) => {
  const { t: translateAllocations } = useTranslation('allocation');
  const assets = useAssetStore((s) => s.assets);
  const employees = useEmployeeStore((s) => s.employees);
  const { format, symbol } = useCurrency();

  const metrics = useMemo(() => {
    const totalCount = assets.length;
    const allocatedAssets = assets.filter((a) => a.status === 'Allocated');
    const allocatedCount = allocatedAssets.length;
    const availableCount = assets.filter((a) => a.status === 'Available').length;
    const maintenanceCount = assets.filter((a) => a.status === 'Maintenance').length;

    const allocatedValuation = allocatedAssets.reduce((sum, a) => sum + (a.purchaseCost || 0), 0);
    const totalValuation = assets.reduce((sum, a) => sum + (a.purchaseCost || 0), 0);

    const allocationRate = totalCount ? Math.round((allocatedCount / totalCount) * 100) : 0;
    const availableRate = totalCount ? Math.round((availableCount / totalCount) * 100) : 0;
    const maintenanceRate = totalCount ? Math.max(0, 100 - allocationRate - availableRate) : 0;

    // Unique employees with active allocations
    const allocatedEmpIds = new Set<string>();
    allocatedAssets.forEach((a) => {
      if (a.assignedTo?.id) allocatedEmpIds.add(a.assignedTo.id);
      else if (a.assignedTo?.name) allocatedEmpIds.add(a.assignedTo.name);
    });

    // Unique departments with active allocations
    const allocatedDepts = new Set<string>();
    allocatedAssets.forEach((a) => {
      if (a.assignedTo?.department) allocatedDepts.add(a.assignedTo.department);
    });

    const formattedValuation = format(allocatedValuation);

    return {
      totalCount,
      allocatedCount,
      availableCount,
      maintenanceCount,
      allocatedValuation,
      totalValuation,
      allocationRate,
      availableRate,
      maintenanceRate,
      allocatedEmployeesCount: allocatedEmpIds.size,
      allocatedDepartmentsCount: allocatedDepts.size,
      totalEmployees: employees.length,
      formattedValuation,
    };
  }, [assets, employees, format]);

  return (
    <div
      data-testid={testId}
      className={cn(
        'relative overflow-hidden rounded-2xl p-5 sm:p-6 text-white transition-all duration-300 hover:shadow-xl group select-none border border-slate-800 flex flex-col justify-between h-full',
        className,
      )}
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      {/* Ambient Decorative Glows */}
      <div className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-blue-500/15 blur-3xl transition-all duration-500 group-hover:bg-blue-500/25" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 size-40 rounded-full bg-indigo-500/10 blur-2xl" />

      <div className="relative z-10 flex flex-col justify-between h-full space-y-5">
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-slate-800/90 text-blue-400 border border-slate-700/60 shadow-xs">
              <HeaderIcon className="size-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
                {overline}
              </span>
              <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
            </div>
          </div>

          {/* Allocation Rate Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
            <TrendingUp className="size-3.5" />
            <span>
              {metrics.allocationRate}%{' '}
              {translateAllocations('kpi.activeSuffix', { defaultValue: 'Active' })}
            </span>
          </div>
        </div>

        {/* Primary Metric & Value */}
        <div className="grid grid-cols-2 gap-4 pt-1 items-end">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {metrics.allocatedCount.toLocaleString()}
              </span>
              <span className="text-xs sm:text-sm font-medium text-slate-400">
                / {metrics.totalCount.toLocaleString()}{' '}
                {translateAllocations('kpi.totalSuffix', { defaultValue: 'Total' })}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
              <span className="size-3.5 flex items-center justify-center font-bold font-mono text-[11px] text-blue-400">
                {symbol}
              </span>
              <span>
                {translateAllocations('kpi.valuationPrefix', { defaultValue: 'Valuation:' })}{' '}
                {metrics.formattedValuation}
              </span>
            </p>
          </div>

          <div className="text-right space-y-1">
            <div className="flex items-center justify-end gap-1.5 text-xs text-slate-300 font-medium">
              <Users className="size-3.5 text-indigo-400" />
              <span>
                {metrics.allocatedEmployeesCount}{' '}
                {translateAllocations('kpi.assignedStaff', { defaultValue: 'Assigned Staff' })}
              </span>
            </div>
            <div className="flex items-center justify-end gap-1.5 text-xs text-slate-400 font-medium">
              <DeptIcon className="size-3.5 text-cyan-400" />
              <span>
                {metrics.allocatedDepartmentsCount}{' '}
                {translateAllocations('kpi.departments', { defaultValue: 'Departments' })}
              </span>
            </div>
          </div>
        </div>

        {/* Mini Distribution Bar & Health Footer */}
        <div className="space-y-2 pt-3 border-t border-slate-800/90">
          <div className="flex justify-between text-[11px] font-medium text-slate-400">
            <span className="flex items-center gap-1 text-slate-300">
              <CheckCircle2 className="size-3 text-blue-400" />
              {translateAllocations('kpi.allocatedLabel', { defaultValue: 'Allocated:' })}{' '}
              {metrics.allocatedCount}
            </span>
            <span className="text-slate-400">
              {translateAllocations('kpi.availShort', { defaultValue: 'Avail:' })}{' '}
              {metrics.availableCount} |{' '}
              {translateAllocations('kpi.maintShort', { defaultValue: 'Maint:' })}{' '}
              {metrics.maintenanceCount}
            </span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800 flex gap-0.5">
            <div
              style={{ width: `${metrics.allocationRate}%` }}
              className="h-full bg-primary transition-all duration-500 rounded-l-full"
              title={`Allocated: ${metrics.allocationRate}%`}
            />
            <div
              style={{ width: `${metrics.availableRate}%` }}
              className="h-full bg-emerald-500 transition-all duration-500"
              title={`Available: ${metrics.availableRate}%`}
            />
            <div
              style={{ width: `${metrics.maintenanceRate}%` }}
              className="h-full bg-amber-500 transition-all duration-500 rounded-r-full"
              title={`Maintenance / Other: ${metrics.maintenanceRate}%`}
            />
          </div>

          <div className="flex items-center justify-between pt-1 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="size-3.5" />
              {statusText}
            </span>
            <span>{syncText}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllocationOverviewKpiCard;
