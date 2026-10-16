import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTranslation } from 'react-i18next';
import type { Asset } from '@/types/asset';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { AllocationRowActions } from './AllocationRowActions';
import { formatDate } from '@/utils/date';
import {
  getAllocationId,
  resolveAssignedEmployee,
  resolveEmployeeName,
  resolveDepartment,
} from '@/utils/allocation';
import { Layers } from 'lucide-react';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import {
  ALLOCATION_TABLE_STATES,
  ALLOCATION_TABLE_COLUMNS,
  ALLOCATION_STATUS_LABELS,
  ALLOCATION_TABLE_DEFAULTS,
} from './constants/AllocationTable.constants';

interface AllocationTableProps {
  allocations: Asset[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onClearFilters?: () => void;
  onNewAllocation?: () => void;
}

/**
 * @description: Renders a tabular data view of asset allocations with state handling for loading, error, and empty results
 * @param {Array<Asset>} allocations: Array of allocated asset records
 * @param {boolean} isLoading: Loading boolean
 * @param {string | null} error: Error message string or null
 * @param {() => void} onRetry: Retry callback
 * @param {() => void} onClearFilters: Clear filters callback
 * @param {() => void} onNewAllocation: Action callback to create new allocation
 * @return: Allocation table component JSX
 */
export const AllocationTable: React.FC<AllocationTableProps> = ({
  allocations,
  isLoading = false,
  error = null,
  onRetry,
  onClearFilters,
  onNewAllocation,
}) => {
  const { t: translateAllocations } = useTranslation('allocation');
  const { t: translateEmployees } = useTranslation('employee');
  const employees = useEmployeeStore((s) => s.employees);

  // 1. Loading State (with asset-related icon integrated into loader)
  if (isLoading) {
    return (
      <LoadingState
        icon={Layers}
        title={translateAllocations('loading.title', {
          defaultValue: ALLOCATION_TABLE_STATES.LOADING_TITLE,
        })}
        description={translateAllocations('loading.description', {
          defaultValue: ALLOCATION_TABLE_STATES.LOADING_DESC,
        })}
      />
    );
  }

  // 2. Error State
  if (error) {
    return (
      <ErrorState
        title={translateAllocations('error.title', {
          defaultValue: ALLOCATION_TABLE_STATES.ERROR_TITLE,
        })}
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
        title={translateAllocations('empty.title', {
          defaultValue: ALLOCATION_TABLE_STATES.EMPTY_TITLE,
        })}
        description={translateAllocations('empty.description', {
          defaultValue: ALLOCATION_TABLE_STATES.EMPTY_DESC,
        })}
        secondaryActionLabel={
          onClearFilters
            ? translateAllocations('filters.clearFilters', {
                defaultValue: ALLOCATION_TABLE_STATES.CLEAR_FILTERS_ACTION,
              })
            : undefined
        }
        onSecondaryAction={onClearFilters}
        actionLabel={
          onNewAllocation
            ? translateAllocations('newAllocationButton', {
                defaultValue: ALLOCATION_TABLE_STATES.NEW_ALLOCATION_ACTION,
              })
            : undefined
        }
        onAction={onNewAllocation}
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-slate-200/80 dark:border-slate-800 bg-transparent hover:bg-transparent">
            <TableHead className="w-[120px] font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm pl-4">
              {translateAllocations('columns.allocationId', {
                defaultValue: ALLOCATION_TABLE_COLUMNS.ALLOCATION_ID,
              })}
            </TableHead>
            <TableHead className="min-w-[150px] font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
              {translateAllocations('columns.asset', {
                defaultValue: ALLOCATION_TABLE_COLUMNS.ASSET,
              })}
            </TableHead>
            <TableHead className="min-w-[150px] font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
              {translateAllocations('columns.employee', {
                defaultValue: ALLOCATION_TABLE_COLUMNS.EMPLOYEE,
              })}
            </TableHead>
            <TableHead className="w-[130px] font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
              {translateAllocations('columns.department', {
                defaultValue: ALLOCATION_TABLE_COLUMNS.DEPARTMENT,
              })}
            </TableHead>
            <TableHead className="w-[110px] font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
              {translateAllocations('columns.status', {
                defaultValue: ALLOCATION_TABLE_COLUMNS.STATUS,
              })}
            </TableHead>
            <TableHead className="w-[130px] font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
              {translateAllocations('columns.allocatedDate', {
                defaultValue: ALLOCATION_TABLE_COLUMNS.ALLOCATED_ON,
              })}
            </TableHead>
            <TableHead className="w-[70px] text-right font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm pr-4">
              {translateAllocations('columns.actions', {
                defaultValue: ALLOCATION_TABLE_COLUMNS.ACTIONS,
              })}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {allocations.map((asset, idx) => {
            const allocationId = getAllocationId(asset, idx);
            const assignedEmp = resolveAssignedEmployee(asset, employees);
            const employeeName = resolveEmployeeName(
              asset,
              assignedEmp,
              ALLOCATION_TABLE_DEFAULTS.EMPLOYEE,
            );
            const department = resolveDepartment(
              asset,
              assignedEmp,
              ALLOCATION_TABLE_DEFAULTS.DEPARTMENT,
            );
            const allocatedDate = formatDate(
              asset.assignedTo?.assignedDate || asset.createdAt,
              ALLOCATION_TABLE_DEFAULTS.DATE,
            );

            // Dynamically determine status based on live employee status
            const getStatusBadge = () => {
              if (asset.status === 'Available' || !asset.assignedTo) {
                return (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                    {translateAllocations('statuses.Returned', {
                      defaultValue: ALLOCATION_STATUS_LABELS.RETURNED,
                    })}
                  </span>
                );
              }

              if (asset.status === 'Maintenance') {
                return (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                    {translateAllocations('statuses.Maintenance', {
                      defaultValue: ALLOCATION_STATUS_LABELS.MAINTENANCE,
                    })}
                  </span>
                );
              }

              if (asset.status === 'Retired') {
                return (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {translateAllocations('statuses.Retired', {
                      defaultValue: ALLOCATION_STATUS_LABELS.RETIRED,
                    })}
                  </span>
                );
              }

              // When asset is allocated, check the assigned employee's live status
              const empStatus = assignedEmp?.status.toLowerCase();
              if (empStatus === 'inactive') {
                return (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                    {translateAllocations('statuses.Inactive', {
                      defaultValue: ALLOCATION_STATUS_LABELS.INACTIVE,
                    })}
                  </span>
                );
              }

              if (empStatus === 'terminated') {
                return (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-950/60 dark:text-red-300">
                    {translateAllocations('statuses.Terminated', {
                      defaultValue: ALLOCATION_STATUS_LABELS.TERMINATED,
                    })}
                  </span>
                );
              }

              if (empStatus === 'on-leave') {
                return (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                    {translateAllocations('statuses.OnLeave', {
                      defaultValue: ALLOCATION_STATUS_LABELS.ON_LEAVE,
                    })}
                  </span>
                );
              }

              return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                  {translateAllocations('statuses.Active', {
                    defaultValue: ALLOCATION_STATUS_LABELS.ACTIVE,
                  })}
                </span>
              );
            };

            const displayEmployeeName =
              !asset.assignedTo ||
              employeeName === ALLOCATION_TABLE_DEFAULTS.EMPLOYEE ||
              employeeName === 'Unassigned'
                ? translateAllocations('table.unassigned', {
                    defaultValue: ALLOCATION_TABLE_DEFAULTS.EMPLOYEE,
                  })
                : employeeName;

            const displayDepartment =
              department && department !== ALLOCATION_TABLE_DEFAULTS.DEPARTMENT
                ? translateEmployees(`departments.${department}`, {
                    defaultValue: department,
                  })
                : department;

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
                  {displayEmployeeName}
                </TableCell>

                {/* Department */}
                <TableCell className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
                  {displayDepartment}
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
