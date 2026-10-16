import { useState, useMemo } from 'react';
import HistoryHeader from '@/components/history/HistoryHeader';
import HistoryKpiCards from '@/components/history/HistoryKpiCards';
import HistoryFilterBar from '@/components/history/HistoryFilterBar';
import HistoryTable from '@/components/history/HistoryTable';
import { useActivityStore } from '@/store/useActivityStore';
import type { HistoryCategory } from '@/types/activity';
import { HISTORY_PAGE_CONSTANTS } from './constants/HistoryPage.constants';

export function HistoryPage() {
  const [activeTab, setActiveTab] = useState<HistoryCategory>(HISTORY_PAGE_CONSTANTS.DEFAULTS.TAB);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState<string>(
    HISTORY_PAGE_CONSTANTS.DEFAULTS.ACTION_FILTER,
  );
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>(
    HISTORY_PAGE_CONSTANTS.DEFAULTS.SORT_ORDER,
  );

  const activities = useActivityStore((state) => state.activities);

  const handleClearFilters = () => {
    setSearch('');
    setActionFilter(HISTORY_PAGE_CONSTANTS.DEFAULTS.ACTION_FILTER);
  };

  /**
   * @description Filtered and sorted history records from dynamic store
   * @param {HistoryCategory} activeTab - Filter by category
   * @param {string} search - Search query
   * @param {string} actionFilter - Filter by action type
   * @param {'newest' | 'oldest'} sortOrder - Sort order
   * @returns {HistoryRecord[]} Filtered and sorted history records
   */
  const filteredRecords = useMemo(() => {
    const q = search.trim().toLowerCase();

    return activities
      .filter((item) => {
        // 1. Tab category filter
        if (activeTab !== HISTORY_PAGE_CONSTANTS.DEFAULTS.TAB && item.category !== activeTab) {
          return false;
        }

        // 2. Action type filter
        if (
          actionFilter !== HISTORY_PAGE_CONSTANTS.DEFAULTS.ACTION_FILTER &&
          item.statusBadge?.label.toLowerCase() !== actionFilter.toLowerCase() &&
          item.action.toLowerCase() !== actionFilter.toLowerCase()
        ) {
          return false;
        }

        // 3. Search query filter
        if (q) {
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchEntity =
            item.entityName.toLowerCase().includes(q) || item.entityId.toLowerCase().includes(q);
          const actorName = item.actor.name;
          const actorRole = item.actor.role;
          const matchActor =
            actorName.toLowerCase().includes(q) || actorRole.toLowerCase().includes(q);
          const matchDept = item.department?.toLowerCase().includes(q) ?? false;
          const matchLoc = item.location?.toLowerCase().includes(q) ?? false;

          if (!matchTitle && !matchDesc && !matchEntity && !matchActor && !matchDept && !matchLoc) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        return sortOrder === HISTORY_PAGE_CONSTANTS.SORT_ORDERS.NEWEST
          ? timeB - timeA
          : timeA - timeB;
      });
  }, [activities, activeTab, search, actionFilter, sortOrder]);

  return (
    <div
      data-testid="history-page"
      className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto w-full text-left animate-in fade-in duration-200"
    >
      {/* 1. Page Header */}
      <HistoryHeader filteredRecords={filteredRecords} activeTab={activeTab} />

      {/* 2. KPI Cards */}
      <HistoryKpiCards />

      {/* 3. Filter Bar with Tabs and Unread Badges */}
      <HistoryFilterBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        search={search}
        onSearchChange={setSearch}
        actionFilter={actionFilter}
        onActionFilterChange={setActionFilter}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
      />

      {/* 4. History Logs Table */}
      <HistoryTable records={filteredRecords} onClearFilters={handleClearFilters} />
    </div>
  );
}

export default HistoryPage;
