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
import { Laptop, Smartphone, Monitor, HardDrive, Keyboard, Box } from 'lucide-react';

interface ActiveAllocationsListViewProps {
  allocations: Asset[];
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Laptop':
      return <Laptop className="size-4 text-blue-500" />;
    case 'Mobile':
      return <Smartphone className="size-4 text-cyan-500" />;
    case 'Monitor':
      return <Monitor className="size-4 text-indigo-500" />;
    case 'Desktop':
      return <HardDrive className="size-4 text-purple-500" />;
    case 'Accessories':
      return <Keyboard className="size-4 text-amber-500" />;
    default:
      return <Box className="size-4 text-slate-400" />;
  }
};

const getInitials = (name?: string): string => {
  if (!name) return 'UN';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const ActiveAllocationsListView: React.FC<ActiveAllocationsListViewProps> = ({
  allocations,
}) => {
  const employees = useEmployeeStore((s) => s.employees);

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
    <div className="overflow-x-auto select-none" data-testid="active-allocations-list-view">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-slate-200/80 dark:border-slate-800 bg-transparent hover:bg-transparent">
            <TableHead className="w-[120px] font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm pl-4">
              Allocation ID
            </TableHead>
            <TableHead className="min-w-[170px] font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
              Asset
            </TableHead>
            <TableHead className="min-w-[170px] font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
              Assigned Employee
            </TableHead>
            <TableHead className="w-[130px] font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
              Department
            </TableHead>
            <TableHead className="w-[130px] font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
              Location
            </TableHead>
            <TableHead className="w-[110px] font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
              Status
            </TableHead>
            <TableHead className="w-[120px] font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
              Allocated Date
            </TableHead>
            <TableHead className="w-[70px] text-right font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm pr-4">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {allocations.map((asset, idx) => {
            const allocationId = getAllocationId(asset, idx);

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
              : asset.assignedTo?.name || 'Unassigned Staff';

            const department = assignedEmp?.department || asset.assignedTo?.department || 'IT';
            const employeeCode =
              assignedEmp?.employeeId || asset.assignedTo?.employeeId || 'EMP-100';
            const allocatedDate = formatDate(asset.assignedTo?.assignedDate || asset.createdAt);

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
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                      {getCategoryIcon(asset.category)}
                    </div>
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
                      className={`size-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-blue-600 text-white shadow-2xs`}
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
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium">
                    {department}
                  </span>
                </TableCell>

                {/* Location */}
                <TableCell className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
                  {asset.location}
                </TableCell>

                {/* Status Badge */}
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50">
                    <span className="size-1.5 rounded-full bg-emerald-500 mr-1.5" />
                    Active
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

export default ActiveAllocationsListView;
//jiyare dashboard load thai tiyare widget unnecessarily chunks are not downloaded  during dashboaed loading
