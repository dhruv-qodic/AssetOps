import React from 'react';
import { LayoutDashboard, SlidersHorizontal, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { useDashboardStore } from '@/store/useDashboardStore';
import { DASHBOARD_TIME_RANGES, type DashboardTimeRange } from '@/constans/dashboard.constants';
import { ASSET_LOCATIONS } from '@/constans/asset.constants';
import { PageHeader } from '@/components/common/PageHeader';

export const DashboardHeader: React.FC = () => {
  const { timeRange, setTimeRange, selectedLocation, setSelectedLocation, openCustomization } =
    useDashboardStore();

  const timeRangeOptions = DASHBOARD_TIME_RANGES.map((range) => ({
    label: range,
    value: range,
  }));

  const locationOptions = [
    { label: 'All Locations', value: 'All' },
    ...ASSET_LOCATIONS.map((loc) => ({
      label: loc,
      value: loc,
    })),
  ];

  return (
    <PageHeader
      icon={LayoutDashboard}
      title="AssetOps Dashboard"
      description="Real-time overview of hardware inventory, operational health, and allocation analytics."
    >
      {/* 1. Time Range Filter */}
      <div className="w-full sm:w-44 shrink-0">
        <Select
          value={timeRange}
          onValueChange={(val) => setTimeRange(val as DashboardTimeRange)}
          options={timeRangeOptions.map((opt) => ({
            ...opt,
            icon: <Calendar className="size-3.5 text-slate-400 shrink-0" />,
          }))}
          placeholder="Select timeframe"
        />
      </div>

      {/* 2. Location Filter */}
      <div className="w-full sm:w-44 shrink-0">
        <Select
          value={selectedLocation}
          onValueChange={setSelectedLocation}
          options={locationOptions.map((opt) => ({
            ...opt,
            icon: <MapPin className="size-3.5 text-slate-400 shrink-0" />,
          }))}
          placeholder="Filter location"
        />
      </div>

      {/* Customization Button */}
      <Button
        type="button"
        variant="outline"
        onClick={openCustomization}
        className="flex items-center gap-2 h-9 px-3.5 text-xs sm:text-sm font-medium border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-2xs hover:text-[#155DFC] dark:hover:text-[#155DFC] transition-colors shrink-0"
      >
        <SlidersHorizontal className="size-3.5 text-slate-500" />
        <span>Customize</span>
      </Button>
    </PageHeader>
  );
};

export default DashboardHeader;

