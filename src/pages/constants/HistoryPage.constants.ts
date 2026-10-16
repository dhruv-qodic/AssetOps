import type { HistoryCategory } from '@/types/activity';

export const HISTORY_PAGE_CONSTANTS = {
  DEFAULTS: {
    TAB: 'all' as HistoryCategory,
    ACTION_FILTER: 'All',
    SORT_ORDER: 'newest' as 'newest' | 'oldest',
  },
  SORT_ORDERS: {
    NEWEST: 'newest' as const,
    OLDEST: 'oldest' as const,
  },
} as const;
