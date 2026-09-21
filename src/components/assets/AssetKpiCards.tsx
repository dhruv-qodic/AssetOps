import React, { useMemo } from 'react';
import {
  Boxes,
  Layers,
  UserCheck,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useAssetStore } from '@/store/useAssetStore';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '../ui/card';

interface AssetKpiCardsProps {
  className?: string;
}

export const AssetKpiCards: React.FC<AssetKpiCardsProps> = ({ className }) => {
  const assets = useAssetStore((s) => s.assets);

  // Live Metrics Calculations
  const metrics = useMemo(() => {
    const totalCount = assets.length;
    const allocatedCount = assets.filter((a) => a.status === 'Allocated').length;
    const availableCount = assets.filter((a) => a.status === 'Available').length;
    const maintenanceCount = assets.filter((a) => a.status === 'Maintenance').length;
    const retiredCount = assets.filter((a) => a.status === 'Retired').length;

    const totalValuation = assets.reduce((sum, a) => sum + (a.purchaseCost || 0), 0);
    const allocatedValuation = assets
      .filter((a) => a.status === 'Allocated')
      .reduce((sum, a) => sum + (a.purchaseCost || 0), 0);

    const allocationRate = totalCount ? Math.round((allocatedCount / totalCount) * 100) : 0;
    const availableRate = totalCount ? Math.round((availableCount / totalCount) * 100) : 0;

    const formattedTotalValuation = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(totalValuation);

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
      retiredCount,
      totalValuation,
      allocationRate,
      availableRate,
      formattedTotalValuation,
      formattedAllocatedValuation,
    };
  }, [assets]);

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 w-full', className)}>
      {/* 1. FIRST CARD: #0f1729 (Deep Navy Slate Theme) */}
      <div
        className="relative overflow-hidden rounded-2xl p-5 sm:p-6 text-white transition-all duration-300 hover:shadow-lg group select-none border border-slate-800"
        style={{ backgroundColor: '#090f25' }}
      >
        {/* Ambient Decorative Glow */}
        <div className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-blue-500/10 blur-3xl transition-all duration-500 group-hover:bg-blue-500/20" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 size-40 rounded-full bg-indigo-500/10 blur-2xl" />

        <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
          {/* Card Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-slate-800/90 text-blue-400 border border-slate-700/60 shadow-xs">
                <Boxes className="size-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
                  Inventory Overview
                </span>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Total Asset Valuation
                </h3>
              </div>
            </div>

            {/* Growth / Active Badge */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
              <TrendingUp className="size-3.5" />
              <span>+8.4%</span>
            </div>
          </div>

          {/* Primary Metric & Value */}
          <div className="flex items-baseline justify-between pt-1">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {metrics.formattedTotalValuation}
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
                <Layers className="size-3.5 text-blue-400" />
                <span>Across {metrics.totalCount.toLocaleString()} total registered assets</span>
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 font-medium">Available Assets</span>
              <div className="text-lg font-bold text-slate-200">
                {metrics.availableCount}{' '}
                <span className="text-xs font-normal text-slate-400">
                  ({metrics.availableRate}%)
                </span>
              </div>
            </div>
          </div>

          {/* Asset Distribution Mini Progress Bar */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
            <div className="flex justify-between text-[11px] font-medium text-slate-400">
              <span className="flex items-center gap-1 text-slate-300">
                <CheckCircle2 className="size-3 text-emerald-400" />
                Available: {metrics.availableCount}
              </span>
              <span className="text-slate-400">
                Maintenance: {metrics.maintenanceCount} | Retired: {metrics.retiredCount}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800 flex gap-0.5">
              <div
                style={{ width: `${metrics.allocationRate}%` }}
                className="h-full bg-indigo-500 transition-all duration-500 rounded-l-full"
                title={`Allocated: ${metrics.allocationRate}%`}
              />
              <div
                style={{ width: `${metrics.availableRate}%` }}
                className="h-full bg-emerald-500 transition-all duration-500"
                title={`Available: ${metrics.availableRate}%`}
              />
              <div
                style={{
                  width: `${Math.max(0, 100 - metrics.allocationRate - metrics.availableRate)}%`,
                }}
                className="h-full bg-amber-500 transition-all duration-500 rounded-r-full"
                title="Maintenance & Retired"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. SECOND CARD: Project Theme (Vibrant Brand Indigo Theme) */}
      <Card className="flex h-full flex-col justify-between border-slate-200 bg-white shadow-sm p-0">
        <CardContent className="p-5">
          <div className="relative z-10 flex h-full flex-col justify-between space-y-5">
            {/* Card Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <UserCheck className="size-5" />
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Deployment & Utilization
                  </span>

                  <h3 className="text-base font-bold tracking-tight text-slate-900">
                    Active Asset Allocations
                  </h3>
                </div>
              </div>

              {/* Utilization Badge */}
              <div className="flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                <Sparkles className="size-3.5 text-blue-500" />
                <span>{metrics.allocationRate}% Utilized</span>
              </div>
            </div>

            {/* Primary Metric */}
            <div className="flex items-baseline justify-between pt-1">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                    {metrics.allocatedCount.toLocaleString()}
                  </span>

                  <span className="text-sm font-medium text-slate-500">
                    / {metrics.totalCount.toLocaleString()} Assets
                  </span>
                </div>

                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <DollarSign className="size-3.5 text-blue-500" />
                  <span>Allocated Value: {metrics.formattedAllocatedValuation}</span>
                </p>
              </div>

              {/* Maintenance */}
              <div className="text-right">
                <span className="text-xs font-medium text-slate-500">In Maintenance</span>

                <div className="text-lg font-bold text-slate-900">
                  {metrics.maintenanceCount}{' '}
                  <span className="text-xs font-normal text-slate-500">devices</span>
                </div>
              </div>
            </div>

            {/* Footer Stats */}
            <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-xs font-medium">
              <div className="flex items-center gap-1.5 text-slate-600">
                <ShieldCheck className="size-3.5 text-emerald-600" />
                <span>Operational Health: Optimal</span>
              </div>

              <div className="flex cursor-pointer items-center gap-1 text-blue-600 transition-colors hover:text-blue-700">
                <span>View details</span>
                <ArrowUpRight className="size-3.5" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssetKpiCards;
