import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  UserPlus,
  CornerDownLeft,
  PlusCircle,
  Edit3,
  Wrench,
  Trash2,
  UserCheck,
  User,
  Laptop,
  Clock,
  Eye,
  GitCommit,
  ShieldAlert,
  ArrowRightLeft,
  Package,
} from 'lucide-react';
import type { HistoryRecord, HistoryActionType } from '@/types/activity';
import { useActivityStore, formatRelativeTime } from '@/store/useActivityStore';
import { cn } from '@/lib/utils';
import HistoryDetailModal from './HistoryDetailModal';
import { Pagination } from '@/components/common/Pagination';
import EmptyState from '@/components/common/EmptyState';

interface HistoryTableProps {
  records: HistoryRecord[];
  onClearFilters: () => void;
}

const getActionIcon = (actionType: HistoryActionType) => {
  switch (actionType) {
    case 'allocation_assigned':
    case 'assigned':
      return {
        icon: UserPlus,
        bg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400',
      };
    case 'allocation_returned':
    case 'returned':
      return {
        icon: CornerDownLeft,
        bg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
      };
    case 'allocation_reallocated':
      return {
        icon: ArrowRightLeft,
        bg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400',
      };
    case 'asset_created':
    case 'created':
      return {
        icon: PlusCircle,
        bg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
      };
    case 'asset_updated':
    case 'updated':
      return {
        icon: Edit3,
        bg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
      };
    case 'asset_maintenance':
    case 'maintenance':
      return {
        icon: Wrench,
        bg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
      };
    case 'asset_retired':
    case 'asset_deleted':
    case 'deleted':
      return {
        icon: Trash2,
        bg: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400',
      };
    case 'employee_onboarded':
    case 'employee_created':
      return {
        icon: UserPlus,
        bg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
      };
    case 'employee_updated':
    case 'employee_transferred':
      return {
        icon: UserCheck,
        bg: 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400',
      };
    case 'employee_offboarded':
    case 'employee_deleted':
      return {
        icon: ShieldAlert,
        bg: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400',
      };
    default:
      return {
        icon: GitCommit,
        bg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
      };
  }
};

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

export const HistoryTable: React.FC<HistoryTableProps> = ({ records, onClearFilters }) => {
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const totalFiltered = records.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = totalFiltered === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endIndex = Math.min(safePage * pageSize, totalFiltered);

  const paginatedRecords = records.slice((safePage - 1) * pageSize, safePage * pageSize);

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
          title="No history found"
          description="No activity logs match your current search and filter criteria, or no actions have been performed yet."
          actionLabel="Clear filters"
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
                  Log ID
                </TableHead>
                <TableHead className="min-w-[260px] font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                  Action & Event
                </TableHead>
                <TableHead className="min-w-[180px] font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                  Target Entity
                </TableHead>
                <TableHead className="w-[140px] font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                  Department
                </TableHead>
                <TableHead className="min-w-[160px] font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                  Executed By
                </TableHead>
                <TableHead className="w-[140px] font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                  Timestamp
                </TableHead>
                <TableHead className="w-[80px] text-right font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm pr-4">
                  Details
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedRecords.map((item) => {
                const actionIcon = getActionIcon(item.actionType);
                const ActionIcon = actionIcon.icon;
                const badgeVariant = item.statusBadge?.variant || 'slate';
                const badgeLabel =
                  item.statusBadge?.label || item.badge || item.action || 'Activity';
                const badgeClass = getBadgeClasses(badgeVariant);

                const actorName = item.actor.name;
                const actorRole = item.actor.role;
                const actorInitials = item.actor.avatarInitials;

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
                                title="Unread Activity"
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
                        {item.entityType === 'Asset' ? (
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
                      {item.department ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium">
                          {item.department}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">General</span>
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
                            {actorRole}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Timestamp */}
                    <TableCell className="text-slate-600 dark:text-slate-400 text-xs whitespace-nowrap">
                      <div
                        className="flex items-center gap-1.5"
                        title={new Date(item.timestamp).toLocaleString()}
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
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#155DFC] hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
                        title="View Full Details"
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
            entityLabel="history logs"
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
