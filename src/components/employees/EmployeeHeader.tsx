import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { usePermission } from '@/hooks/usePermission';

export const EmployeeHeader: React.FC = () => {
    const { openAddModal } = useEmployeeStore();
    const { hasPermission } = usePermission();
    const canManage = hasPermission('MANAGE_EMPLOYEES');

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
            {/* Title */}
            <div>
                <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900 dark:text-white">
                    Employee Management
                </h1>
            </div>

            {/* Action Button */}
            <div className="flex items-center gap-2.5 self-start sm:self-auto">
                {canManage && (
                    <Button
                        type="button"
                        onClick={openAddModal}
                        className="h-9.5 px-4 bg-[#4C40F7] hover:bg-[#3D31E5] text-white text-xs sm:text-sm font-medium rounded-md shadow-xs shadow-[#4C40F7]/25 transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
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
