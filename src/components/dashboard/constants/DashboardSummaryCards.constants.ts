export const DASHBOARD_SUMMARY_CARD_IDS = {
  TOTAL_ASSETS: 'total_assets',
  AVAILABLE_ASSETS: 'available_assets',
  ASSIGNED_ASSETS: 'assigned_assets',
  MAINTENANCE_ASSETS: 'maintenance_assets',
  TOTAL_ASSET_VALUE: 'total_asset_value',
} as const;

export const DASHBOARD_SUMMARY_CARDS_TEXT = {
  TOTAL_ASSETS_TITLE: 'Total Assets',
  TOTAL_ASSETS_BADGE: 'Active Fleet',
  TOTAL_ASSETS_ALL_LOCATIONS_DESC: 'Across all branches & offices',
  getLocationDesc: (location: string) => `Located in ${location}`,

  AVAILABLE_ASSETS_TITLE: 'Available Assets',
  AVAILABLE_BADGE_SUFFIX: 'available',
  AVAILABLE_ASSETS_DESC: 'Ready for employee assignment',

  ASSIGNED_ASSETS_TITLE: 'Assigned Assets',
  DEPLOYED_BADGE_SUFFIX: 'deployed',
  ASSIGNED_ASSETS_DESC: 'Actively in use across departments',

  MAINTENANCE_ASSETS_TITLE: 'In Maintenance',
  SERVICING_BADGE_SUFFIX: 'servicing',
  MAINTENANCE_ASSETS_DESC: 'Under repair or routine diagnostics',

  TOTAL_VALUE_TITLE: 'Total Asset Value',
  TOTAL_VALUE_BADGE: 'Acquisition Value',
  TOTAL_VALUE_DESC: 'Cumulative hardware book cost',
} as const;
