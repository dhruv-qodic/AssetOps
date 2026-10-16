import React from 'react';
import { cn } from '@/lib/utils';

export interface SettingsInfoCalloutProps {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * @description Reusable informational callout banner for settings panels
 */
export const SettingsInfoCallout: React.FC<SettingsInfoCalloutProps> = ({
  icon: Icon,
  title,
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        'p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/50 flex items-start gap-3 text-left',
        className,
      )}
    >
      <Icon className="size-4.5 text-primary shrink-0 mt-0.5" />
      <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
        <p className="font-semibold text-slate-800 dark:text-slate-200">{title}</p>
        <div className="leading-relaxed">{children}</div>
      </div>
    </div>
  );
};

export default SettingsInfoCallout;
