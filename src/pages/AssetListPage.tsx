import { useAssetStore } from '@/store/useAssetStore';
import { useAssetFilterStore } from '@/store/useAssetFilterStore';
import { useDebounce } from '@/hooks/useDebounce';
import AssetHeader from '@/components/assets/AssetHeader';
import AssetFilterPanel from '@/components/assets/AssetFilterPanel';
import AssetToolbar from '@/components/assets/AssetToolbar';
import AssetTable from '@/components/assets/AssetTable';
import AssetVisualizer from '@/components/assets/AssetVisualizer';
import AssetPagination from '@/components/assets/AssetPagination';
import AddAssetModal from '@/components/assets/AddAssetModal';
import AssetDetailsModal from '@/components/assets/AssetDetailsModal';
import DeleteAssetModal from '@/components/assets/DeleteAssetModal';
import ImportAssetsModal from '@/components/assets/ImportAssetsModal';
import AllocateAssetModal from '@/components/assets/AllocateAssetModal';

export function AssetListPage() {
  useAssetStore((s) => s.assets);
  const filters = useAssetStore((s) => s.filters);
  const getFilteredAssets = useAssetStore((s) => s.getFilteredAssets);
  const isLoading = useAssetStore((s) => s.isLoading);
  const error = useAssetStore((s) => s.error);
  const reloadAssets = useAssetStore((s) => s.reloadAssets);
  const resetAssetStoreFilters = useAssetStore((s) => s.resetFilters);
  const openAddModal = useAssetStore((s) => s.openAddModal);
  const viewMode = useAssetStore((s) => s.viewMode);

  // Subscribe to multi-facet filter store
  const searchKeyword = useAssetFilterStore((s) => s.searchKeyword);
  useAssetFilterStore((s) => s.selectedCategories);
  useAssetFilterStore((s) => s.selectedStatuses);
  useAssetFilterStore((s) => s.selectedDepartments);
  useAssetFilterStore((s) => s.costRange);
  const resetFilterStore = useAssetFilterStore((s) => s.resetFilters);

  // Debounce searchKeyword (300ms default)
  const debouncedSearchKeyword = useDebounce(searchKeyword, 300);

  const handleClearFilters = () => {
    resetFilterStore();
    resetAssetStoreFilters();
  };

  const { allFilteredAssets, paginatedAssets, totalFiltered, totalPages, startIndex, endIndex } =
    getFilteredAssets(debouncedSearchKeyword);

  const showPagination = viewMode === 'table' && !isLoading && !error && totalFiltered > 0;

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-5 mx-auto w-full">
      {/* 1. Page Header with Title and Action Buttons */}
      <AssetHeader />

      {/* 2. Main Layout: Multi-Facet Filter Panel (Left) + Asset Content (Right) */}
      <div className="flex flex-col lg:flex-row items-start gap-5">
        {/* Left Side: Multi-Facet Filter Panel */}
        <AssetFilterPanel />

        {/* Right Side: Data Toolbar, Table / Visualizer, and Pagination */}
        <div className="flex-1 min-w-0 w-full space-y-4">
          <AssetToolbar totalCount={totalFiltered} />

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
            {viewMode === 'virtualized' ? (
              <AssetVisualizer
                assets={allFilteredAssets}
                isLoading={isLoading}
                error={error}
                onRetry={() => void reloadAssets()}
                onClearFilters={handleClearFilters}
                onAddAsset={openAddModal}
              />
            ) : (
              <AssetTable
                assets={paginatedAssets}
                isLoading={isLoading}
                error={error}
                onRetry={() => void reloadAssets()}
                onClearFilters={handleClearFilters}
                onAddAsset={openAddModal}
              />
            )}

            {/* Pagination Footer (Only displayed in Paginated Table Mode) */}
            {showPagination && (
              <AssetPagination
                totalFiltered={totalFiltered}
                startIndex={startIndex}
                endIndex={endIndex}
                totalPages={totalPages}
                currentPage={filters.page}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modals & Dialogs */}
      <AddAssetModal />
      <AssetDetailsModal />
      <DeleteAssetModal />
      <ImportAssetsModal />
      <AllocateAssetModal />
    </div>
  );
}

export default AssetListPage;
