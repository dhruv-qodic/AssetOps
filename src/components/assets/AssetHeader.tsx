import React from 'react';
import { Plus, ArrowUpToLine, Layers2, Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/common/PageHeader';
import { useAssetStore } from '@/store/useAssetStore';
import { useAssetFilterStore } from '@/store/useAssetFilterStore';
import { usePermission } from '@/hooks/usePermission';
import {
  ASSET_HEADER_TITLES,
  ASSET_HEADER_PLACEHOLDERS,
  ASSET_HEADER_ARIA,
  ASSET_HEADER_BUTTONS,
} from './constants/AssetHeader.constants';

/**
 * @description: Page header component for assets management with search input, import action, and add asset trigger
 * @returns {JSX.Element} Asset header component JSX
 */
export const AssetHeader: React.FC = () => {
  const { t: translateAssets } = useTranslation('asset');
  const openAddModal = useAssetStore((s) => s.openAddModal);
  const openImportModal = useAssetStore((s) => s.openImportModal);
  const setPage = useAssetStore((s) => s.setPage);

  const searchKeyword = useAssetFilterStore((s) => s.searchKeyword);
  const setSearchKeyword = useAssetFilterStore((s) => s.setSearchKeyword);

  const { hasPermission } = usePermission();
  const canCreate = hasPermission('CREATE_ASSET');

  /**
   * @description: Handle search input change and reset pagination to page 1
   * @param {React.ChangeEvent<HTMLInputElement>} e - Change event from search text input
   * @returns {void}
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
    setPage(1);
  };

  /**
   * @description: Clear the active search keyword and reset page to 1
   * @returns {void}
   */
  const handleClearSearch = () => {
    setSearchKeyword('');
    setPage(1);
  };

  return (
    <PageHeader
      title={translateAssets('title', { defaultValue: ASSET_HEADER_TITLES.PAGE_TITLE })}
      subtitle={translateAssets('subtitle', { defaultValue: ASSET_HEADER_TITLES.PAGE_SUBTITLE })}
      icon={Layers2}
      className="lg:flex-row lg:items-center"
      actionsClassName="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto"
    >
      {/* Asset Search Bar (as marked in reference) */}
      <div className="relative flex-1 sm:w-72 md:w-80 lg:w-80">
        <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <Input
          type="text"
          value={searchKeyword}
          onChange={handleSearchChange}
          placeholder={translateAssets('searchPlaceholder', {
            defaultValue: ASSET_HEADER_PLACEHOLDERS.SEARCH_KEYWORD,
          })}
          aria-label={ASSET_HEADER_ARIA.SEARCH_ASSETS}
          className="h-9.5 pl-9 pr-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 rounded-lg shadow-2xs focus-visible:ring-1 focus-visible:ring-primary"
        />
        {searchKeyword && (
          <button
            type="button"
            onClick={handleClearSearch}
            aria-label={ASSET_HEADER_ARIA.CLEAR_SEARCH}
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
            className="h-9.5 px-4 bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm font-medium rounded-md shadow-xs shadow-primary/25 transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
          >
            <Plus className="size-4 stroke-[2.5]" />
            <span>
              {translateAssets('addAsset', { defaultValue: ASSET_HEADER_BUTTONS.ADD_ASSET })}
            </span>
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
            <span>
              {translateAssets('importAssets', { defaultValue: ASSET_HEADER_BUTTONS.IMPORT })}
            </span>
          </Button>
        )}
      </div>
    </PageHeader>
  );
};

export default AssetHeader;
