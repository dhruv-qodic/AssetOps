import React from 'react';

interface CategoryItem {
  name: string;
  percentage: number;
  color: string;
}

const defaultCategories: CategoryItem[] = [
  { name: 'Laptop', percentage: 34, color: '#3B82F6' },
  { name: 'Mobile', percentage: 22, color: '#0EA5E9' },
  { name: 'Monitor', percentage: 18, color: '#F59E0B' },
  { name: 'Accessories', percentage: 16, color: '#10B981' },
  { name: 'Others', percentage: 10, color: '#A855F7' },
];

export const AssetCategoryDistributionChart: React.FC = () => {
  const radius = 64;
  const circumference = 2 * Math.PI * radius;

  // Compute stroke offsets dynamically
  let accumulatedPercent = 0;
  const segments = defaultCategories.map((item) => {
    const strokeDash = (item.percentage / 100) * circumference;
    const strokeOffset = -((accumulatedPercent / 100) * circumference);
    accumulatedPercent += item.percentage;
    return {
      ...item,
      strokeDash,
      strokeOffset,
    };
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between">
      <div>
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
          Asset Category Distribution
        </h3>

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
              1,248
            </span>
            <span className="text-[11px] font-medium text-slate-400">
              Total Assets
            </span>
          </div>
        </div>
      </div>

      {/* Category Breakdown Legend */}
      <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        {defaultCategories.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between text-xs sm:text-sm"
          >
            <div className="flex items-center gap-2">
              <span
                className="size-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                {item.name}
              </span>
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetCategoryDistributionChart;
