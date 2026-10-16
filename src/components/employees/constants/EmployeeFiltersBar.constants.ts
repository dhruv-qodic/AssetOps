/**
 * @description: Constants, options, labels, and placeholders for EmployeeFiltersBar component
 */
import {
  EMPLOYEE_DEPARTMENTS,
  EMPLOYEE_STATUS_OPTIONS,
  EMPLOYEE_TYPE_OPTIONS,
} from '@/constant/employee.constants';
import type { EmployeeStatus, EmployeeType } from '@/types/employee';

export const EMPLOYEE_FILTERS_PLACEHOLDERS = {
  SEARCH: 'Search employees by name, email, department...',
} as const;

export const EMPLOYEE_FILTERS_LABELS = {
  DEPARTMENT: 'Department',
  STATUS: 'Status',
  TYPE: 'Type',
  SORT: 'Sort',
  ACTIVE_FILTERS: 'Active filters:',
  CLEAR_ALL: 'Clear all',
  ALL: 'All',
} as const;

export const EMPLOYEE_FILTER_DEPARTMENT_OPTIONS = [
  { label: EMPLOYEE_FILTERS_LABELS.ALL, value: EMPLOYEE_FILTERS_LABELS.ALL },
  ...EMPLOYEE_DEPARTMENTS.map((dept) => ({ label: dept, value: dept })),
];

export const EMPLOYEE_FILTER_STATUS_OPTIONS: { label: string; value: EmployeeStatus | 'All' }[] = [
  { label: EMPLOYEE_FILTERS_LABELS.ALL, value: EMPLOYEE_FILTERS_LABELS.ALL },
  ...EMPLOYEE_STATUS_OPTIONS,
];

export const EMPLOYEE_FILTER_TYPE_OPTIONS: { label: string; value: EmployeeType | 'All' }[] = [
  { label: EMPLOYEE_FILTERS_LABELS.ALL, value: EMPLOYEE_FILTERS_LABELS.ALL },
  ...EMPLOYEE_TYPE_OPTIONS,
];
