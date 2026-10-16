export const REPORTS_FILTER_BAR_CONSTANTS = {
  LABELS: {
    REPORT_TYPE: 'Report Type',
    TIME_RANGE: 'Time Range',
    DEPARTMENT: 'Department',
    GENERATE_REPORT: 'Generate Report',
    ALL_DEPARTMENT: 'All',
  },
  IDS: {
    REPORT_TYPE: 'report-type',
    TIME_RANGE: 'time-range',
    DEPARTMENT: 'department',
  },
  REPORT_TYPE_OPTIONS: [
    { label: 'Asset Overview', value: 'Asset Overview' },
    { label: 'Allocation Report', value: 'Allocation Report' },
    { label: 'Maintenance Report', value: 'Maintenance Report' },
    { label: 'Department Summary', value: 'Department Summary' },
    { label: 'Lifecycle Report', value: 'Lifecycle Report' },
  ],
  TIME_RANGE_OPTIONS: [
    { label: 'Last 30 Days', value: 'Last 30 Days' },
    { label: 'Last 7 Days', value: 'Last 7 Days' },
    { label: 'Last 90 Days', value: 'Last 90 Days' },
    { label: 'Year to Date', value: 'Year to Date' },
    { label: 'All Time', value: 'All Time' },
  ],
} as const;
