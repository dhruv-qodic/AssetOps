import { useState, useMemo } from 'react';
import { useAssetStore } from '@/store/useAssetStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { Button } from '@/components/ui/button';
import AllocateAssetModal from '@/components/assets/AllocateAssetModal';
import AssetDetailsModal from '@/components/assets/AssetDetailsModal';
import AllocationFiltersBar from '@/components/allocations/AllocationFiltersBar';
import AllocationTable from '@/components/allocations/AllocationTable';
import AllocationSummaryCard from '@/components/allocations/AllocationSummaryCard';
import { Pagination } from '@/components/common/Pagination';
import { Layers, Plus } from 'lucide-react';

export function AllocationsPage() {
  const {
    assets,
    openAllocateModal,
    isLoading: isAssetLoading,
    error: assetError,
    reloadAssets,
  } = useAssetStore();
  const {
    employees,
    isLoading: isEmpLoading,
    error: empError,
    reloadEmployees,
  } = useEmployeeStore();

  const isLoading = isAssetLoading || isEmpLoading;
  const error = assetError || empError;

  const handleRetry = () => {
    reloadAssets();
    reloadEmployees();
  };

  const handleOpenNewAllocation = () => {
    const availableAsset = assets.find((a) => a.status === 'Available');
    if (availableAsset) {
      openAllocateModal(availableAsset);
    } else if (assets.length > 0) {
      openAllocateModal(assets[0]);
    }
  };

  // Filter and Pagination States
  const [search, setSearch] = useState('');
  const [assetCategory, setAssetCategory] = useState('All');
  const [employeeFilter, setEmployeeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Clear all filters helper
  const handleClearFilters = () => {
    setSearch('');
    setAssetCategory('All');
    setEmployeeFilter('All');
    setStatusFilter('All');
    setLocationFilter('All');
    setCurrentPage(1);
  };

  // Filtered allocations list (includes both allocated and available/returned for full visibility)
  const filteredAllocations = useMemo(() => {
    return assets.filter((asset) => {
      const assignedEmp = employees.find(
        (e) =>
          (asset.assignedTo?.id && e.id === asset.assignedTo.id) ||
          (asset.assignedTo?.employeeId && e.employeeId === asset.assignedTo.employeeId) ||
          (asset.assignedTo?.name &&
            `${e.firstName} ${e.lastName}`.trim().toLowerCase() ===
              asset.assignedTo.name.trim().toLowerCase()),
      );

      const empFullName = assignedEmp
        ? `${assignedEmp.firstName} ${assignedEmp.lastName}`.trim()
        : asset.assignedTo?.name || '';

      const empDepartment = assignedEmp?.department || asset.assignedTo?.department || '';
      const empStatus = assignedEmp?.status.toLowerCase() || 'active';

      // 1. Text Search across asset name, assetId, employee name, employeeId, department
      if (search.trim()) {
        const q = search.toLowerCase();
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
      if (assetCategory !== 'All' && asset.category !== assetCategory) {
        return false;
      }

      // 3. Employee Filter
      if (
        employeeFilter !== 'All' &&
        empFullName.toLowerCase() !== employeeFilter.toLowerCase() &&
        asset.assignedTo?.name.toLowerCase() !== employeeFilter.toLowerCase()
      ) {
        return false;
      }

      // 4. Status Filter (Evaluated with live employee status)
      if (statusFilter !== 'All') {
        if (statusFilter === 'Active') {
          if (
            asset.status !== 'Allocated' ||
            empStatus === 'inactive' ||
            empStatus === 'terminated'
          ) {
            return false;
          }
        } else if (statusFilter === 'Inactive') {
          if (asset.status !== 'Allocated' || empStatus !== 'inactive') {
            return false;
          }
        } else if (statusFilter === 'Terminated') {
          if (asset.status !== 'Allocated' || empStatus !== 'terminated') {
            return false;
          }
        } else if (statusFilter === 'Returned') {
          if (asset.status !== 'Available') {
            return false;
          }
        } else if (statusFilter === 'Maintenance') {
          if (asset.status !== 'Maintenance') {
            return false;
          }
        }
      }

      // 5. Location Filter
      if (locationFilter !== 'All' && asset.location !== locationFilter) {
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
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full text-left">
      {/* 1. Page Header with Title, Subtitle, and New Allocation Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="size-6 text-[#4C40F7]" />
            <span>Asset Allocations</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Track and manage asset allocation to employees
          </p>
        </div>

        <Button
          type="button"
          onClick={handleOpenNewAllocation}
          className="h-10 px-5 bg-[#4C40F7] hover:bg-[#3D31E5] text-white text-xs sm:text-sm font-medium rounded-lg shadow-sm shadow-indigo-600/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
        >
          <Plus className="size-4 stroke-[2.5]" />
          <span>New Allocation</span>
        </Button>
      </div>

      {/* 2. Main Content 2-Column Grid (Left: Filters + Table + Pagination, Right: Allocation Summary Card) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Column: Allocations Directory Card */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-5 space-y-4 overflow-hidden">
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
              entityLabel="allocations"
              className="px-2 pt-3 border-t border-slate-100 dark:border-slate-800"
            />
          )}
        </div>

        {/* Right Column: Allocation Summary Card with Donut Chart */}
        <div className="lg:col-span-1">
          <AllocationSummaryCard />
        </div>
      </div>

      {/* Modals & Dialogs */}
      <AllocateAssetModal />
      <AssetDetailsModal />
    </div>
  );
}

export default AllocationsPage;
