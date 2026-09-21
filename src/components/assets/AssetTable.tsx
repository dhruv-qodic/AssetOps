import React, { useMemo } from 'react';
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
import { Columns3, DollarSign, MapPin, Package, PackageSearch } from 'lucide-react';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import { cn } from '@/lib/utils';
import { AVAILABLE_ASSET_COLUMNS, type ColumnDefinition } from '@/constans/asset.constants';
import { useColumnVisibilityStore } from '@/store/useColumnVisibilityStore';

interface AssetTableProps {
  assets: Asset[];
  isLoading?: boolean;
  isPending?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onClearFilters?: () => void;
  onAddAsset?: () => void;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

const getHeaderClasses = (id: string, index: number, total: number) => {
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const alignRight = id === 'actions';

  return cn(
    'font-bold text-slate-700 dark:text-slate-300 text-xs sm:text-sm cursor-pointer select-none transition-colors hover:text-rose-600 dark:hover:text-rose-400 group',
    isFirst && 'pl-6',
    isLast && 'pr-6',
    alignRight && 'text-right',
    id === 'assetId' && 'w-[120px]',
    id === 'name' && 'min-w-[200px]',
    id === 'category' && 'w-[130px]',
    id === 'status' && 'w-[130px]',
    id === 'location' && 'w-[130px]',
    id === 'purchaseCost' && 'w-[120px]',
    id === 'assignedTo' && 'min-w-[150px]',
    id === 'serialNumber' && 'w-[140px]',
    id === 'model' && 'w-[140px]',
    id === 'purchaseDate' && 'w-[130px]',
    id === 'warrantyExpiry' && 'w-[130px]',
    id === 'department' && 'w-[130px]',
    id === 'specifications' && 'min-w-[160px]',
    id === 'notes' && 'min-w-[160px]',
    id === 'createdAt' && 'w-[130px]',
    id === 'updatedAt' && 'w-[130px]',
    id === 'actions' && 'w-[80px]',
  );
};

const getCellClasses = (id: string, index: number, total: number) => {
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const alignRight = id === 'actions';

  return cn(isFirst && 'pl-6', isLast && 'pr-6', alignRight && 'text-right');
};

export const AssetTable: React.FC<AssetTableProps> = ({
  assets,
  isLoading = false,
  isPending = false,
  error = null,
  onRetry,
  onClearFilters,
  onAddAsset,
}) => {
  const { visibleColumnIds, removeColumn } = useColumnVisibilityStore();

  const visibleColumns = useMemo(() => {
    return visibleColumnIds
      .map((id) => AVAILABLE_ASSET_COLUMNS.find((col) => col.id === id))
      .filter((col): col is ColumnDefinition => Boolean(col));
  }, [visibleColumnIds]);

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
    return <ErrorState title="Failed to load assets" message={error} onRetry={onRetry} />;
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

  // Helper to render individual cell content for any column
  const renderCellContent = (colId: string, asset: Asset) => {
    switch (colId) {
      case 'assetId':
        return (
          <span className="font-medium text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
            {asset.assetId}
          </span>
        );

      case 'name':
        return (
          <div className="flex items-center gap-3">
            <AssetDeviceIcon category={asset.category} name={asset.name} />
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
        );

      case 'category':
        return (
          <span className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
            {asset.category}
          </span>
        );

      case 'status':
        return <AssetStatusBadge status={asset.status} />;

      case 'location':
        return asset.location ? (
          <span className="font-medium text-slate-800 dark:text-slate-200 flex gap-2 items-center text-xs sm:text-sm">
            <MapPin className="size-3.5 text-slate-400 shrink-0" />
            {asset.location}
          </span>
        ) : (
          <span className="text-slate-400 font-normal">-</span>
        );

      case 'purchaseCost':
        return asset.purchaseCost != null ? (
          <span className="font-medium text-slate-800 dark:text-slate-200 flex gap-2 items-center text-xs sm:text-sm">
            <DollarSign className="size-3.5 text-slate-400 shrink-0" />
            {asset.purchaseCost}
          </span>
        ) : (
          <span className="text-slate-400 font-normal">-</span>
        );

      case 'assignedTo':
        return asset.assignedTo ? (
          <span className="font-medium text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
            {asset.assignedTo.name}
          </span>
        ) : (
          <span className="text-slate-400 font-normal">-</span>
        );

      case 'serialNumber':
        return (
          <span className="font-mono text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
            {asset.serialNumber || '-'}
          </span>
        );

      case 'model':
        return (
          <span className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
            {asset.model || '-'}
          </span>
        );

      case 'purchaseDate':
        return (
          <span className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm whitespace-nowrap">
            {formatDate(asset.purchaseDate)}
          </span>
        );

      case 'warrantyExpiry':
        return (
          <span className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm whitespace-nowrap">
            {formatDate(asset.warrantyExpiry)}
          </span>
        );

      case 'department':
        return (
          <span className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
            {asset.assignedTo?.department || '-'}
          </span>
        );

      case 'specifications': {
        const specs = asset.specifications;
        if (specs && Object.keys(specs).length > 0) {
          const specString = Object.entries(specs)
            .map(([k, v]) => `${k}: ${v}`)
            .join(', ');
          return (
            <span
              className="text-slate-600 dark:text-slate-300 text-xs truncate max-w-[200px] inline-block"
              title={specString}
            >
              {specString}
            </span>
          );
        }
        return <span className="text-slate-400 font-normal">-</span>;
      }

      case 'notes':
        return asset.notes ? (
          <span
            className="text-slate-600 dark:text-slate-300 text-xs truncate max-w-[180px] inline-block"
            title={asset.notes}
          >
            {asset.notes}
          </span>
        ) : (
          <span className="text-slate-400 font-normal">-</span>
        );

      case 'createdAt':
        return (
          <span className="text-slate-600 dark:text-slate-400 text-xs whitespace-nowrap">
            {formatDate(asset.createdAt)}
          </span>
        );

      case 'updatedAt':
        return (
          <span className="text-slate-600 dark:text-slate-400 text-xs whitespace-nowrap">
            {formatDate(asset.updatedAt)}
          </span>
        );

      case 'actions':
        return <AssetRowActions asset={asset} />;

      default:
        return <span className="text-slate-400 font-normal">-</span>;
    }
  };

  return (
    <div
      className={cn('overflow-x-auto transition-opacity duration-150', isPending && 'opacity-65')}
    >
      <Table>
        <TableHeader>
          <TableRow className="border-b border-slate-200/80 dark:border-slate-800 bg-[#F8FAFC]/90 dark:bg-slate-900/80">
            {visibleColumns.map((col, idx) => (
              <TableHead
                key={col.id}
                onClick={() => removeColumn(col.id)}
                className={getHeaderClasses(col.id, idx, visibleColumns.length)}
                title={`Click to hide "${col.label}" column`}
              >
                <span>{col.label.toUpperCase()}</span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {visibleColumns.length === 0 ? (
            <TableRow>
              <TableCell colSpan={1} className="py-12 text-center text-slate-500">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Columns3 className="size-6 text-slate-400" />
                  <p className="text-sm font-medium">No columns currently visible.</p>
                  <p className="text-xs text-slate-400">
                    Use the Column Visibility button above to select columns to display.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            assets.map((asset) => (
              <TableRow
                key={asset.id}
                className="group hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
              >
                {visibleColumns.map((col, idx) => (
                  <TableCell
                    key={col.id}
                    className={getCellClasses(col.id, idx, visibleColumns.length)}
                  >
                    {renderCellContent(col.id, asset)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AssetTable;
