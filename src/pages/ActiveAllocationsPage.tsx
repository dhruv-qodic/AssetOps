import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorBoundary } from 'react-error-boundary';
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
import ActiveAllocationListView from '@/components/allocations/ActiveAllocationListView';
import ActiveAllocationsCardView from '@/components/allocations/ActiveAllocationsCardView';
import AllocateAssetModal from '@/components/assets/AllocateAssetModal';
import AssetQrModal from '@/components/assets/AssetQrModal';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import { Pagination } from '@/components/common/Pagination';
import { WidgetErrorFallback, ErrorFallback } from '@/components/common/ErrorFallback';
import { ALLOCATION_WIDGET_TITLES } from '@/constant/allocation.constants';
import { CheckCircle2 } from 'lucide-react';
import { ACTIVE_ALLOCATIONS_PAGE_CONSTANTS } from './constants/ActiveAllocationsPage.constants';

export function ActiveAllocationsPage() {
  const { t: translateAllocations } = useTranslation('allocation');
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
  const [viewMode, setViewMode] = useState<ActiveAllocationViewMode>(
    ACTIVE_ALLOCATIONS_PAGE_CONSTANTS.DEFAULT_VIEW_MODE,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = ACTIVE_ALLOCATIONS_PAGE_CONSTANTS.PAGINATION.PAGE_SIZE;

  // Clear all filters
  const handleClearFilters = () => {
    resetFilters();
    setCurrentPage(1);
  };

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  /**
   * @description: Filters active allocations list based on search keyword, selected categories, departments, and locations
   * @param {string} searchKeyword - Keyword to search for in asset or employee names, or email addresses
   * @param {string[]} selectedCategories - Selected asset categories to filter by
   * @param {string[]} selectedDepartments - Selected employee departments to filter by
   * @param {string[]} selectedLocations - Selected asset locations to filter by
   * @param {number[]} costRange - Cost range [min, max] for asset cost filtering
   * @returns {AssetAllocation[]} Filtered active allocations list
   */
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
            title={ACTIVE_ALLOCATIONS_PAGE_CONSTANTS.LOADING.TITLE}
            description={ACTIVE_ALLOCATIONS_PAGE_CONSTANTS.LOADING.DESCRIPTION}
            size="lg"
          />
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-12 shadow-xs">
          <ErrorState
            title={ACTIVE_ALLOCATIONS_PAGE_CONSTANTS.ERROR_TITLE}
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
            aria-label={ACTIVE_ALLOCATIONS_PAGE_CONSTANTS.SECTIONS.METRICS_ARIA}
            className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-stretch"
          >
            <ErrorBoundary
              fallbackRender={({ error: err, resetErrorBoundary }) => (
                <WidgetErrorFallback
                  error={err}
                  resetErrorBoundary={resetErrorBoundary}
                  widgetTitle={ALLOCATION_WIDGET_TITLES.ALLOCATION_METRICS}
                  minHeight="min-h-[220px]"
                />
              )}
            >
              <ActiveAllocationsKpiCard />
            </ErrorBoundary>

            <ErrorBoundary
              fallbackRender={({ error: err, resetErrorBoundary }) => (
                <WidgetErrorFallback
                  error={err}
                  resetErrorBoundary={resetErrorBoundary}
                  widgetTitle={ALLOCATION_WIDGET_TITLES.DEPARTMENT_ALLOCATION_CHART}
                  minHeight="min-h-[220px]"
                />
              )}
            >
              <ActiveAllocationsChart />
            </ErrorBoundary>
          </section>

          {/* 3. Filter + View Switcher Toolbar */}
          <section
            aria-label={ACTIVE_ALLOCATIONS_PAGE_CONSTANTS.SECTIONS.FILTERS_ARIA}
            className="space-y-4"
          >
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
                  title={translateAllocations('empty.activeTitle', {
                    defaultValue: ACTIVE_ALLOCATIONS_PAGE_CONSTANTS.EMPTY.TITLE,
                  })}
                  description={translateAllocations('empty.activeDescription', {
                    defaultValue: ACTIVE_ALLOCATIONS_PAGE_CONSTANTS.EMPTY.DESCRIPTION,
                  })}
                  secondaryActionLabel={translateAllocations('filters.clearFilters', {
                    defaultValue: ACTIVE_ALLOCATIONS_PAGE_CONSTANTS.EMPTY.CLEAR_FILTERS,
                  })}
                  onSecondaryAction={handleClearFilters}
                  actionLabel={translateAllocations('newAllocationButton', {
                    defaultValue: ACTIVE_ALLOCATIONS_PAGE_CONSTANTS.EMPTY.NEW_ALLOCATION,
                  })}
                  onAction={() => openAllocateModal()}
                />
              </div>
            ) : (
              <ErrorBoundary
                fallbackRender={({ error: err, resetErrorBoundary }) => (
                  <ErrorFallback
                    error={err}
                    resetErrorBoundary={resetErrorBoundary}
                    title={ACTIVE_ALLOCATIONS_PAGE_CONSTANTS.FALLBACK.TITLE}
                    message={ACTIVE_ALLOCATIONS_PAGE_CONSTANTS.FALLBACK.MESSAGE}
                    minHeight="min-h-[300px]"
                  />
                )}
              >
                <div className="space-y-4">
                  {viewMode === 'list' ? (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
                      <ActiveAllocationListView allocations={paginatedAllocations} />
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
                        entityLabel={translateAllocations('pagination.allocations', {
                          defaultValue: ACTIVE_ALLOCATIONS_PAGE_CONSTANTS.PAGINATION.ENTITY_LABEL,
                        })}
                      />
                    </div>
                  )}
                </div>
              </ErrorBoundary>
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
