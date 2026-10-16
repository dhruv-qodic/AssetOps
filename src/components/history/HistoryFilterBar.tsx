import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Layers,
  Package,
  Users,
  GitCommit,
  Search,
  X,
  ArrowUpDown,
  UserPlus,
  CornerDownLeft,
  PlusCircle,
  Edit3,
  Wrench,
  UserCheck,
  Trash2,
  Activity,
  RotateCcw,
  RotateCw,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { HistoryCategory, HistoryRecord } from '@/types/activity';
import {
  useActivityStore,
  selectCanUndo,
  selectCanRedo,
  selectUndoCount,
  selectRedoCount,
  selectUndoneCount,
  selectPresentAction,
  selectNextRedoAction,
} from '@/store/useActivityStore';
import { useUndoRedoShortcuts } from '@/hooks/useKeyboardShortcut';
import UndoConfirmModal from './UndoConfirmModal';
import { toast } from 'sonner';
import { HISTORY_FILTER_BAR_CONSTANTS } from './constants/HistoryFilterBar.constants';

interface HistoryFilterBarProps {
  activeTab: HistoryCategory;
  onTabChange: (tab: HistoryCategory) => void;
  search: string;
  onSearchChange: (search: string) => void;
  actionFilter: string;
  onActionFilterChange: (action: string) => void;
  sortOrder: 'newest' | 'oldest';
  onSortOrderChange: (order: 'newest' | 'oldest') => void;
}

/**
 * @description: Filter navigation bar for activity history with tabs, search, action filter, sort order, and undo/redo buttons
 * @param {HistoryCategory} activeTab: Current category tab
 * @param {function(HistoryCategory): void} onTabChange: Tab switch callback
 * @param {string} search: Current search text
 * @param {function(string): void} onSearchChange: Search update callback
 * @param {string} actionFilter: Selected action type filter
 * @param {function(string): void} onActionFilterChange: Action filter update callback
 * @param {'newest' | 'oldest'} sortOrder: Active timestamp sorting order ('newest' | 'oldest')
 * @param onSortOrderChange: Sort order update callback
 * @return: History filter bar component JSX
 */
