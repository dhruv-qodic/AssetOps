import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { useAssetStore } from '@/store/useAssetStore';
import { EmployeeStatusBadge } from './EmployeeStatusBadge';
import {
  User,
  Hash,
  Mail,
  Phone,
  Building2,
  UserCog,
  Briefcase,
  MapPin,
  Activity,
  Calendar,
  Clock,
  Box,
  Pencil,
  Laptop,
} from 'lucide-react';

export const EmployeeDetailsModal: React.FC = () => {
  const { isViewModalOpen, selectedEmployee, closeModals, openEditModal } = useEmployeeStore();
  const { assets } = useAssetStore();

  if (!selectedEmployee) return null;

  const fullName = `${selectedEmployee.firstName} ${selectedEmployee.lastName}`.trim();

  // Find assets assigned to this employee
  const assignedAssetsList = assets.filter((asset) => {
    if (!asset.assignedTo) return false;
    return (
      asset.assignedTo.id === selectedEmployee.id ||
      asset.assignedTo.employeeId === selectedEmployee.employeeId ||
      asset.assignedTo.name?.toLowerCase() === fullName.toLowerCase() ||
      selectedEmployee.assignedAssets?.includes(asset.id)
    );
  });

  const formattedCreated = selectedEmployee.createdAt
    ? new Date(selectedEmployee.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'N/A';

  const formattedUpdated = selectedEmployee.updatedAt
    ? new Date(selectedEmployee.updatedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'N/A';

  return (
    <Dialog open={isViewModalOpen} onOpenChange={closeModals}>
      <DialogContent onClose={closeModals} className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-[#4C40F7] border border-indigo-100 dark:border-indigo-900/50 shadow-2xs">
              <User className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                Employee Profile
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Detailed information and assigned assets for {selectedEmployee.employeeId}.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-1 text-left">
          {/* Profile Hero Header Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-indigo-50/30 dark:from-slate-800/80 dark:to-indigo-950/30 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-3.5">
              {selectedEmployee.avatar ? (
                <img
                  src={selectedEmployee.avatar}
                  alt={fullName}
                  className="size-14 rounded-2xl object-cover border-2 border-white dark:border-slate-700 shadow-xs"
                />
              ) : (
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4C40F7] to-purple-600 text-white font-bold text-lg shadow-md">
                  {selectedEmployee.firstName?.[0]}
                  {selectedEmployee.lastName?.[0]}
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-snug">
                    {fullName}
                  </h3>
                  <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                    {selectedEmployee.employeeId}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  {selectedEmployee.position} • {selectedEmployee.department}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <EmployeeStatusBadge status={selectedEmployee.status} />
              <span className="capitalize text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-200/70 dark:bg-slate-700/70 text-slate-700 dark:text-slate-300">
                {selectedEmployee.type}
              </span>
            </div>
          </div>

          {/* Complete Employee Details Grid */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <UserCog className="size-3.5 text-[#4C40F7]" />
              <span>Personal & Work Details</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1.5">
                  <Hash className="size-3.5 text-slate-400" /> Employee ID
                </span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                  {selectedEmployee.employeeId}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1.5">
                  <User className="size-3.5 text-slate-400" /> Full Name
                </span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {fullName}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1.5">
                  <Mail className="size-3.5 text-slate-400" /> Email Address
                </span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {selectedEmployee.email}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1.5">
                  <Phone className="size-3.5 text-slate-400" /> Phone Number
                </span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedEmployee.phone || 'Not provided'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1.5">
                  <Building2 className="size-3.5 text-slate-400" /> Department
                </span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedEmployee.department}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1.5">
                  <UserCog className="size-3.5 text-slate-400" /> Position / Title
                </span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedEmployee.position || 'N/A'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1.5">
                  <Briefcase className="size-3.5 text-slate-400" /> Employment Type
                </span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                  {selectedEmployee.type}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-slate-400" /> Work Location
                </span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedEmployee.location || 'Headquarters'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1.5">
                  <Activity className="size-3.5 text-slate-400" /> Status
                </span>
                <div className="pt-0.5">
                  <EmployeeStatusBadge status={selectedEmployee.status} />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-slate-400" /> Created Date
                </span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {formattedCreated}
                </p>
              </div>
            </div>
          </div>

          {/* Assigned Assets Section */}
          <div className="space-y-2 pt-1">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Box className="size-3.5 text-[#4C40F7]" />
                <span>Assigned Equipment ({assignedAssetsList.length})</span>
              </span>
            </h4>

            {assignedAssetsList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {assignedAssetsList.map((asset) => (
                  <div
                    key={asset.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-[#4C40F7] shrink-0">
                        <Laptop className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                          {asset.name}
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {asset.assetId} • {asset.category}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
                      {asset.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3.5 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  No organization assets currently assigned to this employee.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              closeModals();
              openEditModal(selectedEmployee);
            }}
            className="h-9 text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Pencil className="size-3.5" />
            <span>Edit Profile</span>
          </Button>

          <Button
            type="button"
            onClick={closeModals}
            className="h-9 px-5 bg-[#4C40F7] hover:bg-[#3D31E5] text-white text-xs font-medium rounded-md shadow-xs cursor-pointer"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDetailsModal;

