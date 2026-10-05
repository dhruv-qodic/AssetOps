import React from 'react';
import type { Asset } from '@/types/asset';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { useAssetStore } from '@/store/useAssetStore';
import {
  Laptop,
  Smartphone,
  Monitor,
  HardDrive,
  Keyboard,
  Box,
  QrCode,
  Calendar,
  MapPin,
  RefreshCw,
  UserMinus,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface ActiveAllocationsCardViewProps {
  allocations: Asset[];
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Laptop':
      return <Laptop className="size-5 text-blue-500" />;
    case 'Mobile':
      return <Smartphone className="size-5 text-cyan-500" />;
    case 'Monitor':
      return <Monitor className="size-5 text-indigo-500" />;
    case 'Desktop':
      return <HardDrive className="size-5 text-purple-500" />;
    case 'Accessories':
      return <Keyboard className="size-5 text-amber-500" />;
    default:
      return <Box className="size-5 text-slate-400" />;
  }
};

const getInitials = (name?: string): string => {
  if (!name) return 'UN';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getAvatarColor = (name?: string): string => {
  if (!name) return 'bg-slate-700 text-white';
  const colors = [
    'bg-blue-600 text-white',
    'bg-indigo-600 text-white',
    'bg-purple-600 text-white',
    'bg-emerald-600 text-white',
    'bg-teal-600 text-white',
    'bg-cyan-600 text-white',
    'bg-sky-600 text-white',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export const ActiveAllocationsCardView: React.FC<ActiveAllocationsCardViewProps> = ({
  allocations,
}) => {
  const employees = useEmployeeStore((s) => s.employees);
  const unassignAssetFromEmployee = useEmployeeStore((s) => s.unassignAssetFromEmployee);
  const openQrModal = useAssetStore((s) => s.openQrModal);
  const openAllocateModal = useAssetStore((s) => s.openAllocateModal);
  const deallocateAsset = useAssetStore((s) => s.deallocateAsset);

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

  const handleDeallocate = (asset: Asset) => {
    if (asset.assignedTo?.id) {
      unassignAssetFromEmployee(asset.assignedTo.id, asset.id);
    }
    deallocateAsset(asset.id);
    toast.success(`Asset "${asset.name}" returned/deallocated`);
  };

  return (
    <div
      data-testid="active-allocations-card-view"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
    >
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
        const employeeCode = assignedEmp?.employeeId || asset.assignedTo?.employeeId || 'EMP-100';
        const allocatedDate = formatDate(asset.assignedTo?.assignedDate || asset.createdAt);

        return (
          <Card
            key={asset.id}
            data-testid={`active-allocation-card-${asset.id}`}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 flex flex-col justify-between text-left p-0"
          >
            {/* Top Blue Accent Highlight */}
            <div className="h-1 bg-[#155DFC] w-full" />

            <CardContent className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
              {/* Header: Allocation ID & Status Pill */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200/60 dark:border-blue-900/50">
                  {allocationId}
                </span>

                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  Active
                </span>
              </div>

              {/* Asset Info */}
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 group-hover:scale-105 transition-transform">
                  {getCategoryIcon(asset.category)}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {asset.name}
                  </h4>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {asset.assetId} {asset.model ? `• ${asset.model}` : ''}
                  </p>
                </div>
              </div>

              {/* Employee Information (Initials-Only Avatar Fallback - No External Images) */}
              <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 flex items-center gap-3">
                <div
                  className={`size-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${getAvatarColor(
                    employeeName,
                  )} shadow-2xs`}
                >
                  {getInitials(employeeName)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {employeeName}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {employeeCode} • {department}
                  </p>
                </div>
              </div>

              {/* Metadata Details (Location + Allocated Date) */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="size-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{asset.location}</span>
                </div>
                <div className="flex items-center gap-1.5 justify-end truncate">
                  <Calendar className="size-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{allocatedDate}</span>
                </div>
              </div>

              {/* Quick Actions Footer */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => openQrModal(asset)}
                  className="flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                  title="View Asset QR Code & Details"
                >
                  <QrCode className="size-3.5" />
                  <span>QR Code</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openAllocateModal(asset)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
                    title="Reallocate Asset"
                  >
                    <RefreshCw className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeallocate(asset)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors cursor-pointer"
                    title="Deallocate / Return Hardware"
                  >
                    <UserMinus className="size-3.5" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ActiveAllocationsCardView;
