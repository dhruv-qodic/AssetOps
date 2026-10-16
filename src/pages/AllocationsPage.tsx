import { useState, useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { useAssetStore } from '@/store/useAssetStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { Button } from '@/components/ui/button';
import AllocateAssetModal from '@/components/assets/AllocateAssetModal';
import AssetQrModal from '@/components/assets/AssetQrModal';
import AllocationFiltersBar from '@/components/allocations/AllocationFiltersBar';
import AllocationTable from '@/components/allocations/AllocationTable';
import AllocationSummaryCard from '@/components/allocations/AllocationSummaryCard';
import { Pagination } from '@/components/common/Pagination';
import { Layers, Plus } from 'lucide-react';
import { AssetAllocationKpiCards } from '@/components/allocations/AssetAllocationKpiCards';
import { WidgetErrorFallback } from '@/components/common/ErrorFallback';
import { ALLOCATION_WIDGET_TITLES } from '@/constant/allocation.constants';
import { ALLOCATIONS_PAGE_CONSTANTS } from './constants/AllocationsPage.constants';

export function AllocationsPage() {
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

  const handleOpenNewAllocation = () => {
    openAllocateModal();
  };

  // Filter and Pagination States
  const [search, setSearch] = useState('');
  const [assetCategory, setAssetCategory] = useState<string>(
    ALLOCATIONS_PAGE_CONSTANTS.FILTERS.ALL,
  );
  const [employeeFilter, setEmployeeFilter] = useState<string>(
    ALLOCATIONS_PAGE_CONSTANTS.FILTERS.ALL,
  );
  const [statusFilter, setStatusFilter] = useState<string>(ALLOCATIONS_PAGE_CONSTANTS.FILTERS.ALL);
  const [locationFilter, setLocationFilter] = useState<string>(
    ALLOCATIONS_PAGE_CONSTANTS.FILTERS.ALL,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = ALLOCATIONS_PAGE_CONSTANTS.PAGINATION.PAGE_SIZE;

  // Clear all filters helper
  const handleClearFilters = () => {
    setSearch('');
    setAssetCategory(ALLOCATIONS_PAGE_CONSTANTS.FILTERS.ALL);
    setEmployeeFilter(ALLOCATIONS_PAGE_CONSTANTS.FILTERS.ALL);
    setStatusFilter(ALLOCATIONS_PAGE_CONSTANTS.FILTERS.ALL);
    setLocationFilter(ALLOCATIONS_PAGE_CONSTANTS.FILTERS.ALL);
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
  const filteredAllocations = useMemo(() => {
    // Pre-index employees for O(1) lookup
    const empById = new Map<string, (typeof employees)[0]>();
    const empByCode = new Map<string, (typeof employees)[0]>();
    const empByName = new Map<string, (typeof employees)[0]>();

    for (const e of employees) {
      if (e.id) empById.set(e.id, e);
      if (e.employeeId) empByCode.set(e.employeeId.toLowerCase(), e);
      const nameKey = `${e.firstName} ${e.lastName}`.trim().toLowerCase();
      if (nameKey) empByName.set(nameKey, e);
    }

    const q = search.trim().toLowerCase();

    return assets.filter((asset) => {
      let assignedEmp = undefined;
      if (asset.assignedTo?.id) {
        assignedEmp = empById.get(asset.assignedTo.id);
      }
      if (!assignedEmp && asset.assignedTo?.employeeId) {
        assignedEmp = empByCode.get(asset.assignedTo.employeeId.toLowerCase());
      }
      if (!assignedEmp && asset.assignedTo?.name) {
        assignedEmp = empByName.get(asset.assignedTo.name.trim().toLowerCase());
      }

      const empFullName = assignedEmp
        ? `${assignedEmp.firstName} ${assignedEmp.lastName}`.trim()
        : asset.assignedTo?.name || '';

      const empDepartment = assignedEmp?.department || asset.assignedTo?.department || '';
      const empStatus = assignedEmp?.status.toLowerCase() || 'active';

      // 1. Text Search across asset name, assetId, employee name, employeeId, department
      if (q) {
        const matchAsset =
          asset.name.toLowerCase().includes(q) ||
          asset.assetId.toLowerCase().includes(q) ||
          asset.category.toLowerCase().includes(q);
        const matchEmp =
          empFullName.toLowerCase().includes(q) ||
          asset.assignedTo?.employeeId?.toLowerCase().includes(q) ||
          assignedEmp?.employeeId.toLowerCase().includes(q) ||
          empDepartment.toLowerCase().includes(q);

        if (!matchAsset && !matchEmp) return false;
      }

      // 2. Asset Category Filter
      if (
        assetCategory !== ALLOCATIONS_PAGE_CONSTANTS.FILTERS.ALL &&
        asset.category !== assetCategory
      ) {
        return false;
      }

      // 3. Employee Filter
      if (
        employeeFilter !== ALLOCATIONS_PAGE_CONSTANTS.FILTERS.ALL &&
        empFullName.toLowerCase() !== employeeFilter.toLowerCase() &&
        asset.assignedTo?.name.toLowerCase() !== employeeFilter.toLowerCase()
      ) {
        return false;
      }

      // 4. Status Filter (Evaluated with live employee status)
      if (statusFilter !== ALLOCATIONS_PAGE_CONSTANTS.FILTERS.ALL) {
        if (statusFilter === ALLOCATIONS_PAGE_CONSTANTS.FILTERS.STATUSES.ACTIVE) {
          if (
            asset.status !== 'Allocated' ||
            empStatus === 'inactive' ||
            empStatus === 'terminated'
          ) {
            return false;
          }
        } else if (statusFilter === ALLOCATIONS_PAGE_CONSTANTS.FILTERS.STATUSES.INACTIVE) {
          if (asset.status !== 'Allocated' || empStatus !== 'inactive') {
            return false;
          }
        } else if (statusFilter === ALLOCATIONS_PAGE_CONSTANTS.FILTERS.STATUSES.TERMINATED) {
          if (asset.status !== 'Allocated' || empStatus !== 'terminated') {
            return false;
          }
        } else if (statusFilter === ALLOCATIONS_PAGE_CONSTANTS.FILTERS.STATUSES.RETURNED) {
          if (asset.status !== 'Available') {
            return false;
          }
        } else if (statusFilter === ALLOCATIONS_PAGE_CONSTANTS.FILTERS.STATUSES.MAINTENANCE) {
          if (asset.status !== 'Maintenance') {
            return false;
          }
        }
      }

      // 5. Location Filter
      if (
        locationFilter !== ALLOCATIONS_PAGE_CONSTANTS.FILTERS.ALL &&
        asset.location !== locationFilter
      ) {
        return false;
      }

      return true;
    });
  }, [assets, employees, search, assetCategory, employeeFilter, statusFilter, locationFilter]);

  // Pagination calculation
  const totalFiltered = filteredAllocations.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = totalFiltered === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endIndex = Math.min(safePage * pageSize, totalFiltered);
  const paginatedAllocations = filteredAllocations.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  const showPagination = !isLoading && !error && totalFiltered > 0;

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto w-full text-left">
      {/* 1. Page Header with Title, Subtitle, and New Allocation Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary shadow-xs shrink-0 mt-0.5 sm:mt-0">
            <Layers className="size-6 sm:size-7" />
          </div>
          <div className="space-y-0.5 text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {translateAllocations('title', {
                defaultValue: ALLOCATIONS_PAGE_CONSTANTS.HEADER.TITLE,
              })}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {translateAllocations('subtitle', {
                defaultValue: ALLOCATIONS_PAGE_CONSTANTS.HEADER.SUBTITLE,
              })}
            </p>
          </div>
        </div>

        <Button
          type="button"
          onClick={handleOpenNewAllocation}
          className="h-10 px-5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm font-medium rounded-lg shadow-sm shadow-primary/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
        >
          <Plus className="size-4 stroke-[2.5]" />
          <span>
            {translateAllocations('newAllocationButton', {
              defaultValue: ALLOCATIONS_PAGE_CONSTANTS.HEADER.NEW_ALLOCATION_BUTTON,
            })}
          </span>
        </Button>
      </div>

      {/* 2. Main Content 2-Column Grid (Left: Filters + Table + Pagination, Right: Allocation Summary Card) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Column: Allocations Directory Card */}
        <div className="lg:col-span-3 dark:border-slate-800 shadow-xs p-5 space-y-4 overflow-hidden">
          {/* Filters Bar (Dropdowns + Search) */}
          <AllocationFiltersBar
            search={search}
            onSearchChange={(val) => {
              setSearch(val);
              setCurrentPage(1);
            }}
            assetCategory={assetCategory}
            onAssetCategoryChange={(val) => {
              setAssetCategory(val);
              setCurrentPage(1);
            }}
            employeeFilter={employeeFilter}
            onEmployeeFilterChange={(val) => {
              setEmployeeFilter(val);
              setCurrentPage(1);
            }}
            statusFilter={statusFilter}
            onStatusFilterChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
            locationFilter={locationFilter}
            onLocationFilterChange={(val) => {
              setLocationFilter(val);
              setCurrentPage(1);
            }}
            onClearFilters={handleClearFilters}
            employees={employees}
          />

          {/* Allocations Data Table with Loading -> Error -> Empty -> Success States */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
            <AllocationTable
              allocations={paginatedAllocations}
              isLoading={isLoading}
              error={error}
              onRetry={handleRetry}
              onClearFilters={handleClearFilters}
              onNewAllocation={handleOpenNewAllocation}
            />
          </div>

          {/* Common Reusable Pagination Component */}
          {showPagination && (
            <Pagination
              totalFiltered={totalFiltered}
              startIndex={startIndex}
              endIndex={endIndex}
              totalPages={totalPages}
              currentPage={safePage}
              onPageChange={setCurrentPage}
              entityLabel={translateAllocations('pagination.allocations', {
                defaultValue: ALLOCATIONS_PAGE_CONSTANTS.PAGINATION.ENTITY_LABEL,
              })}
              className="px-2 pt-3 border-t border-slate-100 dark:border-slate-800"
            />
          )}
        </div>

        {/* Right Column: Allocation Summary Card with Donut Chart */}
        <div className="lg:col-span-1 space-y-4">
          {/* KPI Card */}
          <ErrorBoundary
            fallbackRender={({ error: err, resetErrorBoundary }) => (
              <WidgetErrorFallback
                error={err}
                resetErrorBoundary={resetErrorBoundary}
                widgetTitle={ALLOCATION_WIDGET_TITLES.ALLOCATION_KPIS}
                minHeight="min-h-[140px]"
              />
            )}
          >
            <div className="bg-[#012143] rounded-2xl border border-slate-800/80 shadow-xs text-white overflow-hidden">
              <AssetAllocationKpiCards />
            </div>
          </ErrorBoundary>

          <ErrorBoundary
            fallbackRender={({ error: err, resetErrorBoundary }) => (
              <WidgetErrorFallback
                error={err}
                resetErrorBoundary={resetErrorBoundary}
                widgetTitle={ALLOCATION_WIDGET_TITLES.ALLOCATION_SUMMARY}
                minHeight="min-h-[260px]"
              />
            )}
          >
            <AllocationSummaryCard />
          </ErrorBoundary>
        </div>
      </div>

      {/* Modals & Dialogs */}
      <AllocateAssetModal />
      <AssetQrModal />
    </div>
  );
}

export default AllocationsPage;
