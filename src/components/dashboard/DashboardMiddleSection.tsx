import React, { Suspense, lazy } from 'react';
import { useDashboardStore } from '@/store/useDashboardStore';
import { DashboardRecentActivity } from './DashboardRecentActivity';
import { DashboardWidgetSkeleton } from './DashboardWidgetSkeleton';

// Lazy-load heavy pie chart component
const AssetDistributionPieChart = lazy(() => import('./AssetDistributionPieChart'));

export const DashboardMiddleSection: React.FC = () => {
  const { visibleWidgetIds } = useDashboardStore();

  const isPieChartVisible = visibleWidgetIds.includes('distribution_pie_chart');
  const isActivityVisible = visibleWidgetIds.includes('recent_activity');

  if (!isPieChartVisible && !isActivityVisible) {
    return null;
  }

  if (isPieChartVisible && !isActivityVisible) {
    return (
      <div className="w-full">
        <Suspense fallback={<DashboardWidgetSkeleton variant="pie" minHeight="min-h-[380px]" />}>
          <AssetDistributionPieChart />
        </Suspense>
      </div>
    );
  }

  if (!isPieChartVisible && isActivityVisible) {
    return (
      <div className="w-full">
        <DashboardRecentActivity />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
      {/* 1. Meaningful Asset Management Chart (Lazy Loaded) */}
      <div className="lg:col-span-5 flex flex-col">
        <Suspense fallback={<DashboardWidgetSkeleton variant="pie" minHeight="min-h-[380px]" />}>
          <AssetDistributionPieChart />
        </Suspense>
      </div>

      {/* 2. Recent Activity Feed (Eagerly Loaded) */}
      <div className="lg:col-span-7 flex flex-col">
        <DashboardRecentActivity />
      </div>
    </div>
  );
};

export default DashboardMiddleSection;
