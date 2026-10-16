export const ALLOCATION_FILTERS_LABELS = {
  ASSET: 'Asset',
  EMPLOYEE: 'Employee',
  STATUS: 'Status',
  LOCATION: 'Location',
  CLEAR_FILTERS: 'Clear Filters',
  ALL_OPTION: 'All',
  SEARCH_PLACEHOLDER: 'Search by asset, employee, or department...',
} as const;

export const ALLOCATION_FILTER_STATUS_OPTIONS = [
  { label: 'All', value: 'All' },
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' },
  { label: 'Returned', value: 'Returned' },
  { label: 'Maintenance', value: 'Maintenance' },
  { label: 'Terminated', value: 'Terminated' },
] as const;
