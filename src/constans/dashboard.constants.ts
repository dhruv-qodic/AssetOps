export interface DashboardCardDefinition {
  id: string;
  label: string;
  category: 'Metrics';
  description: string;
  defaultVisible: boolean;
}

export interface DashboardWidgetDefinition {
  id: string;
  label: string;
  category: 'Overview Charts' | 'Analytics' | 'Activity Feed';
  description: string;
  defaultVisible: boolean;
}

export const DASHBOARD_CARDS: DashboardCardDefinition[] = [
  {
    id: 'total_assets',
    label: 'Total Assets',
    category: 'Metrics',
    description: 'Total hardware count in the entire inventory',
    defaultVisible: true,
  },
  {
    id: 'available_assets',
    label: 'Available Assets',
    category: 'Metrics',
    description: 'Hardware currently unassigned and ready for deployment',
    defaultVisible: true,
  },
  {
    id: 'assigned_assets',
    label: 'Assigned Assets',
    category: 'Metrics',
    description: 'Hardware actively allocated to staff members',
    defaultVisible: true,
  },
  {
    id: 'maintenance_assets',
    label: 'Maintenance Assets',
    category: 'Metrics',
    description: 'Hardware under repair, diagnostics, or servicing',
    defaultVisible: true,
  },
  {
    id: 'total_asset_value',
    label: 'Total Asset Value',
    category: 'Metrics',
    description: 'Cumulative monetary acquisition value of all hardware',
    defaultVisible: true,
  },
];

export const DASHBOARD_WIDGETS: DashboardWidgetDefinition[] = [
  {
    id: 'lifecycle_chart',
    label: 'Asset Status & Lifecycle Breakdown',
    category: 'Overview Charts',
    description: 'Hardware status allocation across major categories',
    defaultVisible: true,
  },
  {
    id: 'recent_activity',
    label: 'Recent Asset Activity Feed',
    category: 'Activity Feed',
    description: 'Live timeline of assignments, returns, updates, and maintenance',
    defaultVisible: true,
  },
  {
    id: 'growth_line_chart',
    label: 'Hardware Fleet Growth Trend',
    category: 'Analytics',
    description: 'Line chart tracking historical fleet expansion vs active allocation',
    defaultVisible: true,
  },
  {
    id: 'valuation_area_chart',
    label: 'Asset Valuation & Spend Trend',
    category: 'Analytics',
    description: 'Area chart illustrating cumulative hardware asset investment over time',
    defaultVisible: true,
  },
  {
    id: 'distribution_pie_chart',
    label: 'Asset Category & Department Distribution',
    category: 'Analytics',
    description: 'Donut & pie breakdown across categories and department utilization',
    defaultVisible: true,
  },
];

export const DASHBOARD_TIME_RANGES = [
  'Last 7 Days',
  'Last 30 Days',
  'Last 90 Days',
  'Year to Date',
  'All Time',
] as const;

export type DashboardTimeRange = (typeof DASHBOARD_TIME_RANGES)[number];
