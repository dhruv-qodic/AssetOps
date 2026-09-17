import type { AssetCategory, AssetStatus, AssetSortOption, AssetFilters } from '@/types/asset';

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

export interface ColumnDefinition {
  id: string;
  label: string;
  category: 'Core' | 'Financial & Dates' | 'Assignment' | 'Technical' | 'System';
  description?: string;
  defaultVisible: boolean;
}

export const AVAILABLE_ASSET_COLUMNS: ColumnDefinition[] = [
  {
    id: 'assetId',
    label: 'Asset ID',
    category: 'Core',
    description: 'Unique asset identifier tag (e.g., A1001)',
    defaultVisible: true,
  },
  {
    id: 'name',
    label: 'Asset Name',
    category: 'Core',
    description: 'Hardware name, model title, and device icon',
    defaultVisible: true,
  },
  {
    id: 'category',
    label: 'Category',
    category: 'Core',
    description: 'Classification (Laptop, Mobile, Monitor, Tablet, etc.)',
    defaultVisible: true,
  },
  {
    id: 'status',
    label: 'Status',
    category: 'Core',
    description: 'Current lifecycle state (Available, Allocated, Maintenance, etc.)',
    defaultVisible: true,
  },
  {
    id: 'location',
    label: 'Location',
    category: 'Core',
    description: 'Workplace, office branch, or remote site',
    defaultVisible: true,
  },
  {
    id: 'purchaseCost',
    label: 'Cost',
    category: 'Financial & Dates',
    description: 'Acquisition expenditure in USD currency',
    defaultVisible: true,
  },
  {
    id: 'assignedTo',
    label: 'Assigned To',
    category: 'Assignment',
    description: 'Employee name and assignment information',
    defaultVisible: true,
  },
  {
    id: 'serialNumber',
    label: 'Serial Number',
    category: 'Technical',
    description: 'Manufacturer unique hardware serial key',
    defaultVisible: false,
  },
  {
    id: 'model',
    label: 'Model / Variant',
    category: 'Technical',
    description: 'Specific manufacturer sub-model or specs',
    defaultVisible: false,
  },
  {
    id: 'purchaseDate',
    label: 'Purchase Date',
    category: 'Financial & Dates',
    description: 'Acquisition date recorded for depreciation',
    defaultVisible: false,
  },
  {
    id: 'warrantyExpiry',
    label: 'Warranty Expiry',
    category: 'Financial & Dates',
    description: 'Vendor warranty or service agreement expiry',
    defaultVisible: false,
  },
  {
    id: 'department',
    label: 'Department',
    category: 'Assignment',
    description: 'Organizational unit of assigned employee',
    defaultVisible: false,
  },
  {
    id: 'specifications',
    label: 'Specifications',
    category: 'Technical',
    description: 'Technical hardware attributes (RAM, Storage, CPU)',
    defaultVisible: false,
  },
  {
    id: 'notes',
    label: 'Notes / Remarks',
    category: 'Core',
    description: 'Internal documentation or servicing notes',
    defaultVisible: false,
  },
  {
    id: 'createdAt',
    label: 'Created Date',
    category: 'System',
    description: 'Timestamp when asset was added to system',
    defaultVisible: false,
  },
  {
    id: 'updatedAt',
    label: 'Last Updated',
    category: 'System',
    description: 'Timestamp of last modification',
    defaultVisible: false,
  },
  {
    id: 'actions',
    label: 'Actions',
    category: 'System',
    description: 'Context menu for edit, view, and allocation operations',
    defaultVisible: true,
  },
];
