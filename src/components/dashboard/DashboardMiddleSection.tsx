import React from 'react';
import { useDashboardStore } from '@/store/useDashboardStore';
import { AssetLifecycleChart } from './AssetLifecycleChart';
import { DashboardRecentActivity } from './DashboardRecentActivity';

export const DashboardMiddleSection: React.FC = () => {
  const { visibleWidgetIds } = useDashboardStore();

  const isLifecycleVisible = visibleWidgetIds.includes('lifecycle_chart');
  const isActivityVisible = visibleWidgetIds.includes('recent_activity');

  if (!isLifecycleVisible && !isActivityVisible) {
    return null;
  }

  if (isLifecycleVisible && !isActivityVisible) {
    return (
      <div className="w-full">
        <AssetLifecycleChart />
      </div>
    );
  }

  if (!isLifecycleVisible && isActivityVisible) {
    return (
      <div className="w-full">
        <DashboardRecentActivity />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
      {/* 1. Meaningful Asset Management Chart */}
      <div className="lg:col-span-7 flex flex-col">
        <AssetLifecycleChart />
      </div>

      {/* 2. Recent Activity Feed */}
      <div className="lg:col-span-5 flex flex-col">
        <DashboardRecentActivity />
      </div>
    </div>
  );
};

export default DashboardMiddleSection;
