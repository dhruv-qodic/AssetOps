import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'An error occurred while fetching the requested data. Please try again.',
  onRetry,
  className,
}) => {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 sm:p-12 animate-in fade-in duration-200',
        className,
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 mb-3 border border-rose-100 dark:border-rose-900/60 shadow-2xs">
        <AlertCircle className="size-7" />
      </div>

      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
        {title}
      </h3>

      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1.5 leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <div className="mt-5">
          <Button
            type="button"
            onClick={onRetry}
            variant="outline"
            className="h-9 px-4 text-xs font-medium border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-[0.98]"
          >
            <RefreshCw className="size-3.5" />
            <span>Try Again</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ErrorState;
