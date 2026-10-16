import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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
import { toast } from 'sonner';
import { useAssetStore } from '@/store/useAssetStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import {
  ALLOCATE_ASSET_TITLES,
  ALLOCATE_ASSET_LABELS,
  ALLOCATE_ASSET_PLACEHOLDERS,
  ALLOCATE_ASSET_MESSAGES,
  ALLOCATE_ASSET_BUTTONS,
} from './constants/AllocateAssetModel.constants';
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

/**
 * @description: Modal dialog for assigning available hardware assets to selected employees
 * @returns {JSX.Element} Allocation modal component JSX
 */
export const AllocateAssetModal: React.FC = () => {
  const { t: translateAssets } = useTranslation('asset');
  const { t: translateAllocations } = useTranslation('allocation');
  const { t: translateEmployees } = useTranslation('employee');
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

  /**
   * @description: Filter all assets whose status is 'Available'
   * @returns {Asset[]} Array of available assets
   */
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

  /**
   * @description: Filter available assets by search query
   * @returns {Asset[]} Array of filtered available assets
   */
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

  /**
   * @description: Filter employees by search query
   * @returns {Employee[]} Array of filtered employees
   */
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

  /**
   * @description: Get the target asset from the available assets
   * @returns {Asset | null} Target asset or null
   */
  const targetAsset = useMemo(() => {
    return assets.find((a) => a.id === selectedAssetId) || null;
  }, [assets, selectedAssetId]);

  /**
   * @description: Handle the allocation of an asset to an employee
   * @returns {void}
   */
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

    toast.success(
      translateAssets('toasts.allocated', {
        assetName: targetAsset.name,
        employeeName: `${selectedEmp.firstName} ${selectedEmp.lastName}`,
        defaultValue: `Allocated ${targetAsset.name} to ${selectedEmp.firstName} ${selectedEmp.lastName}`,
      }),
    );
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
                {translateAssets('allocateModal.title', {
                  defaultValue: ALLOCATE_ASSET_TITLES.MODAL_TITLE,
                })}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {translateAssets('allocateModal.subtitle', {
                  defaultValue: ALLOCATE_ASSET_TITLES.MODAL_DESCRIPTION,
                })}
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
                  <PackageCheck className="size-3.5 text-primary" />
                  <span>
                    {translateAssets('allocateModal.selectAssetLabel', {
                      defaultValue: ALLOCATE_ASSET_LABELS.AVAILABLE_ASSETS,
                    })}
                  </span>
                  <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {availableAssets.length}{' '}
                  {translateAssets('allocateModal.availableSuffix', {
                    defaultValue: ALLOCATE_ASSET_LABELS.AVAILABLE_SUFFIX,
                  })}
                </span>
              </div>

              {/* Asset Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <Input
                  value={assetSearchQuery}
                  onChange={(e) => setAssetSearchQuery(e.target.value)}
                  placeholder={translateAssets('allocateModal.selectAssetPlaceholder', {
                    defaultValue: ALLOCATE_ASSET_PLACEHOLDERS.SEARCH_ASSETS,
                  })}
                  className="pl-9 h-9 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900"
                />
              </div>

              {/* Available Assets Scrollable List */}
              <div className="space-y-2 max-h-72 overflow-y-auto p-2">
                {filteredAvailableAssets.length > 0 ? (
                  filteredAvailableAssets.map((asset) => {
                    const isSelected = selectedAssetId === asset.id;
                    return (
                      <div
                        key={asset.id}
                        onClick={() => setSelectedAssetId(asset.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-primary bg-indigo-50/70 dark:bg-indigo-950/50 shadow-2xs ring-1 ring-primary'
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
                              <span>
                                {translateAssets(`categories.${asset.category}`, {
                                  defaultValue: asset.category,
                                })}
                              </span>
                              {asset.location && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-0.5">
                                    <MapPin className="size-3 text-slate-400" />
                                    {translateAssets(`locations.${asset.location}`, {
                                      defaultValue: asset.location,
                                    })}
                                  </span>
                                </>
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            {translateAssets(`statuses.${asset.status}`, {
                              defaultValue: asset.status,
                            })}
                          </span>
                          <div
                            className={`size-5 rounded-full border flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'bg-primary border-primary text-white'
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
                      ? translateAssets('allocateModal.noAvailableAssets', {
                          defaultValue: ALLOCATE_ASSET_MESSAGES.NO_AVAILABLE_ASSETS,
                        })
                      : translateAssets('allocateModal.noMatchingAssets', {
                          defaultValue: ALLOCATE_ASSET_MESSAGES.NO_MATCHING_ASSETS,
                        })}
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
                  <UserCheck className="size-3.5 text-primary" />
                  <span>
                    {translateAssets('allocateModal.selectEmployeeLabel', {
                      defaultValue: ALLOCATE_ASSET_LABELS.EMPLOYEES,
                    })}
                  </span>
                  <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {employees.length}{' '}
                  {translateAssets('allocateModal.personnelSuffix', {
                    defaultValue: ALLOCATE_ASSET_LABELS.PERSONNEL_SUFFIX,
                  })}
                </span>
              </div>

              {/* Employee Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <Input
                  value={empSearchQuery}
                  onChange={(e) => setEmpSearchQuery(e.target.value)}
                  placeholder={translateAssets('allocateModal.selectEmployeePlaceholder', {
                    defaultValue: ALLOCATE_ASSET_PLACEHOLDERS.SEARCH_EMPLOYEES,
                  })}
                  className="pl-9 h-9 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900"
                />
              </div>

              {/* Employee Scrollable List */}
              <div className="space-y-2 max-h-72 overflow-y-auto p-2">
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
                            ? 'border-primary bg-indigo-50/70 dark:bg-indigo-950/50 shadow-2xs ring-1 ring-primary'
                            : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="size-9 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 select-none">
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
                              {translateEmployees(`departments.${emp.department}`, {
                                defaultValue: emp.department,
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <MapPin className="size-3" />
                            {translateAssets(`locations.${emp.location}`, {
                              defaultValue: emp.location,
                            })}
                          </span>
                          <div
                            className={`size-5 rounded-full border flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'bg-primary border-primary text-white'
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
                    {translateAssets('allocateModal.noMatchingEmployees', {
                      defaultValue: ALLOCATE_ASSET_MESSAGES.NO_MATCHING_EMPLOYEES,
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Allocation Preview Banner */}
          {targetAsset && selectedEmp && (
            <div className="p-3 bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/50 rounded-xl flex items-center justify-between text-xs animate-in fade-in duration-200">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-slate-500 dark:text-slate-400">
                  {translateAllocations('allocateModal.allocatingPrefix', {
                    defaultValue: ALLOCATE_ASSET_LABELS.ALLOCATING_PREFIX,
                  })}
                </span>
                <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {targetAsset.name}
                </span>
                <span className="font-mono text-[10px] text-slate-500">
                  ({targetAsset.assetId})
                </span>
                <ArrowRight className="size-3 text-indigo-500 shrink-0" />
                <span className="font-semibold text-primary dark:text-indigo-300 truncate">
                  {selectedEmp.firstName} {selectedEmp.lastName}
                </span>
                <span className="text-slate-400">({selectedEmp.department})</span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 shrink-0">
                {translateAllocations('allocateModal.readyToAllocate', {
                  defaultValue: ALLOCATE_ASSET_LABELS.READY_TO_ALLOCATE,
                })}
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
            {translateAssets('allocateModal.cancelButton', {
              defaultValue: ALLOCATE_ASSET_BUTTONS.CANCEL,
            })}
          </Button>
          <Button
            type="button"
            onClick={handleAllocate}
            disabled={!targetAsset || !selectedEmp}
            className="h-9 bg-primary hover:bg-primary text-white text-xs font-medium px-5 rounded-md shadow-xs cursor-pointer disabled:opacity-50"
          >
            {translateAssets('allocateModal.submitButton', {
              defaultValue: ALLOCATE_ASSET_BUTTONS.ALLOCATE,
            })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AllocateAssetModal;
