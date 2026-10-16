import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useVirtualizer } from '@tanstack/react-virtual';
import { AssetStatusBadge } from './AssetStatusBadge';
import { AssetDeviceIcon } from './AssetDeviceIcon';
import { AssetRowActions } from './AssetRowActions';
import type { Asset } from '@/types/asset';
import { Loader2, MapPin, Package, PackageSearch, Zap } from 'lucide-react';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import { cn } from '@/lib/utils';
import { ASSET_TABLE_MESSAGES } from './constants/AssetTable.constants';
import {
  ASSET_VISUALIZER_TITLES,
  ASSET_VISUALIZER_COLUMNS,
} from './constants/AssetVisualizer.constants';
import { useCurrency } from '@/hooks/useCurrency';

interface AssetVisualizerProps {
  assets: Asset[];
  isLoading?: boolean;
  isPending?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onClearFilters?: () => void;
  onAddAsset?: () => void;
}

const GRID_COLS =
  'grid-cols-[120px_minmax(250px,1fr)_140px_130px_150px_120px_minmax(150px,1fr)_80px]';

/**
 * @description: Virtualized multi-column asset list layout optimized for smooth rendering of large hardware fleets
 * @param {AssetVisualizerProps} props - Component properties containing assets list, pending state, and error handling
 * @returns {JSX.Element} Asset visualizer component JSX
 */
