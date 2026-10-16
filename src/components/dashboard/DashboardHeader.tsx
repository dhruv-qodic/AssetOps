import React from 'react';
import { LayoutDashboard, SlidersHorizontal, Calendar, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { PageHeader } from '@/components/common/PageHeader';
import { useDashboardStore } from '@/store/useDashboardStore';
import { DASHBOARD_TIME_RANGES, type DashboardTimeRange } from '@/constant/dashboard.constants';
import { ASSET_LOCATIONS } from '@/constant/asset.constants';
import { DASHBOARD_HEADER_TEXT } from './constants/DashboardHeader.constants';

/**
 * @description: Renders the dashboard top header with title, timeframe selection, location filters, and customization trigger
 * @return {JSX.Element}: React dashboard header component
 */
export const DashboardHeader: React.FC = () => {
  const { t: translateDashboard } = useTranslation('dashboard');
  const { timeRange, setTimeRange, selectedLocation, setSelectedLocation, openCustomization } =
    useDashboardStore();

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case 'Last 7 Days':
        return translateDashboard('timeRanges.last7Days', { defaultValue: range });
      case 'Last 30 Days':
        return translateDashboard('timeRanges.last30Days', { defaultValue: range });
      case 'Last 90 Days':
        return translateDashboard('timeRanges.last90Days', { defaultValue: range });
      case 'Year to Date':
        return translateDashboard('timeRanges.yearToDate', { defaultValue: range });
      case 'All Time':
        return translateDashboard('timeRanges.allTime', { defaultValue: range });
      default:
        return range;
    }
  };

  const timeRangeOptions = DASHBOARD_TIME_RANGES.map((range) => ({
    label: getTimeRangeLabel(range),
    value: range,
  }));

  const locationOptions = [
    {
      label: translateDashboard('filters.allLocations', {
        defaultValue: DASHBOARD_HEADER_TEXT.ALL_LOCATIONS_LABEL,
      }),
      value: DASHBOARD_HEADER_TEXT.ALL_LOCATIONS_VALUE,
    },
    ...ASSET_LOCATIONS.map((loc) => ({
      label: loc,
      value: loc,
    })),
  ];

  return (
    <PageHeader
      title={translateDashboard('title', { defaultValue: DASHBOARD_HEADER_TEXT.TITLE })}
      subtitle={translateDashboard('subtitle', { defaultValue: DASHBOARD_HEADER_TEXT.SUBTITLE })}
      icon={LayoutDashboard}
      className="pb-2 border-b border-slate-200/80 dark:border-slate-800/80 lg:flex-row lg:items-center"
      actionsClassName="flex-wrap items-center gap-2.5 sm:gap-3 self-stretch lg:self-auto"
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
          placeholder={translateDashboard('filters.timeRangeLabel', {
            defaultValue: DASHBOARD_HEADER_TEXT.TIMEFRAME_PLACEHOLDER,
          })}
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
          placeholder={translateDashboard('filters.locationLabel', {
            defaultValue: DASHBOARD_HEADER_TEXT.LOCATION_PLACEHOLDER,
          })}
        />
      </div>

      {/* Customization Button */}
      <Button
        type="button"
        variant="outline"
        onClick={openCustomization}
        className="flex items-center gap-2 h-9 px-3.5 text-xs sm:text-sm font-medium border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-2xs hover:text-primary dark:hover:text-primary transition-colors shrink-0 cursor-pointer"
      >
        <SlidersHorizontal className="size-3.5 text-slate-500" />
        <span>
          {translateDashboard('customizeWidgets', {
            defaultValue: DASHBOARD_HEADER_TEXT.CUSTOMIZE_BUTTON,
          })}
        </span>
      </Button>
    </PageHeader>
  );
};

export default DashboardHeader;
