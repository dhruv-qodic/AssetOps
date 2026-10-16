export const ACTIVE_ALLOCATIONS_CARD_DEFAULTS = {
  INITIALS: 'UN',
  DATE: 'May 10, 2024',
  EMPLOYEE_NAME: 'Unassigned Staff',
  DEPARTMENT: 'IT',
  EMPLOYEE_CODE: 'EMP-100',
  ID_PREFIX: 'AL',
  STATUS_ACTIVE: 'Active',
} as const;

export const ACTIVE_ALLOCATIONS_CARD_ACTIONS = {
  QR_CODE_LABEL: 'QR Code',
  QR_CODE_TITLE: 'View Asset QR Code & Details',
  REALLOCATE_TITLE: 'Reallocate Asset',
  DEALLOCATE_TITLE: 'Deallocate / Return Hardware',
  getToastReturned: (assetName: string) => `Asset "${assetName}" returned/deallocated`,
} as const;
