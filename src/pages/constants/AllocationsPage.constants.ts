export const ALLOCATIONS_PAGE_CONSTANTS = {
  HEADER: {
    TITLE: 'Asset Allocations',
    SUBTITLE: 'Track and manage asset allocation to employees',
    NEW_ALLOCATION_BUTTON: 'New Allocation',
  },
  FILTERS: {
    ALL: 'All',
    STATUSES: {
      ACTIVE: 'Active',
      INACTIVE: 'Inactive',
      TERMINATED: 'Terminated',
      RETURNED: 'Returned',
      MAINTENANCE: 'Maintenance',
    },
  },
  PAGINATION: {
    PAGE_SIZE: 10,
    ENTITY_LABEL: 'allocations',
  },
} as const;
