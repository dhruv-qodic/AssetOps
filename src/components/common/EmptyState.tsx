import React from 'react';
import { useTranslation } from 'react-i18next';
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

/**
 * @description: Displays a placeholder card when no table rows, search results, or data records are found
 * @param {EmptyStateProps}props: EmptyStateProps containing icon, title, description, and primary/secondary action buttons
 * @return{JSX.Element}: React empty state UI component
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = PackageSearch,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
}) => {
  const { t: translateCommon } = useTranslation('setting');
  const displayTitle = title || translateCommon('common.noData');
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 sm:p-12 animate-in fade-in duration-200',
        className,
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3 border border-primary/20 shadow-2xs">
        <Icon className="size-7" />
      </div>

      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
        {displayTitle}
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
              className="h-9 px-4 text-xs font-medium bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer shadow-xs active:scale-[0.98]"
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
