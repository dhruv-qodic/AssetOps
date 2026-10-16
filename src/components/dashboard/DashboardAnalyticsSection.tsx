import React, { Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';
import { ErrorBoundary } from 'react-error-boundary';
import { useDashboardStore } from '@/store/useDashboardStore';
import { DashboardWidgetSkeleton } from '@/components/dashboard/DashboardWidgetSkeleton';
import { WidgetErrorFallback } from '@/components/common/ErrorFallback';
import { DASHBOARD_WIDGET_TITLES } from '@/constant/dashboard.constants';
import {
  DASHBOARD_ANALYTICS_WIDGET_IDS,
  DASHBOARD_ANALYTICS_HEADER_TEXT,
} from './constants/DashboardAnalyticsSection.constants';

// Lazy-load heavy recharts visualizations
const AssetLifecycleChart = lazy(() => import('@/components/dashboard/AssetLifecycleChart'));
const AssetTrendsLineChart = lazy(() => import('@/components/dashboard/AssetTrendsLineChart'));
const AssetValuationAreaChart = lazy(
  () => import('@/components/dashboard/AssetValuationAreaChart'),
);
const AssetDepreciationChart = lazy(() => import('@/components/dashboard/AssetDepreciationChart'));

/**
 * @description: Lazy-loaded using React.lazy().
 *              - Wrapped with Suspense to display a widget-specific loading skeleton.
 *              - Isolated with react-error-boundary so a failure in one widget does not
 *                affect the remaining dashboard widgets.
 *              - Displays: Time-series telemetry, financial valuation curves, depreciation models,and asset distribution.
 */
export const DashboardAnalyticsSection: React.FC = () => {
  const { t: translateDashboard } = useTranslation('dashboard');
  const { visibleWidgetIds } = useDashboardStore();

  const isLineVisible = visibleWidgetIds.includes(DASHBOARD_ANALYTICS_WIDGET_IDS.GROWTH_LINE_CHART);
  const isAreaVisible = visibleWidgetIds.includes(
    DASHBOARD_ANALYTICS_WIDGET_IDS.VALUATION_AREA_CHART,
  );
  const isLifecycleVisible = visibleWidgetIds.includes(
    DASHBOARD_ANALYTICS_WIDGET_IDS.LIFECYCLE_CHART,
  );
  const isDepreciationVisible = visibleWidgetIds.includes(
    DASHBOARD_ANALYTICS_WIDGET_IDS.DEPRECIATION_CHART,
  );

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
            <h2 className="text-lg sm:xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {translateDashboard('analyticsSection.title', {
                defaultValue: DASHBOARD_ANALYTICS_HEADER_TEXT.TITLE,
              })}
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-primary dark:bg-indigo-950/60 dark:text-indigo-300">
              <Sparkles className="size-3" />
              {translateDashboard('analyticsSection.badge', {
                defaultValue: DASHBOARD_ANALYTICS_HEADER_TEXT.BADGE,
              })}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {translateDashboard('analyticsSection.subtitle', {
              defaultValue: DASHBOARD_ANALYTICS_HEADER_TEXT.SUBTITLE,
            })}
          </p>
        </div>
      </div>

      {/* Analytics Grid: Visualizations */}
      <div className="flex flex-col w-full gap-5">
        {/* Status Lifecycle Chart */}
        {isLifecycleVisible && (
          <div className="flex flex-col w-full">
            <Suspense fallback={<DashboardWidgetSkeleton minHeight="min-h-[360px]" />}>
              <ErrorBoundary
                fallbackRender={({ error, resetErrorBoundary }) => (
                  <WidgetErrorFallback
                    error={error}
                    resetErrorBoundary={resetErrorBoundary}
                    widgetTitle={DASHBOARD_WIDGET_TITLES.LIFECYCLE_CHART}
                    minHeight="min-h-[360px]"
                  />
                )}
              >
                <AssetLifecycleChart />
              </ErrorBoundary>
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
                  <ErrorBoundary
                    fallbackRender={({ error, resetErrorBoundary }) => (
                      <WidgetErrorFallback
                        error={error}
                        resetErrorBoundary={resetErrorBoundary}
                        widgetTitle={DASHBOARD_WIDGET_TITLES.GROWTH_TRENDS}
                        minHeight="min-h-[360px]"
                      />
                    )}
                  >
                    <AssetTrendsLineChart />
                  </ErrorBoundary>
                </Suspense>
              </div>
            )}

            {/* Area Chart */}
            {isAreaVisible && (
              <div className="flex flex-col">
                <Suspense fallback={<DashboardWidgetSkeleton minHeight="min-h-[360px]" />}>
                  <ErrorBoundary
                    fallbackRender={({ error, resetErrorBoundary }) => (
                      <WidgetErrorFallback
                        error={error}
                        resetErrorBoundary={resetErrorBoundary}
                        widgetTitle={DASHBOARD_WIDGET_TITLES.VALUATION_TRENDS}
                        minHeight="min-h-[360px]"
                      />
                    )}
                  >
                    <AssetValuationAreaChart />
                  </ErrorBoundary>
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
              <ErrorBoundary
                fallbackRender={({ error, resetErrorBoundary }) => (
                  <WidgetErrorFallback
                    error={error}
                    resetErrorBoundary={resetErrorBoundary}
                    widgetTitle={DASHBOARD_WIDGET_TITLES.DEPRECIATION_SCHEDULE}
                    variant="depreciation"
                    minHeight="min-h-[420px]"
                  />
                )}
              >
                <AssetDepreciationChart />
              </ErrorBoundary>
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardAnalyticsSection;
