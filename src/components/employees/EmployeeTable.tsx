import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTranslation } from 'react-i18next';
import { EmployeeStatusBadge } from './EmployeeStatusBadge';
import { EmployeeRowActions } from './EmployeeRowActions';
import type { Employee } from '@/types/employee';
import { Users, UserX } from 'lucide-react';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';

import {
  EMPLOYEE_TABLE_MESSAGES,
  EMPLOYEE_TABLE_COLUMNS,
} from './constants/EmployeeTable.constants';

interface EmployeeTableProps {
  employees: Employee[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onClearFilters?: () => void;
  onAddEmployee?: () => void;
}

/**
 * @ description: Renders a structured data table of employee records with loading, error, and empty states.
 * @param {EmployeeTableProps} props - Component properties containing employee records and handlers.
 * @returns {JSX.Element} Employee table component JSX.
 */
export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  isLoading = false,
  error = null,
  onRetry,
  onClearFilters,
  onAddEmployee,
}) => {
  const { t: translateEmployees } = useTranslation('employee');

  // 1. Loading State (with asset/employee-related icon in loader)
  if (isLoading) {
    return (
      <LoadingState
        icon={Users}
        title={translateEmployees('loading.title', {
          defaultValue: EMPLOYEE_TABLE_MESSAGES.LOADING_TITLE,
        })}
        description={translateEmployees('loading.description', {
          defaultValue: EMPLOYEE_TABLE_MESSAGES.LOADING_DESCRIPTION,
        })}
      />
    );
  }

  // 2. Error State
  if (error) {
    return (
      <ErrorState
        title={translateEmployees('error.title', {
          defaultValue: EMPLOYEE_TABLE_MESSAGES.ERROR_TITLE,
        })}
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
        title={translateEmployees('emptyState.title', {
          defaultValue: EMPLOYEE_TABLE_MESSAGES.EMPTY_TITLE,
        })}
        description={translateEmployees('emptyState.description', {
          defaultValue: EMPLOYEE_TABLE_MESSAGES.EMPTY_DESCRIPTION,
        })}
        secondaryActionLabel={
          onClearFilters
            ? translateEmployees('emptyState.clearFilters', {
                defaultValue: EMPLOYEE_TABLE_MESSAGES.CLEAR_FILTERS,
              })
            : undefined
        }
        onSecondaryAction={onClearFilters}
        actionLabel={
          onAddEmployee
            ? translateEmployees('addEmployee', {
                defaultValue: EMPLOYEE_TABLE_MESSAGES.ADD_EMPLOYEE,
              })
            : undefined
        }
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
              {translateEmployees('columns.employeeId', {
                defaultValue: EMPLOYEE_TABLE_COLUMNS.EMPLOYEE_ID,
              })}
            </TableHead>
            <TableHead className="min-w-[160px] font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
              {translateEmployees('columns.name', {
                defaultValue: EMPLOYEE_TABLE_COLUMNS.NAME,
              })}
            </TableHead>
            <TableHead className="w-[160px] font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
              {translateEmployees('columns.department', {
                defaultValue: EMPLOYEE_TABLE_COLUMNS.DEPARTMENT,
              })}
            </TableHead>
            <TableHead className="min-w-[200px] font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
              {translateEmployees('columns.email', {
                defaultValue: EMPLOYEE_TABLE_COLUMNS.EMAIL,
              })}
            </TableHead>
            <TableHead className="w-[130px] font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
              {translateEmployees('columns.status', {
                defaultValue: EMPLOYEE_TABLE_COLUMNS.STATUS,
              })}
            </TableHead>
            <TableHead className="w-[130px] font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
              {translateEmployees('columns.role', {
                defaultValue: EMPLOYEE_TABLE_COLUMNS.ROLE,
              })}
            </TableHead>
            <TableHead className="w-[90px] text-right pr-6 font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
              {translateEmployees('columns.actions', {
                defaultValue: EMPLOYEE_TABLE_COLUMNS.ACTIONS,
              })}
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
                  {translateEmployees(`departments.${employee.department}`, {
                    defaultValue: employee.department,
                  })}
                </TableCell>

                {/* Email */}
                <TableCell className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
                  {employee.email}
                </TableCell>

                {/* Status */}
                <TableCell>
                  <EmployeeStatusBadge status={employee.status} />
                </TableCell>

                {/* Role */}
                <TableCell className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
                  {employee.position}
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
