import React, { useState } from 'react';
import { Zap, Table2, Columns3, FolderTree } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAssetStore } from '@/store/useAssetStore';
import { cn } from '@/lib/utils';
import ColumnVisibilityModal from './ColumnVisibilityModal';
import AssetFilterDropdown from './AssetFilterDropdown';
import { ASSET_TOOLBAR_LABELS, ASSET_TOOLBAR_TOOLTIPS } from './constants/AssetToolbar.constants';

interface AssetToolbarProps {
  totalCount?: number;
  isPending?: boolean;
}

/**
 * @description: Toolbar for switching view modes (table, cards, tree), opening column visibility modal, and filtering assets
 * @param {AssetToolbarProps} props - Component properties containing totalCount and isPending indicator
 * @returns {JSX.Element} Toolbar controls bar JSX
 */
export const AssetToolbar: React.FC<AssetToolbarProps> = ({ totalCount, isPending = false }) => {
  const { t: translateAssets } = useTranslation('asset');
  const viewMode = useAssetStore((s) => s.viewMode);
  const setViewMode = useAssetStore((s) => s.setViewMode);

  /**
   * @description: State for column visibility modal
   */
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-2.5 shadow-xs">
      {/* Left: Results Info / Status */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {translateAssets('toolbar.assetRecords', {
            defaultValue: ASSET_TOOLBAR_LABELS.ASSET_RECORDS,
          })}
        </span>
        {typeof totalCount === 'number' && (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {totalCount}{' '}
            {totalCount === 1
              ? translateAssets('toolbar.assetSingular', {
                  defaultValue: ASSET_TOOLBAR_LABELS.ASSET_SINGULAR,
                })
              : translateAssets('toolbar.assetsPlural', {
                  defaultValue: ASSET_TOOLBAR_LABELS.ASSETS_PLURAL,
                })}
          </span>
        )}
        {isPending && (
          <span
            data-testid="asset-filtering-indicator"
            className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 animate-pulse"
          >
            <span className="size-1.5 rounded-full bg-primary animate-ping" />
            <span>
              {translateAssets('toolbar.filtering', {
                defaultValue: ASSET_TOOLBAR_LABELS.FILTERING,
              })}
            </span>
          </span>
        )}
      </div>

      {/* Right: Actions (Filter + Columns + View Mode Switcher) */}
      <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0 flex-wrap">
        {/* Filter Popup Trigger Button */}
        <AssetFilterDropdown />

        {/* Column Visibility Trigger Button */}
        {viewMode === 'table' && (
          <button
            type="button"
            onClick={() => setIsColumnModalOpen(true)}
            className="h-8.5 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-xs font-medium rounded-lg shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98] select-none"
            title={ASSET_TOOLBAR_TOOLTIPS.CONFIGURE_COLUMNS}
          >
            <Columns3 className="size-3.5 text-slate-500 dark:text-slate-400" />
            <span>
              {translateAssets('columnVisibility', {
                defaultValue: ASSET_TOOLBAR_LABELS.COLUMNS,
              })}
            </span>
          </button>
        )}

        {/* View Mode Switcher (Table | Visualizer | Hierarchy) */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg border border-slate-200/80 dark:border-slate-700/60 shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer select-none',
              viewMode === 'table'
                ? 'bg-primary text-primary-foreground shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200',
            )}
            title={ASSET_TOOLBAR_TOOLTIPS.STANDARD_TABLE_VIEW}
          >
            <Table2 className="size-3.5" />
            <span>
              {translateAssets('views.table', {
                defaultValue: ASSET_TOOLBAR_LABELS.VIEW_TABLE,
              })}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('virtualized')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer select-none',
              viewMode === 'virtualized'
                ? 'bg-primary text-primary-foreground shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200',
            )}
            title={ASSET_TOOLBAR_TOOLTIPS.VIRTUALIZED_GRID}
          >
            <Zap className="size-3.5" />
            <span>
              {translateAssets('views.visualizer', {
                defaultValue: ASSET_TOOLBAR_LABELS.VIEW_VISUALIZER,
              })}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('tree')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer select-none',
              viewMode === 'tree'
                ? 'bg-primary text-primary-foreground shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200',
            )}
            title={ASSET_TOOLBAR_TOOLTIPS.HIERARCHY_TREE}
          >
            <FolderTree className="size-3.5" />
            <span>
              {translateAssets('views.hierarchy', {
                defaultValue: ASSET_TOOLBAR_LABELS.VIEW_HIERARCHY,
              })}
            </span>
          </button>
        </div>
      </div>

      {/* Column Visibility Dialog */}
      <ColumnVisibilityModal
        isOpen={isColumnModalOpen}
        onClose={() => setIsColumnModalOpen(false)}
      />
    </div>
  );
};

export default AssetToolbar;
