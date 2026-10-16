import React from 'react';
import { cn } from '@/lib/utils';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
  iconBg?: string;
  iconColor?: string;
  children?: React.ReactNode;
  className?: string;
  actionsClassName?: string;
  'data-testid'?: string;
}

/**
 * Standardized Page Header component displaying Title, Subtitle, optional leading Icon, and right-aligned Action buttons.
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon: Icon,
  iconBg = 'bg-primary/10 dark:bg-primary/20',
  iconColor = 'text-primary',
  children,
  className,
  actionsClassName,
  'data-testid': testId,
}) => {
  return (
    <div
      data-testid={testId}
      className={cn(
        'flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1',
        className,
      )}
    >
      {/* Title & Leading Icon */}
      <div className="flex items-start sm:items-center gap-3 shrink-0">
        {Icon && (
          <div
            className={cn('p-2.5 rounded-xl shadow-xs shrink-0 mt-0.5 sm:mt-0', iconBg, iconColor)}
          >
            <Icon className="size-6 sm:size-7" />
          </div>
        )}
        <div className="space-y-0.5 text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Action Items / Controls Area */}
      {children && (
        <div
          className={cn(
            'flex flex-wrap items-center gap-2.5 self-start sm:self-auto shrink-0',
            actionsClassName,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
