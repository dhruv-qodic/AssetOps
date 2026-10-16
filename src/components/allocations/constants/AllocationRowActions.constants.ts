export const ALLOCATION_ROW_ACTIONS_TEXT = {
  ARIA_LABEL: 'Allocation actions',
  ASSET_DETAILS: 'Asset Details',
  DEALLOCATE_RETURN: 'Deallocate / Return',
  REALLOCATE_ASSET: 'Reallocate Asset',
  STATUS_ALLOCATED: 'Allocated',
  getToastDeallocated: (assetName: string) => `Asset "${assetName}" deallocated successfully`,
} as const;
