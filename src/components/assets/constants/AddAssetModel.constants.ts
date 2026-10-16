/**
 * @description: Constants, labels, placeholders, and notification strings for AddAssetModal component
 */

export const ASSET_MODAL_MESSAGES = {
  CREATED_SUCCESS: 'Asset created successfully',
  UPDATED_SUCCESS: 'Asset updated successfully',
} as const;

export const ASSET_MODAL_TITLES = {
  ADD_ASSET: 'Add New Asset',
  EDIT_ASSET: 'Edit Asset',
  ADD_DESCRIPTION: 'Fill in the information below to register a new organization asset.',
  EDIT_DESCRIPTION_PREFIX: 'Update specifications and details for',
} as const;

export const ASSET_MODAL_LABELS = {
  ASSET_ID: 'Asset ID',
  ASSET_NAME: 'Asset Name',
  MODEL_SPECIFICATION: 'Model / Specification',
  SERIAL_NUMBER: 'Serial Number',
  CATEGORY: 'Category',
  STATUS: 'Status',
  LOCATION: 'Location',
  PURCHASE_DATE: 'Purchase Date',
  TECHNICAL_SPECS: 'Technical Specifications',
  NOTES_REMARKS: 'Notes / Remarks',
} as const;

export const ASSET_MODAL_PLACEHOLDERS = {
  ASSET_ID: 'A1010',
  NAME: 'e.g. Dell Laptop',
  MODEL: 'e.g. Latitude 5440, 27-inch',
  SERIAL_NUMBER: 'SN-078000',
  CATEGORY: 'Select asset category',
  STATUS: 'Current asset status',
  LOCATION: "Asset's current location",
  SPEC_PROPERTY: 'Property (e.g. Processor, RAM)',
  SPEC_VALUE: 'Value (e.g. 16GB DDR5, M3 Pro)',
  NOTES: 'Additional inventory details or maintenance notes...',
} as const;

export const ASSET_MODAL_BUTTONS = {
  CANCEL: 'Cancel',
  CREATE_ASSET: 'Create Asset',
  SAVE_CHANGES: 'Save Changes',
  ADD_SPEC_FIELD: 'Add Spec Field',
  LOAD_PRESETS: 'Load Presets',
} as const;

export const ASSET_MODAL_STRINGS = {
  NO_SPECS_ADDED: 'No technical specifications added yet.',
  REMOVE_FIELD: 'Remove field',
  NOTES_HELPER: 'Any additional information that might be useful',
  DEFAULT_PROPERTY: 'Property',
} as const;

export const SPEC_PRESETS = {
  COMPUTERS: [
    { key: 'Processor', value: '' },
    { key: 'RAM', value: '' },
    { key: 'Storage', value: '' },
  ],
  MONITORS: [
    { key: 'Resolution', value: '' },
    { key: 'Refresh Rate', value: '' },
    { key: 'Panel', value: '' },
  ],
} as const;
