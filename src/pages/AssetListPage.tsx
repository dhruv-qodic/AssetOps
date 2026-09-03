import { useAssetStore } from '@/store/useAssetStore';
import AssetHeader from '@/components/assets/AssetHeader';
import AssetFiltersBar from '@/components/assets/AssetFiltersBar';
import AssetTable from '@/components/assets/AssetTable';
import AssetPagination from '@/components/assets/AssetPagination';
import AddAssetModal from '@/components/assets/AddAssetModal';
import AssetDetailsModal from '@/components/assets/AssetDetailsModal';
import DeleteAssetModal from '@/components/assets/DeleteAssetModal';
import ImportAssetsModal from '@/components/assets/ImportAssetsModal';

export function AssetListPage() {
  const { getFilteredAssets, filters } = useAssetStore();

  const {
    paginatedAssets,
    totalFiltered,
    totalPages,
    startIndex,
    endIndex,
  } = getFilteredAssets();

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-5 max-w-7xl mx-auto w-full">
      {/* 1. Page Header with Title and Action Buttons */}
      <AssetHeader />

      {/* 2. Search & Filter Bar */}
      <AssetFiltersBar />

      {/* 3. Assets Data Table Card Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {/* Table Content */}
        <AssetTable assets={paginatedAssets} />

        {/* Pagination Footer */}
        <AssetPagination
          totalFiltered={totalFiltered}
          startIndex={startIndex}
          endIndex={endIndex}
          totalPages={totalPages}
          currentPage={filters.page}
        />
      </div>

      {/* Modals & Dialogs */}
      <AddAssetModal />
      <AssetDetailsModal />
      <DeleteAssetModal />
      <ImportAssetsModal />
    </div>
  );
}

export default AssetListPage;