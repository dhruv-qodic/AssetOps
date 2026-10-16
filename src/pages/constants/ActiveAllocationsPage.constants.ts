export const ACTIVE_ALLOCATIONS_PAGE_CONSTANTS = {
  LOADING: {
    TITLE: 'Loading Active Allocations...',
    DESCRIPTION: 'Aggregating currently active hardware deployments and employee assignments.',
  },
  ERROR_TITLE: 'Failed to load active allocations',
  EMPTY: {
    TITLE: 'No active allocations found',
    DESCRIPTION:
      'No currently active allocations match your filter or search criteria. Try clearing your filters or create a new allocation.',
    CLEAR_FILTERS: 'Clear filters',
    NEW_ALLOCATION: 'New Allocation',
  },
  SECTIONS: {
    METRICS_ARIA: 'Active Allocation Metrics and Chart',
    FILTERS_ARIA: 'Active Allocation Filters and Views',
  },
  FALLBACK: {
    TITLE: 'Failed to render allocation items',
    MESSAGE: 'An unexpected error occurred while displaying allocation records.',
  },
  PAGINATION: {
    PAGE_SIZE: 12,
    ENTITY_LABEL: 'active allocations',
  },
  DEFAULT_VIEW_MODE: 'list' as const,
} as const;
