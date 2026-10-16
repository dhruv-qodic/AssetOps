export const ACTIVE_ALLOCATION_LIST_COLUMNS = {
  ALLOCATION_ID: 'Allocation ID',
  ASSET: 'Asset',
  ASSIGNED_EMPLOYEE: 'Assigned Employee',
  DEPARTMENT: 'Department',
  LOCATION: 'Location',
  STATUS: 'Status',
  ALLOCATED_DATE: 'Allocated Date',
  ACTIONS: 'Actions',
} as const;

export const ACTIVE_ALLOCATION_LIST_DEFAULTS = {
  INITIALS: 'UN',
  DATE: 'May 10, 2024',
  EMPLOYEE_NAME: 'Unassigned Staff',
  DEPARTMENT: 'IT',
  EMPLOYEE_CODE: 'EMP-100',
  STATUS_ACTIVE: 'Active',
  ID_PREFIX: 'AL',
} as const;
