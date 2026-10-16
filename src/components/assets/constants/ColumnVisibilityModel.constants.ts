import { type ColumnDefinition } from '@/constant/asset.constants';

/**
 * @description: Constants, categories, labels, and text for ColumnVisibilityModal component
 */

export const COLUMN_VISIBILITY_CATEGORIES: Array<'All' | ColumnDefinition['category']> = [
  'All',
  'Core',
  'Financial & Dates',
  'Assignment',
  'Technical',
  'System',
];

export const COLUMN_VISIBILITY_TITLES = {
  MODAL_TITLE: 'Column Visibility',
  MODAL_DESCRIPTION: 'Select and manage which data columns are displayed in the Assets table view.',
} as const;

export const COLUMN_VISIBILITY_LABELS = {
  SELECTED_COLUMNS: 'Selected Columns',
  AVAILABLE_COLUMNS: 'Available Columns',
  ACTIVE_SUFFIX: 'active',
  OF_CONNECTOR: 'of',
  RESET_DEFAULT: 'Reset Default',
  CLEAR_ALL: 'Clear all',
  NO_COLUMNS_SELECTED: 'No columns selected. Click columns below to add them to this list.',
  SELECT_ALL_PREFIX: 'Select all',
} as const;

export const COLUMN_VISIBILITY_PLACEHOLDERS = {
  SEARCH: 'Search available columns by title, ID, or description...',
} as const;

export const COLUMN_VISIBILITY_BUTTONS = {
  CANCEL: 'Cancel',
  DONE: 'Done',
} as const;

export const COLUMN_VISIBILITY_MESSAGES = {
  NO_COLUMNS_FOUND: (query: string): string => `No columns found matching "${query}".`,
} as const;
