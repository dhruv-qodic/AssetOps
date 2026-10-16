/**
 * @description: Constants, titles, labels, placeholders, and button texts for AssetHierarchyView component
 */

export const ASSET_HIERARCHY_MESSAGES = {
  LOADING_TITLE: 'Loading asset hierarchy...',
  LOADING_DESCRIPTION:
    'Organizing hardware assets by office locations, departments, and employees.',
  ERROR_TITLE: 'Failed to load asset hierarchy',
  EMPTY_TITLE: 'No assets available for hierarchy view',
  EMPTY_DESCRIPTION:
    'No assets match your search or filter criteria. Try clearing filters or create a new asset.',
  NO_MATCHING_TITLE: 'No matching assets found in tree view',
  CLEAR_SEARCH: 'Clear Search',
} as const;

export const ASSET_HIERARCHY_TITLES = {
  TREE_TITLE: 'Asset Hierarchy Tree',
  TREE_SUBTITLE:
    'Structured parent-child view: Office Location → Department → Assignee → Hardware Asset',
} as const;

export const ASSET_HIERARCHY_PLACEHOLDERS = {
  SEARCH_TREE: 'Search tree...',
} as const;

export const ASSET_HIERARCHY_BUTTONS = {
  EXPAND_ALL: 'Expand All',
  COLLAPSE_ALL: 'Collapse All',
  QR: 'QR',
  EDIT: 'Edit',
  DETAILS: 'Details',
} as const;

export const ASSET_HIERARCHY_LABELS = {
  OFFICE_LOCATION_TAG: 'Office Location',
  INVENTORY_TAG: 'Inventory',
  ASSIGNEE_TAG: 'Assignee',
  OFFICES: 'Offices',
  DEPARTMENTS: 'Departments',
  ACTIVE_ASSIGNEES: 'Active Assignees',
  ASSETS: 'Assets',
  VALUE: 'Value',
  MEMBER_SINGULAR: 'member/group',
  MEMBERS_PLURAL: 'members/groups',
  ASSET_SINGULAR: 'asset',
  ASSETS_PLURAL: 'assets',
} as const;
