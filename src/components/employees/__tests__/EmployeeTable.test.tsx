import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmployeeTable } from '../EmployeeTable';
import type { Employee } from '@/types/employee';

describe('EmployeeTable Component', () => {
  const mockEmployees: Employee[] = [
    {
      id: 'emp-1',
      employeeId: 'EMP001',
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      department: 'Engineering',
      position: 'Developer',
      status: 'active',
      type: 'full-time',
      avatar: '',
      phone: '123',
      location: 'HQ',
      assignedAssets: ['A1001'],
      allocatedAssetsCount: 1,
      joinDate: '2023-01-01',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    },
    {
      id: 'emp-2',
      employeeId: 'EMP002',
      firstName: 'Bob',
      lastName: 'Jones',
      email: 'bob@example.com',
      department: 'Finance',
      position: 'Analyst',
      status: 'inactive',
      type: 'full-time',
      avatar: '',
      phone: '456',
      location: 'HQ',
      assignedAssets: [],
      allocatedAssetsCount: 0,
      joinDate: '2023-02-01',
      createdAt: '2023-02-01T00:00:00Z',
      updatedAt: '2023-02-01T00:00:00Z',
    },
  ];

  it('should render loading state when isLoading is true', () => {
    render(<EmployeeTable employees={[]} isLoading={true} />);
    expect(screen.getByText('Loading employee directory...')).toBeInTheDocument();
  });

  it('should render error state with retry button', async () => {
    const user = userEvent.setup();
    const handleRetry = vi.fn();

    render(
      <EmployeeTable
        employees={[]}
        error="Network timeout error"
        onRetry={handleRetry}
      />,
    );

    expect(screen.getByText('Failed to load employee directory')).toBeInTheDocument();
    expect(screen.getByText('Network timeout error')).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /try again/i });
    await user.click(retryBtn);

    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it('should render empty state when employees list is empty', async () => {
    const user = userEvent.setup();
    const handleClear = vi.fn();
    const handleAdd = vi.fn();

    render(
      <EmployeeTable
        employees={[]}
        onClearFilters={handleClear}
        onAddEmployee={handleAdd}
      />,
    );

    expect(screen.getByText('No employees found')).toBeInTheDocument();

    const clearBtn = screen.getByRole('button', { name: /clear filters/i });
    const addBtn = screen.getByRole('button', { name: /add employee/i });

    await user.click(clearBtn);
    expect(handleClear).toHaveBeenCalledTimes(1);

    await user.click(addBtn);
    expect(handleAdd).toHaveBeenCalledTimes(1);
  });

  it('should render table headers and employee rows in success state', () => {
    render(<EmployeeTable employees={mockEmployees} />);

    expect(screen.getByRole('columnheader', { name: /employee id/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /name/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /department/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /email/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /status/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /actions/i })).toBeInTheDocument();

    expect(screen.getByText('EMP001')).toBeInTheDocument();
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.getByText('Engineering')).toBeInTheDocument();
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
  });
});
