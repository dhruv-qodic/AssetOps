/**
 * @description: Constants, headers, labels, placeholders, and feedback messages for ImportAssetsModal component
 */

export const IMPORT_ASSETS_TITLES = {
  MODAL_TITLE: 'Import Assets',
  MODAL_DESCRIPTION:
    'Upload CSV or Excel spreadsheets to bulk import hardware assets into AssetOps.',
  DRAG_DROP_MORE: 'Drag & drop more spreadsheets or click to browse',
  DRAG_DROP_PROMPT: 'Drag & drop your CSV or Excel spreadsheets here',
  UPLOADED_FILES: 'Uploaded Files',
  TOTAL_ROWS: 'Total Rows',
  READY_TO_IMPORT: 'Ready to Import',
  INVALID_ROWS: 'Invalid Rows',
  DUPLICATES: 'Duplicates',
  GUIDELINES_TITLE: 'Import Guidelines & Supported Columns:',
  GUIDELINES_COLUMNS:
    'Asset ID, Name, Category, Status, Location, Serial Number, Purchase Date, Purchase Cost, Model, Warranty Expiry, Notes, and Specifications',
  GUIDELINES_DOWNLOAD_HINT:
    'Download the sample template above for standard column formatting and sample data.',
  BEGIN_PROMPT: 'Select CSV or Excel files to begin',
} as const;

export const IMPORT_ASSETS_BUTTONS = {
  TEMPLATE_CSV: 'Template (.csv)',
  TEMPLATE_XLSX: '(.xlsx)',
  BROWSE_FILES: 'Browse Files',
  ADD_MORE_FILES: 'Add more files',
  CLEAR_ALL: 'Clear all',
  CANCEL: 'Cancel',
  RESET: 'Reset',
  IMPORTING: 'Importing...',
  IMPORT_ASSETS: 'Import Assets',
} as const;

export const IMPORT_ASSETS_PLACEHOLDERS = {
  SEARCH_PARSED: 'Search parsed records...',
} as const;

export const IMPORT_ASSETS_TABLE_COLUMNS = {
  STATUS: 'Status',
  SOURCE: 'Source',
  ASSET_ID: 'Asset ID',
  NAME_MODEL: 'Name & Model',
  CATEGORY: 'Category',
  LOCATION: 'Location',
  SERIAL_NO: 'Serial No',
  COST: 'Cost',
  ISSUES_ERRORS: 'Issues / Errors',
} as const;

export const IMPORT_ASSETS_LABELS = {
  READY: 'Ready',
  INVALID: 'Invalid',
  DUPLICATE: 'Duplicate',
  MISSING: 'Missing',
  READY_TO_IMPORT_CELL: 'Ready to import',
  NO_RECORDS_MATCH: 'No records match the selected filter or search query.',
} as const;

export const IMPORT_ASSETS_MESSAGES = {
  NO_VALID_RECORDS: 'No valid records to import. Please review and fix validation errors.',
  IMPORT_SUCCESS: (count: number): string =>
    `Successfully imported ${count} assets into inventory!`,
  SKIPPED_RECORDS: (count: number): string => `Skipped ${count} invalid or duplicate records.`,
} as const;
