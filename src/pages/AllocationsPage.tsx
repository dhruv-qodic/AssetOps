import { useState } from 'react';
import { useAssetStore } from '@/store/useAssetStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AssetDeviceIcon from '@/components/assets/AssetDeviceIcon';
import AllocateAssetModal from '@/components/assets/AllocateAssetModal';
import {
  Layers,
  Search,
  UserCheck,
  UserMinus,
  Plus,
  Box,
  Building2,
  Calendar,
  Laptop,
} from 'lucide-react';

export function AllocationsPage() {
  const { assets, openAllocateModal, deallocateAsset } = useAssetStore();
  const { employees, unassignAssetFromEmployee } = useEmployeeStore();
  const [search, setSearch] = useState('');

  // Filter allocated assets
  const allocatedAssets = assets.filter(
    (a) => a.status === 'Allocated' && a.assignedTo !== null
  );

  const availableAssetsCount = assets.filter((a) => a.status === 'Available').length;

  const filteredAllocations = allocatedAssets.filter((asset) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const matchAsset =
      asset.name.toLowerCase().includes(q) ||
      asset.assetId.toLowerCase().includes(q) ||
      asset.category.toLowerCase().includes(q);
    const matchEmp =
      asset.assignedTo?.name.toLowerCase().includes(q) ||
      asset.assignedTo?.employeeId?.toLowerCase().includes(q) ||
      asset.assignedTo?.department?.toLowerCase().includes(q);

    return matchAsset || matchEmp;
  });

  const handleDeallocate = (assetId: string, empId?: string) => {
    if (empId) {
      unassignAssetFromEmployee(empId, assetId);
    }
    deallocateAsset(assetId);
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-5 max-w-7xl mx-auto w-full text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="size-6 text-[#4C40F7]" />
            <span>Asset Allocations</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Track and manage hardware assignments across all team members.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => {
            const availableAsset = assets.find((a) => a.status === 'Available');
            if (availableAsset) {
              openAllocateModal(availableAsset);
            } else if (assets.length > 0) {
              openAllocateModal(assets[0]);
            }
          }}
          className="h-9.5 px-4 bg-[#4C40F7] hover:bg-[#3D31E5] text-white text-xs sm:text-sm font-medium rounded-md shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
        >
          <Plus className="size-4 stroke-[2.5]" />
          <span>New Allocation</span>
        </Button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Total Allocations
            </p>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {allocatedAssets.length}
            </div>
            <p className="text-[11px] text-slate-400">Currently assigned hardware</p>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-[#4C40F7]">
            <UserCheck className="size-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Available for Assignment
            </p>
            <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {availableAssetsCount}
            </div>
            <p className="text-[11px] text-slate-400">Ready in inventory</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
            <Box className="size-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Total Employees
            </p>
            <div className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">
              {employees.length}
            </div>
            <p className="text-[11px] text-slate-400">Staff directory members</p>
          </div>
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600">
            <Building2 className="size-6" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter allocations by asset, employee, ID, or department..."
            className="pl-9 h-9.5 text-xs sm:text-sm rounded-xl"
          />
        </div>
      </div>

      {/* Allocations Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Asset Info</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Assigned To</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Assigned Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAllocations.length > 0 ? (
                filteredAllocations.map((asset) => (
                  <tr
                    key={asset.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Asset Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <AssetDeviceIcon category={asset.category} />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">
                            {asset.name}
                          </div>
                          <div className="text-[11px] font-mono text-slate-400">
                            {asset.assetId} • {asset.serialNumber}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 font-medium text-slate-600 dark:text-slate-300">
                      {asset.category}
                    </td>

                    {/* Assigned Employee */}
                    <td className="py-3.5 px-4">
                      {asset.assignedTo ? (
                        <div className="flex items-center gap-2.5">
                          {asset.assignedTo.avatar ? (
                            <img
                              src={asset.assignedTo.avatar}
                              alt={asset.assignedTo.name}
                              className="size-8 rounded-full object-cover shrink-0"
                            />
                          ) : (
                            <div className="size-8 rounded-full bg-[#4C40F7]/10 text-[#4C40F7] font-bold text-xs flex items-center justify-center shrink-0">
                              {asset.assignedTo.name?.[0]}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">
                              {asset.assignedTo.name}
                            </div>
                            <div className="text-[11px] font-mono text-slate-400">
                              {asset.assignedTo.employeeId || 'Staff'}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>

                    {/* Department */}
                    <td className="py-3.5 px-4 font-medium text-slate-600 dark:text-slate-300">
                      {asset.assignedTo?.department || '—'}
                    </td>

                    {/* Assigned Date */}
                    <td className="py-3.5 px-4 font-medium text-slate-600 dark:text-slate-300">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="size-3.5 text-slate-400" />
                        {asset.assignedTo?.assignedDate || asset.updatedAt.split('T')[0]}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeallocate(asset.id, asset.assignedTo?.id)}
                        className="h-8 text-xs text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 border-amber-200 dark:border-amber-900 cursor-pointer"
                      >
                        <UserMinus className="size-3.5 mr-1" />
                        <span>Deallocate</span>
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    <Laptop className="size-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-medium">No active asset allocations found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AllocateAssetModal />
    </div>
  );
}

export default AllocationsPage;