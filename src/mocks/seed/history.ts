export type HistoryCategory = 'all' | 'asset' | 'employee' | 'allocation';

export type HistoryActionType =
  | 'asset_created'
  | 'asset_updated'
  | 'asset_deleted'
  | 'asset_maintenance'
  | 'asset_retired'
  | 'employee_onboarded'
  | 'employee_updated'
  | 'employee_offboarded'
  | 'employee_transferred'
  | 'allocation_assigned'
  | 'allocation_returned'
  | 'allocation_reallocated';

export interface HistoryRecord {
  id: string;
  category: 'asset' | 'employee' | 'allocation';
  action: string;
  actionType: HistoryActionType;
  title: string;
  description: string;
  entityName: string;
  entityId: string;
  entityType: 'Asset' | 'Employee' | 'Allocation';
  actor: {
    name: string;
    email: string;
    role: string;
    avatarInitials: string;
  };
  department?: string;
  location?: string;
  timestamp: string;
  relativeTime: string;
  statusBadge: {
    label: string;
    variant: 'emerald' | 'blue' | 'indigo' | 'amber' | 'rose' | 'purple' | 'slate';
  };
  isUnread?: boolean;
  metadata?: Record<string, string | number>;
}

export const MOCK_HISTORY_RECORDS: HistoryRecord[] = [
  {
    id: 'HIST-1089',
    category: 'allocation',
    action: 'Hardware Allocated',
    actionType: 'allocation_assigned',
    title: 'Allocated MacBook Pro 16" to Sarah Connor',
    description:
      'Assigned hardware asset A1001 (Apple M3 Max, 64GB RAM) to Sarah Connor in DevOps Engineering.',
    entityName: 'MacBook Pro 16"',
    entityId: 'A1001',
    entityType: 'Allocation',
    actor: {
      name: 'Admin User',
      email: 'admin@assetops.com',
      role: 'IT Administrator',
      avatarInitials: 'AU',
    },
    department: 'IT',
    location: 'Headquarters',
    timestamp: '2026-10-05T11:45:00.000Z',
    relativeTime: '15m ago',
    statusBadge: {
      label: 'Allocated',
      variant: 'indigo',
    },
    isUnread: true,
    metadata: {
      'Allocation Code': 'AL1001',
      'Serial Number': 'MBP16-001',
      'Assigned Employee': 'Sarah Connor (EMP-001)',
      Condition: 'New',
    },
  },
  {
    id: 'HIST-1088',
    category: 'asset',
    action: 'New Asset Added',
    actionType: 'asset_created',
    title: 'Registered iPhone 15 Pro in Asset Registry',
    description:
      'Added mobile device A1002 (256GB Titanium) with purchase cost $1,199 to New York inventory.',
    entityName: 'iPhone 15 Pro',
    entityId: 'A1002',
    entityType: 'Asset',
    actor: {
      name: 'Elena Rostova',
      email: 'elena.rostova@assetops.com',
      role: 'Asset Manager',
      avatarInitials: 'ER',
    },
    department: 'IT',
    location: 'New York Office',
    timestamp: '2026-10-05T10:15:00.000Z',
    relativeTime: '1h ago',
    statusBadge: {
      label: 'Created',
      variant: 'emerald',
    },
    isUnread: true,
    metadata: {
      Category: 'Mobile',
      Model: 'A2848 (Titanium Black)',
      'Serial Number': 'IPH15-002',
      Cost: '$1,199',
    },
  },
  {
    id: 'HIST-1087',
    category: 'employee',
    action: 'Employee Onboarded',
    actionType: 'employee_onboarded',
    title: 'Onboarded John Doe to Engineering Team',
    description:
      'Created employee profile EMP-034 for John Doe (Full-Time Senior Frontend Engineer).',
    entityName: 'John Doe',
    entityId: 'EMP-034',
    entityType: 'Employee',
    actor: {
      name: 'Jessica Pearson',
      email: 'jessica.pearson@assetops.com',
      role: 'HR Lead',
      avatarInitials: 'JP',
    },
    department: 'Engineering',
    location: 'San Francisco',
    timestamp: '2026-10-05T08:30:00.000Z',
    relativeTime: '3h ago',
    statusBadge: {
      label: 'Onboarded',
      variant: 'emerald',
    },
    isUnread: true,
    metadata: {
      Position: 'Senior Frontend Engineer',
      'Work Type': 'Full-Time',
      Manager: 'Sarah Connor',
      Email: 'john.doe@assetops.com',
    },
  },
  {
    id: 'HIST-1086',
    category: 'allocation',
    action: 'Hardware Returned',
    actionType: 'allocation_returned',
    title: 'Dell UltraSharp 27" Returned to Inventory',
    description: 'Returned monitor A1003 by Ellen Ripley. Inspected and marked Available in stock.',
    entityName: 'Dell UltraSharp 27"',
    entityId: 'A1003',
    entityType: 'Allocation',
    actor: {
      name: 'Admin User',
      email: 'admin@assetops.com',
      role: 'IT Administrator',
      avatarInitials: 'AU',
    },
    department: 'Marketing',
    location: 'San Francisco',
    timestamp: '2026-10-04T16:20:00.000Z',
    relativeTime: 'Yesterday at 4:20 PM',
    statusBadge: {
      label: 'Returned',
      variant: 'blue',
    },
    isUnread: true,
    metadata: {
      'Previous Assignee': 'Ellen Ripley (EMP-003)',
      Condition: 'Good Condition',
      'Return Reason': 'Office Upgrade',
    },
  },
  {
    id: 'HIST-1085',
    category: 'asset',
    action: 'Maintenance Scheduled',
    actionType: 'asset_maintenance',
    title: 'Diagnostic Maintenance on Ubiquiti Gateway',
    description:
      'Hardware asset A1019 dispatched to vendor service center for firmware port inspection.',
    entityName: 'Ubiquiti Dream Machine Pro',
    entityId: 'A1019',
    entityType: 'Asset',
    actor: {
      name: 'Marcus Vance',
      email: 'marcus.vance@assetops.com',
      role: 'Network Engineer',
      avatarInitials: 'MV',
    },
    department: 'IT',
    location: 'Headquarters',
    timestamp: '2026-10-04T14:10:00.000Z',
    relativeTime: 'Yesterday at 2:10 PM',
    statusBadge: {
      label: 'Maintenance',
      variant: 'amber',
    },
    isUnread: true,
    metadata: {
      'Vendor Ticket': 'UBI-99412',
      'Estimated Return': '2026-10-12',
      Priority: 'High',
    },
  },
  {
    id: 'HIST-1084',
    category: 'employee',
    action: 'Profile Updated',
    actionType: 'employee_updated',
    title: 'Updated John Rambo Department to Enterprise Sales',
    description:
      'Promoted John Rambo (EMP-002) from Account Executive to Senior Enterprise Director.',
    entityName: 'John Rambo',
    entityId: 'EMP-002',
    entityType: 'Employee',
    actor: {
      name: 'Jessica Pearson',
      email: 'jessica.pearson@assetops.com',
      role: 'HR Lead',
      avatarInitials: 'JP',
    },
    department: 'Sales',
    location: 'New York Office',
    timestamp: '2026-10-04T11:00:00.000Z',
    relativeTime: 'Yesterday at 11:00 AM',
    statusBadge: {
      label: 'Updated',
      variant: 'purple',
    },
    isUnread: false,
    metadata: {
      'Previous Role': 'Account Executive',
      'New Role': 'Senior Enterprise Director',
      'Effective Date': '2026-10-01',
    },
  },
  {
    id: 'HIST-1083',
    category: 'asset',
    action: 'Specifications Updated',
    actionType: 'asset_updated',
    title: 'Upgraded RAM on HP Z2 Workstation Tower',
    description:
      'Upgraded system memory from 32GB to 64GB DDR5 ECC and updated asset specification record.',
    entityName: 'HP Z2 Tower Workstation',
    entityId: 'A1011',
    entityType: 'Asset',
    actor: {
      name: 'Admin User',
      email: 'admin@assetops.com',
      role: 'IT Administrator',
      avatarInitials: 'AU',
    },
    department: 'Engineering',
    location: 'Headquarters',
    timestamp: '2026-10-03T17:45:00.000Z',
    relativeTime: '2 days ago',
    statusBadge: {
      label: 'Updated',
      variant: 'slate',
    },
    isUnread: false,
    metadata: {
      'Upgraded Part': 'Corsair 64GB DDR5 ECC',
      'Cost Incurred': '$280',
      Technician: 'IT Hardware Lab',
    },
  },
  {
    id: 'HIST-1082',
    category: 'allocation',
    action: 'Hardware Reallocated',
    actionType: 'allocation_reallocated',
    title: 'Reallocated CalDigit TS4 Dock to Olivia Morgan',
    description:
      'Transferred Thunderbolt 4 Dock A1039 from Finance pool to Olivia Morgan in Design team.',
    entityName: 'CalDigit TS4 Thunderbolt Dock',
    entityId: 'A1039',
    entityType: 'Allocation',
    actor: {
      name: 'Elena Rostova',
      email: 'elena.rostova@assetops.com',
      role: 'Asset Manager',
      avatarInitials: 'ER',
    },
    department: 'Design',
    location: 'Remote',
    timestamp: '2026-10-03T13:30:00.000Z',
    relativeTime: '2 days ago',
    statusBadge: {
      label: 'Reallocated',
      variant: 'indigo',
    },
    isUnread: false,
    metadata: {
      'New Assignee': 'Olivia Morgan (EMP-012)',
      'Previous Team': 'Finance',
      'Shipment Tracking': 'FEDEX-99218274',
    },
  },
  {
    id: 'HIST-1081',
    category: 'employee',
    action: 'Department Transfer',
    actionType: 'employee_transferred',
    title: 'Transferred Ellen Ripley to Marketing Directorate',
    description: 'Reassigned organization branch and reporting manager for Ellen Ripley (EMP-003).',
    entityName: 'Ellen Ripley',
    entityId: 'EMP-003',
    entityType: 'Employee',
    actor: {
      name: 'Jessica Pearson',
      email: 'jessica.pearson@assetops.com',
      role: 'HR Lead',
      avatarInitials: 'JP',
    },
    department: 'Marketing',
    location: 'San Francisco',
    timestamp: '2026-10-02T15:10:00.000Z',
    relativeTime: '3 days ago',
    statusBadge: {
      label: 'Transferred',
      variant: 'purple',
    },
    isUnread: false,
    metadata: {
      'Old Department': 'Sales Operations',
      'New Department': 'Product Marketing',
      'New Manager': 'David Zhao',
    },
  },
  {
    id: 'HIST-1080',
    category: 'asset',
    action: 'Asset Decommissioned',
    actionType: 'asset_retired',
    title: 'Retired Legacy Dell OptiPlex 7050 Desktop',
    description:
      'Hardware unit A0942 reached end-of-life cycle. Hard drive wiped following NIST 800-88 standard.',
    entityName: 'Dell OptiPlex 7050',
    entityId: 'A0942',
    entityType: 'Asset',
    actor: {
      name: 'Admin User',
      email: 'admin@assetops.com',
      role: 'IT Administrator',
      avatarInitials: 'AU',
    },
    department: 'IT',
    location: 'Headquarters',
    timestamp: '2026-10-01T09:20:00.000Z',
    relativeTime: '4 days ago',
    statusBadge: {
      label: 'Retired',
      variant: 'rose',
    },
    isUnread: false,
    metadata: {
      'Disposal Method': 'Certified E-Waste Recycling',
      Certificate: 'CERT-WIPE-2026-0942',
      'Useful Life': '5 Years',
    },
  },
  {
    id: 'HIST-1079',
    category: 'allocation',
    action: 'Hardware Allocated',
    actionType: 'allocation_assigned',
    title: 'Allocated ASUS ProArt 27" 5K to Mia Lee',
    description: 'Deployed color-accurate display A1017 to Mia Lee in Creative Media team.',
    entityName: 'ASUS ProArt 27" 5K',
    entityId: 'A1017',
    entityType: 'Allocation',
    actor: {
      name: 'Elena Rostova',
      email: 'elena.rostova@assetops.com',
      role: 'Asset Manager',
      avatarInitials: 'ER',
    },
    department: 'Marketing',
    location: 'Headquarters',
    timestamp: '2026-09-30T14:40:00.000Z',
    relativeTime: '5 days ago',
    statusBadge: {
      label: 'Allocated',
      variant: 'indigo',
    },
    isUnread: false,
    metadata: {
      'Allocation Code': 'AL1017',
      Resolution: '5K Retina (5120x2880)',
      Assignee: 'Mia Lee (EMP-018)',
    },
  },
  {
    id: 'HIST-1078',
    category: 'asset',
    action: 'Warranty Extended',
    actionType: 'asset_updated',
    title: 'AppleCare+ Coverage Extended on MacBook Fleet',
    description:
      'Renewed enterprise warranty coverage for 25 registered mobile workstations through Q4 2028.',
    entityName: 'AppleCare+ Enterprise Agreement',
    entityId: 'WARR-2026-88',
    entityType: 'Asset',
    actor: {
      name: 'Admin User',
      email: 'admin@assetops.com',
      role: 'IT Administrator',
      avatarInitials: 'AU',
    },
    department: 'Finance',
    location: 'Headquarters',
    timestamp: '2026-09-29T11:15:00.000Z',
    relativeTime: '6 days ago',
    statusBadge: {
      label: 'Updated',
      variant: 'slate',
    },
    isUnread: false,
    metadata: {
      'Agreement Number': 'AC-ENT-99418',
      'Units Covered': '25 Workstations',
      'Term Length': '24 Months',
    },
  },
];

export const HISTORY_KPI_SUMMARY = {
  totalHistory: 1248,
  totalHistoryGrowth: '+14.2% this month',
  assetActions: 584,
  assetActionsRate: '46.8% of total logs',
  employeeActions: 312,
  employeeActionsRate: '25.0% of total logs',
  allocationActions: 352,
  allocationActionsRate: '28.2% of total logs',
  unreadCounts: {
    all: 5,
    asset: 2,
    employee: 1,
    allocation: 2,
  },
};
