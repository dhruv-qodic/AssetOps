/**
 * @description: Constants, card labels, badges, and descriptions for EmployeeCards component
 */

export const EMPLOYEE_CARDS_TITLES = {
  TOTAL_EMPLOYEES: 'Total Employees',
  ACTIVE_EMPLOYEES: 'Active Employees',
  INACTIVE_TERMINATED: 'Inactive & Terminated',
  FULL_TIME_STAFF: 'Full-Time Staff',
} as const;

export const EMPLOYEE_CARDS_BADGES = {
  ALL_STAFF: 'All staff',
  ACTIVE_SUFFIX: '% active',
  INACTIVE_SUFFIX: '% of total',
  RATIO_SUFFIX: '% ratio',
} as const;

export const EMPLOYEE_CARDS_DESCRIPTIONS = {
  TOTAL_WORKFORCE: 'Total workforce headcount',
  ACTIVE_WORKFORCE: 'Currently active workforce',
  LEAVE_OR_DEPARTED: 'On leave or departed',
  PERMANENT_STATUS: 'Permanent employment status',
} as const;
