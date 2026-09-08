import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface TrendDataPoint {
  date: string;
  allocated: number;
  available: number;
}

const trendData: TrendDataPoint[] = [
  { date: 'May 10', allocated: 15, available: 6 },
  { date: 'May 12', allocated: 17, available: 8 },
  { date: 'May 14', allocated: 21, available: 10 },
  { date: 'May 16', allocated: 20, available: 12 },
  { date: 'May 18', allocated: 24, available: 13 },
  { date: 'May 20', allocated: 26, available: 15 },
  { date: 'May 22', allocated: 28, available: 16 },
];

export const AssetGrowthTrendChart: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between h-full">
      {/* Header with Title & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
          Asset Growth Trend
        </h3>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#4C40F7] rounded-full" />
            <span className="text-slate-600 dark:text-slate-300">Allocated</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#38BDF8] rounded-full" />
            <span className="text-slate-600 dark:text-slate-300">Available</span>
          </div>
        </div>
      </div>

      {/* Area Chart Container */}
      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={trendData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorAllocated" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4C40F7" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#4C40F7" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorAvailable" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              className="stroke-slate-100 dark:stroke-slate-800/80"
            />

            <XAxis
              dataKey="date"
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
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload.length) {
                  return (
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-xl border border-slate-200/80 dark:border-slate-700 text-xs space-y-1.5 animate-in fade-in zoom-in-95">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{label}</p>
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-[#4C40F7]" />
                        <span className="text-slate-500 dark:text-slate-400">Allocated:</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {payload[0]?.value}k
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-[#38BDF8]" />
                        <span className="text-slate-500 dark:text-slate-400">Available:</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {payload[1]?.value}k
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
              dataKey="allocated"
              stroke="#4C40F7"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorAllocated)"
            />

            <Area
              type="monotone"
              dataKey="available"
              stroke="#38BDF8"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorAvailable)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AssetGrowthTrendChart;
