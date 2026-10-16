/**
 * @description: Constants, labels, placeholders, and UI strings for AllocateAssetModal component
 */

export const ALLOCATE_ASSET_TITLES = {
  MODAL_TITLE: 'Allocate Asset to Employee',
  MODAL_DESCRIPTION:
    'Select an available organization asset on the left and assign it to an employee on the right.',
} as const;

export const ALLOCATE_ASSET_LABELS = {
  AVAILABLE_ASSETS: 'Available Assets',
  AVAILABLE_SUFFIX: 'Available',
  EMPLOYEES: 'Employees',
  PERSONNEL_SUFFIX: 'Personnel',
  ALLOCATING_PREFIX: 'Allocating:',
  READY_TO_ALLOCATE: 'Ready to Allocate',
} as const;

export const ALLOCATE_ASSET_PLACEHOLDERS = {
  SEARCH_ASSETS: 'Search available assets by name, ID, category, or location...',
  SEARCH_EMPLOYEES: 'Search employee by name, ID, position, or department...',
} as const;

export const ALLOCATE_ASSET_MESSAGES = {
  NO_AVAILABLE_ASSETS: 'No available assets found to allocate.',
  NO_MATCHING_ASSETS: 'No matching available assets found.',
  NO_MATCHING_EMPLOYEES: 'No matching active employees found.',
} as const;

export const ALLOCATE_ASSET_BUTTONS = {
  CANCEL: 'Cancel',
  ALLOCATE: 'Allocate Asset',
} as const;
