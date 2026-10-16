import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { User, Laptop, Clock, Eye, Package } from 'lucide-react';
import type { HistoryRecord } from '@/types/activity';
import { useActivityStore } from '@/store/useActivityStore';
import { formatRelativeTime, formatDateTime } from '@/utils/date';
import { getActivityStyle } from '@/utils/activityStyles';
import { cn } from '@/lib/utils';
import HistoryDetailModal from './HistoryDetailModal';
import { Pagination } from '@/components/common/Pagination';
import EmptyState from '@/components/common/EmptyState';
import { HISTORY_TABLE_CONSTANTS } from './constants/HistoryTable.constants';

interface HistoryTableProps {
  records: HistoryRecord[];
  onClearFilters: () => void;
}

/**
 * @description: Resolves Tailwind CSS classes for action badge color variants
 * @param {string} variant: Color variant identifier
 * @returns {string} Tailwind CSS class name string
 */
const getBadgeClasses = (variant: string) => {
  switch (variant) {
    case 'emerald':
      return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60';
    case 'blue':
      return 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60';
    case 'indigo':
      return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60';
    case 'amber':
      return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60';
    case 'rose':
      return 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60';
    case 'purple':
      return 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60';
    default:
      return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60';
  }
};

/**
 * @description: Paginated data table displaying audit logs with entity, user, category badge, and detail modal
 * @param {HistoryRecord[]} records: Array of history log records
 * @param {function(): void} onClearFilters: Callback to clear active filters
 * @returns {JSX.Element} History table component JSX
 */
