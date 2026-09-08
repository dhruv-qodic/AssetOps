import type {
  EmployeeStatus,
  EmployeeType,
  EmployeeSortOption,
  EmployeeFilters,
} from '@/types/employee';

export const EMPLOYEE_STATUSES: EmployeeStatus[] = [
  'active',
  'inactive',
  'terminated',
];

export const EMPLOYEE_TYPES: EmployeeType[] = [
  'full-time',
  'contractor',
  'intern',
];

export const EMPLOYEE_DEPARTMENTS: string[] = [
  'IT',
  'HR',
  'Sales',
  'Marketing',
  'Finance',
];
export const DEPARTMENTS = EMPLOYEE_DEPARTMENTS;

export const EMPLOYEE_LOCATIONS: string[] = [
  'Headquarters',
  'New York Office',
  'San Francisco',
  'London Office',
  'Remote',
];
export const LOCATIONS = EMPLOYEE_LOCATIONS;

export const EMPLOYEE_SORT_OPTIONS: {
  label: string;
  value: EmployeeSortOption;
}[] = [
    { label: 'Recently Added', value: 'recently_added' },
    { label: 'Name (A to Z)', value: 'name_asc' },
    { label: 'Name (Z to A)', value: 'name_desc' },
    { label: 'Employee ID (Ascending)', value: 'employee_id_asc' },
    { label: 'Employee ID (Descending)', value: 'employee_id_desc' },
    { label: 'Date Created (Newest)', value: 'date_created_desc' },
  ];

export const DEFAULT_EMPLOYEE_FILTERS: EmployeeFilters = {
  search: '',
  status: 'All',
  type: 'All',
  department: 'All',
  location: 'All',
  sortBy: 'employee_id_asc',
  page: 1,
  pageSize: 10,
};

export interface StatusBadgeConfig {
  label: string;
  bg: string;
  text: string;
  border: string;
  dot: string;
}

export const EMPLOYEE_STATUS_CONFIG: Record<
  EmployeeStatus,
  StatusBadgeConfig
> = {
  active: {
    label: 'Active',
    bg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
    text: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800',
    dot: 'bg-emerald-500',
  },
  inactive: {
    label: 'Inactive',
    bg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
    text: 'text-slate-700 dark:text-slate-400',
    border: 'border-slate-300 dark:border-slate-700',
    dot: 'bg-slate-400',
  },
  terminated: {
    label: 'Terminated',
    bg: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400',
    text: 'text-rose-700 dark:text-rose-400',
    border: 'border-rose-200 dark:border-rose-800',
    dot: 'bg-rose-500',
  },
};

export const EMPLOYEE_TYPE_CONFIG: Record<
  EmployeeType,
  StatusBadgeConfig
> = {
  'full-time': {
    label: 'Full-Time',
    bg: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
    text: 'text-blue-700 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
    dot: 'bg-blue-500',
  },
  contractor: {
    label: 'Contractor',
    bg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800',
    dot: 'bg-amber-500',
  },
  intern: {
    label: 'Intern',
    bg: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400',
    text: 'text-purple-700 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-800',
    dot: 'bg-purple-500',
  },
};

export const EMPLOYEE_STATUS_OPTIONS = EMPLOYEE_STATUSES.map((status) => ({
  label: EMPLOYEE_STATUS_CONFIG[status].label,
  value: status,
}));

export const EMPLOYEE_TYPE_OPTIONS = EMPLOYEE_TYPES.map((type) => ({
  label: EMPLOYEE_TYPE_CONFIG[type].label,
  value: type,
}));

export const DEPARTMENT_OPTIONS = EMPLOYEE_DEPARTMENTS.map((dept) => ({
  label: dept,
  value: dept,
}));

export const LOCATION_OPTIONS = EMPLOYEE_LOCATIONS.map((loc) => ({
  label: loc,
  value: loc,
}));
