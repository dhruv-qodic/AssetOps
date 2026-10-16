import React, { useMemo } from 'react';
import {
  Boxes,
  Layers,
  UserCheck,
  TrendingUp,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useAssetStore } from '@/store/useAssetStore';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '../ui/card';
import { useTranslation } from 'react-i18next';
import { ASSET_KPI_TITLES, ASSET_KPI_LABELS } from './constants/AssetKpiCards.constants';
import { useCurrency } from '@/hooks/useCurrency';

interface AssetKpiCardsProps {
  className?: string;
}

/**
 * @description: Displays summary metric cards for asset counts, allocation rate, available rate, and valuation
 * @param {AssetKpiCardsProps} props - Component properties containing optional className
 * @returns {JSX.Element} Grid of asset KPI metric cards
 */
export const AssetKpiCards: React.FC<AssetKpiCardsProps> = ({ className }) => {
  const { t: translateAssets } = useTranslation('asset');
  const assets = useAssetStore((s) => s.assets);
  const { format, symbol } = useCurrency();

  /**
   * @description: Computes live metric counts, rates, and valuations across assets
   * @returns {object} Metrics object with totalCount, allocatedCount, availableCount, and valuation stats
   */
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

    const formattedTotalValuation = format(totalValuation);
    const formattedAllocatedValuation = format(allocatedValuation);

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
  }, [assets, format]);

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 w-full', className)}>
      {/* 1. FIRST CARD: #0f1729 (Deep Navy Slate Theme) */}
      <div
        className="relative overflow-hidden rounded-2xl p-5 sm:p-6 text-white transition-all duration-300 hover:shadow-lg group select-none border border-slate-800"
        style={{ backgroundColor: '#090f25' }}
      >
        {/* Ambient Decorative Glow */}
        <div className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-primary/10 blur-3xl transition-all duration-500 group-hover:bg-primary/20" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 size-40 rounded-full bg-primary/10 blur-2xl" />

        <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
          {/* Card Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-slate-800/90 text-primary border border-slate-700/60 shadow-xs">
                <Boxes className="size-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
                  {translateAssets('kpiCards.inventoryOverview', {
                    defaultValue: ASSET_KPI_TITLES.INVENTORY_OVERVIEW,
                  })}
                </span>
                <h3 className="text-base font-bold text-white tracking-tight">
                  {translateAssets('kpiCards.totalValuation', {
                    defaultValue: ASSET_KPI_TITLES.TOTAL_VALUATION,
                  })}
                </h3>
              </div>
            </div>

            {/* Growth / Active Badge */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
              <TrendingUp className="size-3.5" />
              <span>
                {translateAssets('kpiCards.growthPercentage', {
                  defaultValue: ASSET_KPI_LABELS.GROWTH_PERCENTAGE,
                })}
              </span>
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
                <span>
                  {translateAssets('kpiCards.acrossPrefix', {
                    defaultValue: ASSET_KPI_LABELS.ACROSS_PREFIX,
                  })}{' '}
                  {metrics.totalCount.toLocaleString()}{' '}
                  {translateAssets('kpiCards.totalRegisteredAssets', {
                    defaultValue: ASSET_KPI_LABELS.TOTAL_REGISTERED_ASSETS,
                  })}
                </span>
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 font-medium">
                {translateAssets('kpiCards.availableAssets', {
                  defaultValue: ASSET_KPI_LABELS.AVAILABLE_ASSETS,
                })}
              </span>
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
                {translateAssets('kpiCards.available', {
                  defaultValue: ASSET_KPI_LABELS.AVAILABLE,
                })}
                : {metrics.availableCount}
              </span>
              <span className="text-slate-400">
                {translateAssets('kpiCards.maintenance', {
                  defaultValue: ASSET_KPI_LABELS.MAINTENANCE,
                })}
                : {metrics.maintenanceCount} |{' '}
                {translateAssets('kpiCards.retired', {
                  defaultValue: ASSET_KPI_LABELS.RETIRED,
                })}
                : {metrics.retiredCount}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800 flex gap-0.5">
              <div
                style={{ width: `${metrics.allocationRate}%` }}
                className="h-full bg-primary transition-all duration-500 rounded-l-full"
                title={`${translateAssets('kpiCards.assets', { defaultValue: ASSET_KPI_LABELS.ASSETS })}: ${metrics.allocationRate}%`}
              />
              <div
                style={{ width: `${metrics.availableRate}%` }}
                className="h-full bg-emerald-500 transition-all duration-500"
                title={`${translateAssets('kpiCards.available', { defaultValue: ASSET_KPI_LABELS.AVAILABLE })}: ${metrics.availableRate}%`}
              />
              <div
                style={{
                  width: `${Math.max(0, 100 - metrics.allocationRate - metrics.availableRate)}%`,
                }}
                className="h-full bg-amber-500 transition-all duration-500 rounded-r-full"
                title={`${translateAssets('kpiCards.maintenance', { defaultValue: ASSET_KPI_LABELS.MAINTENANCE })} & ${translateAssets('kpiCards.retired', { defaultValue: ASSET_KPI_LABELS.RETIRED })}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. SECOND CARD: Project Theme (Vibrant Brand Indigo Theme) */}
      <Card className="flex h-full flex-col justify-between border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-0">
        <CardContent className="p-5">
          <div className="relative z-10 flex h-full flex-col justify-between space-y-5">
            {/* Card Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 dark:bg-primary/20 text-primary">
                  <UserCheck className="size-5" />
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {translateAssets('kpiCards.deploymentUtilization', {
                      defaultValue: ASSET_KPI_TITLES.DEPLOYMENT_UTILIZATION,
                    })}
                  </span>

                  <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                    {translateAssets('kpiCards.activeAllocations', {
                      defaultValue: ASSET_KPI_TITLES.ACTIVE_ALLOCATIONS,
                    })}
                  </h3>
                </div>
              </div>

              {/* Utilization Badge */}
              <div className="flex items-center gap-1.5 rounded-full border border-primary/20 dark:border-primary/40 bg-primary/10 dark:bg-primary/20 px-2.5 py-1 text-xs font-semibold text-primary">
                <Sparkles className="size-3.5 text-primary" />
                <span>
                  {metrics.allocationRate}%{' '}
                  {translateAssets('kpiCards.utilized', {
                    defaultValue: ASSET_KPI_LABELS.UTILIZED,
                  })}
                </span>
              </div>
            </div>

            {/* Primary Metric */}
            <div className="flex items-baseline justify-between pt-1">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                    {metrics.allocatedCount.toLocaleString()}
                  </span>

                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    / {metrics.totalCount.toLocaleString()}{' '}
                    {translateAssets('kpiCards.assets', {
                      defaultValue: ASSET_KPI_LABELS.ASSETS,
                    })}
                  </span>
                </div>

                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <span className="size-3.5 flex items-center justify-center font-bold font-mono text-[11px] text-blue-500 dark:text-blue-400">
                    {symbol}
                  </span>
                  <span>
                    {translateAssets('kpiCards.allocatedValue', {
                      defaultValue: ASSET_KPI_LABELS.ALLOCATED_VALUE,
                    })}{' '}
                    {metrics.formattedAllocatedValuation}
                  </span>
                </p>
              </div>

              {/* Maintenance */}
              <div className="text-right">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {translateAssets('kpiCards.inMaintenance', {
                    defaultValue: ASSET_KPI_LABELS.IN_MAINTENANCE,
                  })}
                </span>

                <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {metrics.maintenanceCount}{' '}
                  <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                    {translateAssets('kpiCards.devices', {
                      defaultValue: ASSET_KPI_LABELS.DEVICES,
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Stats */}
            <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-3 text-xs font-medium">
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>
                  {translateAssets('kpiCards.operationalHealth', {
                    defaultValue: ASSET_KPI_LABELS.OPERATIONAL_HEALTH,
                  })}
                </span>
              </div>

              <div className="flex cursor-pointer items-center gap-1 text-blue-600 dark:text-blue-400 transition-colors hover:text-blue-700 dark:hover:text-blue-300">
                <span>
                  {translateAssets('kpiCards.viewDetails', {
                    defaultValue: ASSET_KPI_LABELS.VIEW_DETAILS,
                  })}
                </span>
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