export const HistoryTable: React.FC<HistoryTableProps> = ({ records, onClearFilters }) => {
  const { t: translateHistory } = useTranslation('history');
  const { t: translateEmployees } = useTranslation('employee');
  const { t: translateAssets } = useTranslation('asset');

  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = HISTORY_TABLE_CONSTANTS.PAGINATION.PAGE_SIZE;
  const totalFiltered = records.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = totalFiltered === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endIndex = Math.min(safePage * pageSize, totalFiltered);

  const paginatedRecords = records.slice((safePage - 1) * pageSize, safePage * pageSize);

  /**
   * @description: Opens the audit detail modal for a selected history record and marks it as read
   * @param {HistoryRecord} record: History item to view
   * @returns {void}
   */
  const handleOpenDetail = (record: HistoryRecord) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
    if (record.isUnread) {
      useActivityStore.getState().markAsRead(record.id);
    }
  };

  if (records.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <EmptyState
          icon={Package}
          title={translateHistory('empty.title', {
            defaultValue: HISTORY_TABLE_CONSTANTS.EMPTY_STATE.TITLE,
          })}
          description={translateHistory('empty.description', {
            defaultValue: HISTORY_TABLE_CONSTANTS.EMPTY_STATE.DESCRIPTION,
          })}
          actionLabel={translateHistory('filters.clearFilters', {
            defaultValue: HISTORY_TABLE_CONSTANTS.EMPTY_STATE.ACTION_LABEL,
          })}
          onAction={onClearFilters}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div
          className="overflow-x-auto select-none custom-scrollbar"
          data-testid="history-table-container"
        >
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50/50">
                <TableHead className="w-[110px] font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm pl-4">
                  {translateHistory('columns.logId', {
                    defaultValue: HISTORY_TABLE_CONSTANTS.HEADERS.LOG_ID,
                  })}
                </TableHead>
                <TableHead className="min-w-[260px] font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                  {translateHistory('columns.action', {
                    defaultValue: HISTORY_TABLE_CONSTANTS.HEADERS.ACTION_EVENT,
                  })}
                </TableHead>
                <TableHead className="min-w-[180px] font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                  {translateHistory('columns.entity', {
                    defaultValue: HISTORY_TABLE_CONSTANTS.HEADERS.TARGET_ENTITY,
                  })}
                </TableHead>
                <TableHead className="w-[140px] font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                  {translateHistory('columns.department', {
                    defaultValue: HISTORY_TABLE_CONSTANTS.HEADERS.DEPARTMENT,
                  })}
                </TableHead>
                <TableHead className="min-w-[160px] font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                  {translateHistory('columns.actor', {
                    defaultValue: HISTORY_TABLE_CONSTANTS.HEADERS.EXECUTED_BY,
                  })}
                </TableHead>
                <TableHead className="w-[140px] font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                  {translateHistory('columns.timestamp', {
                    defaultValue: HISTORY_TABLE_CONSTANTS.HEADERS.TIMESTAMP,
                  })}
                </TableHead>
                <TableHead className="w-[80px] text-right font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm pr-4">
                  {translateHistory('columns.actions', {
                    defaultValue: HISTORY_TABLE_CONSTANTS.HEADERS.DETAILS,
                  })}
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedRecords.map((item) => {
                const actionIcon = getActivityStyle(item.actionType);
                const ActionIcon = actionIcon.icon;
                const badgeVariant = item.statusBadge?.variant || 'slate';
                const rawBadgeLabel =
                  item.statusBadge?.label ||
                  item.badge ||
                  item.action ||
                  HISTORY_TABLE_CONSTANTS.LABELS.DEFAULT_BADGE;
                const badgeLabel = translateHistory(`actionsMap.${rawBadgeLabel.toLowerCase()}`, {
                  defaultValue: rawBadgeLabel,
                });
                const badgeClass = getBadgeClasses(badgeVariant);

                const actorName = item.actor.name;
                const actorRole = item.actor.role;
                const actorRoleDisplay = translateHistory(`actorRoles.${actorRole}`, {
                  defaultValue: actorRole,
                });
                const actorInitials = item.actor.avatarInitials;

                const departmentDisplay = item.department
                  ? translateEmployees(`departments.${item.department}`, {
                      defaultValue: translateAssets(`locations.${item.department}`, {
                        defaultValue: item.department,
                      }),
                    })
                  : null;

                return (
                  <TableRow
                    key={item.id}
                    onClick={() => handleOpenDetail(item)}
                    className="group hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors border-b border-slate-100 dark:border-slate-800/60 cursor-pointer"
                  >
                    {/* Log ID */}
                    <TableCell className="font-semibold text-slate-900 dark:text-white text-xs pl-4">
                      <span className="font-medium text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                        {item.id}
                      </span>
                    </TableCell>

                    {/* Action & Event Description */}
                    <TableCell className="text-xs sm:text-sm">
                      <div className="flex items-start gap-3 py-0.5">
                        <div
                          className={cn(
                            'p-2 rounded-xl shrink-0 mt-0.5 group-hover:scale-105 transition-transform',
                            actionIcon.bg,
                          )}
                        >
                          <ActionIcon className="size-4" />
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-bold text-slate-900 dark:text-white truncate">
                              {item.title}
                            </p>
                            <span
                              className={cn(
                                'text-[10px] font-semibold px-2 py-0.2 rounded-full shrink-0',
                                badgeClass,
                              )}
                            >
                              {badgeLabel}
                            </span>
                            {item.isUnread && (
                              <span
                                title={HISTORY_TABLE_CONSTANTS.LABELS.UNREAD_TITLE}
                                className="size-2 rounded-full bg-blue-500 animate-pulse shrink-0"
                              />
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Target Entity */}
                    <TableCell className="text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        {item.entityType === HISTORY_TABLE_CONSTANTS.LABELS.ENTITY_TYPE_ASSET ? (
                          <Laptop className="size-3.5 text-slate-400 shrink-0" />
                        ) : (
                          <User className="size-3.5 text-slate-400 shrink-0" />
                        )}
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[150px]">
                            {item.entityName}
                          </p>
                          <span className="text-[10px] font-mono text-slate-400 block">
                            {item.entityId}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Department */}
                    <TableCell className="text-slate-600 dark:text-slate-400 text-xs">
                      {departmentDisplay ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium">
                          {departmentDisplay}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">
                          {HISTORY_TABLE_CONSTANTS.LABELS.DEFAULT_DEPARTMENT}
                        </span>
                      )}
                    </TableCell>

                    {/* Executed By (Actor) */}
                    <TableCell className="text-xs">
                      <div className="flex items-center gap-2">
                        <div className="size-7 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 shadow-2xs">
                          {actorInitials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {actorName}
                          </p>
                          <span className="text-[10px] text-slate-400 truncate block">
                            {actorRoleDisplay}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Timestamp */}
                    <TableCell className="text-slate-600 dark:text-slate-400 text-xs whitespace-nowrap">
                      <div
                        className="flex items-center gap-1.5"
                        title={formatDateTime(item.timestamp)}
                      >
                        <Clock className="size-3 text-slate-400 shrink-0" />
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {formatRelativeTime(item.timestamp)}
                        </span>
                      </div>
                    </TableCell>

                    {/* Details Action Button */}
                    <TableCell className="text-right pr-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetail(item);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
                        title={translateHistory('actions.viewDetails', {
                          defaultValue: HISTORY_TABLE_CONSTANTS.LABELS.VIEW_DETAILS_TITLE,
                        })}
                        aria-label={`View details for log ${item.id}`}
                      >
                        <Eye className="size-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalFiltered > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-4">
          <Pagination
            totalFiltered={totalFiltered}
            startIndex={startIndex}
            endIndex={endIndex}
            totalPages={totalPages}
            currentPage={safePage}
            onPageChange={setCurrentPage}
            entityLabel={translateHistory('pagination.historyLogs', {
              defaultValue: HISTORY_TABLE_CONSTANTS.LABELS.ENTITY_LABEL,
            })}
          />
        </div>
      )}

      {/* Detail Modal */}
      <HistoryDetailModal
        record={selectedRecord}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRecord(null);
        }}
      />
    </div>
  );
};

export default HistoryTable;
