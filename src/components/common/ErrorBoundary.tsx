import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  onReset?: () => void;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  fullScreen?: boolean;
  title?: string;
  message?: string;
  className?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Reusable Error Boundary component to prevent crashes in lazy-loaded
 * or dynamic components from breaking the entire application.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  public handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public override render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // 1. Custom fallback function or node
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback(this.state.error, this.handleReset);
      }
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 2. Default AssetOps Error Fallback UI
      const {
        fullScreen = false,
        title = 'Something went wrong',
        message = this.state.error.message ||
          'An unexpected error occurred while loading this view.',
        className,
      } = this.props;

      return (
        <div
          role="alert"
          className={cn(
            'flex w-full items-center justify-center p-6 animate-in fade-in duration-200 select-none text-left',
            fullScreen
              ? 'fixed inset-0 z-50 min-h-screen bg-background/90 backdrop-blur-xs'
              : 'min-h-[320px] flex-1 py-10',
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
                {title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm line-clamp-3">
                {message}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="default"
                size="sm"
                onClick={this.handleReset}
                className="gap-2 bg-[#155DFC] hover:bg-blue-700 text-white shadow-xs cursor-pointer"
              >
                <RotateCcw className="size-3.5" />
                Try Again
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
