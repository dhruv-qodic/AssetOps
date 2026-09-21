import React, { useMemo } from 'react';
import { BarChart3, Layers } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useAssetStore } from '@/store/useAssetStore';
import { useDashboardStore } from '@/store/useDashboardStore';
import { ASSET_CATEGORIES } from '@/constans/asset.constants';

export const AssetLifecycleChart: React.FC = () => {
  const assets = useAssetStore((s) => s.assets);
  const { selectedLocation } = useDashboardStore();

  const filteredAssets = useMemo(() => {
    if (selectedLocation === 'All') return assets;
    return assets.filter((a) => a.location.toLowerCase() === selectedLocation.toLowerCase());
  }, [assets, selectedLocation]);

  // Aggregate status breakdown per major asset category
  const chartData = useMemo(() => {
    const mainCategories = ASSET_CATEGORIES.slice(0, 5); // Laptop, Mobile, Monitor, Accessories, Desktop

    return mainCategories.map((cat) => {
      const categoryAssets = filteredAssets.filter((a) => a.category === cat);
      const allocated = categoryAssets.filter((a) => a.status === 'Allocated').length;
      const available = categoryAssets.filter((a) => a.status === 'Available').length;
      const maintenance = categoryAssets.filter((a) => a.status === 'Maintenance').length;

      return {
        category: cat,
        Allocated: allocated,
        Available: available,
        Maintenance: maintenance,
        total: categoryAssets.length,
      };
    });
  }, [filteredAssets]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full text-left">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 text-[#4C40F7] dark:bg-indigo-950/50 dark:text-indigo-400">
            <BarChart3 className="size-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Asset Status by Category
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">
              Operational status breakdown across hardware categories
            </span>
          </div>
        </div>

        {/* Total Badge */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <Layers className="size-3.5 text-slate-400" />
            {filteredAssets.length} Assets
          </span>
        </div>
      </div>

      {/* Bar Chart Visualization */}
      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              className="stroke-slate-100 dark:stroke-slate-800/80"
            />
            <XAxis
              dataKey="category"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#94A3B8' }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#94A3B8' }}
              dx={-5}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: 'rgba(76, 64, 247, 0.04)' }}
              content={({ active, payload, label }) => {
                if (active && payload.length) {
                  return (
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-xl border border-slate-200/80 dark:border-slate-700 text-xs space-y-1.5 animate-in fade-in zoom-in-95">
                      <p className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700/60 pb-1">
                        {label}
                      </p>
                      {payload.map((entry) => (
                        <div key={entry.name} className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="size-2 rounded-full"
                              style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-slate-500 dark:text-slate-400">
                              {entry.name}:
                            </span>
                          </div>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {entry.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend iconType="circle" wrapperStyle={{ paddingBottom: '12px', fontSize: '11px' }} />
            <Bar dataKey="Allocated" fill="#160dba" radius={[4, 4, 0, 0]} maxBarSize={28} />
            <Bar dataKey="Available" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={28} />
            <Bar dataKey="Maintenance" fill="#F59E0B" radius={[4, 4, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AssetLifecycleChart;
