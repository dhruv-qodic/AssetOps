import React, { useMemo } from 'react';
import { PieChart, Laptop, Smartphone, Monitor, Headphones, Boxes } from 'lucide-react';
import { useAssetStore } from '@/store/useAssetStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { getAssetDepartment } from '@/utils/assetDepartment';

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

export const AssetCategoryDistributionChart: React.FC<AssetCategoryDistributionChartProps> = ({
  departmentFilter = 'All',
}) => {
  const { assets } = useAssetStore();
  const { employees } = useEmployeeStore();

  // Filter assets dynamically by department
  const filteredAssets = useMemo(() => {
    if (departmentFilter === 'All') return assets;
    return assets.filter((asset) => {
      const dept = getAssetDepartment(asset, employees);
      return dept.toLowerCase() === departmentFilter.toLowerCase();
    });
  }, [assets, employees, departmentFilter]);

  // Dynamically calculate category counts from filtered assets
  const laptopCount = filteredAssets.filter((a) => a.category === 'Laptop').length;
  const mobileCount = filteredAssets.filter((a) => a.category === 'Mobile').length;
  const monitorCount = filteredAssets.filter((a) => a.category === 'Monitor').length;
  const accessoriesCount = filteredAssets.filter((a) => a.category === 'Accessories').length;
  const othersCount = filteredAssets.filter(
    (a) => !['Laptop', 'Mobile', 'Monitor', 'Accessories'].includes(a.category)
  ).length;

  const totalAssetsCount = filteredAssets.length;

  // Calculate percentages strictly based on actual assets in the system
  const categories: CategoryItem[] = [
    {
      name: 'Laptop',
      count: laptopCount,
      percentage: totalAssetsCount > 0 ? Math.round((laptopCount / totalAssetsCount) * 100) : 0,
      color: '#2563EB', // Blue 600
      icon: Laptop,
    },
    {
      name: 'Mobile',
      count: mobileCount,
      percentage: totalAssetsCount > 0 ? Math.round((mobileCount / totalAssetsCount) * 100) : 0,
      color: '#0284C7', // Sky 600
      icon: Smartphone,
    },
    {
      name: 'Monitor',
      count: monitorCount,
      percentage: totalAssetsCount > 0 ? Math.round((monitorCount / totalAssetsCount) * 100) : 0,
      color: '#F59E0B', // Amber 500
      icon: Monitor,
    },
    {
      name: 'Accessories',
      count: accessoriesCount,
      percentage: totalAssetsCount > 0 ? Math.round((accessoriesCount / totalAssetsCount) * 100) : 0,
      color: '#10B981', // Emerald 500
      icon: Headphones,
    },
    {
      name: 'Others',
      count: othersCount,
      percentage: totalAssetsCount > 0 ? Math.max(0, 100 - (
        Math.round((laptopCount / totalAssetsCount) * 100) +
        Math.round((mobileCount / totalAssetsCount) * 100) +
        Math.round((monitorCount / totalAssetsCount) * 100) +
        Math.round((accessoriesCount / totalAssetsCount) * 100)
      )) : 0,
      color: '#64748B', // Slate Blue 500
      icon: Boxes,
    },
  ];

  const radius = 64;
  const circumference = 2 * Math.PI * radius;

  // Compute stroke offsets dynamically
  let accumulatedPercent = 0;
  const segments = categories.map((item) => {
    const strokeDash = (item.percentage / 100) * circumference;
    const strokeOffset = -((accumulatedPercent / 100) * circumference);
    accumulatedPercent += item.percentage;
    return {
      ...item,
      strokeDash,
      strokeOffset,
    };
  });

  const displayTotal = totalAssetsCount.toLocaleString();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
            <PieChart className="size-4" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            Asset Category Distribution
          </h3>
        </div>

        {/* Donut Chart Container */}
        <div className="relative flex items-center justify-center my-4">
          <svg
            className="size-44 sm:size-48 -rotate-90 transform"
            viewBox="0 0 170 170"
          >
            {/* Background Track */}
            <circle
              cx="85"
              cy="85"
              r={radius}
              className="stroke-slate-100 dark:stroke-slate-800"
              strokeWidth="20"
              fill="transparent"
            />

            {/* Render Category Segments */}
            {segments.map((seg) => (
              <circle
                key={seg.name}
                cx="85"
                cy="85"
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

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {displayTotal}
            </span>
            <span className="text-[11px] font-medium text-slate-400">
              Total Assets
            </span>
          </div>
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
                <Icon className="size-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                <span className="text-slate-600 dark:text-slate-300 font-medium">
                  {item.name}
                </span>
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
