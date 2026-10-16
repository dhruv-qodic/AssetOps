/**
 * @description: Constants, labels, descriptions, and messages for DeleteAssetModal component
 */

export const DELETE_ASSET_TITLES = {
  MODAL_TITLE: 'Delete Asset',
  MODAL_DESCRIPTION: 'Are you sure you want to remove this asset?',
  WARNING_TEXT:
    'This action cannot be undone. All assignment logs and status records for this asset will be permanently removed.',
} as const;

export const DELETE_ASSET_LABELS = {
  CATEGORY: 'Category',
  SERIAL: 'Serial',
} as const;

export const DELETE_ASSET_BUTTONS = {
  CANCEL: 'Cancel',
  DELETE: 'Delete Asset',
} as const;

export const DELETE_ASSET_MESSAGES = {
  DELETE_SUCCESS: (name: string): string => `Asset "${name}" deleted successfully`,
} as const;
