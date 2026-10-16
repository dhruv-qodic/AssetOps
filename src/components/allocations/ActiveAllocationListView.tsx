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
import { AllocationRowActions } from '@/components/allocations/AllocationRowActions';
import { AssetDeviceIcon } from '@/components/assets/AssetDeviceIcon';
import {
  ACTIVE_ALLOCATION_LIST_COLUMNS,
  ACTIVE_ALLOCATION_LIST_DEFAULTS,
} from './constants/ActiveAllocationListView.constants';
import { formatDate } from '@/utils/date';
import { getInitials } from '@/utils/string';
import {
  getAllocationId,
  resolveAssignedEmployee,
  resolveEmployeeName,
  resolveDepartment,
  resolveEmployeeCode,
} from '@/utils/allocation';

import { useTranslation } from 'react-i18next';

export interface ActiveAllocationsListViewProps {
  allocations: Asset[];
}

/**
 * @description: Renders a dense tabular list view of currently active asset allocations
 * @param {allocations: Asset[]}: Array of allocated assets
 * @return: Active allocations list view table JSX
 */
export const ActiveAllocationListView: React.FC<ActiveAllocationsListViewProps> = ({
  allocations,
}) => {
  const { t: translateAllocations } = useTranslation('allocation');
  const { t: translateEmployees } = useTranslation('employee');
  const { t: translateAssets } = useTranslation('asset');
  const employees = useEmployeeStore((s) => s.employees);

  return (
    <div className="overflow-x-auto select-none" data-testid="active-allocations-list-view">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-slate-200/80 dark:border-slate-800 bg-transparent hover:bg-transparent">
            <TableHead className="w-[120px] font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm pl-4">
              {translateAllocations('columns.allocationId', {
                defaultValue: ACTIVE_ALLOCATION_LIST_COLUMNS.ALLOCATION_ID,
              })}
            </TableHead>
            <TableHead className="min-w-[170px] font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
              {translateAllocations('columns.asset', {
                defaultValue: ACTIVE_ALLOCATION_LIST_COLUMNS.ASSET,
              })}
            </TableHead>
            <TableHead className="min-w-[170px] font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
              {translateAllocations('columns.assignedEmployee', {
                defaultValue: ACTIVE_ALLOCATION_LIST_COLUMNS.ASSIGNED_EMPLOYEE,
              })}
            </TableHead>
            <TableHead className="w-[130px] font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
              {translateAllocations('columns.department', {
                defaultValue: ACTIVE_ALLOCATION_LIST_COLUMNS.DEPARTMENT,
              })}
            </TableHead>
            <TableHead className="w-[130px] font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
              {translateAllocations('columns.location', {
                defaultValue: ACTIVE_ALLOCATION_LIST_COLUMNS.LOCATION,
              })}
            </TableHead>
            <TableHead className="w-[110px] font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
              {translateAllocations('columns.status', {
                defaultValue: ACTIVE_ALLOCATION_LIST_COLUMNS.STATUS,
              })}
            </TableHead>
            <TableHead className="w-[120px] font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
              {translateAllocations('columns.allocatedDate', {
                defaultValue: ACTIVE_ALLOCATION_LIST_COLUMNS.ALLOCATED_DATE,
              })}
            </TableHead>
            <TableHead className="w-[70px] text-right font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm pr-4">
              {translateAllocations('columns.actions', {
                defaultValue: ACTIVE_ALLOCATION_LIST_COLUMNS.ACTIONS,
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
              ACTIVE_ALLOCATION_LIST_DEFAULTS.EMPLOYEE_NAME,
            );
            const department = resolveDepartment(
              asset,
              assignedEmp,
              ACTIVE_ALLOCATION_LIST_DEFAULTS.DEPARTMENT,
            );
            const employeeCode = resolveEmployeeCode(
              asset,
              assignedEmp,
              ACTIVE_ALLOCATION_LIST_DEFAULTS.EMPLOYEE_CODE,
            );
            const allocatedDate = formatDate(
              asset.assignedTo?.assignedDate || asset.createdAt,
              ACTIVE_ALLOCATION_LIST_DEFAULTS.DATE,
            );

            return (
              <TableRow
                key={asset.id}
                className="group hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors border-b border-slate-100 dark:border-slate-800/60"
              >
                {/* Allocation ID */}
                <TableCell className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm pl-4">
                  <span className="font-medium text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                    {allocationId}
                  </span>
                </TableCell>

                {/* Asset Name & Tag */}
                <TableCell className="text-xs sm:text-sm">
                  <div className="flex items-center gap-2.5">
                    <AssetDeviceIcon category={asset.category} name={asset.name} />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{asset.name}</p>
                      <span className="text-[11px] text-slate-400">
                        {asset.assetId} {asset.model ? `• ${asset.model}` : ''}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* Assigned Employee with Initials Fallback (No External Avatars) */}
                <TableCell className="text-xs sm:text-sm">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`size-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-primary text-primary-foreground shadow-2xs`}
                    >
                      {getInitials(employeeName)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {employeeName}
                      </p>
                      <span className="text-[11px] text-slate-400">{employeeCode}</span>
                    </div>
                  </div>
                </TableCell>

                {/* Department */}
                <TableCell className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium">
                    {translateEmployees(`departments.${department}`, { defaultValue: department })}
                  </span>
                </TableCell>

                {/* Location */}
                <TableCell className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
                  {translateAssets(`locations.${asset.location}`, { defaultValue: asset.location })}
                </TableCell>

                {/* Status Badge */}
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50">
                    <span className="size-1.5 rounded-full bg-emerald-500 mr-1.5" />
                    {translateAllocations('statuses.Active', {
                      defaultValue: ACTIVE_ALLOCATION_LIST_DEFAULTS.STATUS_ACTIVE,
                    })}
                  </span>
                </TableCell>

                {/* Allocated Date */}
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

export const ActiveAllocationsListView = ActiveAllocationListView;
export default ActiveAllocationListView;
