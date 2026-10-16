import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';

export interface DonutSegment {
  id?: string;
  name?: string;
  label?: string;
  percentage: number;
  color: string;
}

export interface DonutChartProps {
  segments: DonutSegment[];
  radius?: number;
  strokeWidth?: number;
  strokeLinecap?: 'butt' | 'round';
  trackClass?: string;
  sizeClass?: string;
  viewBoxSize?: number;
  centerPrimary?: React.ReactNode;
  centerSecondary?: React.ReactNode;
  centerPrimaryClass?: string;
  centerSecondaryClass?: string;
  className?: string;
}

/**
 * Reusable SVG Donut / Ring chart component calculating stroke dash arrays and offsets.
 */
export const DonutChart: React.FC<DonutChartProps> = ({
  segments,
  radius = 64,
  strokeWidth = 20,
  strokeLinecap = 'butt',
  trackClass = 'stroke-slate-100 dark:stroke-slate-800',
  sizeClass = 'size-44 sm:size-48',
  viewBoxSize,
  centerPrimary,
  centerSecondary,
  centerPrimaryClass = 'text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight',
  centerSecondaryClass = 'text-xs text-slate-400 font-medium mt-0.5',
  className,
}) => {
  const boxSize = viewBoxSize || (radius + strokeWidth) * 2;
  const center = boxSize / 2;
  const circumference = 2 * Math.PI * radius;

  const computedSegments = useMemo(() => {
    let accumulated = 0;
    return segments.map((seg, idx) => {
      const strokeDash = (Math.max(0, seg.percentage) / 100) * circumference;
      const strokeOffset = -((accumulated / 100) * circumference);
      accumulated += Math.max(0, seg.percentage);
      return {
        ...seg,
        key: seg.id || seg.name || seg.label || `seg-${idx}`,
        strokeDash,
        strokeOffset,
      };
    });
  }, [segments, circumference]);

  return (
    <div className={cn('relative flex items-center justify-center shrink-0', sizeClass, className)}>
      <svg className="size-full -rotate-90 transform" viewBox={`0 0 ${boxSize} ${boxSize}`}>
        {/* Background Track Ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          className={trackClass}
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Dynamic Color Segments */}
        {computedSegments.map((seg) => (
          <circle
            key={seg.key}
            cx={center}
            cy={center}
            r={radius}
            stroke={seg.color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={`${seg.strokeDash} ${circumference}`}
            strokeDashoffset={seg.strokeOffset}
            strokeLinecap={strokeLinecap}
            className="transition-all duration-700 ease-out hover:opacity-90"
          />
        ))}
      </svg>

      {/* Center Content / Label */}
      {(centerPrimary !== undefined || centerSecondary !== undefined) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none select-none">
          {centerPrimary !== undefined && (
            <span className={centerPrimaryClass}>{centerPrimary}</span>
          )}
          {centerSecondary !== undefined && (
            <span className={centerSecondaryClass}>{centerSecondary}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default DonutChart;
