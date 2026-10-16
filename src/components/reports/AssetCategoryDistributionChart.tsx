import React, { useMemo } from 'react';
import { PieChart, Laptop, Smartphone, Monitor, Headphones, Boxes } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAssetStore } from '@/store/useAssetStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { getAssetDepartment } from '@/utils/assetDepartment';
import { ASSET_CATEGORY_DISTRIBUTION_CHART_CONSTANTS } from './constants/AssetCategoryDistributionChart.constants';
import { DonutChart } from '@/components/common/DonutChart';

interface CategoryItem {
  name: string;
  count: number;
  percentage: number;
  color: string;
  icon: React.ElementType;
}

interface AssetCategoryDistributionChartProps {
  departmentFilter?: string;
}

/**
 * @description: Renders a donut chart and legend displaying inventory breakdown across device categories, filtered by department
 * @param {string}departmentFilter: Optional department filter code (defaults to 'All')
 * @returns {JSX.Element} Asset category distribution chart card JSX
 */
export const AssetCategoryDistributionChart: React.FC<AssetCategoryDistributionChartProps> = ({
  departmentFilter = ASSET_CATEGORY_DISTRIBUTION_CHART_CONSTANTS.DEFAULT_DEPARTMENT,
}) => {
  const { t: translateReports } = useTranslation('report');
  const { t: translateAssets } = useTranslation('asset');

  const assets = useAssetStore((s) => s.assets);
  const employees = useEmployeeStore((s) => s.employees);

  /**
   * @description: Filters asset records according to department ownership
   * @return {Asset[]}: Filtered asset array
   */
  const filteredAssets = useMemo(() => {
    if (departmentFilter === ASSET_CATEGORY_DISTRIBUTION_CHART_CONSTANTS.DEFAULT_DEPARTMENT)
      return assets;
    return assets.filter((asset) => {
      const dept = getAssetDepartment(asset, employees);
      return dept.toLowerCase() === departmentFilter.toLowerCase();
    });
  }, [assets, employees, departmentFilter]);

  // Dynamically calculate category counts from filtered assets
  const laptopCount = filteredAssets.filter(
    (a) => a.category === ASSET_CATEGORY_DISTRIBUTION_CHART_CONSTANTS.CATEGORIES.LAPTOP,
  ).length;
  const mobileCount = filteredAssets.filter(
    (a) => a.category === ASSET_CATEGORY_DISTRIBUTION_CHART_CONSTANTS.CATEGORIES.MOBILE,
  ).length;
  const monitorCount = filteredAssets.filter(
    (a) => a.category === ASSET_CATEGORY_DISTRIBUTION_CHART_CONSTANTS.CATEGORIES.MONITOR,
  ).length;
  const accessoriesCount = filteredAssets.filter(
    (a) => a.category === ASSET_CATEGORY_DISTRIBUTION_CHART_CONSTANTS.CATEGORIES.ACCESSORIES,
  ).length;
  const standardCategories: string[] = [
    ASSET_CATEGORY_DISTRIBUTION_CHART_CONSTANTS.CATEGORIES.LAPTOP,
    ASSET_CATEGORY_DISTRIBUTION_CHART_CONSTANTS.CATEGORIES.MOBILE,
    ASSET_CATEGORY_DISTRIBUTION_CHART_CONSTANTS.CATEGORIES.MONITOR,
    ASSET_CATEGORY_DISTRIBUTION_CHART_CONSTANTS.CATEGORIES.ACCESSORIES,
  ];
  const othersCount = filteredAssets.filter((a) => !standardCategories.includes(a.category)).length;

  const totalAssetsCount = filteredAssets.length;

  // Calculate percentages strictly based on actual assets in the system
  const categories: CategoryItem[] = useMemo(
    () => [
      {
        name: translateAssets('categories.Laptop', {
          defaultValue: ASSET_CATEGORY_DISTRIBUTION_CHART_CONSTANTS.CATEGORIES.LAPTOP,
        }),
        count: laptopCount,
        percentage: totalAssetsCount > 0 ? Math.round((laptopCount / totalAssetsCount) * 100) : 0,
        color: ASSET_CATEGORY_DISTRIBUTION_CHART_CONSTANTS.COLORS.LAPTOP,
        icon: Laptop,
      },
      {
        name: translateAssets('categories.Mobile', {
          defaultValue: ASSET_CATEGORY_DISTRIBUTION_CHART_CONSTANTS.CATEGORIES.MOBILE,
        }),
        count: mobileCount,
        percentage: totalAssetsCount > 0 ? Math.round((mobileCount / totalAssetsCount) * 100) : 0,
        color: ASSET_CATEGORY_DISTRIBUTION_CHART_CONSTANTS.COLORS.MOBILE,
        icon: Smartphone,
      },
      {
        name: translateAssets('categories.Monitor', {
          defaultValue: ASSET_CATEGORY_DISTRIBUTION_CHART_CONSTANTS.CATEGORIES.MONITOR,
        }),
        count: monitorCount,
        percentage: totalAssetsCount > 0 ? Math.round((monitorCount / totalAssetsCount) * 100) : 0,
        color: ASSET_CATEGORY_DISTRIBUTION_CHART_CONSTANTS.COLORS.MONITOR,
        icon: Monitor,
      },
      {
        name: translateAssets('categories.Accessories', {
          defaultValue: ASSET_CATEGORY_DISTRIBUTION_CHART_CONSTANTS.CATEGORIES.ACCESSORIES,
        }),
        count: accessoriesCount,
        percentage:
          totalAssetsCount > 0 ? Math.round((accessoriesCount / totalAssetsCount) * 100) : 0,
        color: ASSET_CATEGORY_DISTRIBUTION_CHART_CONSTANTS.COLORS.ACCESSORIES,
        icon: Headphones,
      },
      {
        name: translateReports('charts.others', {
          defaultValue: ASSET_CATEGORY_DISTRIBUTION_CHART_CONSTANTS.CATEGORIES.OTHERS,
        }),
        count: othersCount,
        percentage:
          totalAssetsCount > 0
            ? Math.max(
                0,
                100 -
                  (Math.round((laptopCount / totalAssetsCount) * 100) +
                    Math.round((mobileCount / totalAssetsCount) * 100) +
                    Math.round((monitorCount / totalAssetsCount) * 100) +
                    Math.round((accessoriesCount / totalAssetsCount) * 100)),
              )
            : 0,
        color: ASSET_CATEGORY_DISTRIBUTION_CHART_CONSTANTS.COLORS.OTHERS,
        icon: Boxes,
      },
    ],
    [
      laptopCount,
      mobileCount,
      monitorCount,
      accessoriesCount,
      othersCount,
      totalAssetsCount,
      translateAssets,
      translateReports,
    ],
  );

  const displayTotal = totalAssetsCount.toLocaleString();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <PieChart className="size-4" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            {translateReports('charts.categoryDistribution', {
              defaultValue: ASSET_CATEGORY_DISTRIBUTION_CHART_CONSTANTS.TITLE,
            })}
          </h3>
        </div>

        {/* Donut Chart Container */}
        <div className="my-4 flex items-center justify-center">
          <DonutChart
            segments={categories}
            radius={64}
            strokeWidth={20}
            centerPrimary={displayTotal}
            centerPrimaryClass="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight"
            centerSecondary={translateAssets('kpi.totalAssets', {
              defaultValue: ASSET_CATEGORY_DISTRIBUTION_CHART_CONSTANTS.TOTAL_ASSETS_LABEL,
            })}
            centerSecondaryClass="text-[11px] font-medium text-slate-400"
            sizeClass="size-44 sm:size-48"
          />
        </div>
      </div>

      {/* Category Breakdown Legend */}
      <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        {categories.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              className="flex items-center justify-between text-xs sm:text-sm group"
            >
              <div className="flex items-center gap-2">
                <span
                  className="size-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <Icon className="size-3.5 text-slate-400 group-hover:text-primary transition-colors" />
                <span className="text-slate-600 dark:text-slate-300 font-medium">{item.name}</span>
              </div>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {item.percentage}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AssetCategoryDistributionChart;
