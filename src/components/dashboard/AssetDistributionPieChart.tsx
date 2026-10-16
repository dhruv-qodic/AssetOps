import React, { useMemo } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { useAssetStore } from '@/store/useAssetStore';
import { useDashboardStore } from '@/store/useDashboardStore';
import { ASSET_DISTRIBUTION_PIE_CHART_CONSTANTS } from './constants/AssetDistributionPieChart.constants';
import { DonutChart } from '@/components/common/DonutChart';

/**
 * @description: Renders a donut chart widget visualizing asset status distributions (In Use, In Storage, Maintenance, Deployed)
 * @return {JSX.element}: Asset status distribution donut chart card JSX
 */
export const AssetDistributionPieChart: React.FC = () => {
  const assets = useAssetStore((s) => s.assets);
  const { selectedLocation } = useDashboardStore();

  /**
   * @description: Filters assets based on the dashboard location filter
   * @return {Array<Asset>}: Filtered asset items array
   */
  const filteredAssets = useMemo(() => {
    if (selectedLocation === 'All') return assets;
    return assets.filter((a) => a.location.toLowerCase() === selectedLocation.toLowerCase());
  }, [assets, selectedLocation]);

  const totalAssetsCount = filteredAssets.length;

  const inUseCount = filteredAssets.filter((a) => a.status === 'Allocated').length;
  const inStorageCount = filteredAssets.filter((a) => a.status === 'Available').length;
  const inMaintenanceCount = filteredAssets.filter((a) => a.status === 'Maintenance').length;
  const deployedCount = filteredAssets.filter(
    (a) => a.status === 'Retired' || a.status === 'Lost',
  ).length;

  /**
   * @description: Computes circular stroke offsets and percentages for each asset status segment
   * @return {Array<StatusSegment>}: Array of formatted status segments with SVG dash properties
   */
  const segmentsData = useMemo(() => {
    const items = [
      {
        id: ASSET_DISTRIBUTION_PIE_CHART_CONSTANTS.SEGMENT_IDS.IN_USE,
        label: ASSET_DISTRIBUTION_PIE_CHART_CONSTANTS.LABELS.IN_USE,
        count: inUseCount,
        percentage: totalAssetsCount > 0 ? Math.round((inUseCount / totalAssetsCount) * 100) : 22,
        color: ASSET_DISTRIBUTION_PIE_CHART_CONSTANTS.COLORS.IN_USE,
      },
      {
        id: ASSET_DISTRIBUTION_PIE_CHART_CONSTANTS.SEGMENT_IDS.IN_STORAGE,
        label: ASSET_DISTRIBUTION_PIE_CHART_CONSTANTS.LABELS.IN_STORAGE,
        count: inStorageCount,
        percentage:
          totalAssetsCount > 0 ? Math.round((inStorageCount / totalAssetsCount) * 100) : 58,
        color: ASSET_DISTRIBUTION_PIE_CHART_CONSTANTS.COLORS.IN_STORAGE,
      },
      {
        id: ASSET_DISTRIBUTION_PIE_CHART_CONSTANTS.SEGMENT_IDS.IN_MAINTENANCE,
        label: ASSET_DISTRIBUTION_PIE_CHART_CONSTANTS.LABELS.IN_MAINTENANCE,
        count: inMaintenanceCount,
        percentage:
          totalAssetsCount > 0 ? Math.round((inMaintenanceCount / totalAssetsCount) * 100) : 12,
        color: ASSET_DISTRIBUTION_PIE_CHART_CONSTANTS.COLORS.IN_MAINTENANCE,
      },
      {
        id: ASSET_DISTRIBUTION_PIE_CHART_CONSTANTS.SEGMENT_IDS.DEPLOYED,
        label: ASSET_DISTRIBUTION_PIE_CHART_CONSTANTS.LABELS.DEPLOYED,
        count: deployedCount,
        percentage:
          totalAssetsCount > 0
            ? Math.max(
                0,
                100 -
                  (Math.round((inUseCount / totalAssetsCount) * 100) +
                    Math.round((inStorageCount / totalAssetsCount) * 100) +
                    Math.round((inMaintenanceCount / totalAssetsCount) * 100)),
              )
            : 8,
        color: ASSET_DISTRIBUTION_PIE_CHART_CONSTANTS.COLORS.DEPLOYED,
      },
    ];

    return items;
  }, [totalAssetsCount, inUseCount, inStorageCount, inMaintenanceCount, deployedCount]);

  const mainCenterPercentage = segmentsData[0]?.percentage ?? 22;

  return (
    <div className="bg-[#101726] text-white rounded-3xl border border-slate-800/80 p-6 sm:p-7 shadow-xl flex flex-col justify-between h-full text-left relative overflow-hidden">
      {/* Header with Title and More button matching reference */}
      <div className="flex items-center justify-between pb-2">
        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
          {ASSET_DISTRIBUTION_PIE_CHART_CONSTANTS.TITLE}
        </h3>
        <button
          type="button"
          aria-label={ASSET_DISTRIBUTION_PIE_CHART_CONSTANTS.ARIA_OPTIONS}
          className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800/60"
        >
          <MoreHorizontal className="size-5" />
        </button>
      </div>

      {/* Middle Section: Donut Ring Chart + Right Legend */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-auto py-3">
        {/* SVG Donut Ring Chart */}
        <DonutChart
          segments={segmentsData}
          radius={62}
          strokeWidth={20}
          trackClass="stroke-slate-800"
          centerPrimary={`${mainCenterPercentage}%`}
          centerPrimaryClass="text-2xl sm:text-3xl font-black text-white tracking-tight"
          sizeClass="size-44 sm:size-48"
        />

        {/* Right Side Vertical Legend */}
        <div className="flex flex-col gap-2.5 sm:pl-2 w-full sm:w-auto">
          {segmentsData.map((item) => (
            <div key={item.id} className="flex items-center gap-2 text-xs sm:text-sm">
              <span
                className="size-2.5 rounded-xs shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-300 font-medium whitespace-nowrap">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Horizontal Legend Row */}
      <div className="flex items-center gap-4 sm:gap-6 pt-4 border-t border-slate-800/80 text-xs font-semibold text-slate-300 overflow-x-auto">
        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className="size-2 rounded-xs"
            style={{ backgroundColor: ASSET_DISTRIBUTION_PIE_CHART_CONSTANTS.COLORS.IN_USE }}
          />
          <span>{ASSET_DISTRIBUTION_PIE_CHART_CONSTANTS.LABELS.IN_USE}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className="size-2 rounded-xs"
            style={{ backgroundColor: ASSET_DISTRIBUTION_PIE_CHART_CONSTANTS.COLORS.IN_STORAGE }}
          />
          <span>{ASSET_DISTRIBUTION_PIE_CHART_CONSTANTS.LABELS.IN_STORAGE}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className="size-2 rounded-xs"
            style={{ backgroundColor: ASSET_DISTRIBUTION_PIE_CHART_CONSTANTS.COLORS.DEPLOYED }}
          />
          <span>{ASSET_DISTRIBUTION_PIE_CHART_CONSTANTS.LABELS.DEPLOYED}</span>
        </div>
      </div>
    </div>
  );
};

export default AssetDistributionPieChart;
