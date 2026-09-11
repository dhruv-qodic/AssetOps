import React, { useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { AssetStatusBadge } from './AssetStatusBadge';
import { AssetDeviceIcon } from './AssetDeviceIcon';
import { AssetRowActions } from './AssetRowActions';
import type { Asset } from '@/types/asset';
import { DollarSign, MapPin, Package, PackageSearch, Zap } from 'lucide-react';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';

interface AssetVisualizerProps {
  assets: Asset[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onClearFilters?: () => void;
  onAddAsset?: () => void;
}

const GRID_COLS =
  'grid-cols-[120px_minmax(250px,1fr)_140px_130px_150px_120px_minmax(150px,1fr)_80px]';

export const AssetVisualizer: React.FC<AssetVisualizerProps> = ({
  assets,
  isLoading = false,
  error = null,
  onRetry,
  onClearFilters,
  onAddAsset,
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [openRowId, setOpenRowId] = useState<string | null>(null);

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
        title="Loading assets..."
        description="Please wait while we retrieve the latest asset inventory."
      />
    );
  }

  // 2. Error State
  if (error) {
    return (
      <ErrorState
        title="Failed to load assets"
        message={error}
        onRetry={onRetry}
      />
    );
  }

  // 3. Empty State
  if (assets.length === 0) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="No assets found"
        description="No assets match your active search or filter criteria. Try clearing filters or add a new asset."
        secondaryActionLabel={onClearFilters ? 'Clear filters' : undefined}
        onSecondaryAction={onClearFilters}
        actionLabel={onAddAsset ? 'Add Asset' : undefined}
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
            Visualizer Engine Active
          </span>
          <span className="text-slate-400">•</span>
          <span>High-performance windowed virtual grid</span>
        </div>
        <div className="font-mono text-[11px] bg-slate-200/70 dark:bg-slate-700/60 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
          {assets.length.toLocaleString()} items virtualized
        </div>
      </div>

      {/* Sticky Table Header */}
      <div className="overflow-x-auto">
        <div className="min-w-[1000px]">
          <div
            className={`grid ${GRID_COLS} items-center border-b border-slate-200/80 dark:border-slate-800 bg-[#F8FAFC]/90 dark:bg-slate-900/80 text-xs font-bold text-slate-700 dark:text-slate-300 py-3.5 px-6 select-none`}
          >
            <div>ASSET ID</div>
            <div>NAME</div>
            <div>CATEGORY</div>
            <div>STATUS</div>
            <div>LOCATION</div>
            <div>COST</div>
            <div>ASSIGNED TO</div>
            <div className="text-right">ACTIONS</div>
          </div>

          {/* Virtualized List View Container */}
          <div
            ref={parentRef}
            className="h-[600px] overflow-auto relative scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700"
          >
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const asset = assets[virtualRow.index];
                if (!asset) return null;
                const isRowOpen = openRowId === asset.id;

                return (
                  <div
                    key={asset.id}
                    data-index={virtualRow.index}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                      zIndex: isRowOpen ? 50 : 1,
                    }}
                    className={`grid ${GRID_COLS} items-center px-6 border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group text-xs sm:text-sm bg-white dark:bg-slate-900`}
                  >
                    {/* Asset ID */}
                    <div className="font-medium text-slate-900 dark:text-slate-100 truncate">
                      {asset.assetId}
                    </div>

                    {/* Name + Icon + Model */}
                    <div className="flex items-center gap-3 pr-2 min-w-0">
                      <AssetDeviceIcon
                        category={asset.category}
                        name={asset.name}
                      />
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
                      {asset.category}
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
                          {asset.location}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-normal">-</span>
                      )}
                    </div>

                    {/* Cost */}
                    <div className="truncate text-slate-700 dark:text-slate-300 flex gap-1 items-center">
                      <DollarSign className="size-3.5 text-slate-400 shrink-0" />
                      {asset.purchaseCost}
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
                    <div className="text-right">
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
    </div>
  );
};

export default AssetVisualizer;
