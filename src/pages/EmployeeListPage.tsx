import { useTranslation } from 'react-i18next';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import EmployeeHeader from '@/components/employees/EmployeeHeader';
import EmployeeCards from '@/components/employees/EmployeeCards';
import EmployeeFiltersBar from '@/components/employees/EmployeeFiltersBar';
import EmployeeTable from '@/components/employees/EmployeeTable';
import { Pagination } from '@/components/common/Pagination';
import EmployeeModal from '@/components/employees/EmployeeModal';
import EmployeeDetailsModal from '@/components/employees/EmployeeDetailsModal';
import DeleteEmployeeModal from '@/components/employees/DeleteEmployeeModal';

export function EmployeeListPage() {
  const { t: translateEmployees } = useTranslation('employee');
  useEmployeeStore((s) => s.employees);
  const filters = useEmployeeStore((s) => s.filters);
  const getFilteredEmployees = useEmployeeStore((s) => s.getFilteredEmployees);
  const isLoading = useEmployeeStore((s) => s.isLoading);
  const error = useEmployeeStore((s) => s.error);
  const reloadEmployees = useEmployeeStore((s) => s.reloadEmployees);
  const resetFilters = useEmployeeStore((s) => s.resetFilters);
  const openAddModal = useEmployeeStore((s) => s.openAddModal);
  const setPage = useEmployeeStore((s) => s.setPage);

  const { paginatedEmployees, totalFiltered, totalPages, startIndex, endIndex } =
    getFilteredEmployees();

  const showPagination = !isLoading && !error && totalFiltered > 0;

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-5 max-w-[1400px] mx-auto w-full">
      {/* 1. Header with title and action button */}
      <EmployeeHeader />

      {/* 2. Employee Summary Stats Cards */}
      <EmployeeCards />

      {/* 3. Filter Bar with Search input and dropdowns */}
      <EmployeeFiltersBar />

      {/* 3. Employee Data Table Card Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {/* Table Content with Loading -> Error -> Empty -> Success States */}
        <EmployeeTable
          employees={paginatedEmployees}
          isLoading={isLoading}
          error={error}
          onRetry={() => void reloadEmployees()}
          onClearFilters={resetFilters}
          onAddEmployee={openAddModal}
        />

        {/* Pagination Footer */}
        {showPagination && (
          <Pagination
            totalFiltered={totalFiltered}
            startIndex={startIndex}
            endIndex={endIndex}
            totalPages={totalPages}
            currentPage={filters.page}
            onPageChange={setPage}
            entityLabel={translateEmployees('pagination.employees', {
              defaultValue: 'employees',
            })}
          />
        )}
      </div>

      {/* Modals & Dialogs */}
      <EmployeeModal />
      <EmployeeDetailsModal />
      <DeleteEmployeeModal />
    </div>
  );
}

export default EmployeeListPage;
