import React from 'react';
import { Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { usePermission } from '@/hooks/usePermission';
import { PageHeader } from '@/components/common/PageHeader';

export const EmployeeHeader: React.FC = () => {
  const openAddModal = useEmployeeStore((s) => s.openAddModal);
  const { hasPermission } = usePermission();
  const canManage = hasPermission('MANAGE_EMPLOYEES');

  return (
    <PageHeader
      icon={Users}
      title="Employee Management"
      description="Manage employee directory, departmental assignments, and equipment permissions."
    >
      {/* Action Button */}
      <div className="flex items-center gap-2.5 self-start sm:self-auto">
        {canManage && (
          <Button
            type="button"
            onClick={openAddModal}
            className="h-9.5 px-4 bg-[#155DFC] hover:bg-[#1047C7] text-white text-xs sm:text-sm font-medium rounded-lg shadow-xs shadow-[#155DFC]/25 transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
          >
            <Plus className="size-4 stroke-[2.5]" />
            <span>Add Employee</span>
          </Button>
        )}
      </div>
    </PageHeader>
  );
};

export default EmployeeHeader;

