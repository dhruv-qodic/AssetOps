/**
 * @description: Constants and style definitions for AssetStatusBadge component
 */
import type { AssetStatus } from '@/types/asset';

export const ASSET_STATUS_BADGE_STYLES: Record<AssetStatus, string> = {
  Allocated: 'bg-[#EBF9F1] text-[#1FA653] dark:bg-emerald-950/50 dark:text-emerald-400',
  Available: 'bg-[#EAF2FE] text-[#2F6FEB] dark:bg-blue-950/50 dark:text-blue-400',
  Maintenance: 'bg-[#FEF6E6] text-[#E08A1E] dark:bg-amber-950/50 dark:text-amber-400',
  Retired: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  Lost: 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400',
};

export const DEFAULT_ASSET_STATUS_BADGE_STYLE = 'bg-slate-100 text-slate-700';
