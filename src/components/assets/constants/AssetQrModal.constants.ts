/**
 * @description: Constants, labels, messages, and button text for AssetQrModal component
 */

export const ASSET_QR_TITLES = {
  MODAL_TITLE: 'Asset QR Code',
  SCAN_HINT: 'Scan to navigate directly to this asset page',
} as const;

export const ASSET_QR_LABELS = {
  SERIAL: 'Serial',
  DIRECT_URL: 'Direct Asset URL',
  FORMAT_PREFIX: 'Format:',
  COPIED: 'Copied',
  COPY: 'Copy',
  REFRESH: 'Refresh',
  OPEN_DETAIL_PAGE: 'Open Asset Detail Page',
} as const;

export const ASSET_QR_BUTTONS = {
  DOWNLOAD_QR: 'Download QR Code',
} as const;

export const ASSET_QR_MESSAGES = {
  COPIED_SUCCESS: 'Asset link copied to clipboard',
  COPIED_ERROR: 'Failed to copy link to clipboard',
  DOWNLOAD_SUCCESS: (id: string): string => `QR Code downloaded for ${id}`,
  DOWNLOAD_ERROR: 'Failed to download QR code',
  CANVAS_ERROR: 'Could not generate QR code image',
  REFRESHED_INFO: 'QR Code refreshed',
} as const;
