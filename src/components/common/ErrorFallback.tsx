import React from 'react';
import { useTranslation } from 'react-i18next';
import type { FallbackProps } from 'react-error-boundary';
import { AlertTriangle, RotateCcw, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DEFAULT_ERROR_FALLBACK_TITLE,
  DEFAULT_ERROR_FALLBACK_MESSAGE,
  DEFAULT_WIDGET_ERROR_TITLE,
  DEFAULT_WIDGET_ERROR_MESSAGE,
} from '@/constant/error.constants';

export interface ErrorFallbackProps extends FallbackProps {
  title?: string;
  message?: string;
  fullScreen?: boolean;
  minHeight?: string;
  className?: string;
  showReloadButton?: boolean;
}

export interface WidgetErrorFallbackProps extends FallbackProps {
  widgetTitle?: string;
  minHeight?: string;
  variant?: 'default' | 'pie' | 'depreciation';
  className?: string;
}

/**
 * @description: Reusable application and page-level fallback UI for react-error-boundary with reset controls
 * @param {ErrorFallbackProps} props - Component properties containing error, resetErrorBoundary, title, message, and layout settings
 * @returns {JSX.Element} React error fallback UI component
 */
export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  title,
  message,
  fullScreen = false,
  minHeight,
  className,
  showReloadButton = true,
}) => {
  const { t: translateError } = useTranslation('setting');
  const displayTitle =
    title || translateError('common.somethingWentWrong') || DEFAULT_ERROR_FALLBACK_TITLE;
  const displayMessage =
    message || (error instanceof Error ? error.message : null) || DEFAULT_ERROR_FALLBACK_MESSAGE;

  return (
    <div
      role="alert"
      className={cn(
        'flex w-full items-center justify-center p-6 animate-in fade-in duration-200 select-none text-left',
        fullScreen
          ? 'fixed inset-0 z-50 min-h-screen bg-background/90 backdrop-blur-xs'
          : minHeight || 'min-h-[320px] flex-1 py-10',
        className,
      )}
    >
      <div className="relative flex flex-col items-center max-w-md w-full p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg text-center space-y-4">
        {/* Warning Icon Container */}
        <div className="flex size-14 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 shadow-2xs">
          <AlertTriangle className="size-7" />
        </div>

        {/* Error Title & Description */}
        <div className="space-y-1.5 text-center">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            {displayTitle}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm line-clamp-3">
            {displayMessage}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={resetErrorBoundary}
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs cursor-pointer active:scale-95 transition-transform"
          >
            <RotateCcw className="size-3.5" />
            {translateError('common.tryAgain')}
          </Button>

          {showReloadButton && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {translateError('common.reloadPage')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * @description: Reusable isolated widget/card fallback UI for react-error-boundary in dashboard visualizations
 * @param {WidgetErrorFallbackProps} props - Component properties containing error, resetErrorBoundary, widgetTitle, minHeight, variant, and className
 * @returns {JSX.Element} React widget error fallback UI component
 */
export const WidgetErrorFallback: React.FC<WidgetErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  widgetTitle = DEFAULT_WIDGET_ERROR_TITLE,
  minHeight = 'min-h-[360px]',
  variant = 'default',
  className,
}) => {
  const isPieVariant = variant === 'pie';
  const displayMessage =
    (error instanceof Error ? error.message : null) || DEFAULT_WIDGET_ERROR_MESSAGE;

  return (
    <div
      role="alert"
      aria-label={`Error loading ${widgetTitle}`}
      data-testid="widget-error-boundary"
      className={cn(
        isPieVariant
          ? 'bg-[#101726] text-white rounded-3xl border border-slate-800/80 p-6 sm:p-7 shadow-xl'
          : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs',
        'flex flex-col items-center justify-center text-center h-full w-full select-none animate-in fade-in duration-200',
        minHeight,
        className,
      )}
    >
      <div className="flex flex-col items-center max-w-sm w-full mx-auto space-y-3.5 my-auto py-4">
        {/* Warning / Error Icon Badge */}
        <div
          className={cn(
            'flex size-12 items-center justify-center rounded-2xl shadow-2xs shrink-0',
            isPieVariant
              ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
              : 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/60 text-rose-600 dark:text-rose-400',
          )}
        >
          <AlertTriangle className="size-6" />
        </div>

        {/* Error Message Details */}
        <div className="space-y-1 text-center">
          <h4
            className={cn(
              'text-sm sm:text-base font-bold tracking-tight',
              isPieVariant ? 'text-white' : 'text-slate-900 dark:text-slate-100',
            )}
          >
            Failed to load {widgetTitle}
          </h4>
          <p
            className={cn(
              'text-xs max-w-xs line-clamp-2',
              isPieVariant ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400',
            )}
          >
            {displayMessage}
          </p>
        </div>

        {/* Localized Reload Widget Action */}
        <div className="pt-1">
          <Button
            type="button"
            size="sm"
            data-testid="widget-reload-button"
            onClick={resetErrorBoundary}
            className="h-8.5 px-3.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-[0.98] transition-all"
          >
            <RefreshCw className="size-3.5" />
            <span>Reload Widget</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;
