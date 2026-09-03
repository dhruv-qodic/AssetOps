import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { EmployeeStatusBadge } from './EmployeeStatusBadge';
import { Mail, Building2, MapPin, Briefcase } from 'lucide-react';

export const EmployeeDetailsModal: React.FC = () => {
  const { isViewModalOpen, selectedEmployee, closeModals } = useEmployeeStore();

  if (!selectedEmployee) return null;

  const fullName = `${selectedEmployee.firstName} ${selectedEmployee.lastName}`.trim();

  return (
    <Dialog open={isViewModalOpen} onOpenChange={closeModals}>
      <DialogContent className="sm:max-w-[480px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
              Employee Details
            </DialogTitle>
            <EmployeeStatusBadge status={selectedEmployee.status} />
          </div>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {/* Main info card */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="flex size-12 items-center justify-center rounded-full bg-[#4C40F7]/10 text-[#4C40F7] font-bold text-base">
              {selectedEmployee.firstName?.[0]}
              {selectedEmployee.lastName?.[0]}
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {fullName}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                ID: {selectedEmployee.employeeId}
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1.5">
                <Building2 className="size-3.5" /> Department
              </span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {selectedEmployee.department}
              </p>
            </div>

            <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1.5">
                <Briefcase className="size-3.5" /> Position
              </span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {selectedEmployee.position || 'N/A'}
              </p>
            </div>

            <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1.5">
                <Mail className="size-3.5" /> Email
              </span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                {selectedEmployee.email}
              </p>
            </div>

            <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1.5">
                <MapPin className="size-3.5" /> Location
              </span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {selectedEmployee.location || 'Headquarters'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="button"
            onClick={closeModals}
            className="h-9 px-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs sm:text-sm font-medium rounded-lg"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDetailsModal;
