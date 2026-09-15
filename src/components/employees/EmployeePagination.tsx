import React from 'react';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { Pagination } from '@/components/common/Pagination';

interface EmployeePaginationProps {
  totalFiltered: number;
  startIndex: number;
  endIndex: number;
  totalPages: number;
  currentPage: number;
}

export const EmployeePagination: React.FC<EmployeePaginationProps> = (props) => {
  const { setPage } = useEmployeeStore();

  return (
    <Pagination
      {...props}
      onPageChange={setPage}
      entityLabel="employees"
    />
  );
};

export default EmployeePagination;
