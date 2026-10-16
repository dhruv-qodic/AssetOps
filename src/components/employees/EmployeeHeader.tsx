import React from 'react';
import { Plus, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { usePermission } from '@/hooks/usePermission';
import {
  EMPLOYEE_HEADER_TITLES,
  EMPLOYEE_HEADER_BUTTONS,
} from './constants/EmployeeHeader.constants';
import { PageHeader } from '@/components/common/PageHeader';

/**
 * @description: Page header component displaying title, subtitle, and an action button to add a new employee.
 * @returns {JSX.Element} Employee header component JSX.
 */
export const EmployeeHeader: React.FC = () => {
  const { t: translateEmployees } = useTranslation('employee');
  const openAddModal = useEmployeeStore((s) => s.openAddModal);
  const { hasPermission } = usePermission();
  const canManage = hasPermission('MANAGE_EMPLOYEES');

  return (
    <PageHeader
      title={translateEmployees('title', { defaultValue: EMPLOYEE_HEADER_TITLES.TITLE })}
      subtitle={translateEmployees('subtitle', { defaultValue: EMPLOYEE_HEADER_TITLES.SUBTITLE })}
      icon={Users}
    >
      {canManage && (
        <Button
          type="button"
          onClick={openAddModal}
          className="h-9.5 px-4 bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm font-medium rounded-md shadow-xs shadow-primary/25 transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
        >
          <Plus className="size-4 stroke-[2.5]" />
          <span>
            {translateEmployees('addEmployee', {
              defaultValue: EMPLOYEE_HEADER_BUTTONS.ADD_EMPLOYEE,
            })}
          </span>
        </Button>
      )}
    </PageHeader>
  );
};

export default EmployeeHeader;
