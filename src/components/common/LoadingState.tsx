import React from 'react';
import { Package, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  icon?: React.ElementType;
  title?: string;
  description?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  icon: Icon = Package,
  title = 'Loading data...',
  description = 'Please wait while we retrieve the latest information.',
  className,
  size = 'md',
}) => {
  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 sm:p-12 animate-in fade-in duration-300',
        isSmall && 'p-4 sm:p-6',
        isLarge && 'p-12 sm:p-16 min-h-[360px]',
        className,
      )}
    >
      {/* Asset-related icon integrated into an animated loader */}
      <div className="relative flex items-center justify-center mb-4">
        {/* Outer glowing pulsing aura */}
        <div className="absolute size-16 rounded-full bg-[#4C40F7]/10 dark:bg-[#4C40F7]/20 animate-ping opacity-75" />

        {/* Outer spinning border ring */}
        <div className="relative flex size-14 items-center justify-center rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 shadow-xs">
          <Icon className="size-6 text-[#4C40F7] animate-pulse" />

          {/* Absolute corner spinner */}
          <div className="absolute -inset-1 pointer-events-none">
            <Loader2 className="size-16 text-[#4C40F7]/60 animate-spin" />
          </div>
        </div>
      </div>

      <h3 className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
        {title}
      </h3>
      {description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};

export default LoadingState;
