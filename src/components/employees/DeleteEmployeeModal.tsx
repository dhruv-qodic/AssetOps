import React from 'react';
import { useTranslation } from 'react-i18next';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { useAssetStore } from '@/store/useAssetStore';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import {
  DELETE_EMPLOYEE_MODAL_TITLES,
  DELETE_EMPLOYEE_MODAL_BUTTONS,
  DELETE_EMPLOYEE_MODAL_MESSAGES,
} from './constants/DeleteEmployeeModal.constants';

/**
 * @description: Confirmation dialog modal for permanently deleting an employee and deallocating any assigned assets
 * @returns {JSX.Element | null} Delete employee modal dialog JSX
 */
export const DeleteEmployeeModal: React.FC = () => {
  const { t: translateEmployees } = useTranslation('employee');
  const isDeleteModalOpen = useEmployeeStore((s) => s.isDeleteModalOpen);
  const selectedEmployee = useEmployeeStore((s) => s.selectedEmployee);
  const closeModals = useEmployeeStore((s) => s.closeModals);
  const deleteEmployee = useEmployeeStore((s) => s.deleteEmployee);
  const assets = useAssetStore((s) => s.assets);
  const deallocateAsset = useAssetStore((s) => s.deallocateAsset);

  if (!selectedEmployee) return null;

  const fullName = `${selectedEmployee.firstName} ${selectedEmployee.lastName}`.trim();

  /**
   * @description: Deallocates any assets assigned to the employee and deletes the employee from store
   * @returns {void}
   */
  const handleDelete = () => {
    // Deallocate any assets currently assigned to this employee
    const assigned = assets.filter(
      (a) =>
        a.assignedTo?.id === selectedEmployee.id ||
        a.assignedTo?.employeeId === selectedEmployee.employeeId,
    );
    assigned.forEach((a) => {
      deallocateAsset(a.id);
    });

    deleteEmployee(selectedEmployee.id);
    toast.success(
      translateEmployees('toasts.deleted', {
        name: fullName,
        defaultValue: `${DELETE_EMPLOYEE_MODAL_MESSAGES.SUCCESS_PREFIX}${fullName}${DELETE_EMPLOYEE_MODAL_MESSAGES.SUCCESS_SUFFIX}`,
      }),
    );
    closeModals();
  };

  return (
    <ConfirmDialog
      isOpen={isDeleteModalOpen}
      onClose={closeModals}
      onConfirm={handleDelete}
      title={translateEmployees('deleteModal.title', {
        defaultValue: DELETE_EMPLOYEE_MODAL_TITLES.TITLE,
      })}
      description={translateEmployees('deleteModal.subtitle', {
        name: fullName,
        defaultValue: DELETE_EMPLOYEE_MODAL_TITLES.DESCRIPTION,
      })}
      cancelLabel={translateEmployees('deleteModal.cancelButton', {
        defaultValue: DELETE_EMPLOYEE_MODAL_BUTTONS.CANCEL,
      })}
      confirmLabel={translateEmployees('deleteModal.confirmButton', {
        defaultValue: DELETE_EMPLOYEE_MODAL_BUTTONS.DELETE,
      })}
      confirmVariant="destructive"
    >
      <div className="py-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
        {translateEmployees('deleteModal.confirmationQuestion', {
          defaultValue: DELETE_EMPLOYEE_MODAL_TITLES.CONFIRMATION_QUESTION,
        })}
        <span className="font-semibold text-slate-900 dark:text-white">
          {fullName} ({selectedEmployee.employeeId})
        </span>
        ?
      </div>
    </ConfirmDialog>
  );
};

export default DeleteEmployeeModal;
