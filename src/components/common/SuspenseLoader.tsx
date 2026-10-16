import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SuspenseLoaderProps {
  message?: string;
  fullScreen?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * @description: Reusable loading component for Suspense fallbacks and async transitions featuring an animated rotating spinner and message
 * @param {SuspenseLoaderProps} props: containing message, fullScreen, className, and size
 * @return {JSX.Element}: React suspense loader element
 */
export const SuspenseLoader: FC<SuspenseLoaderProps> = ({
  message,
  fullScreen = false,
  className,
  size = 'md',
}) => {
  const { t: translateLoader } = useTranslation('setting');
  const displayMessage = message ?? translateLoader('common.loading');
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
          <Loader2 className={cn('animate-spin text-primary', iconSizeClass)} aria-hidden="true" />
        </div>

        {/* Loading message below it */}
        {displayMessage && (
          <p
            className={cn(
              'font-medium text-slate-600 dark:text-slate-300 tracking-tight',
              textSizeClass,
            )}
          >
            {displayMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default SuspenseLoader;
