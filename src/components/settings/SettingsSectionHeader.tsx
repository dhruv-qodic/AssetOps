import React from 'react';
import { cn } from '@/lib/utils';

export interface SettingsSectionHeaderProps {
  icon: React.ElementType;
  title: string;
  description: string;
  badge?: React.ReactNode;
  className?: string;
}

/**
 * @description Reusable header component for settings tab sections
 */
export const SettingsSectionHeader: React.FC<SettingsSectionHeaderProps> = ({
  icon: Icon,
  title,
  description,
  badge,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-3.5 pb-4 border-b border-slate-100 dark:border-slate-800',
        className,
      )}
    >
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
          <Icon className="size-5" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {description}
          </p>
        </div>
      </div>
      {badge && <div className="shrink-0">{badge}</div>}
    </div>
  );
};

export default SettingsSectionHeader;
