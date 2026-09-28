import React from 'react';
import { Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { usePermission } from '@/hooks/usePermission';

export const EmployeeHeader: React.FC = () => {
  const openAddModal = useEmployeeStore((s) => s.openAddModal);
  const { hasPermission } = usePermission();
  const canManage = hasPermission('MANAGE_EMPLOYEES');

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
      {/* Title */}
      <div className="flex items-start sm:items-center gap-3">
        <div className="p-2.5 rounded-xl bg-[#155DFC]/10 dark:bg-[#155DFC]/20 text-[#155DFC] shadow-xs shrink-0 mt-0.5 sm:mt-0">
          <Users className="size-6 sm:size-7" />
        </div>
        <div className="space-y-0.5 text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Employee Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Manage your organization's workforce, departments, and assigned hardware.
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex items-center gap-2.5 self-start sm:self-auto">
        {canManage && (
          <Button
            type="button"
            onClick={openAddModal}
            className="h-9.5 px-4 bg-[#155DFC] hover:bg-[#0D4ECC] text-white text-xs sm:text-sm font-medium rounded-md shadow-xs shadow-[#155DFC]/25 transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
          >
            <Plus className="size-4 stroke-[2.5]" />
            <span>Add Employee</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmployeeHeader;
