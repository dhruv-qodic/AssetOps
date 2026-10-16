import React from 'react';

/**
 * @description Sleek skeleton loader for lazy-loaded settings tab panels
 */
export const SettingsTabSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-6 max-w-4xl animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-start gap-3.5 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="size-10 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-5 w-44 rounded-md bg-slate-200 dark:bg-slate-800" />
          <div className="h-3.5 w-72 rounded-md bg-slate-100 dark:bg-slate-800/60" />
        </div>
      </div>

      {/* Content Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
        <div className="h-28 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-800" />
        <div className="h-28 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-800" />
        <div className="h-28 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-800" />
      </div>

      {/* Footer Banner Skeleton */}
      <div className="h-16 rounded-xl bg-slate-100/60 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-800" />
    </div>
  );
};

export default SettingsTabSkeleton;
