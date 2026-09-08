import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Eye, Edit2, Trash2 } from 'lucide-react';
import type { Employee } from '@/types/employee';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { usePermission } from '@/hooks/usePermission';
import { cn } from '@/lib/utils';

interface EmployeeRowActionsProps {
  employee: Employee;
}

export const EmployeeRowActions: React.FC<EmployeeRowActionsProps> = ({
  employee,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { openViewModal, openEditModal, openDeleteModal } = useEmployeeStore();
  const { hasPermission } = usePermission();

  const canManage = hasPermission('MANAGE_EMPLOYEES');

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex size-8 items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer',
          isOpen && 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
        )}
        title="Employee actions"
        aria-label="Employee actions"
      >
        <MoreHorizontal className="size-4.5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* View Details */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              openViewModal(employee);
            }}
            className="w-full px-3 py-2 text-xs flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left"
          >
            <Eye className="size-3.5 text-slate-400" />
            <span>View Details</span>
          </button>

          {/* Edit Employee */}
          {canManage && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                openEditModal(employee);
              }}
              className="w-full px-3 py-2 text-xs flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left"
            >
              <Edit2 className="size-3.5 text-blue-500" />
              <span>Edit Employee</span>
            </button>
          )}

          {/* Delete Employee */}
          {canManage && (
            <>
              <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  openDeleteModal(employee);
                }}
                className="w-full px-3 py-2 text-xs flex items-center gap-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer text-left"
              >
                <Trash2 className="size-3.5" />
                <span>Delete Employee</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeeRowActions;
