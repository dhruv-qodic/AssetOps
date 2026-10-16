/**
 * @description: Constants, messages, and titles for AssetTable component
 */

export const ASSET_TABLE_MESSAGES = {
  LOADING_TITLE: 'Loading assets...',
  LOADING_DESCRIPTION: 'Please wait while we retrieve the latest asset inventory.',
  ERROR_TITLE: 'Failed to load assets',
  EMPTY_TITLE: 'No assets found',
  EMPTY_DESCRIPTION:
    'No assets match your active search or filter criteria. Try clearing filters or add a new asset.',
  CLEAR_FILTERS: 'Clear filters',
  ADD_ASSET: 'Add Asset',
  NO_COLUMNS_TITLE: 'No columns currently visible.',
  NO_COLUMNS_DESCRIPTION: 'Use the Column Visibility button above to select columns to display.',
  HIDE_COLUMN_TITLE: (label: string): string => `Click to hide "${label}" column`,
} as const;
