import React from 'react';
import { useTranslation } from 'react-i18next';
import type { EmployeeStatus } from '@/types/employee';
import { EMPLOYEE_STATUS_CONFIG } from '@/constant/employee.constants';
import { cn } from '@/lib/utils';
import {
  EMPLOYEE_STATUS_BADGE_STYLES,
  DEFAULT_EMPLOYEE_STATUS_BADGE_STYLE,
} from './constants/EmployeeStatusBadge.constants';

interface EmployeeStatusBadgeProps {
  status: EmployeeStatus;
  className?: string;
}

/**
 * @ description: Renders a styled status badge indicator for an employee status ('active' | 'inactive' | 'terminated').
 * @param {EmployeeStatusBadgeProps} props - Component properties for employee status badge.
 * @returns {JSX.Element} Status badge component JSX.
 */
export const EmployeeStatusBadge: React.FC<EmployeeStatusBadgeProps> = ({ status, className }) => {
  const { t: translateEmployees } = useTranslation('employee');

  /**
   * @ description: Resolves Tailwind CSS class string for background and text colors based on status.
   * @returns {string} Tailwind CSS class name string.
   */
  const getBadgeStyle = () => {
    return EMPLOYEE_STATUS_BADGE_STYLES[status] || DEFAULT_EMPLOYEE_STATUS_BADGE_STYLE;
  };

  /**
   * @ description: Converts employee status code to a capitalized display label.
   * @returns {string} Human-readable label string.
   */
  const getLabel = () => {
    return EMPLOYEE_STATUS_CONFIG[status].label || status;
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-colors select-none',
        getBadgeStyle(),
        className,
      )}
    >
      {translateEmployees(`statuses.${status}`, { defaultValue: getLabel() })}
    </span>
  );
};

export default EmployeeStatusBadge;
