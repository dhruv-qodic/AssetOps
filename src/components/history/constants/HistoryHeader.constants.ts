export const HISTORY_HEADER_CONSTANTS = {
  TITLE: 'Activity History',
  SUBTITLE: 'Comprehensive audit logs, lifecycle events, and operational tracking across AssetOps',
  BUTTONS: {
    REFRESH: 'Refresh',
    REFRESH_TITLE: 'Refresh History Feed',
    EXPORT: 'Export Audit Log',
    EXPORTING: 'Exporting...',
    EXPORT_TITLE: 'Export History Logs to Excel',
  },
  MESSAGES: {
    NO_RECORDS_ERROR: 'No history records available to export with current criteria.',
    DEFAULT_EXPORT_ERROR: 'Failed to export history records. Please try again.',
    REFRESH_SUCCESS: 'Activity history refreshed',
  },
} as const;
