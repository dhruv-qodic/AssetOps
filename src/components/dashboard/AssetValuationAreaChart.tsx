import React, { useMemo } from 'react';
import { DollarSign } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAssetStore } from '@/store/useAssetStore';
import { useDashboardStore } from '@/store/useDashboardStore';

export const AssetValuationAreaChart: React.FC = () => {
  const assets = useAssetStore((s) => s.assets);
  const { timeRange, selectedLocation } = useDashboardStore();

  const filteredAssets = useMemo(() => {
    if (selectedLocation === 'All') return assets;
    return assets.filter(
      (a) => a.location.toLowerCase() === selectedLocation.toLowerCase(),
    );
  }, [assets, selectedLocation]);

  const totalValue = useMemo(() => {
    return filteredAssets.reduce((acc, a) => acc + (a.purchaseCost || 0), 0);
  }, [filteredAssets]);

  const valuationData = useMemo(() => {
    const scale = (factor: number) => Math.max(0, Math.round(totalValue * factor));

    switch (timeRange) {
      case 'Last 7 Days':
        return [
          { time: 'Day 1', valuation: scale(0.92) },
          { time: 'Day 2', valuation: scale(0.93) },
          { time: 'Day 3', valuation: scale(0.95) },
          { time: 'Day 4', valuation: scale(0.96) },
          { time: 'Day 5', valuation: scale(0.98) },
          { time: 'Day 6', valuation: scale(0.99) },
          { time: 'Day 7', valuation: totalValue },
        ];
      case 'Last 90 Days':
        return [
          { time: 'Month 1', valuation: scale(0.7) },
          { time: 'Month 2', valuation: scale(0.85) },
          { time: 'Month 3', valuation: totalValue },
        ];
      case 'Year to Date':
        return [
          { time: 'Jan', valuation: scale(0.4) },
          { time: 'Feb', valuation: scale(0.55) },
          { time: 'Mar', valuation: scale(0.68) },
          { time: 'Apr', valuation: scale(0.82) },
          { time: 'May', valuation: scale(0.92) },
          { time: 'Jun', valuation: totalValue },
        ];
      case 'All Time':
        return [
          { time: '2022', valuation: scale(0.2) },
          { time: '2023', valuation: scale(0.4) },
          { time: '2024', valuation: scale(0.65) },
          { time: '2025', valuation: scale(0.85) },
          { time: '2026', valuation: totalValue },
        ];
      case 'Last 30 Days':
      default:
        return [
          { time: 'W1', valuation: scale(0.8) },
          { time: 'W2', valuation: scale(0.88) },
          { time: 'W3', valuation: scale(0.94) },
          { time: 'W4', valuation: totalValue },
        ];
    }
  }, [timeRange, totalValue]);

  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(totalValue);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
            <DollarSign className="size-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Asset Valuation & Capital Spend
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">
              Cumulative hardware asset value over time
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <span className="text-xs font-bold text-slate-900 dark:text-white bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-2.5 py-1 rounded-lg">
            {formattedTotal}
          </span>
        </div>
      </div>

      {/* Area Chart */}
      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={valuationData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValuation" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
              </linearGradient>
            </defs>

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
              tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
              dx={-5}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload.length) {
                  return (
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-xl border border-slate-200/80 dark:border-slate-700 text-xs space-y-1.5 animate-in fade-in zoom-in-95">
                      <p className="font-bold text-slate-900 dark:text-white">{label}</p>
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-purple-600" />
                        <span className="text-slate-500 dark:text-slate-400">Total Valuation:</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          ${Number(payload[0]?.value).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey="valuation"
              stroke="#8B5CF6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorValuation)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AssetValuationAreaChart;
