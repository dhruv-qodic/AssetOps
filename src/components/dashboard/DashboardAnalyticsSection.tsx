import React, { Suspense, lazy } from 'react';
import { Sparkles } from 'lucide-react';
import { useDashboardStore } from '@/store/useDashboardStore';
import { DashboardWidgetSkeleton } from './DashboardWidgetSkeleton';

// Lazy-load heavy recharts visualizations
const AssetLifecycleChart = lazy(() => import('./AssetLifecycleChart'));
const AssetTrendsLineChart = lazy(() => import('./AssetTrendsLineChart'));
const AssetValuationAreaChart = lazy(() => import('./AssetValuationAreaChart'));
const AssetDepreciationChart = lazy(() => import('./AssetDepreciationChart'));

export const DashboardAnalyticsSection: React.FC = () => {
  const { visibleWidgetIds } = useDashboardStore();

  const isLineVisible = visibleWidgetIds.includes('growth_line_chart');
  const isAreaVisible = visibleWidgetIds.includes('valuation_area_chart');
  const isLifecycleVisible = visibleWidgetIds.includes('lifecycle_chart');
  const isDepreciationVisible = visibleWidgetIds.includes('depreciation_chart');

  const visibleCount = [
    isLifecycleVisible,
    isLineVisible,
    isAreaVisible,
    isDepreciationVisible,
  ].filter(Boolean).length;

  if (visibleCount === 0) {
    return null;
  }

  return (
    <div className="space-y-4 text-left">
      {/* Analytics Section Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Operational Analytics & Forecasting
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-[#155DFC] dark:bg-indigo-950/60 dark:text-indigo-300">
              <Sparkles className="size-3" />
              Dynamic Insights
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Time-series telemetry, financial valuation curves, depreciation models, and asset
            distribution.
          </p>
        </div>
      </div>

      {/* Analytics Grid: Visualizations */}
      <div className="flex flex-col w-full gap-5">
        {/* Status Lifecycle Chart */}
        {isLifecycleVisible && (
          <div className="flex flex-col w-full">
            <Suspense fallback={<DashboardWidgetSkeleton minHeight="min-h-[360px]" />}>
              <AssetLifecycleChart />
            </Suspense>
          </div>
        )}

        {/* Dual Grid for Fleet Trends & Asset Valuation */}
        {(isLineVisible || isAreaVisible) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
            {/* Line Chart */}
            {isLineVisible && (
              <div className="flex flex-col">
                <Suspense fallback={<DashboardWidgetSkeleton minHeight="min-h-[360px]" />}>
                  <AssetTrendsLineChart />
                </Suspense>
              </div>
            )}

            {/* Area Chart */}
            {isAreaVisible && (
              <div className="flex flex-col">
                <Suspense fallback={<DashboardWidgetSkeleton minHeight="min-h-[360px]" />}>
                  <AssetValuationAreaChart />
                </Suspense>
              </div>
            )}
          </div>
        )}

        {/* Depreciation & Book Value Chart */}
        {isDepreciationVisible && (
          <div className="flex flex-col w-full">
            <Suspense
              fallback={
                <DashboardWidgetSkeleton variant="depreciation" minHeight="min-h-[420px]" />
              }
            >
              <AssetDepreciationChart />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardAnalyticsSection;
