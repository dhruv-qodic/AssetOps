import React, { useMemo } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { useAssetStore } from '@/store/useAssetStore';
import { useDashboardStore } from '@/store/useDashboardStore';

interface StatusSegment {
  id: string;
  label: string;
  count: number;
  percentage: number;
  color: string;
  strokeDash: number;
  strokeOffset: number;
}

export const AssetDistributionPieChart: React.FC = () => {
  const assets = useAssetStore((s) => s.assets);
  const { selectedLocation } = useDashboardStore();

  const filteredAssets = useMemo(() => {
    if (selectedLocation === 'All') return assets;
    return assets.filter(
      (a) => a.location.toLowerCase() === selectedLocation.toLowerCase(),
    );
  }, [assets, selectedLocation]);

  const totalAssetsCount = filteredAssets.length;

  const inUseCount = filteredAssets.filter((a) => a.status === 'Allocated').length;
  const inStorageCount = filteredAssets.filter((a) => a.status === 'Available').length;
  const inMaintenanceCount = filteredAssets.filter((a) => a.status === 'Maintenance').length;
  const deployedCount = filteredAssets.filter(
    (a) => a.status === 'Retired' || a.status === 'Lost',
  ).length;

  const radius = 62;
  const circumference = 2 * Math.PI * radius;

  // Segments definition matching reference image
  const segmentsData = useMemo(() => {
    const items = [
      {
        id: 'in_use',
        label: 'In Use',
        count: inUseCount,
        percentage: totalAssetsCount > 0 ? Math.round((inUseCount / totalAssetsCount) * 100) : 22,
        color: '#3B82F6', // Vibrant Blue
      },
      {
        id: 'in_storage',
        label: 'In Storage',
        count: inStorageCount,
        percentage:
          totalAssetsCount > 0 ? Math.round((inStorageCount / totalAssetsCount) * 100) : 58,
        color: '#22C55E', // Bright Emerald / Mint Green
      },
      {
        id: 'in_maintenance',
        label: 'In Maintenance',
        count: inMaintenanceCount,
        percentage:
          totalAssetsCount > 0 ? Math.round((inMaintenanceCount / totalAssetsCount) * 100) : 12,
        color: '#F97316', // Orange / Amber
      },
      {
        id: 'deployed',
        label: 'Deployed',
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
        color: '#06B6D4', // Cyan
      },
    ];

    let accumulated = 0;
    const computedSegments: StatusSegment[] = items.map((item) => {
      const strokeDash = (item.percentage / 100) * circumference;
      const strokeOffset = -((accumulated / 100) * circumference);
      accumulated += item.percentage;
      return {
        ...item,
        strokeDash,
        strokeOffset,
      };
    });

    return computedSegments;
  }, [totalAssetsCount, inUseCount, inStorageCount, inMaintenanceCount, deployedCount, circumference]);

  const mainCenterPercentage = segmentsData[0]?.percentage ?? 22;

  return (
    <div className="bg-[#101726] text-white rounded-3xl border border-slate-800/80 p-6 sm:p-7 shadow-xl flex flex-col justify-between h-full text-left relative overflow-hidden">
      {/* Header with Title and More button matching reference */}
      <div className="flex items-center justify-between pb-2">
        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
          Asset Status Distribution
        </h3>
        <button
          type="button"
          aria-label="Options"
          className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800/60"
        >
          <MoreHorizontal className="size-5" />
        </button>
      </div>

      {/* Middle Section: Donut Ring Chart + Right Legend */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-auto py-3">
        {/* SVG Donut Ring Chart */}
        <div className="relative size-44 sm:size-48 flex items-center justify-center shrink-0">
          <svg className="size-full -rotate-90 transform" viewBox="0 0 160 160">
            {/* Background Track */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              className="stroke-slate-800"
              strokeWidth="20"
              fill="transparent"
            />

            {/* Status Segments */}
            {segmentsData.map((seg) => (
              <circle
                key={seg.id}
                cx="80"
                cy="80"
                r={radius}
                stroke={seg.color}
                strokeWidth="20"
                fill="transparent"
                strokeDasharray={`${seg.strokeDash} ${circumference}`}
                strokeDashoffset={seg.strokeOffset}
                strokeLinecap="butt"
                className="transition-all duration-700 ease-out hover:opacity-90"
              />
            ))}
          </svg>

          {/* Center Percentage Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {mainCenterPercentage}%
            </span>
          </div>
        </div>

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
          <span className="size-2 rounded-xs bg-[#3B82F6]" />
          <span>In Use</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="size-2 rounded-xs bg-[#F97316]" />
          <span>In Storage</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="size-2 rounded-xs bg-[#06B6D4]" />
          <span>Deployed</span>
        </div>
      </div>
    </div>
  );
};

export default AssetDistributionPieChart;
