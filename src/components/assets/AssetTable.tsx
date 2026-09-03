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
import { PackageSearch } from 'lucide-react';

interface AssetTableProps {
  assets: Asset[];
}

export const AssetTable: React.FC<AssetTableProps> = ({ assets }) => {
  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-[#4C40F7] mb-3">
          <PackageSearch className="size-7" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
          No assets found
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1">
          No assets match your active search or filter criteria. Try clearing
          filters or add a new asset.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-slate-200/80 dark:border-slate-800 bg-[#F8FAFC]/90 dark:bg-slate-900/80">
            <TableHead className="w-[120px] pl-6 font-bold text-slate-700 dark:text-slate-300">
              Asset ID
            </TableHead>
            <TableHead className="min-w-[200px] font-bold text-slate-700 dark:text-slate-300">
              Name
            </TableHead>
            <TableHead className="w-[140px] font-bold text-slate-700 dark:text-slate-300">
              Category
            </TableHead>
            <TableHead className="w-[130px] font-bold text-slate-700 dark:text-slate-300">
              Status
            </TableHead>
            <TableHead className="min-w-[150px] font-bold text-slate-700 dark:text-slate-300">
              Assigned To
            </TableHead>
            <TableHead className="w-[80px] text-right pr-6 font-bold text-slate-700 dark:text-slate-300">
              Actions
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
