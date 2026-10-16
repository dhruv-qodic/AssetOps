import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { ASSET_DEPRECIATION_CHART_TEXT } from './constants/AssetDepreciationChart.constants';
import { formatCurrency } from '@/utils/currency';
import { useCurrency } from '@/hooks/useCurrency';

interface AssetDepreciationChartProps {
  assets?: Asset[];
  initialUsefulLife?: number;
  className?: string;
  isLoading?: boolean;
}

const USEFUL_LIFE_OPTIONS = [3, 5, 7, 10] as const;

/**
 * @description: Renders a composed area/line chart forecasting asset book values and cumulative depreciation over time
 * @param {Asset[]}assets: Optional assets array override
 * @param {number}initialUsefulLife: Initial depreciation period in years (default 5)
 * @param {string}className: Optional styling class name
 * @param {boolean}isLoading: Loading indicator boolean
 * @return: Asset depreciation chart component JSX
 */
export const AssetDepreciationChart: React.FC<AssetDepreciationChartProps> = ({
  assets: propAssets,
  initialUsefulLife = 5,
  className = '',
  isLoading = false,
}) => {
  const { t: translateDashboard } = useTranslation('dashboard');
  const storeAssets = useAssetStore((s) => s.assets);
  const { selectedLocation } = useDashboardStore();
  const [usefulLifeYears, setUsefulLifeYears] = useState<number>(initialUsefulLife);
  const { currency, symbol, convert, format } = useCurrency();

  const labelNetBookValue = translateDashboard('depreciationSection.netBookValue', {
    defaultValue: ASSET_DEPRECIATION_CHART_TEXT.NET_BOOK_VALUE,
  });
  const labelAccumulatedDep = translateDashboard('depreciationSection.accumulatedDep', {
    defaultValue: ASSET_DEPRECIATION_CHART_TEXT.ACCUMULATED_DEP,
  });
  const labelAnnualDep = translateDashboard('depreciationSection.annualDep', {
    defaultValue: ASSET_DEPRECIATION_CHART_TEXT.ANNUAL_DEP,
  });

  // Use props if provided, otherwise filter store assets by dashboard location
  const assets = propAssets ?? storeAssets;

  /**
   * @description: Filters asset records by selected dashboard location if not overridden by props
   * @return {Array<Asset>}: Filtered asset array
   */
  const filteredAssets = useMemo(() => {
    if (propAssets) return propAssets;
    if (selectedLocation === 'All') return assets;
    return assets.filter((a) => a.location.toLowerCase() === selectedLocation.toLowerCase());
  }, [assets, propAssets, selectedLocation]);

  /**
   * @description: Calculates total cumulative purchase cost of filtered assets
   * @return {number}: Total asset cost number in active display currency
   */
  const rawTotalCost = useMemo(() => calculateTotalAssetCost(filteredAssets), [filteredAssets]);

  const totalCost = useMemo(() => {
    return convert(rawTotalCost);
  }, [rawTotalCost, convert]);

  /**
   * @description: Computes straight-line depreciation schedule and annual amortization values
   * @return {Array<Object>}: Object containing annual schedule array and annual depreciation number
   */
  const { schedule, annualDepreciation } = useMemo(() => {
    return calculateDepreciationSchedule(totalCost, usefulLifeYears);
  }, [totalCost, usefulLifeYears]);

  const formattedTotalCost = format(rawTotalCost);
  const formattedAnnualDepreciation = formatCurrency(annualDepreciation, {
    currency,
    convertFromBase: false,
  });

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
                {ASSET_DEPRECIATION_CHART_TEXT.TITLE}
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">
                {ASSET_DEPRECIATION_CHART_TEXT.SUBTITLE}
              </span>
            </div>
          </div>
        </div>
        <div className="py-14 text-center text-slate-400 space-y-2">
          <TrendingDown className="size-9 mx-auto text-slate-300 dark:text-slate-600" />
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            {ASSET_DEPRECIATION_CHART_TEXT.EMPTY_TITLE}
          </p>
          <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
            {ASSET_DEPRECIATION_CHART_TEXT.EMPTY_DESC}
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
                {translateDashboard('widgets.depreciationChart', {
                  defaultValue: ASSET_DEPRECIATION_CHART_TEXT.TITLE,
                })}
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300">
                <Sparkles className="size-2.5" />
                {translateDashboard('depreciationSection.modelBadge', {
                  defaultValue: ASSET_DEPRECIATION_CHART_TEXT.MODEL_BADGE,
                })}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              {translateDashboard('depreciationSection.subtitleWithRate', {
                years: usefulLifeYears,
                defaultValue: ASSET_DEPRECIATION_CHART_TEXT.getSubtitleWithRate(usefulLifeYears),
              })}
            </span>
          </div>
        </div>

        {/* Useful Life Selector & Annual Rate Pill */}
        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          {/* Useful Life Toggle Buttons */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold">
            <span className="text-[10.5px] text-slate-500 dark:text-slate-400 px-1.5 hidden md:inline">
              {translateDashboard('depreciationSection.usefulLifeLabel', {
                defaultValue: ASSET_DEPRECIATION_CHART_TEXT.USEFUL_LIFE_LABEL,
              })}
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
                title={ASSET_DEPRECIATION_CHART_TEXT.getYearsTitle(years)}
              >
                {years}Y
              </button>
            ))}
          </div>

          {/* Annual Rate Badge */}
          <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/80 px-2.5 py-1.5 rounded-lg border border-teal-200/60 dark:border-teal-800/60">
            {formattedAnnualDepreciation}{' '}
            {translateDashboard('depreciationSection.perYearSuffix', {
              defaultValue: ASSET_DEPRECIATION_CHART_TEXT.PER_YEAR_SUFFIX,
            })}
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
              tickFormatter={(v: number) =>
                `${symbol}${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`
              }
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
                              {labelNetBookValue}:
                            </span>
                          </div>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {formatCurrency(
                              Number(payload.find((p) => p.dataKey === 'bookValue')?.value || 0),
                              { currency, convertFromBase: false },
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-amber-500" />
                            <span className="text-slate-500 dark:text-slate-400">
                              {labelAccumulatedDep}:
                            </span>
                          </div>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {formatCurrency(
                              Number(
                                payload.find((p) => p.dataKey === 'accumulatedDepreciation')
                                  ?.value || 0,
                              ),
                              { currency, convertFromBase: false },
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-primary" />
                            <span className="text-slate-500 dark:text-slate-400">
                              {labelAnnualDep}:
                            </span>
                          </div>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {formatCurrency(
                              Number(
                                payload.find((p) => p.dataKey === 'annualDepreciation')?.value || 0,
                              ),
                              { currency, convertFromBase: false },
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend iconType="circle" wrapperStyle={{ paddingBottom: '8px', fontSize: '11px' }} />
            {/* Area Series 1: Net Book Value */}
            <Area
              type="monotone"
              dataKey="bookValue"
              name={labelNetBookValue}
              stroke="#10B981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorBookValue)"
            />
            {/* Area Series 2: Accumulated Depreciation */}
            <Area
              type="monotone"
              dataKey="accumulatedDepreciation"
              name={labelAccumulatedDep}
              stroke="#F59E0B"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorAccumulated)"
            />
            {/* Line Series 3: Annual Depreciation Benchmark Line */}
            <Line
              type="monotone"
              dataKey="annualDepreciation"
              name={labelAnnualDep}
              stroke="var(--primary)"
              strokeWidth={2.5}
              strokeDasharray="4 4"
              dot={{ r: 3, fill: 'var(--primary)' }}
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
            <span>
              {translateDashboard('depreciationSection.totalAssetCost', {
                defaultValue: ASSET_DEPRECIATION_CHART_TEXT.TOTAL_ASSET_COST,
              })}
            </span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5">
            {formattedTotalCost}
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100/60 dark:border-teal-900/40">
          <div className="flex items-center gap-1 text-[10.5px] text-teal-600 dark:text-teal-400 font-medium">
            <TrendingDown className="size-3" />
            <span>
              {translateDashboard('depreciationSection.annualDepRate', {
                defaultValue: ASSET_DEPRECIATION_CHART_TEXT.ANNUAL_DEP_RATE,
              })}
            </span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-teal-700 dark:text-teal-300 mt-0.5">
            {formattedAnnualDepreciation}{' '}
            {translateDashboard('depreciationSection.perYearSuffix', {
              defaultValue: ASSET_DEPRECIATION_CHART_TEXT.PER_YEAR_SUFFIX,
            })}
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center gap-1 text-[10.5px] text-slate-400 font-medium">
            <Calculator className="size-3" />
            <span>
              {translateDashboard('depreciationSection.usefulLife', {
                defaultValue: ASSET_DEPRECIATION_CHART_TEXT.USEFUL_LIFE,
              })}
            </span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5">
            {usefulLifeYears}{' '}
            {translateDashboard('depreciationSection.yearsSuffix', {
              defaultValue: ASSET_DEPRECIATION_CHART_TEXT.YEARS_SUFFIX,
            })}
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center gap-1 text-[10.5px] text-slate-400 font-medium">
            <Sparkles className="size-3" />
            <span>
              {translateDashboard('depreciationSection.assetsCount', {
                defaultValue: ASSET_DEPRECIATION_CHART_TEXT.ASSETS_COUNT,
              })}
            </span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5">
            {filteredAssets.length}{' '}
            {translateDashboard('depreciationSection.assetsSuffix', {
              defaultValue: ASSET_DEPRECIATION_CHART_TEXT.ASSETS_SUFFIX,
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssetDepreciationChart;
