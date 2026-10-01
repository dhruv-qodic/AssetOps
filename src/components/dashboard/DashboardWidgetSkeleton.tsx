import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export interface DashboardWidgetSkeletonProps {
  minHeight?: string;
  className?: string;
  variant?: 'default' | 'pie' | 'depreciation';
  title?: string;
}

export const DashboardWidgetSkeleton: React.FC<DashboardWidgetSkeletonProps> = ({
  minHeight,
  className,
  variant = 'default',
  title = 'Loading widget...',
}) => {
  if (variant === 'pie') {
    return (
      <div
        role="status"
        aria-label={title}
        data-testid="widget-skeleton"
        className={cn(
          'bg-[#101726] text-white rounded-3xl border border-slate-800/80 p-6 sm:p-7 shadow-xl flex flex-col justify-between h-full text-left relative overflow-hidden',
          minHeight || 'min-h-[380px]',
          className,
        )}
      >
        {/* Header Skeleton */}
        <div className="flex items-center justify-between pb-2">
          <Skeleton className="h-5 w-44 bg-slate-800/80" />
          <Skeleton className="size-6 rounded-lg bg-slate-800/80" />
        </div>

        {/* Donut Chart Skeleton */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-auto py-3">
          <div className="size-44 sm:size-48 rounded-full border-[18px] border-slate-800/70 bg-transparent flex items-center justify-center animate-pulse shrink-0">
            <Skeleton className="size-16 rounded-full bg-slate-800/50" />
          </div>

          <div className="flex flex-col gap-2.5 sm:pl-2 w-full sm:w-auto">
            <Skeleton className="h-4 w-28 bg-slate-800/70" />
            <Skeleton className="h-4 w-32 bg-slate-800/70" />
            <Skeleton className="h-4 w-24 bg-slate-800/70" />
            <Skeleton className="h-4 w-28 bg-slate-800/70" />
          </div>
        </div>

        {/* Bottom Horizontal Legend */}
        <div className="flex items-center gap-4 pt-4 border-t border-slate-800/80">
          <Skeleton className="h-3 w-16 bg-slate-800/70" />
          <Skeleton className="h-3 w-16 bg-slate-800/70" />
          <Skeleton className="h-3 w-16 bg-slate-800/70" />
        </div>
      </div>
    );
  }

  if (variant === 'depreciation') {
    return (
      <div
        role="status"
        aria-label={title}
        data-testid="widget-skeleton"
        className={cn(
          'bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full text-left space-y-4',
          minHeight || 'min-h-[420px]',
          className,
        )}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Skeleton className="size-9 rounded-xl bg-slate-100 dark:bg-slate-800" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-48 bg-slate-100 dark:bg-slate-800" />
              <Skeleton className="h-3 w-64 bg-slate-100 dark:bg-slate-800" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-32 rounded-lg bg-slate-100 dark:bg-slate-800" />
            <Skeleton className="h-8 w-24 rounded-lg bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>

        {/* Chart Canvas Area */}
        <div className="w-full h-64 sm:h-72 flex items-center justify-center bg-slate-50/50 dark:bg-slate-800/20 rounded-xl border border-dashed border-slate-200/60 dark:border-slate-800/60 p-4">
          <Skeleton className="w-full h-full rounded-lg bg-slate-100 dark:bg-slate-800/40" />
        </div>

        {/* Bottom 3 KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <Skeleton className="h-14 rounded-xl bg-slate-50 dark:bg-slate-800/40" />
          <Skeleton className="h-14 rounded-xl bg-slate-50 dark:bg-slate-800/40" />
          <Skeleton className="h-14 rounded-xl bg-slate-50 dark:bg-slate-800/40" />
        </div>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-label={title}
      data-testid="widget-skeleton"
      className={cn(
        'bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full text-left',
        minHeight || 'min-h-[360px]',
        className,
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <Skeleton className="size-9 rounded-xl bg-slate-100 dark:bg-slate-800" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-44 bg-slate-100 dark:bg-slate-800" />
            <Skeleton className="h-3 w-56 bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>
        <Skeleton className="h-6 w-24 rounded-lg bg-slate-100 dark:bg-slate-800" />
      </div>

      {/* Chart Canvas Area */}
      <div className="w-full h-64 sm:h-72 flex items-center justify-center bg-slate-50/50 dark:bg-slate-800/20 rounded-xl border border-dashed border-slate-200/60 dark:border-slate-800/60 p-4">
        <Skeleton className="w-full h-full rounded-lg bg-slate-100 dark:bg-slate-800/40" />
      </div>
    </div>
  );
};

export default DashboardWidgetSkeleton;
