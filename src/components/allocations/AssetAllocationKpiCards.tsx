import { useMemo } from 'react';
import {
  Layers,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Users,
  Building2,
} from 'lucide-react';
import { useAssetStore } from '@/store/useAssetStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { cn } from '@/lib/utils';

interface AssetAllocationKpiCardsProps {
  className?: string;
}

export function AssetAllocationKpiCards({ className }: AssetAllocationKpiCardsProps) {
  const assets = useAssetStore((s) => s.assets);
  const employees = useEmployeeStore((s) => s.employees);

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

    // Count unique employees with active allocations
    const allocatedEmpIds = new Set<string>();
    allocatedAssets.forEach((a) => {
      if (a.assignedTo?.id) allocatedEmpIds.add(a.assignedTo.id);
      else if (a.assignedTo?.name) allocatedEmpIds.add(a.assignedTo.name);
    });
    const allocatedEmployeesCount = allocatedEmpIds.size;

    // Unique departments with active allocations
    const allocatedDepts = new Set<string>();
    allocatedAssets.forEach((a) => {
      if (a.assignedTo?.department) allocatedDepts.add(a.assignedTo.department);
    });

    const formattedAllocatedValuation = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(allocatedValuation);

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
      allocatedEmployeesCount,
      allocatedDepartmentsCount: allocatedDepts.size,
      totalEmployees: employees.length,
      formattedAllocatedValuation,
    };
  }, [assets, employees]);

  return (
    <div
      data-testid="asset-allocation-kpi-card"
      className={cn(
        'relative overflow-hidden p-5 sm:p-6 text-white transition-all duration-300 hover:shadow-xl group select-none flex flex-col justify-between h-full',
        className,
      )}
    >
      {/* Ambient Decorative Glows */}
      <div className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-blue-500/15 blur-3xl transition-all duration-500 group-hover:bg-blue-500/25" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 size-40 rounded-full bg-indigo-500/10 blur-2xl" />

      <div className="relative z-10 flex flex-col justify-between h-full space-y-5">
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-slate-800/90 text-blue-400 border border-slate-700/60 shadow-xs">
              <Layers className="size-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
                Active Deployments
              </span>
              <h3 className="text-base font-bold text-white tracking-tight">Allocated Assets</h3>
            </div>
          </div>

          {/* Allocation Rate Badge */}
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
                {metrics.allocatedCount.toLocaleString()}
              </span>
              <span className="text-xs sm:text-sm font-medium text-slate-400">
                / {metrics.totalCount.toLocaleString()} Total
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
              <DollarSign className="size-3.5 text-blue-400" />
              <span>Valuation: {metrics.formattedAllocatedValuation}</span>
            </p>
          </div>

          <div className="text-right space-y-1">
            <div className="flex items-center justify-end gap-1.5 text-xs text-slate-300 font-medium">
              <Users className="size-3.5 text-indigo-400" />
              <span>{metrics.allocatedEmployeesCount} Assigned Staff</span>
            </div>
            <div className="flex items-center justify-end gap-1.5 text-xs text-slate-400 font-medium">
              <Building2 className="size-3.5 text-cyan-400" />
              <span>{metrics.allocatedDepartmentsCount} Departments</span>
            </div>
          </div>
        </div>

        {/* Mini Distribution Bar & Health Footer */}
        <div className="space-y-2 pt-3 border-t border-slate-800/90">
          <div className="flex justify-between text-[11px] font-medium text-slate-400">
            <span className="flex items-center gap-1 text-slate-300">
              <CheckCircle2 className="size-3 text-blue-400" />
              Allocated: {metrics.allocatedCount}
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
                width: `${metrics.availableRate}%`,
              }}
              className="h-full bg-emerald-500 transition-all duration-500"
              title={`Available: ${metrics.availableRate}%`}
            />
            <div
              style={{
                width: `${metrics.maintenanceRate}%`,
              }}
              className="h-full bg-amber-500 transition-all duration-500 rounded-r-full"
              title={`Maintenance / Other: ${metrics.maintenanceRate}%`}
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
}

export default AssetAllocationKpiCards;
