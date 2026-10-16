/**
 * @description: Constants, headers, labels, and status strings for AssetVisualizer component
 */

export const ASSET_VISUALIZER_TITLES = {
  ENGINE_ACTIVE: 'Visualizer Engine Active',
  ENGINE_SUBTITLE: 'High-performance windowed virtual grid',
  FILTERING: 'Filtering...',
  ITEMS_VIRTUALIZED_SUFFIX: 'items virtualized',
  ROW_SELECTED: '1 row selected',
} as const;

export const ASSET_VISUALIZER_COLUMNS = {
  ASSET_ID: 'ASSET ID',
  NAME: 'NAME',
  CATEGORY: 'CATEGORY',
  STATUS: 'STATUS',
  LOCATION: 'LOCATION',
  COST: 'COST',
  ASSIGNED_TO: 'ASSIGNED TO',
  ACTIONS: 'ACTIONS',
} as const;
