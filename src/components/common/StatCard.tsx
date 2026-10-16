import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  title: string;
  value: string | number;
  badge?: string;
  badgeBg?: string;
  badgeStyle?: string;
  badgeIcon?: React.ElementType;
  icon: React.ElementType;
  iconBg?: string;
  iconColor?: string;
  accentGlow?: string;
  barColor?: string;
  description?: string;
  className?: string;
  onClick?: () => void;
  'data-testid'?: string;
}

/**
 * Reusable summary metric KPI card with top gradient highlight and hover animation.
 */
export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  badge,
  badgeBg,
  badgeStyle,
  badgeIcon: BadgeIcon = TrendingUp,
  icon: Icon,
  iconBg = 'bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground',
  iconColor,
  accentGlow = 'hover:border-primary/40 hover:shadow-primary/10',
  barColor = 'from-primary to-primary/80',
  description,
  className,
  onClick,
  'data-testid': testId,
}) => {
  const badgeClasses = badgeStyle || badgeBg || 'bg-primary/10 text-primary';

  return (
    <Card
      data-testid={testId}
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 shadow-xs hover:shadow-lg transition-all duration-300 ease-out hover:-translate-y-1 text-left select-none',
        onClick && 'cursor-pointer',
        accentGlow,
        className,
      )}
    >
      {/* Top Accent Gradient Bar on Hover */}
      {barColor && (
        <div
          className={cn(
            'absolute top-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300',
            barColor,
          )}
        />
      )}

      <CardContent className="p-5 flex flex-col justify-between h-full space-y-3">
        <div className="flex items-start justify-between">
          <span className="text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400 uppercase">
            {title}
          </span>
          <div
            className={cn(
              'p-2.5 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-xs',
              iconBg,
              iconColor,
            )}
          >
            <Icon className="size-5 transition-colors duration-300" />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-primary transition-colors duration-300">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </div>
            {badge && (
              <span
                className={cn(
                  'inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full',
                  badgeClasses,
                )}
              >
                <BadgeIcon className="size-3" />
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