export const HistoryFilterBar: React.FC<HistoryFilterBarProps> = ({
  activeTab,
  onTabChange,
  search,
  onSearchChange,
  actionFilter,
  onActionFilterChange,
  sortOrder,
  onSortOrderChange,
}) => {
  const { t: translateHistory } = useTranslation('history');
  const activities = useActivityStore((s) => s.activities);

  // Fine-grained Zustand selectors
  const canUndo = useActivityStore(selectCanUndo);
  const canRedo = useActivityStore(selectCanRedo);
  const undoCount = useActivityStore(selectUndoCount);
  const redoCount = useActivityStore(selectRedoCount);
  const undoneCount = useActivityStore(selectUndoneCount);
  const presentAction = useActivityStore(selectPresentAction);
  const nextRedoAction = useActivityStore(selectNextRedoAction);

  const undo = useActivityStore((s) => s.undo);
  const redo = useActivityStore((s) => s.redo);
  const getUndoTarget = useActivityStore((s) => s.getUndoTarget);

  // Undo Confirmation Dialog State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmRecord, setConfirmRecord] = useState<HistoryRecord | null>(null);

  /**
   * @description: Initiates undo by identifying the target action and opening the confirmation dialog
   * @return {void}: void
   */
  const handleUndoClick = () => {
    if (!canUndo) return;
    const target = getUndoTarget();
    if (target) {
      setConfirmRecord(target);
      setIsConfirmOpen(true);
    }
  };

  /**
   * @description: Confirms and executes the undo action in the activity store
   * @return {void}: void
   */
  const handleConfirmUndo = () => {
    const targetTitle = confirmRecord?.title;
    const success = undo();
    if (success) {
      toast.success(
        targetTitle
          ? `Undid: ${targetTitle}`
          : translateHistory('undoRedo.undoneSuccess', {
              defaultValue: HISTORY_FILTER_BAR_CONSTANTS.TEXTS.DEFAULT_UNDONE_SUCCESS,
            }),
      );
    }
    setIsConfirmOpen(false);
    setConfirmRecord(null);
  };

  /**
   * @description: Executes redoing the next previously undone action in history
   * @return: void
   */
  const handleRedoClick = () => {
    if (!canRedo) return;
    const target = nextRedoAction;
    const success = redo();
    if (success) {
      toast.success(
        target
          ? `Redid: ${target.title}`
          : translateHistory('undoRedo.redoneSuccess', {
              defaultValue: HISTORY_FILTER_BAR_CONSTANTS.TEXTS.DEFAULT_REDONE_SUCCESS,
            }),
      );
    }
  };

  /**
   * @description: Handle keyboard shortcuts for undo and redo.
   * Keyboard Shortcuts: Ctrl+Z (Undo) and Ctrl+Shift+Z / Ctrl+Y (Redo)
   * @returns {void}
   */
  useUndoRedoShortcuts({
    onUndo: handleUndoClick,
    onRedo: handleRedoClick,
    canUndo,
    canRedo,
  });

  /**
   * @description: Calculate unread counts for each tab.
   * @returns {object}
   */
  const unreadCounts = useMemo(() => {
    return {
      all: activities.filter((a) => a.isUnread).length,
      asset: activities.filter(
        (a) => a.category === HISTORY_FILTER_BAR_CONSTANTS.TABS.ASSET && a.isUnread,
      ).length,
      employee: activities.filter(
        (a) => a.category === HISTORY_FILTER_BAR_CONSTANTS.TABS.EMPLOYEE && a.isUnread,
      ).length,
      allocation: activities.filter(
        (a) => a.category === HISTORY_FILTER_BAR_CONSTANTS.TABS.ALLOCATION && a.isUnread,
      ).length,
    };
  }, [activities]);

  const tabs = [
    {
      id: HISTORY_FILTER_BAR_CONSTANTS.TABS.ALL as HistoryCategory,
      label: translateHistory('tabs.allHistory', {
        defaultValue: HISTORY_FILTER_BAR_CONSTANTS.TAB_LABELS.ALL,
      }),
      icon: Layers,
      badgeCount: unreadCounts.all,
    },
    {
      id: HISTORY_FILTER_BAR_CONSTANTS.TABS.ASSET as HistoryCategory,
      label: translateHistory('tabs.assetHistory', {
        defaultValue: HISTORY_FILTER_BAR_CONSTANTS.TAB_LABELS.ASSET,
      }),
      icon: Package,
      badgeCount: unreadCounts.asset,
    },
    {
      id: HISTORY_FILTER_BAR_CONSTANTS.TABS.EMPLOYEE as HistoryCategory,
      label: translateHistory('tabs.employeeHistory', {
        defaultValue: HISTORY_FILTER_BAR_CONSTANTS.TAB_LABELS.EMPLOYEE,
      }),
      icon: Users,
      badgeCount: unreadCounts.employee,
    },
    {
      id: HISTORY_FILTER_BAR_CONSTANTS.TABS.ALLOCATION as HistoryCategory,
      label: translateHistory('tabs.allocationHistory', {
        defaultValue: HISTORY_FILTER_BAR_CONSTANTS.TAB_LABELS.ALLOCATION,
      }),
      icon: GitCommit,
      badgeCount: unreadCounts.allocation,
    },
  ];

  const actionOptions = useMemo(
    () => [
      {
        label: translateHistory('filters.allActions', {
          defaultValue: HISTORY_FILTER_BAR_CONSTANTS.ACTION_LABELS.ALL,
        }),
        value: HISTORY_FILTER_BAR_CONSTANTS.ACTIONS.ALL,
        icon: <Activity className="size-3.5 text-slate-400" />,
      },
      {
        label: translateHistory('actionsMap.allocated', {
          defaultValue: HISTORY_FILTER_BAR_CONSTANTS.ACTION_LABELS.ALLOCATED,
        }),
        value: HISTORY_FILTER_BAR_CONSTANTS.ACTIONS.ALLOCATED,
        icon: <UserPlus className="size-3.5 text-indigo-500" />,
      },
      {
        label: translateHistory('actionsMap.returned', {
          defaultValue: HISTORY_FILTER_BAR_CONSTANTS.ACTION_LABELS.RETURNED,
        }),
        value: HISTORY_FILTER_BAR_CONSTANTS.ACTIONS.RETURNED,
        icon: <CornerDownLeft className="size-3.5 text-blue-500" />,
      },
      {
        label: translateHistory('actionsMap.created', {
          defaultValue: HISTORY_FILTER_BAR_CONSTANTS.ACTION_LABELS.CREATED,
        }),
        value: HISTORY_FILTER_BAR_CONSTANTS.ACTIONS.CREATED,
        icon: <PlusCircle className="size-3.5 text-emerald-500" />,
      },
      {
        label: translateHistory('actionsMap.updated', {
          defaultValue: HISTORY_FILTER_BAR_CONSTANTS.ACTION_LABELS.UPDATED,
        }),
        value: HISTORY_FILTER_BAR_CONSTANTS.ACTIONS.UPDATED,
        icon: <Edit3 className="size-3.5 text-slate-500" />,
      },
      {
        label: translateHistory('actionsMap.maintenance', {
          defaultValue: HISTORY_FILTER_BAR_CONSTANTS.ACTION_LABELS.MAINTENANCE,
        }),
        value: HISTORY_FILTER_BAR_CONSTANTS.ACTIONS.MAINTENANCE,
        icon: <Wrench className="size-3.5 text-amber-500" />,
      },
      {
        label: translateHistory('actionsMap.onboarded', {
          defaultValue: HISTORY_FILTER_BAR_CONSTANTS.ACTION_LABELS.ONBOARDED,
        }),
        value: HISTORY_FILTER_BAR_CONSTANTS.ACTIONS.ONBOARDED,
        icon: <UserPlus className="size-3.5 text-emerald-500" />,
      },
      {
        label: translateHistory('actionsMap.transferred', {
          defaultValue: HISTORY_FILTER_BAR_CONSTANTS.ACTION_LABELS.TRANSFERRED,
        }),
        value: HISTORY_FILTER_BAR_CONSTANTS.ACTIONS.TRANSFERRED,
        icon: <UserCheck className="size-3.5 text-purple-500" />,
      },
      {
        label: translateHistory('actionsMap.retired', {
          defaultValue: HISTORY_FILTER_BAR_CONSTANTS.ACTION_LABELS.RETIRED,
        }),
        value: HISTORY_FILTER_BAR_CONSTANTS.ACTIONS.RETIRED,
        icon: <Trash2 className="size-3.5 text-rose-500" />,
      },
    ],
    [translateHistory],
  );

  return (
    <div className="space-y-4">
      {/* 1. History Navigation Tabs with Unread Badges and Undo/Redo Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Navigation Tabs */}
        <div
          data-testid="history-tabs"
          className="flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 overflow-x-auto select-none"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0 select-none',
                  isActive
                    ? 'bg-[#012145] dark:bg-[#012145] text-white dark:text-white shadow-xs border border-slate-200/60 dark:border-slate-700'
                    : 'text-[#012145] dark:text-[#012145] hover:text-[#012145] dark:hover:text-[#012145] hover:bg-white/50 dark:hover:bg-slate-800/50',
                )}
              >
                <Icon className="size-4" />
                <span>{tab.label}</span>
                {tab.badgeCount > 0 && (
                  <span
                    className={cn(
                      'text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors',
                      isActive
                        ? 'bg-primary text-white'
                        : 'bg-blue-100 text-primary dark:bg-blue-950/80 dark:text-blue-300',
                    )}
                  >
                    {tab.badgeCount}
                    {translateHistory('tabs.newBadgeSuffix', {
                      defaultValue: HISTORY_FILTER_BAR_CONSTANTS.TEXTS.NEW_BADGE_SUFFIX,
                    })}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Undo / Redo Toolbar at the Marked Location */}
        <div
          data-testid="history-undo-redo-toolbar"
          className="flex items-center gap-2 self-end sm:self-center shrink-0"
        >
          {/* Status Indicator (Undone Count) */}
          {undoneCount > 0 && (
            <span
              data-testid="undone-count-indicator"
              className="text-xs text-slate-500 dark:text-slate-400 font-medium px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-xl hidden md:inline-flex items-center gap-1 border border-slate-200/60 dark:border-slate-700/60"
            >
              <span className="font-bold text-primary">{undoneCount}</span>
              <span>
                {undoneCount === 1
                  ? translateHistory('undoRedo.actionUndone', {
                      defaultValue: HISTORY_FILTER_BAR_CONSTANTS.TEXTS.ACTION_UNDONE,
                    })
                  : translateHistory('undoRedo.actionsUndone', {
                      defaultValue: HISTORY_FILTER_BAR_CONSTANTS.TEXTS.ACTIONS_UNDONE,
                    })}
              </span>
            </span>
          )}

          {/* Undo Button */}
          <button
            type="button"
            data-testid="history-undo-button"
            aria-label={translateHistory('undoRedo.undoAria', {
              defaultValue: HISTORY_FILTER_BAR_CONSTANTS.TEXTS.UNDO_ARIA,
            })}
            disabled={!canUndo}
            onClick={handleUndoClick}
            title={
              canUndo
                ? translateHistory('undoRedo.undoTooltip', {
                    action: presentAction?.title || 'previous action',
                    defaultValue: `Undo: ${presentAction?.title || 'previous action'} (Ctrl+Z)`,
                  })
                : translateHistory('undoRedo.noUndo', {
                    defaultValue: HISTORY_FILTER_BAR_CONSTANTS.TEXTS.NO_UNDO,
                  })
            }
            className={cn(
              'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all select-none shadow-2xs',
              canUndo
                ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 active:scale-[0.98] cursor-pointer'
                : 'opacity-40 bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed',
            )}
          >
            <RotateCcw className="size-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
            <span>
              {translateHistory('undoRedo.undo', {
                defaultValue: HISTORY_FILTER_BAR_CONSTANTS.TEXTS.UNDO,
              })}
            </span>
            {undoCount > 0 && (
              <span
                data-testid="undo-count-badge"
                className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 ml-0.5"
              >
                {undoCount}
              </span>
            )}
          </button>

          {/* Redo Button */}
          <button
            type="button"
            data-testid="history-redo-button"
            aria-label={translateHistory('undoRedo.redoAria', {
              defaultValue: HISTORY_FILTER_BAR_CONSTANTS.TEXTS.REDO_ARIA,
            })}
            disabled={!canRedo}
            onClick={handleRedoClick}
            title={
              canRedo
                ? translateHistory('undoRedo.redoTooltip', {
                    action: nextRedoAction?.title || 'undone action',
                    defaultValue: `Redo: ${nextRedoAction?.title || 'undone action'} (Ctrl+Shift+Z)`,
                  })
                : translateHistory('undoRedo.noRedo', {
                    defaultValue: HISTORY_FILTER_BAR_CONSTANTS.TEXTS.NO_REDO,
                  })
            }
            className={cn(
              'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all select-none shadow-2xs',
              canRedo
                ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 active:scale-[0.98] cursor-pointer'
                : 'opacity-40 bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed',
            )}
          >
            <RotateCw className="size-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
            <span>
              {translateHistory('undoRedo.redo', {
                defaultValue: HISTORY_FILTER_BAR_CONSTANTS.TEXTS.REDO,
              })}
            </span>
            {redoCount > 0 && (
              <span
                data-testid="redo-count-badge"
                className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-950/80 text-primary dark:text-blue-300 ml-0.5"
              >
                {redoCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 2. Search and Filter Controls Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <Input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={translateHistory('filters.searchPlaceholder', {
              defaultValue: HISTORY_FILTER_BAR_CONSTANTS.TEXTS.SEARCH_PLACEHOLDER,
            })}
            aria-label={translateHistory('filters.searchAria', {
              defaultValue: HISTORY_FILTER_BAR_CONSTANTS.TEXTS.SEARCH_ARIA,
            })}
            className="h-9.5 pl-9.5 pr-9 bg-slate-50/80 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 rounded-xl shadow-2xs focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label={translateHistory('filters.clearSearchAria', {
                defaultValue: HISTORY_FILTER_BAR_CONSTANTS.TEXTS.CLEAR_SEARCH_ARIA,
              })}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Right Filter Dropdowns */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap justify-between sm:justify-end">
          {/* Shadcn Action Select Filter */}
          <div className="w-[160px] sm:w-[175px]">
            <Select
              value={actionFilter}
              onValueChange={onActionFilterChange}
              options={actionOptions}
              className="h-9.5 rounded-xl text-xs font-medium"
            />
          </div>

          {/* Sort Order */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() =>
                onSortOrderChange(
                  sortOrder === HISTORY_FILTER_BAR_CONSTANTS.SORT_ORDERS.NEWEST
                    ? HISTORY_FILTER_BAR_CONSTANTS.SORT_ORDERS.OLDEST
                    : HISTORY_FILTER_BAR_CONSTANTS.SORT_ORDERS.NEWEST,
                )
              }
              className="h-9.5 px-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-xl shadow-2xs flex items-center gap-1.5 cursor-pointer select-none transition-all active:scale-[0.98]"
              title={translateHistory('filters.sortToggleTitle', {
                defaultValue: HISTORY_FILTER_BAR_CONSTANTS.TEXTS.SORT_TOGGLE_TITLE,
              })}
            >
              <ArrowUpDown className="size-3.5 text-slate-400" />
              <span>
                {sortOrder === HISTORY_FILTER_BAR_CONSTANTS.SORT_ORDERS.NEWEST
                  ? translateHistory('filters.newestFirst', {
                      defaultValue: HISTORY_FILTER_BAR_CONSTANTS.SORT_LABELS.NEWEST,
                    })
                  : translateHistory('filters.oldestFirst', {
                      defaultValue: HISTORY_FILTER_BAR_CONSTANTS.SORT_LABELS.OLDEST,
                    })}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Undo Confirmation Modal */}
      <UndoConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setConfirmRecord(null);
        }}
        onConfirm={handleConfirmUndo}
        actionRecord={confirmRecord}
      />
    </div>
  );
};

export default HistoryFilterBar;
