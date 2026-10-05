import { useState, useMemo } from 'react';
import { useAssetStore } from '@/store/useAssetStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import {
  useActiveAllocationFilterStore,
  filterActiveAllocations,
} from '@/store/useActiveAllocationFilterStore';
import ActiveAllocationsHeader from '@/components/allocations/ActiveAllocationsHeader';
import ActiveAllocationsKpiCard from '@/components/allocations/ActiveAllocationsKpiCard';
import ActiveAllocationsChart from '@/components/allocations/ActiveAllocationsChart';
import ActiveAllocationsToolbar, {
  type ActiveAllocationViewMode,
} from '@/components/allocations/ActiveAllocationsToolbar';
import ActiveAllocationsListView from '@/components/allocations/ActiveAllocationsListView';
import ActiveAllocationsCardView from '@/components/allocations/ActiveAllocationsCardView';
import AllocateAssetModal from '@/components/assets/AllocateAssetModal';
import AssetQrModal from '@/components/assets/AssetQrModal';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import { Pagination } from '@/components/common/Pagination';
import { CheckCircle2 } from 'lucide-react';

export function ActiveAllocationsPage() {
  const assets = useAssetStore((s) => s.assets);
  const openAllocateModal = useAssetStore((s) => s.openAllocateModal);
  const isAssetLoading = useAssetStore((s) => s.isLoading);
  const assetError = useAssetStore((s) => s.error);
  const reloadAssets = useAssetStore((s) => s.reloadAssets);

  const employees = useEmployeeStore((s) => s.employees);
  const isEmpLoading = useEmployeeStore((s) => s.isLoading);
  const empError = useEmployeeStore((s) => s.error);
  const reloadEmployees = useEmployeeStore((s) => s.reloadEmployees);

  const isLoading = isAssetLoading || isEmpLoading;
  const error = assetError || empError;

  const handleRetry = () => {
    void reloadAssets();
    void reloadEmployees();
  };

  // Filter Store Values & Actions
  const searchKeyword = useActiveAllocationFilterStore((s) => s.searchKeyword);
  const selectedCategories = useActiveAllocationFilterStore((s) => s.selectedCategories);
  const selectedDepartments = useActiveAllocationFilterStore((s) => s.selectedDepartments);
  const selectedLocations = useActiveAllocationFilterStore((s) => s.selectedLocations);
  const costRange = useActiveAllocationFilterStore((s) => s.costRange);

  const setSearchKeyword = useActiveAllocationFilterStore((s) => s.setSearchKeyword);
  const resetFilters = useActiveAllocationFilterStore((s) => s.resetFilters);

  // View Mode & Pagination State
  const [viewMode, setViewMode] = useState<ActiveAllocationViewMode>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Clear all filters
  const handleClearFilters = () => {
    resetFilters();
    setCurrentPage(1);
  };

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // Filtered Active Allocations list (strictly status === 'Allocated')
  const filteredActiveAllocations = useMemo(() => {
    return filterActiveAllocations(assets, employees, {
      searchKeyword,
      selectedCategories,
      selectedDepartments,
      selectedLocations,
      costRange,
    });
  }, [
    assets,
    employees,
    searchKeyword,
    selectedCategories,
    selectedDepartments,
    selectedLocations,
    costRange,
  ]);

  // Pagination calculation
  const totalFiltered = filteredActiveAllocations.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = totalFiltered === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endIndex = Math.min(safePage * pageSize, totalFiltered);
  const paginatedAllocations = filteredActiveAllocations.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  const showPagination = !isLoading && !error && totalFiltered > 0;

  return (
    <div
      data-testid="active-allocations-page"
      className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto w-full text-left"
    >
      {/* 1. Common Page Header */}
      <ActiveAllocationsHeader />

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-12 shadow-xs">
          <LoadingState
            icon={CheckCircle2}
            title="Loading Active Allocations..."
            description="Aggregating currently active hardware deployments and employee assignments."
            size="lg"
          />
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-12 shadow-xs">
          <ErrorState
            title="Failed to load active allocations"
            message={error}
            onRetry={handleRetry}
          />
        </div>
      )}

      {/* Main Content */}
      {!isLoading && !error && (
        <>
          {/* 2. KPI + Chart Two-Column Section */}
          <section
            aria-label="Active Allocation Metrics and Chart"
            className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-stretch"
          >
            <ActiveAllocationsKpiCard />
            <ActiveAllocationsChart />
          </section>

          {/* 3. Filter + View Switcher Toolbar */}
          <section aria-label="Active Allocation Filters and Views" className="space-y-4">
            <ActiveAllocationsToolbar
              search={searchKeyword}
              onSearchChange={(val) => {
                setSearchKeyword(val);
                setCurrentPage(1);
              }}
              onFilterChange={handleFilterChange}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              totalCount={totalFiltered}
              employees={employees}
            />

            {/* 4. Active Allocations Display (List or Card View) */}
            {totalFiltered === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
                <EmptyState
                  icon={CheckCircle2}
                  title="No active allocations found"
                  description="No currently active allocations match your filter or search criteria. Try clearing your filters or create a new allocation."
                  secondaryActionLabel="Clear filters"
                  onSecondaryAction={handleClearFilters}
                  actionLabel="New Allocation"
                  onAction={() => openAllocateModal()}
                />
              </div>
            ) : (
              <div className="space-y-4">
                {viewMode === 'list' ? (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
                    <ActiveAllocationsListView allocations={paginatedAllocations} />
                  </div>
                ) : (
                  <ActiveAllocationsCardView allocations={paginatedAllocations} />
                )}

                {/* Common Pagination */}
                {showPagination && (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-4">
                    <Pagination
                      totalFiltered={totalFiltered}
                      startIndex={startIndex}
                      endIndex={endIndex}
                      totalPages={totalPages}
                      currentPage={safePage}
                      onPageChange={setCurrentPage}
                      entityLabel="active allocations"
                    />
                  </div>
                )}
              </div>
            )}
          </section>
        </>
      )}

      {/* Modals & Dialogs */}
      <AllocateAssetModal />
      <AssetQrModal />
    </div>
  );
}

export default ActiveAllocationsPage;
