import React, { useMemo } from 'react';
import {
  UserCheck,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Users,
  HardDrive,
} from 'lucide-react';
import { useAssetStore } from '@/store/useAssetStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { cn } from '@/lib/utils';

interface ActiveAllocationsKpiCardProps {
  className?: string;
}

export const ActiveAllocationsKpiCard: React.FC<ActiveAllocationsKpiCardProps> = ({
  className,
}) => {
  const assets = useAssetStore((s) => s.assets);
  const employees = useEmployeeStore((s) => s.employees);

  const metrics = useMemo(() => {
    const totalCount = assets.length;
    const activeAllocatedAssets = assets.filter((a) => a.status === 'Allocated');
    const activeCount = activeAllocatedAssets.length;
    const availableCount = assets.filter((a) => a.status === 'Available').length;
    const maintenanceCount = assets.filter((a) => a.status === 'Maintenance').length;

    const activeValuation = activeAllocatedAssets.reduce(
      (sum, a) => sum + (a.purchaseCost || 0),
      0,
    );
    const totalValuation = assets.reduce((sum, a) => sum + (a.purchaseCost || 0), 0);

    const allocationRate = totalCount ? Math.round((activeCount / totalCount) * 100) : 0;

    // Count unique employees with active allocations
    const activeEmpIds = new Set<string>();
    activeAllocatedAssets.forEach((a) => {
      if (a.assignedTo?.id) activeEmpIds.add(a.assignedTo.id);
      else if (a.assignedTo?.name) activeEmpIds.add(a.assignedTo.name);
    });
    const activeEmployeesCount = activeEmpIds.size;

    // Unique active departments
    const activeDepts = new Set<string>();
    activeAllocatedAssets.forEach((a) => {
      if (a.assignedTo?.department) activeDepts.add(a.assignedTo.department);
    });

    const formattedActiveValuation = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(activeValuation);

    return {
      totalCount,
      activeCount,
      availableCount,
      maintenanceCount,
      activeValuation,
      totalValuation,
      allocationRate,
      activeEmployeesCount,
      activeDepartmentsCount: activeDepts.size,
      totalEmployees: employees.length,
      formattedActiveValuation,
    };
  }, [assets, employees]);

  return (
    <div
      data-testid="active-allocations-kpi-card"
      className={cn(
        'relative overflow-hidden rounded-2xl p-5 sm:p-6 text-white transition-all duration-300 hover:shadow-xl group select-none border border-slate-800 flex flex-col justify-between h-full',
        className,
      )}
      style={{ backgroundColor: '#101726' }}
    >
      {/* Ambient Decorative Glows */}
      <div className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-blue-500/15 blur-3xl transition-all duration-500 group-hover:bg-blue-500/25" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 size-40 rounded-full bg-indigo-500/10 blur-2xl" />

      <div className="relative z-10 flex flex-col justify-between h-full space-y-5">
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-slate-800/90 text-blue-400 border border-slate-700/60 shadow-xs">
              <UserCheck className="size-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
                Active Deployments
              </span>
              <h3 className="text-base font-bold text-white tracking-tight">Active Assets</h3>
            </div>
          </div>

          {/* Active Utilization Rate Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
            <TrendingUp className="size-3.5" />
            <span>{metrics.allocationRate}% Active</span>
          </div>
        </div>

        {/* Primary Metric & Value */}
        <div className="grid grid-cols-2 gap-4 pt-1 items-end">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {metrics.activeCount.toLocaleString()}
              </span>
              <span className="text-xs sm:text-sm font-medium text-slate-400">
                / {metrics.totalCount.toLocaleString()} Total
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
              <DollarSign className="size-3.5 text-blue-400" />
              <span>Valuation: {metrics.formattedActiveValuation}</span>
            </p>
          </div>

          <div className="text-right space-y-1">
            <div className="flex items-center justify-end gap-1.5 text-xs text-slate-300 font-medium">
              <Users className="size-3.5 text-indigo-400" />
              <span>{metrics.activeEmployeesCount} Assigned Staff</span>
            </div>
            <div className="flex items-center justify-end gap-1.5 text-xs text-slate-400 font-medium">
              <HardDrive className="size-3.5 text-cyan-400" />
              <span>{metrics.activeDepartmentsCount} Departments</span>
            </div>
          </div>
        </div>

        {/* Mini Distribution Bar & Health Footer */}
        <div className="space-y-2 pt-3 border-t border-slate-800/90">
          <div className="flex justify-between text-[11px] font-medium text-slate-400">
            <span className="flex items-center gap-1 text-slate-300">
              <CheckCircle2 className="size-3 text-blue-400" />
              Active Allocated: {metrics.activeCount}
            </span>
            <span className="text-slate-400">
              Available: {metrics.availableCount} | Maint: {metrics.maintenanceCount}
            </span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800 flex gap-0.5">
            <div
              style={{ width: `${metrics.allocationRate}%` }}
              className="h-full bg-[#155DFC] transition-all duration-500 rounded-l-full"
              title={`Allocated: ${metrics.allocationRate}%`}
            />
            <div
              style={{
                width: `${metrics.totalCount ? Math.round((metrics.availableCount / metrics.totalCount) * 100) : 0}%`,
              }}
              className="h-full bg-emerald-500 transition-all duration-500"
              title="Available"
            />
            <div
              style={{
                width: `${metrics.totalCount ? Math.max(0, 100 - metrics.allocationRate - Math.round((metrics.availableCount / metrics.totalCount) * 100)) : 0}%`,
              }}
              className="h-full bg-amber-500 transition-all duration-500 rounded-r-full"
              title="Maintenance / Other"
            />
          </div>

          <div className="flex items-center justify-between pt-1 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="size-3.5" />
              Allocation Status: Operational
            </span>
            <span>Real-time Sync</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveAllocationsKpiCard;
