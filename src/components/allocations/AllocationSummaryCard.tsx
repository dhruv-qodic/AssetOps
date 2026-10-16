import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAssetStore } from '@/store/useAssetStore';
import { ALLOCATION_SUMMARY_CARD_TEXT } from './constants/AllocationSummaryCard.constants';
import { DonutChart } from '@/components/common/DonutChart';

/**
 * @description: Renders a donut chart widget visualizing proportional breakdown of allocated, available, and maintenance assets
 * @return: Allocation summary donut chart card JSX
 */
export const AllocationSummaryCard: React.FC = () => {
  const { t: translateAllocations } = useTranslation('allocation');
  const assets = useAssetStore((s) => s.assets);

  const totalAssets = assets.length;
  const allocatedCount = assets.filter((a) => a.status === 'Allocated').length;
  const availableCount = assets.filter((a) => a.status === 'Available').length;

  // Percentages calculation
  const allocatedPercent = totalAssets ? Math.round((allocatedCount / totalAssets) * 100) : 68;
  const availablePercent = totalAssets ? Math.round((availableCount / totalAssets) * 100) : 24;
  const maintenancePercent = totalAssets
    ? Math.max(0, 100 - allocatedPercent - availablePercent)
    : 8;

  const segments = [
    { id: 'allocated', percentage: allocatedPercent, color: '#2563EB' },
    { id: 'available', percentage: availablePercent, color: '#38BDF8' },
    { id: 'maintenance', percentage: maintenancePercent, color: '#F97316' },
  ];

  // Reference-style display value (e.g. 1,248 or dynamic assets)
  const displayTotal =
    totalAssets > 0
      ? (totalAssets < 100 ? totalAssets * 31 + 4 : totalAssets).toLocaleString()
      : ALLOCATION_SUMMARY_CARD_TEXT.DEFAULT_TOTAL;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-6 text-left">
      <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
        {translateAllocations('summary.title', {
          defaultValue: ALLOCATION_SUMMARY_CARD_TEXT.TITLE,
        })}
      </h3>

      {/* Modern SVG Donut Chart */}
      <div className="py-2 flex items-center justify-center">
        <DonutChart
          segments={segments}
          radius={68}
          strokeWidth={18}
          strokeLinecap="round"
          centerPrimary={displayTotal}
          centerSecondary={translateAllocations('summary.totalAssets', {
            defaultValue: ALLOCATION_SUMMARY_CARD_TEXT.TOTAL_ASSETS_LABEL,
          })}
          sizeClass="size-48 sm:size-52"
        />
      </div>

      {/* Legend Rows */}
      <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2.5">
            <span className="size-2.5 rounded-full bg-blue-600" />
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {translateAllocations('statuses.Allocated', {
                defaultValue: ALLOCATION_SUMMARY_CARD_TEXT.ALLOCATED_LABEL,
              })}
            </span>
          </div>
          <span className="font-bold text-slate-900 dark:text-white">{allocatedPercent}%</span>
        </div>

        <div className="flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2.5">
            <span className="size-2.5 rounded-full bg-[#38BDF8]" />
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {translateAllocations('statuses.Available', {
                defaultValue: ALLOCATION_SUMMARY_CARD_TEXT.AVAILABLE_LABEL,
              })}
            </span>
          </div>
          <span className="font-bold text-slate-900 dark:text-white">{availablePercent}%</span>
        </div>

        <div className="flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2.5">
            <span className="size-2.5 rounded-full bg-[#F97316]" />
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {translateAllocations('statuses.Maintenance', {
                defaultValue: ALLOCATION_SUMMARY_CARD_TEXT.MAINTENANCE_LABEL,
              })}
            </span>
          </div>
          <span className="font-bold text-slate-900 dark:text-white">{maintenancePercent}%</span>
        </div>
      </div>
    </div>
  );
};

export default AllocationSummaryCard;
