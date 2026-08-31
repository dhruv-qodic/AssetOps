import type {
  AssetCategory,
  AssetStatus,
  AssetSortOption,
  AssetFilters,
} from '@/types/asset';

export const ASSET_CATEGORIES: AssetCategory[] = [
  'Laptop',
  'Mobile',
  'Monitor',
  'Accessories',
  'Desktop',
  'Tablet',
  'Audio',
  'Networking',
  'Other',
];

export const ASSET_STATUSES: AssetStatus[] = [
  'Allocated',
  'Available',
  'Maintenance',
  'Retired',
  'Lost',
];

export const ASSET_LOCATIONS: string[] = [
  'Headquarters',
  'New York Office',
  'San Francisco',
  'London Office',
  'Remote',
];

export const ASSET_SORT_OPTIONS: { label: string; value: AssetSortOption }[] = [
  { label: 'Recently Added', value: 'recently_added' },
  { label: 'Name (A to Z)', value: 'name_asc' },
  { label: 'Name (Z to A)', value: 'name_desc' },
  { label: 'Asset ID (Ascending)', value: 'asset_id_asc' },
  { label: 'Asset ID (Descending)', value: 'asset_id_desc' },
  { label: 'Purchase Date (Newest)', value: 'purchase_date_desc' },
];

export const DEFAULT_ASSET_FILTERS: AssetFilters = {
  search: '',
  category: 'All',
  status: 'All',
  location: 'All',
  sortBy: 'recently_added',
  page: 1,
  pageSize: 10,
};

export interface StatusBadgeConfig {
  label: string;
  bg: string;
  text: string;
  border: string;
  dot: string;
}

export const ASSET_STATUS_CONFIG: Record<AssetStatus, StatusBadgeConfig> = {
  Allocated: {
    label: 'Allocated',
    bg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
    text: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800',
    dot: 'bg-emerald-500',
  },
  Available: {
    label: 'Available',
    bg: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
    text: 'text-blue-700 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
    dot: 'bg-blue-500',
  },
  Maintenance: {
    label: 'Maintenance',
    bg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800',
    dot: 'bg-amber-500',
  },
  Retired: {
    label: 'Retired',
    bg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
    text: 'text-slate-700 dark:text-slate-400',
    border: 'border-slate-300 dark:border-slate-700',
    dot: 'bg-slate-400',
  },
  Lost: {
    label: 'Lost',
    bg: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400',
    text: 'text-rose-700 dark:text-rose-400',
    border: 'border-rose-200 dark:border-rose-800',
    dot: 'bg-rose-500',
  },
};
