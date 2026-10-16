/**
 * @description: Constants and style definitions for EmployeeStatusBadge component
 */
import type { EmployeeStatus } from '@/types/employee';

export const EMPLOYEE_STATUS_BADGE_STYLES: Record<EmployeeStatus, string> = {
  active: 'bg-emerald-100/80 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
  inactive: 'bg-rose-100/90 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300',
  terminated: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
};

export const DEFAULT_EMPLOYEE_STATUS_BADGE_STYLE =
  'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
