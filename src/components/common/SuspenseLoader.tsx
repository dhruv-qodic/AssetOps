import type { FC } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SuspenseLoaderProps {
  message?: string;
  fullScreen?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Reusable loading component for Suspense fallbacks and async transitions.
 * Features an animated rotating icon at the top and a clear message below,
 * styled to seamlessly match the AssetOps theme.
 */
export const SuspenseLoader: FC<SuspenseLoaderProps> = ({
  message = 'Loading...',
  fullScreen = false,
  className,
  size = 'md',
}) => {
  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  const iconSizeClass = isSmall ? 'size-6' : isLarge ? 'size-10' : 'size-8';
  const textSizeClass = isSmall ? 'text-xs' : isLarge ? 'text-base' : 'text-sm';

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        'flex w-full items-center justify-center animate-in fade-in duration-200 select-none',
        fullScreen
          ? 'fixed inset-0 z-50 min-h-screen h-screen w-screen bg-white dark:bg-slate-950'
          : 'min-h-[300px] flex-1 py-10',
        className,
      )}
    >
      <div className="flex flex-col items-center justify-center gap-3 text-center px-4">
        {/* Animated rotating icon at the top */}
        <div className="relative flex items-center justify-center">
          <Loader2
            className={cn('animate-spin text-[#155DFC]', iconSizeClass)}
            aria-hidden="true"
          />
        </div>

        {/* Loading message below it */}
        {message && (
          <p
            className={cn(
              'font-medium text-slate-600 dark:text-slate-300 tracking-tight',
              textSizeClass,
            )}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default SuspenseLoader;
