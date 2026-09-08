import React from 'react';
import type { EmployeeStatus } from '@/types/employee';
import { cn } from '@/lib/utils';

interface EmployeeStatusBadgeProps {
  status: EmployeeStatus;
  className?: string;
}

export const EmployeeStatusBadge: React.FC<EmployeeStatusBadgeProps> = ({
  status,
  className,
}) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100/80 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300';
      case 'inactive':
        return 'bg-rose-100/90 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300';
      case 'terminated':
        return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'inactive':
        return 'Inactive';
      case 'terminated':
        return 'Terminated';
      default:
        return status;
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-colors select-none',
        getBadgeStyle(),
        className
      )}
    >
      {getLabel()}
    </span>
  );
};

export default EmployeeStatusBadge;
