/**
 * @description: Constants, titles, labels, and options for AssetFilterDropdown component
 */

export interface CostPreset {
  label: string;
  min: number | null;
  max: number | null;
}

export const COST_RANGE_PRESETS: CostPreset[] = [
  { label: 'Under $500', min: 0, max: 500 },
  { label: '$500 - $1,000', min: 500, max: 1000 },
  { label: '$1,000 - $2,500', min: 1000, max: 2500 },
  { label: '$2,500+', min: 2500, max: null },
];

export const ASSET_FILTER_DROPDOWN_TITLES = {
  FILTER_BUTTON: 'Filter',
  FILTERS_HEADING: 'Filters',
  SELECTED_SUFFIX: 'Selected',
  CATEGORY_TAB: 'Category',
  STATUS_TAB: 'Status',
  DEPARTMENT_TAB: 'Department',
  LOCATION_TAB: 'Location',
  COST_RANGE_TAB: 'Cost Range',
  SAVED_PRESETS_TAB: 'Saved Presets',
  ASSET_CATEGORIES_SECTION: 'Asset Categories',
  ASSET_STATUS_SECTION: 'Asset Status',
  DEPARTMENT_SECTION: 'Department',
  ASSET_LOCATION_SECTION: 'Asset Location',
  PURCHASE_COST_SECTION: 'Purchase Cost Range ($)',
  QUICK_PRESET_RANGE: 'Quick Preset Range',
  SAVED_PRESETS_SECTION: 'Saved Filter Presets',
  NO_SAVED_PRESETS_TITLE: 'No saved presets yet',
  NO_SAVED_PRESETS_DESC: 'Choose your filter criteria and click "Save Preset" to reuse anytime.',
} as const;

export const ASSET_FILTER_DROPDOWN_BUTTONS = {
  SAVE_PRESET: 'Save Preset',
  SAVE_CURRENT: 'Save Current',
  SELECT_ALL: 'Select All',
  CLEAR: 'Clear',
  RESET_COST: 'Reset Cost',
  APPLY: 'Apply',
  RESET: 'Reset',
  RESET_ALL_FILTERS: 'Reset all filters',
  CANCEL: 'Cancel',
  DELETE_PRESET_TITLE: 'Delete preset',
  CLOSE_TITLE: 'Close',
} as const;

export const ASSET_FILTER_DROPDOWN_LABELS = {
  MIN_COST: 'Min ($)',
  MAX_COST: 'Max ($)',
} as const;

export const ASSET_FILTER_DROPDOWN_PLACEHOLDERS = {
  MIN_COST: '0',
  MAX_COST: '5000',
} as const;

export const ASSET_FILTER_DROPDOWN_MESSAGES = {
  RESET_SUCCESS: 'Filters reset',
  PRESET_SAVED_PREFIX: 'Filter preset "',
  PRESET_SAVED_SUFFIX: '" saved',
  APPLIED_PRESET_PREFIX: 'Applied preset "',
  APPLIED_PRESET_SUFFIX: '"',
  DELETED_PRESET_PREFIX: 'Deleted preset "',
  DELETED_PRESET_SUFFIX: '"',
} as const;

export const ASSET_FILTER_DROPDOWN_TOOLTIPS = {
  ALLOCATIONS_TRIGGER: 'Filter Active Allocations',
  ASSETS_TRIGGER: 'Open Asset Filters',
  ALLOCATIONS_ARIA: 'Filter active allocations',
  ASSETS_ARIA: 'Open Asset Filters',
} as const;
