export const ASSET_DETAIL_PAGE_CONSTANTS = {
  LOADING: {
    TITLE: 'Loading Asset Details...',
    DESCRIPTION: 'Fetching the latest asset profile and history.',
  },
  NOT_FOUND: {
    TITLE: 'Asset Not Found',
    DESCRIPTION: (assetId: string) =>
      `We couldn't locate an asset with identifier "${assetId}". It may have been retired or removed.`,
    ACTION_LABEL: 'Back to Assets List',
    ASSETS_PATH: '/assets',
  },
  TOAST: {
    DEALLOCATE_SUCCESS: (name: string) => `${name} has been returned to inventory`,
    DEALLOCATE_ERROR: 'Failed to deallocate asset',
  },
  BREADCRUMB: {
    ASSETS: 'Assets',
    SEPARATOR: '/',
  },
  HEADER: {
    TITLE: 'Asset Details',
    SUBTITLE: (name: string, assetId: string) =>
      `Detailed hardware specifications, current allocation, and historical activity for ${name} (${assetId}).`,
    QR_CODE_BUTTON: 'QR Code',
    EDIT_ASSET_BUTTON: 'Edit Asset',
  },
  METADATA: {
    ADDED_PREFIX: 'Added ',
    ASSET_ID: 'Asset ID',
    SERIAL_NUMBER: 'Serial Number',
    LOCATION: 'Location',
    PURCHASE_DATE: 'Purchase Date',
    PURCHASE_COST: 'Purchase Cost',
    WARRANTY: 'Warranty',
    DEFAULT_WARRANTY: 'Valid (3 Years)',
    NOT_AVAILABLE: 'N/A',
  },
  TABS: {
    DETAILS: 'Details',
    HISTORY: 'Allocation History',
  },
  CURRENT_ALLOCATION: {
    TITLE: 'Current Allocation',
    DEALLOCATE_BUTTON: 'Deallocate',
    ALLOCATE_BUTTON: 'Allocate Asset',
    DEFAULT_DEPARTMENT: 'IT Department',
    DEFAULT_EMAIL: 'employee@assetops.com',
    ALLOCATED_ON_PREFIX: 'Allocated on ',
    UNALLOCATED_DESCRIPTION:
      'This asset is currently in inventory and not allocated to any team member.',
  },
  SPECIFICATIONS: {
    TITLE: 'Asset Specifications',
    EDIT_SPECS_BUTTON: 'Edit Specs',
    CATEGORY: 'Category',
    LOCATION: 'Location',
    NOTES_TITLE: 'Notes & Remarks:',
  },
  HISTORY_SECTION: {
    TITLE: 'Complete Allocation & Deallocation History',
    SUBTITLE: (name: string, assetId: string) =>
      `Full chronological lifecycle of assignments and returns for ${name} (${assetId})`,
    TOTAL_EVENTS: 'Total Events:',
    EMPTY_TITLE: 'No allocation or deallocation history recorded yet.',
    EMPTY_DESCRIPTION:
      'Future assignment events will automatically appear in this chronological audit log.',
    LOGGED_BY_PREFIX: 'Logged by ',
    ACTION_ALLOCATED: 'Allocated',
  },
} as const;
