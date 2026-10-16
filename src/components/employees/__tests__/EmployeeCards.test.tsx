import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { EmployeeCards } from '../EmployeeCards';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import type { Employee } from '@/types/employee';

describe('EmployeeCards Component', () => {
  const sampleEmployees: Employee[] = [
    {
      id: 'emp-1',
      employeeId: 'E101',
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@company.com',
      phone: '123',
      department: 'Engineering',
      position: 'Developer',
      status: 'active',
      type: 'full-time',
      location: 'Headquarters',
      assignedAssets: [],
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    },
    {
      id: 'emp-2',
      employeeId: 'E102',
      firstName: 'Bob',
      lastName: 'Jones',
      email: 'bob@company.com',
      phone: '456',
      department: 'Sales',
      position: 'Account Executive',
      status: 'inactive',
      type: 'contractor',
      location: 'New York Office',
      assignedAssets: [],
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    },
    {
      id: 'emp-3',
      employeeId: 'E103',
      firstName: 'Charlie',
      lastName: 'Brown',
      email: 'charlie@company.com',
      phone: '789',
      department: 'Marketing',
      position: 'Intern',
      status: 'terminated',
      type: 'intern',
      location: 'Remote',
      assignedAssets: [],
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    },
    {
      id: 'emp-4',
      employeeId: 'E104',
      firstName: 'Diana',
      lastName: 'Prince',
      email: 'diana@company.com',
      phone: '000',
      department: 'Engineering',
      position: 'Lead Architect',
      status: 'active',
      type: 'full-time',
      location: 'San Francisco',
      assignedAssets: [],
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    },
  ];

  beforeEach(() => {
    useEmployeeStore.setState({ employees: sampleEmployees });
  });

  it('should render all 4 employee summary cards with correct titles', () => {
    render(<EmployeeCards />);

    expect(screen.getByText('Total Employees')).toBeInTheDocument();
    expect(screen.getByText('Active Employees')).toBeInTheDocument();
    expect(screen.getByText('Inactive & Terminated')).toBeInTheDocument();
    expect(screen.getByText('Full-Time Staff')).toBeInTheDocument();
  });

  it('should calculate and display metrics and percentages accurately', () => {
    render(<EmployeeCards />);

    // Total: 4
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('All staff')).toBeInTheDocument();

    // Active: 2 out of 4 = 50%
    const twos = screen.getAllByText('2');
    expect(twos.length).toBeGreaterThanOrEqual(2); // Active is 2, Inactive+Terminated is 2, Full-time is 2
    expect(screen.getByText('50% active')).toBeInTheDocument();
    expect(screen.getByText('50% of total')).toBeInTheDocument();
    expect(screen.getByText('50% ratio')).toBeInTheDocument();
  });

  it('should handle zero employees without division by zero or NaN', () => {
    useEmployeeStore.setState({ employees: [] });
    render(<EmployeeCards />);

    const zeros = screen.getAllByText('0');
    expect(zeros.length).toBe(4);
    expect(screen.getByText('0% active')).toBeInTheDocument();
    expect(screen.getByText('0% of total')).toBeInTheDocument();
    expect(screen.getByText('0% ratio')).toBeInTheDocument();
  });
});
