import React from 'react';
import { PackageSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: React.ElementType;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = PackageSearch,
  title = 'No data found',
  description = 'No records match your active search or filter criteria.',
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 sm:p-12 animate-in fade-in duration-200',
        className,
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 text-[#4C40F7] mb-3 border border-indigo-100/80 dark:border-indigo-900/50 shadow-2xs">
        <Icon className="size-7" />
      </div>

      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
        {title}
      </h3>

      {description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1 leading-relaxed">
          {description}
        </p>
      )}

      {(actionLabel || secondaryActionLabel) && (
        <div className="flex items-center gap-2.5 mt-5">
          {secondaryActionLabel && onSecondaryAction && (
            <Button
              type="button"
              variant="outline"
              onClick={onSecondaryAction}
              className="h-9 px-3.5 text-xs font-medium border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer shadow-2xs"
            >
              {secondaryActionLabel}
            </Button>
          )}

          {actionLabel && onAction && (
            <Button
              type="button"
              onClick={onAction}
              className="h-9 px-4 text-xs font-medium bg-[#4C40F7] hover:bg-[#3D31E5] text-white cursor-pointer shadow-xs active:scale-[0.98]"
            >
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
