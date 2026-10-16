export const HISTORY_TABLE_CONSTANTS = {
  HEADERS: {
    LOG_ID: 'Log ID',
    ACTION_EVENT: 'Action & Event',
    TARGET_ENTITY: 'Target Entity',
    DEPARTMENT: 'Department',
    EXECUTED_BY: 'Executed By',
    TIMESTAMP: 'Timestamp',
    DETAILS: 'Details',
  },
  EMPTY_STATE: {
    TITLE: 'No history found',
    DESCRIPTION:
      'No activity logs match your current search and filter criteria, or no actions have been performed yet.',
    ACTION_LABEL: 'Clear filters',
  },
  LABELS: {
    DEFAULT_BADGE: 'Activity',
    DEFAULT_DEPARTMENT: 'General',
    ENTITY_TYPE_ASSET: 'Asset',
    VIEW_DETAILS_TITLE: 'View Full Details',
    UNREAD_TITLE: 'Unread Activity',
    ENTITY_LABEL: 'history logs',
  },
  PAGINATION: {
    PAGE_SIZE: 8,
  },
} as const;
