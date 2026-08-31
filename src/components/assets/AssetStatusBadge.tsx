import React from 'react';
import type { AssetStatus } from '@/types/asset';
import { cn } from '@/lib/utils';

interface AssetStatusBadgeProps {
  status: AssetStatus;
  className?: string;
}

export const AssetStatusBadge: React.FC<AssetStatusBadgeProps> = ({
  status,
  className,
}) => {
  const getBadgeStyle = (st: AssetStatus) => {
    switch (st) {
      case 'Allocated':
        return 'bg-[#EBF9F1] text-[#1FA653] dark:bg-emerald-950/50 dark:text-emerald-400';
      case 'Available':
        return 'bg-[#EAF2FE] text-[#2F6FEB] dark:bg-blue-950/50 dark:text-blue-400';
      case 'Maintenance':
        return 'bg-[#FEF6E6] text-[#E08A1E] dark:bg-amber-950/50 dark:text-amber-400';
      case 'Retired':
        return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
      case 'Lost':
        return 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-medium text-xs px-3 py-1 rounded-full whitespace-nowrap transition-colors select-none',
        getBadgeStyle(status),
        className
      )}
    >
      {status}
    </span>
  );
};

export default AssetStatusBadge;
