export const REPORTS_KPI_CARDS_CONSTANTS = {
  DEFAULTS: {
    DEPARTMENT: 'All',
    TIME_RANGE: 'Last 30 Days',
    REPORT_TYPE: 'Asset Overview',
  },
  TITLES: {
    TOTAL_ASSETS: 'Total Assets',
    ALLOCATED: 'Allocated',
    AVAILABLE: 'Available',
    MAINTENANCE: 'Maintenance',
  },
  TIME_DELTAS: {
    VS_LAST_WEEK: 'vs. last week',
    VS_LAST_QUARTER: 'vs. last quarter',
    VS_LAST_YEAR: 'vs. last year',
    VS_LAST_MONTH: 'vs. last month',
  },
  TIME_RANGES: {
    LAST_7_DAYS: 'Last 7 Days',
    LAST_90_DAYS: 'Last 90 Days',
    YEAR_TO_DATE: 'Year to Date',
    ALL_TIME: 'All Time',
  },
} as const;
