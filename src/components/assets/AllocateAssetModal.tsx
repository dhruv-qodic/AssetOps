import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAssetStore } from '@/store/useAssetStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { AssetDeviceIcon } from './AssetDeviceIcon';
import type { Employee } from '@/types/employee';
import type { AssignedEmployee } from '@/types/asset';
import {
  UserPlus,
  Search,
  Check,
  Building2,
  MapPin,
  UserCheck,
  PackageCheck,
  ArrowRight,
} from 'lucide-react';

export const AllocateAssetModal: React.FC = () => {
  const isAllocateModalOpen = useAssetStore((s) => s.isAllocateModalOpen);
  const selectedAsset = useAssetStore((s) => s.selectedAsset);
  const assets = useAssetStore((s) => s.assets);
  const closeModals = useAssetStore((s) => s.closeModals);
  const allocateAsset = useAssetStore((s) => s.allocateAsset);

  const employees = useEmployeeStore((s) => s.employees);
  const assignAssetToEmployee = useEmployeeStore((s) => s.assignAssetToEmployee);
  const unassignAssetFromEmployee = useEmployeeStore((s) => s.unassignAssetFromEmployee);

  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [assetSearchQuery, setAssetSearchQuery] = useState('');
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [empSearchQuery, setEmpSearchQuery] = useState('');

  // 1. Filter all assets whose status is 'Available'
  const availableAssets = useMemo(() => {
    const list = assets.filter((a) => a.status === 'Available');
    // If a specific asset was passed to the modal and is not already in the available list, include it
    if (selectedAsset && !list.some((a) => a.id === selectedAsset.id)) {
      return [selectedAsset, ...list];
    }
    return list;
  }, [assets, selectedAsset]);

  // Reset/Initialize state on modal open
  useEffect(() => {
    if (isAllocateModalOpen) {
      setAssetSearchQuery('');
      setEmpSearchQuery('');
      setSelectedEmp(null);

      if (selectedAsset) {
        setSelectedAssetId(selectedAsset.id);
      } else if (availableAssets.length > 0) {
        setSelectedAssetId(availableAssets[0].id);
      } else {
        setSelectedAssetId(null);
      }
    }
  }, [isAllocateModalOpen, selectedAsset, availableAssets]);

  // 2. Filter available assets by search query
  const filteredAvailableAssets = useMemo(() => {
    if (!assetSearchQuery.trim()) return availableAssets;
    const q = assetSearchQuery.toLowerCase().trim();
    return availableAssets.filter((asset) => {
      return (
        asset.name.toLowerCase().includes(q) ||
        asset.assetId.toLowerCase().includes(q) ||
        asset.category.toLowerCase().includes(q) ||
        (asset.model && asset.model.toLowerCase().includes(q)) ||
        (asset.location && asset.location.toLowerCase().includes(q)) ||
        (asset.serialNumber && asset.serialNumber.toLowerCase().includes(q))
      );
    });
  }, [availableAssets, assetSearchQuery]);

  // 3. Filter employees by search query
  const filteredEmployees = useMemo(() => {
    if (!empSearchQuery.trim()) return employees;
    const q = empSearchQuery.toLowerCase().trim();
    return employees.filter((emp) => {
      const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
      return (
        fullName.includes(q) ||
        emp.employeeId.toLowerCase().includes(q) ||
        emp.department.toLowerCase().includes(q) ||
        emp.position.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q)
      );
    });
  }, [employees, empSearchQuery]);

  const targetAsset = useMemo(() => {
    return assets.find((a) => a.id === selectedAssetId) || null;
  }, [assets, selectedAssetId]);

  const handleAllocate = () => {
    if (!targetAsset || !selectedEmp) return;

    // If this asset was previously assigned to another employee, unassign it first
    if (targetAsset.assignedTo?.id && targetAsset.assignedTo.id !== selectedEmp.id) {
      unassignAssetFromEmployee(targetAsset.assignedTo.id, targetAsset.id);
    }

    const assignedDate = new Date().toISOString().split('T')[0];
    const assignedEmployeeData: AssignedEmployee = {
      id: selectedEmp.id,
      name: `${selectedEmp.firstName} ${selectedEmp.lastName}`.trim(),
      employeeId: selectedEmp.employeeId,
      email: selectedEmp.email,
      avatar: selectedEmp.avatar,
      department: selectedEmp.department,
      position: selectedEmp.position,
      assignedDate,
    };

    // Synchronize across both Asset and Employee stores
    allocateAsset(targetAsset.id, assignedEmployeeData);
    assignAssetToEmployee(selectedEmp.id, targetAsset.id);

    closeModals();
  };

  return (
    <Dialog open={isAllocateModalOpen} onOpenChange={closeModals}>
      <DialogContent
        onClose={closeModals}
        className="max-w-4xl lg:max-w-5xl w-full max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 border border-emerald-100 dark:border-emerald-900/50 shadow-2xs">
              <UserPlus className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                Allocate Asset to Employee
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Select an available organization asset on the left and assign it to an employee on the right.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2 text-left">
          {/* Side-by-Side 2-Column Grid with Center Divider */}
          <div className="flex flex-col md:flex-row gap-6 items-stretch">
            {/* Left Column: Available Assets List */}
            <div className="flex-1 min-w-0 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <PackageCheck className="size-3.5 text-[#4C40F7]" />
                  <span>Available Assets</span>
                  <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {availableAssets.length} Available
                </span>
              </div>

              {/* Asset Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <Input
                  value={assetSearchQuery}
                  onChange={(e) => setAssetSearchQuery(e.target.value)}
                  placeholder="Search available assets by name, ID, category, or location..."
                  className="pl-9 h-9 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900"
                />
              </div>

              {/* Available Assets Scrollable List */}
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {filteredAvailableAssets.length > 0 ? (
                  filteredAvailableAssets.map((asset) => {
                    const isSelected = selectedAssetId === asset.id;
                    return (
                      <div
                        key={asset.id}
                        onClick={() => setSelectedAssetId(asset.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-[#4C40F7] bg-indigo-50/70 dark:bg-indigo-950/50 shadow-2xs ring-1 ring-[#4C40F7]'
                            : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <AssetDeviceIcon category={asset.category} name={asset.name} />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                                {asset.name}
                              </span>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                {asset.assetId}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate flex items-center gap-1.5 mt-0.5">
                              <span>{asset.category}</span>
                              {asset.location && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-0.5">
                                    <MapPin className="size-3 text-slate-400" />
                                    {asset.location}
                                  </span>
                                </>
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            {asset.status}
                          </span>
                          <div
                            className={`size-5 rounded-full border flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'bg-[#4C40F7] border-[#4C40F7] text-white'
                                : 'border-slate-300 dark:border-slate-700 bg-transparent'
                            }`}
                          >
                            {isSelected && <Check className="size-3 stroke-[3]" />}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                    {availableAssets.length === 0
                      ? 'No available assets found to allocate.'
                      : 'No matching available assets found.'}
                  </div>
                )}
              </div>
            </div>

            {/* Vertical Center Divider */}
            <div className="hidden md:block w-px bg-slate-200/90 dark:bg-slate-800 self-stretch shrink-0" />

            {/* Right Column: Employees List */}
            <div className="flex-1 min-w-0 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <UserCheck className="size-3.5 text-[#4C40F7]" />
                  <span>Employees</span>
                  <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {employees.length} Personnel
                </span>
              </div>

              {/* Employee Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <Input
                  value={empSearchQuery}
                  onChange={(e) => setEmpSearchQuery(e.target.value)}
                  placeholder="Search employee by name, ID, position, or department..."
                  className="pl-9 h-9 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900"
                />
              </div>

              {/* Employee Scrollable List */}
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((emp) => {
                    const isSelected = selectedEmp?.id === emp.id;
                    const fullName = `${emp.firstName} ${emp.lastName}`.trim();
                    return (
                      <div
                        key={emp.id}
                        onClick={() => setSelectedEmp(emp)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-[#4C40F7] bg-indigo-50/70 dark:bg-indigo-950/50 shadow-2xs ring-1 ring-[#4C40F7]'
                            : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="size-9 rounded-full bg-[#4C40F7]/10 text-[#4C40F7] font-bold text-xs flex items-center justify-center shrink-0 select-none">
                            {emp.firstName.trim().charAt(0).toUpperCase() ||
                              fullName.trim().charAt(0).toUpperCase() ||
                              'U'}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {fullName}
                              </p>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                                {emp.employeeId}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                              {emp.position} • <Building2 className="inline size-3 mb-0.5" />{' '}
                              {emp.department}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <MapPin className="size-3" />
                            {emp.location}
                          </span>
                          <div
                            className={`size-5 rounded-full border flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'bg-[#4C40F7] border-[#4C40F7] text-white'
                                : 'border-slate-300 dark:border-slate-700 bg-transparent'
                            }`}
                          >
                            {isSelected && <Check className="size-3 stroke-[3]" />}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                    No matching active employees found.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Allocation Preview Banner */}
          {targetAsset && selectedEmp && (
            <div className="p-3 bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/50 rounded-xl flex items-center justify-between text-xs animate-in fade-in duration-200">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-slate-500 dark:text-slate-400">Allocating:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {targetAsset.name}
                </span>
                <span className="font-mono text-[10px] text-slate-500">({targetAsset.assetId})</span>
                <ArrowRight className="size-3 text-indigo-500 shrink-0" />
                <span className="font-semibold text-[#4C40F7] dark:text-indigo-300 truncate">
                  {selectedEmp.firstName} {selectedEmp.lastName}
                </span>
                <span className="text-slate-400">({selectedEmp.department})</span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 shrink-0">
                Ready to Allocate
              </span>
            </div>
          )}
        </div>

        <DialogFooter className="pt-3">
          <Button
            type="button"
            variant="outline"
            onClick={closeModals}
            className="h-9 text-xs rounded-md"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleAllocate}
            disabled={!targetAsset || !selectedEmp}
            className="h-9 bg-[#4C40F7] hover:bg-[#3D31E5] text-white text-xs font-medium px-5 rounded-md shadow-xs cursor-pointer disabled:opacity-50"
          >
            Allocate Asset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AllocateAssetModal;
