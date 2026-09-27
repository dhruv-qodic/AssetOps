import React from 'react';
import { useDashboardStore } from '@/store/useDashboardStore';
import { DashboardRecentActivity } from './DashboardRecentActivity';
import AssetDistributionPieChart from './AssetDistributionPieChart';

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
        <AssetDistributionPieChart />
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
      {/* 1. Meaningful Asset Management Chart */}
      <div className="lg:col-span-5 flex flex-col">
        <AssetDistributionPieChart />
      </div>

      {/* 2. Recent Activity Feed */}
      <div className="lg:col-span-7 flex flex-col">
        <DashboardRecentActivity />
      </div>
    </div>
  );
};

export default DashboardMiddleSection;
