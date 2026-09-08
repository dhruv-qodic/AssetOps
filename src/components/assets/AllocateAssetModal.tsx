import React, { useState, useEffect } from 'react';
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
import type { Employee } from '@/types/employee';
import type { AssignedEmployee } from '@/types/asset';
import {
  UserPlus,
  Search,
  Check,
  Building2,
  MapPin,
  Laptop,
  UserCheck,
} from 'lucide-react';

export const AllocateAssetModal: React.FC = () => {
  const { isAllocateModalOpen, selectedAsset, closeModals, allocateAsset } = useAssetStore();
  const { employees, assignAssetToEmployee } = useEmployeeStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);

  useEffect(() => {
    if (isAllocateModalOpen) {
      setSearchQuery('');
      setSelectedEmp(null);
    }
  }, [isAllocateModalOpen]);

  if (!selectedAsset) return null;

  // Filter employees (only active or all personnel)
  const filteredEmployees = employees.filter((emp) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const name = `${emp.firstName} ${emp.lastName}`.toLowerCase();
    return (
      name.includes(q) ||
      emp.employeeId.toLowerCase().includes(q) ||
      emp.department.toLowerCase().includes(q) ||
      emp.position.toLowerCase().includes(q)
    );
  });

  const handleAllocate = () => {
    if (!selectedEmp || !selectedAsset) return;

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
    allocateAsset(selectedAsset.id, assignedEmployeeData);
    assignAssetToEmployee(selectedEmp.id, selectedAsset.id);

    closeModals();
  };

  return (
    <Dialog open={isAllocateModalOpen} onOpenChange={closeModals}>
      <DialogContent onClose={closeModals} className="max-w-xl max-h-[90vh] overflow-y-auto">
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
                Assign organization asset to an employee from the staff directory.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-1 text-left">
          {/* Target Asset Summary Card */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-[#4C40F7] shrink-0">
                <Laptop className="size-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {selectedAsset.name}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                    {selectedAsset.assetId}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {selectedAsset.category} • {selectedAsset.location}
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shrink-0">
              {selectedAsset.status}
            </span>
          </div>

          {/* Search Input for Employees */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <UserCheck className="size-3.5 text-[#4C40F7]" />
              <span>Select Employee to Allocate</span>
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search employee by name, ID, or department..."
                className="pl-9 h-9.5 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900"
              />
            </div>
          </div>

          {/* Employee Directory List */}
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => {
                const isSelected = selectedEmp?.id === emp.id;
                const fullName = `${emp.firstName} ${emp.lastName}`.trim();
                return (
                  <div
                    key={emp.id}
                    onClick={() => setSelectedEmp(emp)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${isSelected
                      ? 'border-[#4C40F7] bg-indigo-50/70 dark:bg-indigo-950/50 shadow-2xs'
                      : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {emp.avatar ? (
                        <img
                          src={emp.avatar}
                          alt={fullName}
                          className="size-10 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="size-10 rounded-full bg-[#4C40F7]/10 text-[#4C40F7] font-bold text-xs flex items-center justify-center shrink-0">
                          {emp.firstName?.[0]}
                          {emp.lastName?.[0]}
                        </div>
                      )}
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
                          {emp.position} • <Building2 className="inline size-3 mb-0.5" /> {emp.department}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <MapPin className="size-3" />
                        {emp.location}
                      </span>
                      <div
                        className={`size-5 rounded-full border flex items-center justify-center transition-colors ${isSelected
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
              <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                No matching active employees found.
              </div>
            )}
          </div>
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
            disabled={!selectedEmp}
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
