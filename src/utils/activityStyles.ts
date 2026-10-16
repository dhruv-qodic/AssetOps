import {
  UserPlus,
  CornerDownLeft,
  ArrowRightLeft,
  PlusCircle,
  Edit3,
  Wrench,
  Trash2,
  UserCheck,
  UserMinus,
  Activity,
  Laptop,
  User,
} from 'lucide-react';
import type { HistoryActionType } from '@/types/activity';

export interface ActivityStyleConfig {
  icon: React.ElementType;
  bg: string;
  badgeClass: string;
  iconBg: string;
  iconColor: string;
  entityIcon: React.ElementType;
  defaultBadge: string;
}

/**
 * Returns consistent styling, icons, and badges for a given history/activity action type.
 *
 * @param {HistoryActionType} actionType - History or Activity action type
 * @returns {ActivityStyleConfig} ActivityStyleConfig object with icon, colors, and badge metadata
 */
export function getActivityStyle(actionType: HistoryActionType): ActivityStyleConfig {
  switch (actionType) {
    case 'allocation_assigned':
    case 'assigned':
    case 'asset_allocated':
      return {
        icon: UserPlus,
        bg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400',
        badgeClass: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300',
        iconBg: 'bg-indigo-50 dark:bg-indigo-950/60',
        iconColor: 'text-indigo-600 dark:text-indigo-400',
        entityIcon: Laptop,
        defaultBadge: 'Allocated',
      };
    case 'allocation_returned':
    case 'returned':
    case 'asset_deallocated':
      return {
        icon: CornerDownLeft,
        bg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
        badgeClass: 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300',
        iconBg: 'bg-sky-50 dark:bg-sky-950/60',
        iconColor: 'text-sky-600 dark:text-sky-400',
        entityIcon: Laptop,
        defaultBadge: 'Returned',
      };
    case 'allocation_reallocated':
      return {
        icon: ArrowRightLeft,
        bg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400',
        badgeClass: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300',
        iconBg: 'bg-indigo-50 dark:bg-indigo-950/60',
        iconColor: 'text-indigo-600 dark:text-indigo-400',
        entityIcon: Laptop,
        defaultBadge: 'Reallocated',
      };
    case 'asset_created':
    case 'created':
      return {
        icon: PlusCircle,
        bg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
        badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
        iconBg: 'bg-emerald-50 dark:bg-emerald-950/60',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        entityIcon: Laptop,
        defaultBadge: 'Created',
      };
    case 'asset_updated':
    case 'updated':
      return {
        icon: Edit3,
        bg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
        badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
        iconBg: 'bg-slate-100 dark:bg-slate-800',
        iconColor: 'text-slate-600 dark:text-slate-400',
        entityIcon: Laptop,
        defaultBadge: 'Updated',
      };
    case 'asset_maintenance':
    case 'maintenance':
      return {
        icon: Wrench,
        bg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
        badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
        iconBg: 'bg-amber-50 dark:bg-amber-950/60',
        iconColor: 'text-amber-600 dark:text-amber-400',
        entityIcon: Laptop,
        defaultBadge: 'Maintenance',
      };
    case 'asset_retired':
    case 'asset_deleted':
    case 'deleted':
      return {
        icon: Trash2,
        bg: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400',
        badgeClass: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
        iconBg: 'bg-rose-50 dark:bg-rose-950/60',
        iconColor: 'text-rose-600 dark:text-rose-400',
        entityIcon: Laptop,
        defaultBadge: 'Retired',
      };
    case 'employee_onboarded':
    case 'employee_created':
      return {
        icon: UserPlus,
        bg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
        badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
        iconBg: 'bg-emerald-50 dark:bg-emerald-950/60',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        entityIcon: User,
        defaultBadge: 'Onboarded',
      };
    case 'employee_updated':
    case 'employee_transferred':
      return {
        icon: UserCheck,
        bg: 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400',
        badgeClass: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300',
        iconBg: 'bg-purple-50 dark:bg-purple-950/60',
        iconColor: 'text-purple-600 dark:text-purple-400',
        entityIcon: User,
        defaultBadge: 'Transferred',
      };
    case 'employee_offboarded':
    case 'employee_deleted':
      return {
        icon: UserMinus,
        bg: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400',
        badgeClass: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
        iconBg: 'bg-rose-50 dark:bg-rose-950/60',
        iconColor: 'text-rose-600 dark:text-rose-400',
        entityIcon: User,
        defaultBadge: 'Removed',
      };
    default:
      return {
        icon: Activity,
        bg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
        badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
        iconBg: 'bg-slate-100 dark:bg-slate-800',
        iconColor: 'text-slate-600 dark:text-slate-400',
        entityIcon: Laptop,
        defaultBadge: 'Activity',
      };
  }
}
