import type {
  HistoryCategory,
  HistoryActionType,
  HistoryRecord,
  HistoryActor,
} from '@/types/activity';

export type { HistoryCategory, HistoryActionType, HistoryRecord, HistoryActor };

export const MOCK_HISTORY_RECORDS: HistoryRecord[] = [];

export const HISTORY_KPI_SUMMARY = {
  totalHistory: 0,
  totalHistoryGrowth: '0.0% this month',
  assetActions: 0,
  assetActionsRate: '0.0% of total logs',
  employeeActions: 0,
  employeeActionsRate: '0.0% of total logs',
  allocationActions: 0,
  allocationActionsRate: '0.0% of total logs',
  unreadCounts: {
    all: 0,
    asset: 0,
    employee: 0,
    allocation: 0,
  },
};
