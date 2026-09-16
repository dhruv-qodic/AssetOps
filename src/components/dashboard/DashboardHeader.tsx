import React from 'react';
import { LayoutDashboard, SlidersHorizontal, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { useDashboardStore } from '@/store/useDashboardStore';
import {
  DASHBOARD_TIME_RANGES,
  type DashboardTimeRange,
} from '@/constans/dashboard.constants';
import { ASSET_LOCATIONS } from '@/constans/asset.constants';

export const DashboardHeader: React.FC = () => {
  const {
    timeRange,
    setTimeRange,
    selectedLocation,
    setSelectedLocation,
    openCustomization,
  } = useDashboardStore();

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
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
      {/* Title & Description with React Icon */}
      <div className="flex items-start sm:items-center gap-3">
        <div className="p-2.5 rounded-xl bg-[#4C40F7]/10 dark:bg-[#4C40F7]/20 text-[#4C40F7] shadow-xs shrink-0 mt-0.5 sm:mt-0">
          <LayoutDashboard className="size-6 sm:size-7" />
        </div>
        <div className="space-y-0.5 text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            AssetOps Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time overview of hardware inventory, operational health, and allocation analytics.
          </p>
        </div>
      </div>

      {/* Action Controls: Max 2 Useful Filters + Customization Button */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 self-stretch lg:self-auto">
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
          className="flex items-center gap-2 h-9 px-3.5 text-xs sm:text-sm font-medium border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-2xs hover:text-[#4C40F7] dark:hover:text-[#4C40F7] transition-colors shrink-0"
        >
          <SlidersHorizontal className="size-3.5 text-slate-500" />
          <span>Customize</span>
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
