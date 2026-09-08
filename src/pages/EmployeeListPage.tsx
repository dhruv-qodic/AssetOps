import { useEmployeeStore } from '@/store/useEmployeeStore';
import EmployeeHeader from '@/components/employees/EmployeeHeader';
import EmployeeCards from '@/components/employees/EmployeeCards';
import EmployeeFiltersBar from '@/components/employees/EmployeeFiltersBar';
import EmployeeTable from '@/components/employees/EmployeeTable';
import EmployeePagination from '@/components/employees/EmployeePagination';
import AddEmployeeModal from '@/components/employees/AddEmployeeModal';
import EmployeeDetailsModal from '@/components/employees/EmployeeDetailsModal';
import EditEmployeeModal from '@/components/employees/EditEmployeeModal';
import DeleteEmployeeModal from '@/components/employees/DeleteEmployeeModal';

export function EmployeeListPage() {
  const { getFilteredEmployees, filters } = useEmployeeStore();

  const {
    paginatedEmployees,
    totalFiltered,
    totalPages,
    startIndex,
    endIndex,
  } = getFilteredEmployees();

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-5 max-w-7xl mx-auto w-full">
      {/* 1. Header with title and action button */}
      <EmployeeHeader />

      {/* 2. Employee Summary Stats Cards */}
      <EmployeeCards />

      {/* 3. Filter Bar with Search input and dropdowns */}
      <EmployeeFiltersBar />

      {/* 3. Employee Data Table Card Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {/* Table Content */}
        <EmployeeTable employees={paginatedEmployees} />

        {/* Pagination Footer */}
        <EmployeePagination
          totalFiltered={totalFiltered}
          startIndex={startIndex}
          endIndex={endIndex}
          totalPages={totalPages}
          currentPage={filters.page}
        />
      </div>

      {/* Modals & Dialogs */}
      <AddEmployeeModal />
      <EmployeeDetailsModal />
      <EditEmployeeModal />
      <DeleteEmployeeModal />
    </div>
  );
}

export default EmployeeListPage;