export const ALLOCATION_TABLE_STATES = {
  LOADING_TITLE: 'Loading asset allocations...',
  LOADING_DESC: 'Please wait while we retrieve allocation mappings.',
  ERROR_TITLE: 'Failed to load allocations',
  EMPTY_TITLE: 'No allocations found',
  EMPTY_DESC:
    'No asset allocations match your filter or search criteria. Try adjusting your filters or create a new allocation.',
  CLEAR_FILTERS_ACTION: 'Clear filters',
  NEW_ALLOCATION_ACTION: 'New Allocation',
} as const;

export const ALLOCATION_TABLE_COLUMNS = {
  ALLOCATION_ID: 'Allocation ID',
  ASSET: 'Asset',
  EMPLOYEE: 'Employee',
  DEPARTMENT: 'Department',
  STATUS: 'Status',
  ALLOCATED_ON: 'Allocated On',
  ACTIONS: 'Actions',
} as const;

export const ALLOCATION_STATUS_LABELS = {
  RETURNED: 'Returned',
  MAINTENANCE: 'Maintenance',
  RETIRED: 'Retired',
  INACTIVE: 'Inactive',
  TERMINATED: 'Terminated',
  ON_LEAVE: 'On Leave',
  ACTIVE: 'Active',
} as const;

export const ALLOCATION_TABLE_DEFAULTS = {
  DATE: 'May 10, 2024',
  EMPLOYEE: 'Unassigned',
  DEPARTMENT: 'IT',
  ID_PREFIX: 'AL',
} as const;
