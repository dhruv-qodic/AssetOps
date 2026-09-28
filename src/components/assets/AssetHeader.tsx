import React from 'react';
import { Plus, ArrowUpToLine, Layers2, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAssetStore } from '@/store/useAssetStore';
import { useAssetFilterStore } from '@/store/useAssetFilterStore';
import { usePermission } from '@/hooks/usePermission';

export const AssetHeader: React.FC = () => {
  const openAddModal = useAssetStore((s) => s.openAddModal);
  const openImportModal = useAssetStore((s) => s.openImportModal);
  const setPage = useAssetStore((s) => s.setPage);

  const searchKeyword = useAssetFilterStore((s) => s.searchKeyword);
  const setSearchKeyword = useAssetFilterStore((s) => s.setSearchKeyword);

  const { hasPermission } = usePermission();
  const canCreate = hasPermission('CREATE_ASSET');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchKeyword('');
    setPage(1);
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-1">
      {/* Title */}
      <div className="flex items-start sm:items-center gap-3 shrink-0">
        <div className="p-2.5 rounded-xl bg-[#155DFC]/10 dark:bg-[#155DFC]/20 text-[#155DFC] shadow-xs shrink-0 mt-0.5 sm:mt-0">
          <Layers2 className="size-6 sm:size-7" />
        </div>
        <div className="space-y-0.5 text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Assets Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Manage your company's assets with ease
          </p>
        </div>
      </div>

      {/* Right Area: Search Input + Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
        {/* Asset Search Bar (as marked in reference) */}
        <div className="relative flex-1 sm:w-72 md:w-80 lg:w-80">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <Input
            type="text"
            value={searchKeyword}
            onChange={handleSearchChange}
            placeholder="Search keyword..."
            aria-label="Search assets"
            className="h-9.5 pl-9 pr-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 rounded-lg shadow-2xs focus-visible:ring-1 focus-visible:ring-[#155DFC]"
          />
          {searchKeyword && (
            <button
              type="button"
              onClick={handleClearSearch}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          {canCreate && (
            <Button
              type="button"
              onClick={openAddModal}
              className="h-9.5 px-4 bg-[#155DFC] hover:bg-[#0D4ECC] text-white text-xs sm:text-sm font-medium rounded-md shadow-xs shadow-[#155DFC]/25 transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
            >
              <Plus className="size-4 stroke-[2.5]" />
              <span>Add Asset</span>
            </Button>
          )}

          {canCreate && (
            <Button
              type="button"
              variant="outline"
              onClick={openImportModal}
              className="h-9.5 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs sm:text-sm font-medium rounded-md shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
            >
              <ArrowUpToLine className="size-4 text-slate-500" />
              <span>Import</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetHeader;
