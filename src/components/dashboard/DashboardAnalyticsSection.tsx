import React from 'react';
import { Sparkles } from 'lucide-react';
import { useDashboardStore } from '@/store/useDashboardStore';
import { AssetTrendsLineChart } from './AssetTrendsLineChart';
import { AssetValuationAreaChart } from './AssetValuationAreaChart';
import { AssetDepreciationChart } from './AssetDepreciationChart';
import AssetLifecycleChart from './AssetLifecycleChart';

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
            <AssetLifecycleChart />
          </div>
        )}

        {/* Dual Grid for Fleet Trends & Asset Valuation */}
        {(isLineVisible || isAreaVisible) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
            {/* Line Chart */}
            {isLineVisible && (
              <div className="flex flex-col">
                <AssetTrendsLineChart />
              </div>
            )}

            {/* Area Chart */}
            {isAreaVisible && (
              <div className="flex flex-col">
                <AssetValuationAreaChart />
              </div>
            )}
          </div>
        )}

        {/* Depreciation & Book Value Chart */}
        {isDepreciationVisible && (
          <div className="flex flex-col w-full">
            <AssetDepreciationChart />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardAnalyticsSection;
