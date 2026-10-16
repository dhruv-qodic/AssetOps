import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EmployeeTable } from '../EmployeeTable';
import type { Employee } from '@/types/employee';

describe('EmployeeTable Component', () => {
  const sampleEmployees: Employee[] = [
    {
      id: 'emp-1',
      employeeId: 'E101',
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@company.com',
      phone: '123',
      department: 'Engineering',
      position: 'Staff Engineer',
      status: 'active',
      type: 'full-time',
      location: 'Headquarters',
      assignedAssets: [],
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    },
  ];

  it('should render table headers and employee row data', () => {
    render(<EmployeeTable employees={sampleEmployees} />);

    expect(screen.getByText('Employee ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Department')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();

    expect(screen.getByText('E101')).toBeInTheDocument();
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.getByText('Engineering')).toBeInTheDocument();
    expect(screen.getByText('alice@company.com')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Staff Engineer')).toBeInTheDocument();
  });

  it('should render loading state when isLoading is true', () => {
    render(<EmployeeTable employees={[]} isLoading={true} />);

    expect(screen.getByText(/Loading Employee Directory\.\.\./i)).toBeInTheDocument();
  });

  it('should render error state with retry button when error is provided', () => {
    const onRetry = vi.fn();
    render(<EmployeeTable employees={[]} error="Server failed to respond" onRetry={onRetry} />);

    expect(screen.getByText('Failed to load employee directory')).toBeInTheDocument();
    expect(screen.getByText('Server failed to respond')).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /Try Again/i });
    expect(retryBtn).toBeInTheDocument();
    fireEvent.click(retryBtn);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('should render empty state when no employees match filters', () => {
    const onClearFilters = vi.fn();
    const onAddEmployee = vi.fn();

    render(
      <EmployeeTable
        employees={[]}
        onClearFilters={onClearFilters}
        onAddEmployee={onAddEmployee}
      />,
    );

    expect(screen.getByText('No employees found')).toBeInTheDocument();

    const clearBtn = screen.getByRole('button', { name: /clear filters/i });
    fireEvent.click(clearBtn);
    expect(onClearFilters).toHaveBeenCalledTimes(1);

    const addBtn = screen.getByRole('button', { name: 'Add Employee' });
    fireEvent.click(addBtn);
    expect(onAddEmployee).toHaveBeenCalledTimes(1);
  });
});
