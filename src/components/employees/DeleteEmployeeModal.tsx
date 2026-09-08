import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { AlertTriangle } from 'lucide-react';

export const DeleteEmployeeModal: React.FC = () => {
  const { isDeleteModalOpen, selectedEmployee, closeModals, deleteEmployee } =
    useEmployeeStore();

  if (!selectedEmployee) return null;

  const fullName = `${selectedEmployee.firstName} ${selectedEmployee.lastName}`.trim();

  const handleDelete = () => {
    deleteEmployee(selectedEmployee.id);
    closeModals();
  };

  return (
    <Dialog open={isDeleteModalOpen} onOpenChange={closeModals}>
      <DialogContent className="sm:max-w-[420px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 shrink-0">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                Delete Employee
              </DialogTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                This action cannot be undone.
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="py-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-slate-900 dark:text-white">
            {fullName} ({selectedEmployee.employeeId})
          </span>
          ?
        </div>

        <DialogFooter className="pt-2 gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={closeModals}
            className="h-9.5 text-xs sm:text-sm"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            className="h-9.5 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-medium"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteEmployeeModal;
