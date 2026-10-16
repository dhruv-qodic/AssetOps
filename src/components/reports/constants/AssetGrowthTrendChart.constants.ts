export const ASSET_GROWTH_TREND_CHART_CONSTANTS = {
  TITLE: 'Asset Growth Trend',
  TIMELINE_PREFIX: 'Timeline: ',
  ALLOCATED_LABEL: 'Allocated',
  AVAILABLE_LABEL: 'Available',
  TIME_RANGES: {
    LAST_7_DAYS: 'Last 7 Days',
    LAST_30_DAYS: 'Last 30 Days',
    LAST_90_DAYS: 'Last 90 Days',
    YEAR_TO_DATE: 'Year to Date',
    ALL_TIME: 'All Time',
  },
  COLORS: {
    ALLOCATED: 'var(--primary)',
    AVAILABLE: '#38BDF8',
    TICK: '#94A3B8',
  },
} as const;
