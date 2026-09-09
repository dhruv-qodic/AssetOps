import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EmployeeStatusBadge } from './EmployeeStatusBadge';
import { EmployeeRowActions } from './EmployeeRowActions';
import type { Employee } from '@/types/employee';
import { Users, UserX } from 'lucide-react';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';

interface EmployeeTableProps {
  employees: Employee[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onClearFilters?: () => void;
  onAddEmployee?: () => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  isLoading = false,
  error = null,
  onRetry,
  onClearFilters,
  onAddEmployee,
}) => {
  // 1. Loading State (with asset/employee-related icon in loader)
  if (isLoading) {
    return (
      <LoadingState
        icon={Users}
        title="Loading employee directory..."
        description="Please wait while we retrieve the latest employee records."
      />
    );
  }

  // 2. Error State
  if (error) {
    return (
      <ErrorState
        title="Failed to load employee directory"
        message={error}
        onRetry={onRetry}
      />
    );
  }

  // 3. Empty State
  if (employees.length === 0) {
    return (
      <EmptyState
        icon={UserX}
        title="No employees found"
        description="No employees match your active search or filter criteria. Try clearing filters or adding a new employee."
        secondaryActionLabel={onClearFilters ? "Clear filters" : undefined}
        onSecondaryAction={onClearFilters}
        actionLabel={onAddEmployee ? "Add Employee" : undefined}
        onAction={onAddEmployee}
      />
    );
  }

  // 4. Success State (Data Table)

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-slate-200/80 dark:border-slate-800 bg-[#F8FAFC]/90 dark:bg-slate-900/80">
            <TableHead className="w-[140px] pl-6 font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
              Employee ID
            </TableHead>
            <TableHead className="min-w-[160px] font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
              Name
            </TableHead>
            <TableHead className="w-[160px] font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
              Department
            </TableHead>
            <TableHead className="min-w-[200px] font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
              Email
            </TableHead>
            <TableHead className="w-[130px] font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
              Status
            </TableHead>
            <TableHead className="w-[90px] text-right pr-6 font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {employees.map((employee) => {
            const fullName = `${employee.firstName} ${employee.lastName}`.trim() || employee.email;

            return (
              <TableRow
                key={employee.id}
                className="group hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors border-b border-slate-100 dark:border-slate-800/60"
              >
                {/* Employee ID */}
                <TableCell className="pl-6 font-medium text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                  {employee.employeeId}
                </TableCell>

                {/* Name */}
                <TableCell className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                  {fullName}
                </TableCell>

                {/* Department */}
                <TableCell className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
                  {employee.department}
                </TableCell>

                {/* Email */}
                <TableCell className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
                  {employee.email}
                </TableCell>

                {/* Status */}
                <TableCell>
                  <EmployeeStatusBadge status={employee.status} />
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right pr-6">
                  <EmployeeRowActions employee={employee} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeTable;
