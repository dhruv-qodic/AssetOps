import React from 'react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

export interface PageHeaderProps {
  icon: LucideIcon | React.ReactNode;
  title: string;
  description?: string | React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  icon: Icon,
  title,
  description,
  children,
  className,
}) => {
  const renderIcon = () => {
    if (!Icon) return null;
    if (React.isValidElement(Icon)) {
      return Icon;
    }
    const IconComponent = Icon as React.ElementType;
    return <IconComponent className="size-6 sm:size-7" />;
  };

  return (
    <div
      className={cn(
        'flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80',
        className,
      )}
    >
      {/* Title & Description with Section Icon */}
      <div className="flex items-start sm:items-center gap-3">
        <div className="p-2.5 rounded-xl bg-[#155DFC]/10 dark:bg-[#155DFC]/20 text-[#155DFC] shadow-xs shrink-0 mt-0.5 sm:mt-0">
          {renderIcon()}
        </div>
        <div className="space-y-0.5 text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h1>
          {description && (
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{description}</p>
          )}
        </div>
      </div>

      {/* Action Controls & Filters Slot */}
      {children && (
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 self-stretch lg:self-auto">
          {children}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
