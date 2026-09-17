import React from 'react';
import { Sparkles } from 'lucide-react';
import { useDashboardStore } from '@/store/useDashboardStore';
import { AssetTrendsLineChart } from './AssetTrendsLineChart';
import { AssetValuationAreaChart } from './AssetValuationAreaChart';
import { AssetDistributionPieChart } from './AssetDistributionPieChart';

export const DashboardAnalyticsSection: React.FC = () => {
  const { visibleWidgetIds } = useDashboardStore();

  const isLineVisible = visibleWidgetIds.includes('growth_line_chart');
  const isAreaVisible = visibleWidgetIds.includes('valuation_area_chart');
  const isPieVisible = visibleWidgetIds.includes('distribution_pie_chart');

  const visibleCount = [isLineVisible, isAreaVisible, isPieVisible].filter(Boolean).length;

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
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-[#4C40F7] dark:bg-indigo-950/60 dark:text-indigo-300">
              <Sparkles className="size-3" />
              Dynamic Insights
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Time-series telemetry, financial valuation curves, and category asset distribution.
          </p>
        </div>
      </div>

      {/* Analytics Grid: 3 Visualizations (Line, Area, Pie) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Line Chart */}
        {isLineVisible && (
          <div
            className={`flex flex-col ${
              visibleCount === 3
                ? 'lg:col-span-4'
                : visibleCount === 2
                  ? 'lg:col-span-6'
                  : 'lg:col-span-12'
            }`}
          >
            <AssetTrendsLineChart />
          </div>
        )}

        {/* Area Chart */}
        {isAreaVisible && (
          <div
            className={`flex flex-col ${
              visibleCount === 3
                ? 'lg:col-span-4'
                : visibleCount === 2
                  ? 'lg:col-span-6'
                  : 'lg:col-span-12'
            }`}
          >
            <AssetValuationAreaChart />
          </div>
        )}

        {/* Pie / Donut Chart */}
        {isPieVisible && (
          <div
            className={`flex flex-col ${
              visibleCount === 3
                ? 'lg:col-span-4'
                : visibleCount === 2
                  ? 'lg:col-span-6'
                  : 'lg:col-span-12'
            }`}
          >
            <AssetDistributionPieChart />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardAnalyticsSection;
