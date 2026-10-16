import React from 'react';
import { MoreHorizontal, Eye, Edit2, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Employee } from '@/types/employee';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { usePermission } from '@/hooks/usePermission';
import { useDropdownPosition } from '@/hooks/useDropdownPosition';
import { cn } from '@/lib/utils';
import { EMPLOYEE_ROW_ACTIONS_LABELS } from './constants/EmployeeRowActions.constants';

interface EmployeeRowActionsProps {
  employee: Employee;
}

/**
 * @ description: Action dropdown menu for employee rows permitting viewing, editing, or deleting an employee.
 * @param {{ employee: Employee }} props - Target employee record properties.
 * @returns {JSX.Element} Employee row actions dropdown menu JSX.
 */
export const EmployeeRowActions: React.FC<EmployeeRowActionsProps> = ({ employee }) => {
  const { t: translateEmployees } = useTranslation('employee');
  const {
    ref: dropdownRef,
    isOpen,
    openUpward,
    toggleDropdown,
    closeDropdown,
  } = useDropdownPosition({
    dropdownHeight: 180,
  });

  const openViewModal = useEmployeeStore((s) => s.openViewModal);
  const openEditModal = useEmployeeStore((s) => s.openEditModal);
  const openDeleteModal = useEmployeeStore((s) => s.openDeleteModal);
  const { hasPermission } = usePermission();

  const canManage = hasPermission('MANAGE_EMPLOYEES');

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={toggleDropdown}
        className={cn(
          'flex size-8 items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer',
          isOpen && 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200',
        )}
        title={EMPLOYEE_ROW_ACTIONS_LABELS.ACTIONS_TITLE}
        aria-label={EMPLOYEE_ROW_ACTIONS_LABELS.ACTIONS_ARIA}
      >
        <MoreHorizontal className="size-4.5" />
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute right-0 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150',
            openUpward ? 'bottom-full mb-1.5' : 'top-full mt-1.5',
          )}
        >
          {/* View Details */}
          <button
            type="button"
            onClick={() => {
              closeDropdown();
              openViewModal(employee);
            }}
            className="w-full px-3 py-2 text-xs flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left"
          >
            <Eye className="size-3.5 text-slate-400" />
            <span>
              {translateEmployees('actions.viewDetails', {
                defaultValue: EMPLOYEE_ROW_ACTIONS_LABELS.VIEW_DETAILS,
              })}
            </span>
          </button>

          {/* Edit Employee */}
          {canManage && (
            <button
              type="button"
              onClick={() => {
                closeDropdown();
                openEditModal(employee);
              }}
              className="w-full px-3 py-2 text-xs flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left"
            >
              <Edit2 className="size-3.5 text-blue-500" />
              <span>
                {translateEmployees('actions.edit', {
                  defaultValue: EMPLOYEE_ROW_ACTIONS_LABELS.EDIT_EMPLOYEE,
                })}
              </span>
            </button>
          )}

          {/* Delete Employee */}
          {canManage && (
            <>
              <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
              <button
                type="button"
                onClick={() => {
                  closeDropdown();
                  openDeleteModal(employee);
                }}
                className="w-full px-3 py-2 text-xs flex items-center gap-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer text-left"
              >
                <Trash2 className="size-3.5" />
                <span>
                  {translateEmployees('actions.delete', {
                    defaultValue: EMPLOYEE_ROW_ACTIONS_LABELS.DELETE_EMPLOYEE,
                  })}
                </span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeeRowActions;
