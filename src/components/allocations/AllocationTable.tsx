import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Asset } from '@/types/asset';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { AllocationRowActions } from './AllocationRowActions';
import { Layers } from 'lucide-react';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';

interface AllocationTableProps {
  allocations: Asset[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onClearFilters?: () => void;
  onNewAllocation?: () => void;
}

export const AllocationTable: React.FC<AllocationTableProps> = ({
  allocations,
  isLoading = false,
  error = null,
  onRetry,
  onClearFilters,
  onNewAllocation,
}) => {
  const { employees } = useEmployeeStore();

  // 1. Loading State (with asset-related icon integrated into loader)
  if (isLoading) {
    return (
      <LoadingState
        icon={Layers}
        title="Loading asset allocations..."
        description="Please wait while we retrieve allocation mappings."
      />
    );
  }

  // 2. Error State
  if (error) {
    return (
      <ErrorState
        title="Failed to load allocations"
        message={error}
        onRetry={onRetry}
      />
    );
  }

  // 3. Empty State
  if (allocations.length === 0) {
    return (
      <EmptyState
        icon={Layers}
        title="No allocations found"
        description="No asset allocations match your filter or search criteria. Try adjusting your filters or create a new allocation."
        secondaryActionLabel={onClearFilters ? "Clear filters" : undefined}
        onSecondaryAction={onClearFilters}
        actionLabel={onNewAllocation ? "New Allocation" : undefined}
        onAction={onNewAllocation}
      />
    );
  }

  // 4. Success State (Data Table)

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'May 10, 2024';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const getAllocationId = (asset: Asset, index: number) => {
    if (asset.assetId) {
      const numOnly = asset.assetId.replace(/\D/g, '');
      if (numOnly) return `AL${numOnly}`;
      return `AL${asset.assetId.replace('A', '')}`;
    }
    return `AL${1001 + index}`;
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-slate-200/80 dark:border-slate-800 bg-transparent hover:bg-transparent">
            <TableHead className="w-[120px] font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm pl-4">
              Allocation ID
            </TableHead>
            <TableHead className="min-w-[150px] font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
              Asset
            </TableHead>
            <TableHead className="min-w-[150px] font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
              Employee
            </TableHead>
            <TableHead className="w-[130px] font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
              Department
            </TableHead>
            <TableHead className="w-[110px] font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
              Status
            </TableHead>
            <TableHead className="w-[130px] font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
              Allocated On
            </TableHead>
            <TableHead className="w-[70px] text-right font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm pr-4">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {allocations.map((asset, idx) => {
            const allocationId = getAllocationId(asset, idx);

            // Find matching assigned employee in live employee store
            const assignedEmp = employees.find(
              (e) =>
                (asset.assignedTo?.id && e.id === asset.assignedTo.id) ||
                (asset.assignedTo?.employeeId && e.employeeId === asset.assignedTo.employeeId) ||
                (asset.assignedTo?.name &&
                  `${e.firstName} ${e.lastName}`.trim().toLowerCase() ===
                    asset.assignedTo.name.trim().toLowerCase()),
            );

            const employeeName = assignedEmp
              ? `${assignedEmp.firstName} ${assignedEmp.lastName}`.trim()
              : asset.assignedTo?.name || 'Unassigned';

            const department = assignedEmp?.department || asset.assignedTo?.department || 'IT';
            const allocatedDate = formatDate(asset.assignedTo?.assignedDate || asset.createdAt);

            // Dynamically determine status based on live employee status
            const getStatusBadge = () => {
              if (asset.status === 'Available' || !asset.assignedTo) {
                return (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                    Returned
                  </span>
                );
              }

              if (asset.status === 'Maintenance') {
                return (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                    Maintenance
                  </span>
                );
              }

              if (asset.status === 'Retired') {
                return (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    Retired
                  </span>
                );
              }

              // When asset is allocated, check the assigned employee's live status
              const empStatus = assignedEmp?.status.toLowerCase();
              if (empStatus === 'inactive') {
                return (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                    Inactive
                  </span>
                );
              }

              if (empStatus === 'terminated') {
                return (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-950/60 dark:text-red-300">
                    Terminated
                  </span>
                );
              }

              if (empStatus === 'on-leave') {
                return (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                    On Leave
                  </span>
                );
              }

              return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Active
                </span>
              );
            };

            return (
              <TableRow
                key={asset.id}
                className="group hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors border-b border-slate-100 dark:border-slate-800/60"
              >
                {/* Allocation ID */}
                <TableCell className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm pl-4">
                  {allocationId}
                </TableCell>

                {/* Asset */}
                <TableCell className="font-medium text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                  {asset.name}
                </TableCell>

                {/* Employee */}
                <TableCell className="font-medium text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                  {employeeName}
                </TableCell>

                {/* Department */}
                <TableCell className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
                  {department}
                </TableCell>

                {/* Status Badge (Synced with Employee Status) */}
                <TableCell>{getStatusBadge()}</TableCell>

                {/* Allocated On */}
                <TableCell className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm whitespace-nowrap">
                  {allocatedDate}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right pr-4">
                  <AllocationRowActions asset={asset} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default AllocationTable;
