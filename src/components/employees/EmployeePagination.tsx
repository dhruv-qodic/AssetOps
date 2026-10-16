import React from 'react';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { Pagination } from '@/components/common/Pagination';

import { useTranslation } from 'react-i18next';
import { EMPLOYEE_PAGINATION_CONSTANTS } from './constants/EmployeePagination.constants';

interface EmployeePaginationProps {
  totalFiltered: number;
  startIndex: number;
  endIndex: number;
  totalPages: number;
  currentPage: number;
}

/**
 * @ description: Renders pagination controls connected to the employee store for page navigation.
 * @param {EmployeePaginationProps} props - Employee pagination state props.
 * @returns {JSX.Element} Pagination controls component JSX.
 */
export const EmployeePagination: React.FC<EmployeePaginationProps> = (props) => {
  const { t: translateEmployees } = useTranslation('employee');
  const setPage = useEmployeeStore((s) => s.setPage);

  return (
    <Pagination
      {...props}
      onPageChange={setPage}
      entityLabel={translateEmployees('pagination.employees', {
        defaultValue: EMPLOYEE_PAGINATION_CONSTANTS.ENTITY_LABEL,
      })}
    />
  );
};

export default EmployeePagination;