export const AssetVisualizer: React.FC<AssetVisualizerProps> = ({
  assets,
  isLoading = false,
  isPending = false,
  error = null,
  onRetry,
  onClearFilters,
  onAddAsset,
}) => {
  const { t: translateAssets } = useTranslation('asset');
  const { format } = useCurrency();
  const parentRef = useRef<HTMLDivElement>(null);
  const [openRowId, setOpenRowId] = useState<string | null>(null);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  /**
   * @description: Virtualizer instance to render only visible list rows in DOM
   * @returns {Virtualizer<HTMLDivElement, Element>} Virtualizer instance for rows
   */
  const rowVirtualizer = useVirtualizer({
    count: assets.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56, // row height in px
    overscan: 10,
  });

  // 1. Loading State
  if (isLoading) {
    return (
      <LoadingState
        icon={Package}
        title={ASSET_TABLE_MESSAGES.LOADING_TITLE}
        description={ASSET_TABLE_MESSAGES.LOADING_DESCRIPTION}
      />
    );
  }

  // 2. Error State
  if (error) {
    return (
      <ErrorState title={ASSET_TABLE_MESSAGES.ERROR_TITLE} message={error} onRetry={onRetry} />
    );
  }

  // 3. Empty State
  if (assets.length === 0) {
    return (
      <EmptyState
        icon={PackageSearch}
        title={ASSET_TABLE_MESSAGES.EMPTY_TITLE}
        description={ASSET_TABLE_MESSAGES.EMPTY_DESCRIPTION}
        secondaryActionLabel={onClearFilters ? ASSET_TABLE_MESSAGES.CLEAR_FILTERS : undefined}
        onSecondaryAction={onClearFilters}
        actionLabel={onAddAsset ? ASSET_TABLE_MESSAGES.ADD_ASSET : undefined}
        onAction={onAddAsset}
      />
    );
  }

  return (
    <div className="flex flex-col h-full select-none">
      {/* Visualizer Status Header Banner */}
      <div className="flex items-center justify-between px-6 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Zap className="size-4 text-amber-500 fill-amber-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {translateAssets('visualizer.engineActive', {
              defaultValue: ASSET_VISUALIZER_TITLES.ENGINE_ACTIVE,
            })}
          </span>
          <span className="text-slate-400">•</span>
          <span>
            {translateAssets('visualizer.engineSubtitle', {
              defaultValue: ASSET_VISUALIZER_TITLES.ENGINE_SUBTITLE,
            })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isPending && (
            <div
              data-testid="visualizer-pending-indicator"
              className="flex items-center gap-1.5 font-mono text-[11px] bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded font-medium"
            >
              <Loader2 className="size-3 animate-spin text-primary" />
              <span>
                {translateAssets('toolbar.filtering', {
                  defaultValue: ASSET_VISUALIZER_TITLES.FILTERING,
                })}
              </span>
            </div>
          )}
          <div className="font-mono text-[11px] bg-slate-200/70 dark:bg-slate-700/60 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
            {translateAssets('visualizer.itemsVirtualized', {
              count: assets.length,
              defaultValue: `${assets.length.toLocaleString()} ${ASSET_VISUALIZER_TITLES.ITEMS_VIRTUALIZED_SUFFIX}`,
            })}
          </div>
          {selectedRowId && (
            <div className="font-mono text-[11px] bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 px-2 py-0.5 rounded font-medium">
              {ASSET_VISUALIZER_TITLES.ROW_SELECTED}
            </div>
          )}
        </div>
      </div>

      {/* Unified Table Scroll Container */}
      <div
        ref={parentRef}
        className={cn(
          'h-[600px] overflow-auto relative scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 transition-opacity duration-150',
          isPending && 'opacity-65',
        )}
      >
        <div className="w-full min-w-[1200px]">
          {/* Sticky Table Header */}
          <div
            className={`sticky top-0 z-20 grid ${GRID_COLS} items-center border-b border-slate-200/80 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 py-3.5 px-6 select-none shadow-xs`}
          >
            <div>
              {translateAssets('columns.assetId', {
                defaultValue: ASSET_VISUALIZER_COLUMNS.ASSET_ID,
              })}
            </div>
            <div>
              {translateAssets('columns.name', {
                defaultValue: ASSET_VISUALIZER_COLUMNS.NAME,
              })}
            </div>
            <div>
              {translateAssets('columns.category', {
                defaultValue: ASSET_VISUALIZER_COLUMNS.CATEGORY,
              })}
            </div>
            <div>
              {translateAssets('columns.status', {
                defaultValue: ASSET_VISUALIZER_COLUMNS.STATUS,
              })}
            </div>
            <div>
              {translateAssets('columns.location', {
                defaultValue: ASSET_VISUALIZER_COLUMNS.LOCATION,
              })}
            </div>
            <div>
              {translateAssets('columns.purchaseCost', {
                defaultValue: ASSET_VISUALIZER_COLUMNS.COST,
              })}
            </div>
            <div>
              {translateAssets('columns.assignedTo', {
                defaultValue: ASSET_VISUALIZER_COLUMNS.ASSIGNED_TO,
              })}
            </div>
            <div className="text-right">
              {translateAssets('columns.actions', {
                defaultValue: ASSET_VISUALIZER_COLUMNS.ACTIONS,
              })}
            </div>
          </div>

          {/* Virtualized List View Container */}
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const asset = assets[virtualRow.index];
              const isRowOpen = openRowId === asset.id;
              const isSelected = selectedRowId === asset.id;

              return (
                <div
                  key={asset.id}
                  data-index={virtualRow.index}
                  data-selected={isSelected}
                  aria-selected={isSelected}
                  onClick={() => setSelectedRowId((prev) => (prev === asset.id ? null : asset.id))}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                    zIndex: isRowOpen ? 50 : 1,
                  }}
                  className={`grid ${GRID_COLS} items-center px-6 border-b border-slate-100 dark:border-slate-800/60 transition-colors group text-xs sm:text-sm cursor-pointer select-none ${
                    isSelected
                      ? 'bg-blue-50/90 dark:bg-blue-950/50 hover:bg-blue-100/90 dark:hover:bg-blue-900/60 border-l-4 border-l-blue-600 dark:border-l-blue-400 font-medium'
                      : 'bg-white dark:bg-slate-900 hover:bg-slate-50/80 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {/* Asset ID */}
                  <div className="font-medium text-slate-900 dark:text-slate-100 truncate">
                    {asset.assetId}
                  </div>

                  {/* Name + Icon + Model */}
                  <div className="flex items-center gap-3 pr-2 min-w-0">
                    <AssetDeviceIcon category={asset.category} name={asset.name} />
                    <div className="flex flex-col text-left min-w-0 truncate">
                      <span className="font-semibold text-slate-900 dark:text-slate-100 leading-tight truncate">
                        {asset.name}
                      </span>
                      {asset.model && (
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight truncate">
                          {asset.model}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Category */}
                  <div className="text-slate-600 dark:text-slate-300 truncate">
                    {translateAssets(`categories.${asset.category}`, {
                      defaultValue: asset.category,
                    })}
                  </div>

                  {/* Status */}
                  <div>
                    <AssetStatusBadge status={asset.status} />
                  </div>

                  {/* Location */}
                  <div className="truncate">
                    {asset.location ? (
                      <span className="font-medium text-slate-800 dark:text-slate-200 flex gap-1 items-center">
                        <MapPin className="size-3.5 text-slate-400 shrink-0" />
                        {translateAssets(`locations.${asset.location}`, {
                          defaultValue: asset.location,
                        })}
                      </span>
                    ) : (
                      <span className="text-slate-400 font-normal">-</span>
                    )}
                  </div>

                  {/* Cost */}
                  <div className="truncate text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm">
                    {asset.purchaseCost != null ? format(asset.purchaseCost) : '-'}
                  </div>

                  {/* Assigned To */}
                  <div className="text-slate-700 dark:text-slate-300 truncate pr-2">
                    {asset.assignedTo ? (
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {asset.assignedTo.name}
                      </span>
                    ) : (
                      <span className="text-slate-400 font-normal">-</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="text-right" onClick={(e) => e.stopPropagation()}>
                    <AssetRowActions
                      asset={asset}
                      onOpenChange={(isOpen) => setOpenRowId(isOpen ? asset.id : null)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetVisualizer;
