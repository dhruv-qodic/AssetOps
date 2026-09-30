import React, { useMemo, useState } from 'react';
import { Calculator, TrendingDown, Layers, Sparkles } from 'lucide-react';
import {
  ComposedChart,
  Area,
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
import { calculateDepreciationSchedule, calculateTotalAssetCost } from '@/utils/depreciation';
import type { Asset } from '@/types/asset';

interface AssetDepreciationChartProps {
  assets?: Asset[];
  initialUsefulLife?: number;
  className?: string;
  isLoading?: boolean;
}

const USEFUL_LIFE_OPTIONS = [3, 5, 7, 10] as const;

export const AssetDepreciationChart: React.FC<AssetDepreciationChartProps> = ({
  assets: propAssets,
  initialUsefulLife = 5,
  className = '',
  isLoading = false,
}) => {
  const storeAssets = useAssetStore((s) => s.assets);
  const { selectedLocation } = useDashboardStore();
  const [usefulLifeYears, setUsefulLifeYears] = useState<number>(initialUsefulLife);

  // Use props if provided, otherwise filter store assets by dashboard location
  const assets = propAssets ?? storeAssets;

  const filteredAssets = useMemo(() => {
    if (propAssets) return propAssets;
    if (selectedLocation === 'All') return assets;
    return assets.filter((a) => a.location.toLowerCase() === selectedLocation.toLowerCase());
  }, [assets, propAssets, selectedLocation]);

  const totalCost = useMemo(() => calculateTotalAssetCost(filteredAssets), [filteredAssets]);

  const { schedule, annualDepreciation } = useMemo(() => {
    return calculateDepreciationSchedule(totalCost, usefulLifeYears);
  }, [totalCost, usefulLifeYears]);

  const formattedTotalCost = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(totalCost);

  const formattedAnnualDepreciation = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(annualDepreciation);

  if (isLoading) {
    return (
      <div
        className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs animate-pulse flex flex-col justify-center items-center h-80 ${className}`}
      >
        <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-800 mb-3" />
        <div className="h-4 w-44 bg-slate-200 dark:bg-slate-800 rounded-md mb-2" />
        <div className="h-3 w-64 bg-slate-100 dark:bg-slate-800/60 rounded-md" />
      </div>
    );
  }

  if (filteredAssets.length === 0 || totalCost === 0) {
    return (
      <div
        className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between h-full text-left ${className}`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400">
              <Calculator className="size-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Asset Depreciation & Book Value
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">
                Straight-line annual amortization curve & net book value forecast
              </span>
            </div>
          </div>
        </div>
        <div className="py-14 text-center text-slate-400 space-y-2">
          <TrendingDown className="size-9 mx-auto text-slate-300 dark:text-slate-600" />
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            No depreciation data available
          </p>
          <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
            Hardware assets with recorded acquisition costs are required to project straight-line
            depreciation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full text-left space-y-4 ${className}`}
    >
      {/* 1. Header: Title, Controls, and KPIs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400 shrink-0">
            <Calculator className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Asset Depreciation & Book Value
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300">
                <Sparkles className="size-2.5" />
                Straight-Line Model
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              Annual rate = Purchase Cost / Useful Life ({usefulLifeYears} Years)
            </span>
          </div>
        </div>

        {/* Useful Life Selector & Annual Rate Pill */}
        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          {/* Useful Life Toggle Buttons */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold">
            <span className="text-[10.5px] text-slate-500 dark:text-slate-400 px-1.5 hidden md:inline">
              Useful Life:
            </span>
            {USEFUL_LIFE_OPTIONS.map((years) => (
              <button
                key={years}
                type="button"
                onClick={() => setUsefulLifeYears(years)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  usefulLifeYears === years
                    ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title={`Calculate depreciation for ${years} years useful life`}
              >
                {years}Y
              </button>
            ))}
          </div>

          {/* Annual Rate Badge */}
          <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/80 px-2.5 py-1.5 rounded-lg border border-teal-200/60 dark:border-teal-800/60">
            {formattedAnnualDepreciation} / yr
          </span>
        </div>
      </div>

      {/* 2. Composed Visualization: Area (Book Value + Accumulated) + Line (Annual Dep) */}
      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={schedule} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
            <defs>
              {/* Emerald/Teal gradient for Net Book Value */}
              <linearGradient id="colorBookValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
              {/* Amber gradient for Accumulated Depreciation */}
              <linearGradient id="colorAccumulated" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              className="stroke-slate-100 dark:stroke-slate-800/80"
            />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#94A3B8' }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#94A3B8' }}
              tickFormatter={(v: number) => `$${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
              dx={-5}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload.length) {
                  return (
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-xl border border-slate-200/80 dark:border-slate-700 text-xs space-y-1.5 animate-in fade-in zoom-in-95 text-left">
                      <p className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700/60 pb-1">
                        {label}
                      </p>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-emerald-500" />
                            <span className="text-slate-500 dark:text-slate-400">
                              Net Book Value:
                            </span>
                          </div>
                          <span className="font-bold text-slate-900 dark:text-white">
                            $
                            {Number(
                              payload.find((p) => p.dataKey === 'bookValue')?.value || 0,
                            ).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-amber-500" />
                            <span className="text-slate-500 dark:text-slate-400">
                              Accumulated Dep:
                            </span>
                          </div>
                          <span className="font-bold text-slate-900 dark:text-white">
                            $
                            {Number(
                              payload.find((p) => p.dataKey === 'accumulatedDepreciation')?.value ||
                                0,
                            ).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-[#155DFC]" />
                            <span className="text-slate-500 dark:text-slate-400">
                              Annual Expense:
                            </span>
                          </div>
                          <span className="font-bold text-slate-900 dark:text-white">
                            $
                            {Number(
                              payload.find((p) => p.dataKey === 'annualDepreciation')?.value || 0,
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend iconType="circle" wrapperStyle={{ paddingBottom: '8px', fontSize: '11px' }} />/
            {/* Area Series 1: Net Book Value */}
            <Area
              type="monotone"
              dataKey="bookValue"
              name="Net Book Value"
              stroke="#10B981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorBookValue)"
            />
            {/* Area Series 2: Accumulated Depreciation */}
            <Area
              type="monotone"
              dataKey="accumulatedDepreciation"
              name="Accumulated Depreciation"
              stroke="#F59E0B"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorAccumulated)"
            />
            {/* Line Series 3: Annual Depreciation Benchmark Line */}
            <Line
              type="monotone"
              dataKey="annualDepreciation"
              name="Annual Depreciation"
              stroke="#155DFC"
              strokeWidth={2.5}
              strokeDasharray="4 4"
              dot={{ r: 3, fill: '#155DFC' }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* 3. Summary Metric Chips Footer */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center gap-1 text-[10.5px] text-slate-400 font-medium">
            <Layers className="size-3" />
            <span>Total Asset Cost</span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5">
            {formattedTotalCost}
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100/60 dark:border-teal-900/40">
          <div className="flex items-center gap-1 text-[10.5px] text-teal-600 dark:text-teal-400 font-medium">
            <TrendingDown className="size-3" />
            <span>Annual Dep Rate</span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-teal-700 dark:text-teal-300 mt-0.5">
            {formattedAnnualDepreciation} / yr
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center gap-1 text-[10.5px] text-slate-400 font-medium">
            <Calculator className="size-3" />
            <span>Useful Life</span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5">
            {usefulLifeYears} Years
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center gap-1 text-[10.5px] text-slate-400 font-medium">
            <Sparkles className="size-3" />
            <span>Assets Count</span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5">
            {filteredAssets.length} Assets
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssetDepreciationChart;
