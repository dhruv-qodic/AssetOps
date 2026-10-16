import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, Sparkles } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useAssetStore } from '@/store/useAssetStore';
import { useDashboardStore } from '@/store/useDashboardStore';
import { ASSET_TRENDS_LINE_CHART_TEXT } from './constants/AssetTrendsLineChart.constants';

/**
 * @description: Renders a multi-line chart tracking fleet size growth and active allocations across selected timeframes
 * @return {JSX.Element}: Fleet growth and allocation trends chart component JSX
 */
export const AssetTrendsLineChart: React.FC = () => {
  const { t: translateDashboard } = useTranslation('dashboard');
  const assets = useAssetStore((s) => s.assets);
  const { timeRange, selectedLocation } = useDashboardStore();

  const labelTotalFleet = translateDashboard('trends.totalFleet', {
    defaultValue: ASSET_TRENDS_LINE_CHART_TEXT.TOTAL_FLEET,
  });
  const labelAssigned = translateDashboard('trends.assigned', {
    defaultValue: ASSET_TRENDS_LINE_CHART_TEXT.ASSIGNED,
  });

  /**
   * @description: Filters asset records according to the active location filter
   * @return {Array<Asset>}: Filtered asset items array
   */
  const filteredAssets = useMemo(() => {
    if (selectedLocation === 'All') return assets;
    return assets.filter((a) => a.location.toLowerCase() === selectedLocation.toLowerCase());
  }, [assets, selectedLocation]);

  const totalCount = filteredAssets.length;
  const allocatedCount = filteredAssets.filter((a) => a.status === 'Allocated').length;

  /**
   * @description: Computes time series data points based on selected dashboard timeframe
   * @return {Array<{time: string, total: number, assigned: number}>}: Array of formatted trend data points
   */
  const data = useMemo(() => {
    const scale = (factor: number, base: number) => Math.max(0, Math.round(base * factor));

    switch (timeRange) {
      case 'Last 7 Days':
        return [
          { time: 'Day 1', total: scale(0.85, totalCount), assigned: scale(0.8, allocatedCount) },
          { time: 'Day 2', total: scale(0.88, totalCount), assigned: scale(0.82, allocatedCount) },
          { time: 'Day 3', total: scale(0.9, totalCount), assigned: scale(0.85, allocatedCount) },
          { time: 'Day 4', total: scale(0.92, totalCount), assigned: scale(0.89, allocatedCount) },
          { time: 'Day 5', total: scale(0.95, totalCount), assigned: scale(0.92, allocatedCount) },
          { time: 'Day 6', total: scale(0.98, totalCount), assigned: scale(0.96, allocatedCount) },
          { time: 'Day 7', total: totalCount, assigned: allocatedCount },
        ];
      case 'Last 90 Days':
        return [
          { time: 'M1 - W1', total: scale(0.65, totalCount), assigned: scale(0.6, allocatedCount) },
          {
            time: 'M1 - W3',
            total: scale(0.72, totalCount),
            assigned: scale(0.68, allocatedCount),
          },
          { time: 'M2 - W1', total: scale(0.8, totalCount), assigned: scale(0.76, allocatedCount) },
          {
            time: 'M2 - W3',
            total: scale(0.88, totalCount),
            assigned: scale(0.84, allocatedCount),
          },
          { time: 'M3 - W1', total: scale(0.94, totalCount), assigned: scale(0.9, allocatedCount) },
          { time: 'M3 - W4', total: totalCount, assigned: allocatedCount },
        ];
      case 'Year to Date':
        return [
          { time: 'Jan', total: scale(0.5, totalCount), assigned: scale(0.45, allocatedCount) },
          { time: 'Feb', total: scale(0.6, totalCount), assigned: scale(0.55, allocatedCount) },
          { time: 'Mar', total: scale(0.7, totalCount), assigned: scale(0.66, allocatedCount) },
          { time: 'Apr', total: scale(0.82, totalCount), assigned: scale(0.78, allocatedCount) },
          { time: 'May', total: scale(0.91, totalCount), assigned: scale(0.88, allocatedCount) },
          { time: 'Jun', total: totalCount, assigned: allocatedCount },
        ];
      case 'All Time':
        return [
          { time: '2022', total: scale(0.25, totalCount), assigned: scale(0.2, allocatedCount) },
          { time: '2023', total: scale(0.45, totalCount), assigned: scale(0.4, allocatedCount) },
          { time: '2024', total: scale(0.7, totalCount), assigned: scale(0.68, allocatedCount) },
          { time: '2025', total: scale(0.88, totalCount), assigned: scale(0.85, allocatedCount) },
          { time: '2026', total: totalCount, assigned: allocatedCount },
        ];
      case 'Last 30 Days':
      default:
        return [
          { time: 'Week 1', total: scale(0.78, totalCount), assigned: scale(0.72, allocatedCount) },
          { time: 'Week 2', total: scale(0.84, totalCount), assigned: scale(0.8, allocatedCount) },
          { time: 'Week 3', total: scale(0.92, totalCount), assigned: scale(0.88, allocatedCount) },
          { time: 'Week 4', total: totalCount, assigned: allocatedCount },
        ];
    }
  }, [timeRange, totalCount, allocatedCount]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <TrendingUp className="size-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {translateDashboard('widgets.growthTrend', {
                defaultValue: ASSET_TRENDS_LINE_CHART_TEXT.TITLE,
              })}
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">
              {translateDashboard('trends.timeframe', {
                range: timeRange,
                defaultValue: ASSET_TRENDS_LINE_CHART_TEXT.getTimeframeText(timeRange),
              })}
            </span>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary/10 text-primary self-start sm:self-auto">
          <Sparkles className="size-3" />
          {translateDashboard('trends.badge', { defaultValue: ASSET_TRENDS_LINE_CHART_TEXT.BADGE })}
        </span>
      </div>

      {/* Line Chart */}
      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              className="stroke-slate-100 dark:stroke-slate-800/80"
            />
            <XAxis
              dataKey="time"
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
              content={({ active, payload, label }) => {
                if (active && payload.length) {
                  return (
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-xl border border-slate-200/80 dark:border-slate-700 text-xs space-y-1.5 animate-in fade-in zoom-in-95">
                      <p className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700/60 pb-1">
                        {label}
                      </p>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-1.5">
                          <span className="size-2 rounded-full bg-primary" />
                          <span className="text-slate-500 dark:text-slate-400">
                            {labelTotalFleet}:
                          </span>
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {payload[0]?.value}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-1.5">
                          <span className="size-2 rounded-full bg-emerald-500" />
                          <span className="text-slate-500 dark:text-slate-400">
                            {labelAssigned}:
                          </span>
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {payload[1]?.value}
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend iconType="circle" wrapperStyle={{ paddingBottom: '12px', fontSize: '11px' }} />
            <Line
              type="monotone"
              dataKey="total"
              name={labelTotalFleet}
              stroke="var(--primary)"
              strokeWidth={3}
              dot={{ r: 3, fill: 'var(--primary)' }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="assigned"
              name={labelAssigned}
              stroke="#10B981"
              strokeWidth={3}
              strokeDasharray="4 4"
              dot={{ r: 3, fill: '#10B981' }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AssetTrendsLineChart;
