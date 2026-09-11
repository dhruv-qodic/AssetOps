import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AssetStatusBadge } from './AssetStatusBadge';
import { AssetDeviceIcon } from './AssetDeviceIcon';
import { AssetRowActions } from './AssetRowActions';
import type { Asset } from '@/types/asset';
import { Package, PackageSearch } from 'lucide-react';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';

interface AssetTableProps {
  assets: Asset[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onClearFilters?: () => void;
  onAddAsset?: () => void;
}

export const AssetTable: React.FC<AssetTableProps> = ({
  assets,
  isLoading = false,
  error = null,
  onRetry,
  onClearFilters,
  onAddAsset,
}) => {
  // 1. Loading State (with asset-related icon integrated into loader)
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
        secondaryActionLabel={onClearFilters ? "Clear filters" : undefined}
        onSecondaryAction={onClearFilters}
        actionLabel={onAddAsset ? "Add Asset" : undefined}
        onAction={onAddAsset}
      />
    );
  }

  // 4. Success State (Data Table)

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-slate-200/80 dark:border-slate-800 bg-[#F8FAFC]/90 dark:bg-slate-900/80">
            <TableHead className="w-[120px] pl-6 font-bold text-slate-700 dark:text-slate-300">
              ASSET ID
            </TableHead>
            <TableHead className="min-w-[200px] font-bold text-slate-700 dark:text-slate-300">
              NAME
            </TableHead>
            <TableHead className="w-[140px] font-bold text-slate-700 dark:text-slate-300">
              CATEGORY
            </TableHead>
            <TableHead className="w-[130px] font-bold text-slate-700 dark:text-slate-300">
              STATUS
            </TableHead>
            <TableHead className="w-[130px] font-bold text-slate-700 dark:text-slate-300">
              LOCATION
            </TableHead>
            <TableHead className="w-[130px] font-bold text-slate-700 dark:text-slate-300">
              COST
            </TableHead>
            <TableHead className="min-w-[150px] font-bold text-slate-700 dark:text-slate-300">
              ASSIGNED TO
            </TableHead>
            <TableHead className="w-[80px] text-right pr-6 font-bold text-slate-700 dark:text-slate-300">
              ACTIONS
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {assets.map((asset) => (
            <TableRow
              key={asset.id}
              className="group hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
            >
              {/* Asset ID */}
              <TableCell className="pl-6 font-medium text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                {asset.assetId}
              </TableCell>

              {/* Name with Device Icon + Model Subtitle */}
              <TableCell>
                <div className="flex items-center gap-3">
                  <AssetDeviceIcon
                    category={asset.category}
                    name={asset.name}
                  />
                  <div className="flex flex-col text-left">
                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm leading-tight">
                      {asset.name}
                    </span>
                    {asset.model && (
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                        {asset.model}
                      </span>
                    )}
                  </div>
                </div>
              </TableCell>

              {/* Category */}
              <TableCell className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
                {asset.category}
              </TableCell>

              {/* Status */}
              <TableCell>
                <AssetStatusBadge status={asset.status} />
              </TableCell>

              {/* Location */}
              <TableCell>
                {asset.location ? (
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {asset.location}
                  </span>
                ) : (
                  <span className="text-slate-400 font-normal">-</span>
                )}
              </TableCell>

              {/*Cost */}
              <TableCell>
                {asset.purchaseCost}
              </TableCell>

              {/* Assigned To */}
              <TableCell className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
                {asset.assignedTo ? (
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {asset.assignedTo.name}
                  </span>
                ) : (
                  <span className="text-slate-400 font-normal">-</span>
                )}
              </TableCell>

              {/* Actions */}
              <TableCell className="text-right pr-6">
                <AssetRowActions asset={asset} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AssetTable;
