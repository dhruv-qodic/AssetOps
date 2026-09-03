import React from 'react';
import {
  Laptop,
  Smartphone,
  Monitor,
  Keyboard,
  Headphones,
  HardDrive,
  Tablet,
  Radio,
  Box,
} from 'lucide-react';
import type { AssetCategory } from '@/types/asset';
import { cn } from '@/lib/utils';

interface AssetDeviceIconProps {
  category: AssetCategory;
  name?: string;
  className?: string;
}

export const AssetDeviceIcon: React.FC<AssetDeviceIconProps> = ({
  category,
  name = '',
  className,
}) => {
  const lower = name.toLowerCase();

  const getIcon = () => {
    if (lower.includes('airpods') || lower.includes('headphone') || category === 'Audio') {
      return <Headphones className="size-4.5 text-slate-700 dark:text-slate-200" />;
    }
    if (lower.includes('keyboard') || lower.includes('mouse')) {
      return <Keyboard className="size-4.5 text-slate-700 dark:text-slate-200" />;
    }

    switch (category) {
      case 'Laptop':
        return <Laptop className="size-4.5 text-slate-700 dark:text-slate-200" />;
      case 'Mobile':
        return <Smartphone className="size-4.5 text-blue-600 dark:text-blue-400" />;
      case 'Monitor':
        return <Monitor className="size-4.5 text-indigo-600 dark:text-indigo-400" />;
      case 'Tablet':
        return <Tablet className="size-4.5 text-purple-600 dark:text-purple-400" />;
      case 'Desktop':
        return <HardDrive className="size-4.5 text-slate-700 dark:text-slate-200" />;
      case 'Networking':
        return <Radio className="size-4.5 text-cyan-600 dark:text-cyan-400" />;
      case 'Accessories':
        return <Keyboard className="size-4.5 text-slate-700 dark:text-slate-200" />;
      default:
        return <Box className="size-4.5 text-slate-600 dark:text-slate-300" />;
    }
  };

  return (
    <div
      className={cn(
        'flex size-9.5 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 shadow-2xs select-none transition-transform group-hover:scale-105',
        className
      )}
    >
      {getIcon()}
    </div>
  );
};

export default AssetDeviceIcon;
