/**
 * @description: Constants, messages, and column headers for EmployeeTable component
 */

export const EMPLOYEE_TABLE_MESSAGES = {
  LOADING_TITLE: 'Loading employee directory...',
  LOADING_DESCRIPTION: 'Please wait while we retrieve the latest employee records.',
  ERROR_TITLE: 'Failed to load employee directory',
  EMPTY_TITLE: 'No employees found',
  EMPTY_DESCRIPTION:
    'No employees match your active search or filter criteria. Try clearing filters or adding a new employee.',
  CLEAR_FILTERS: 'Clear filters',
  ADD_EMPLOYEE: 'Add Employee',
} as const;

export const EMPLOYEE_TABLE_COLUMNS = {
  EMPLOYEE_ID: 'Employee ID',
  NAME: 'Name',
  DEPARTMENT: 'Department',
  EMAIL: 'Email',
  STATUS: 'Status',
  ROLE: 'Role',
  ACTIONS: 'Actions',
} as const;
