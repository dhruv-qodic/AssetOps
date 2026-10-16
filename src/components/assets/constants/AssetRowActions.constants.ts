/**
 * @description: Constants, action labels, titles, and toast messages for AssetRowActions component
 */

export const ASSET_ROW_ACTIONS_TITLES = {
  ASSET_ACTIONS: 'Asset actions',
} as const;

export const ASSET_ROW_ACTIONS_LABELS = {
  ASSET_DETAILS: 'Asset Details',
  EDIT_ASSET: 'Edit Asset',
  DEALLOCATE_ASSET: 'Deallocate Asset',
  ALLOCATE_TO_EMPLOYEE: 'Allocate to Employee',
  MARK_AVAILABLE: 'Mark Available',
  MARK_MAINTENANCE: 'Mark Maintenance',
  DELETE_ASSET: 'Delete Asset',
} as const;

export const ASSET_ROW_ACTIONS_MESSAGES = {
  MARKED_UNDER_MAINTENANCE: (name: string): string => `Asset "${name}" marked under maintenance`,
  MARKED_AS_AVAILABLE: (name: string): string => `Asset "${name}" marked as available`,
  DEALLOCATED_SUCCESS: (name: string): string => `Asset "${name}" deallocated successfully`,
} as const;
