import React, { Suspense, lazy } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useDashboardStore } from '@/store/useDashboardStore';
import { DashboardRecentActivity } from '@/components/dashboard/DashboardRecentActivity';
import { DashboardWidgetSkeleton } from '@/components/dashboard/DashboardWidgetSkeleton';
import { WidgetErrorFallback } from '@/components/common/ErrorFallback';
import { DASHBOARD_WIDGET_TITLES } from '@/constant/dashboard.constants';
import { DASHBOARD_MIDDLE_WIDGET_IDS } from './constants/DashboardMiddleSection.constants';

// Lazy-load heavy pie chart component
/**
 * @description: Functional component for rendering the middle section of the dashboard.
 *               - Lazy-loaded using React.lazy().
 *               - Wrapped with Suspense to display a widget-specific loading skeleton.
 *               - Isolated with react-error-boundary so a failure in one widget does not
 *                 affect the remaining dashboard widgets.
 *               - Displays: Asset status distribution pie chart and recent activity feed.
 */
const AssetDistributionPieChart = lazy(() => import('./AssetDistributionPieChart'));

/**
 * @description: Renders the middle section of the dashboard with asset distribution pie chart and recent activity feed
 * @return {JSX.Element | null}: React dashboard middle section layout or null if both widgets are hidden
 */
export const DashboardMiddleSection: React.FC = () => {
  const { visibleWidgetIds } = useDashboardStore();

  const isPieChartVisible = visibleWidgetIds.includes(DASHBOARD_MIDDLE_WIDGET_IDS.DISTRIBUTION_PIE);
  const isActivityVisible = visibleWidgetIds.includes(DASHBOARD_MIDDLE_WIDGET_IDS.RECENT_ACTIVITY);

  if (!isPieChartVisible && !isActivityVisible) {
    return null;
  }

  if (isPieChartVisible && !isActivityVisible) {
    return (
      <div className="w-full">
        <Suspense fallback={<DashboardWidgetSkeleton variant="pie" minHeight="min-h-[380px]" />}>
          <ErrorBoundary
            fallbackRender={({ error, resetErrorBoundary }) => (
              <WidgetErrorFallback
                error={error}
                resetErrorBoundary={resetErrorBoundary}
                widgetTitle={DASHBOARD_WIDGET_TITLES.DISTRIBUTION_PIE}
                variant="pie"
                minHeight="min-h-[380px]"
              />
            )}
          >
            <AssetDistributionPieChart />
          </ErrorBoundary>
        </Suspense>
      </div>
    );
  }

  if (!isPieChartVisible && isActivityVisible) {
    return (
      <div className="w-full">
        <ErrorBoundary
          fallbackRender={({ error, resetErrorBoundary }) => (
            <WidgetErrorFallback
              error={error}
              resetErrorBoundary={resetErrorBoundary}
              widgetTitle={DASHBOARD_WIDGET_TITLES.RECENT_ACTIVITY}
              minHeight="min-h-[380px]"
            />
          )}
        >
          <DashboardRecentActivity />
        </ErrorBoundary>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
      {/* 1. Meaningful Asset Management Chart (Lazy Loaded) */}
      <div className="lg:col-span-5 flex flex-col">
        <Suspense fallback={<DashboardWidgetSkeleton variant="pie" minHeight="min-h-[380px]" />}>
          <ErrorBoundary
            fallbackRender={({ error, resetErrorBoundary }) => (
              <WidgetErrorFallback
                error={error}
                resetErrorBoundary={resetErrorBoundary}
                widgetTitle={DASHBOARD_WIDGET_TITLES.DISTRIBUTION_PIE}
                variant="pie"
                minHeight="min-h-[380px]"
              />
            )}
          >
            <AssetDistributionPieChart />
          </ErrorBoundary>
        </Suspense>
      </div>

      {/* 2. Recent Activity Feed (Eagerly Loaded) */}
      <div className="lg:col-span-7 flex flex-col">
        <ErrorBoundary
          fallbackRender={({ error, resetErrorBoundary }) => (
            <WidgetErrorFallback
              error={error}
              resetErrorBoundary={resetErrorBoundary}
              widgetTitle={DASHBOARD_WIDGET_TITLES.RECENT_ACTIVITY}
              minHeight="min-h-[380px]"
            />
          )}
        >
          <DashboardRecentActivity />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default DashboardMiddleSection;
