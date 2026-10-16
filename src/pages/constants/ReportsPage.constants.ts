export const REPORTS_PAGE_CONSTANTS = {
  HEADER: {
    TITLE: 'Reports & Analytics',
    SUBTITLE: 'Insights and analytics for better decision making',
  },
  DEFAULTS: {
    REPORT_TYPE: 'Asset Overview',
    TIME_RANGE: 'Last 30 Days',
    DEPARTMENT: 'All',
  },
  LOADING: {
    TITLE: 'Compiling analytics and operational reports...',
    DESCRIPTION: 'Please wait while we aggregate asset metrics across departments.',
  },
  ERROR_TITLE: 'Failed to generate reports',
  EMPTY: {
    TITLE: 'No asset data available for reports',
    DESCRIPTION:
      'Reports and analytics will be automatically compiled once you add assets into the inventory.',
    ACTION_LABEL: 'Add Asset',
  },
} as const;
