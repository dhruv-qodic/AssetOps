import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AllocationTable } from '../AllocationTable';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import type { Asset } from '@/types/asset';
import type { Employee } from '@/types/employee';

describe('AllocationTable Component', () => {
  const mockEmployees: Employee[] = [
    {
      id: 'emp-1',
      employeeId: 'EMP001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@assetops.com',
      department: 'Engineering',
      position: 'Senior Engineer',
      status: 'active',
      avatar: '',
      phone: '12345',
      location: 'HQ',
      joinDate: '2023-01-01',
      allocatedAssetsCount: 1,
    },
    {
      id: 'emp-2',
      employeeId: 'EMP002',
      firstName: 'Sarah',
      lastName: 'Connor',
      email: 'sarah@assetops.com',
      department: 'Security',
      position: 'SecOps',
      status: 'on-leave',
      avatar: '',
      phone: '67890',
      location: 'Branch',
      joinDate: '2023-02-01',
      allocatedAssetsCount: 1,
    },
    {
      id: 'emp-3',
      employeeId: 'EMP003',
      firstName: 'Kyle',
      lastName: 'Reese',
      email: 'kyle@assetops.com',
      department: 'Operations',
      position: 'Field Specialist',
      status: 'terminated',
      avatar: '',
      phone: '11223',
      location: 'HQ',
      joinDate: '2023-03-01',
      allocatedAssetsCount: 1,
    },
    {
      id: 'emp-4',
      employeeId: 'EMP004',
      firstName: 'Inactive',
      lastName: 'Person',
      email: 'inactive@assetops.com',
      department: 'HR',
      position: 'Analyst',
      status: 'inactive',
      avatar: '',
      phone: '44556',
      location: 'HQ',
      joinDate: '2023-04-01',
      allocatedAssetsCount: 1,
    },
  ];

  const mockAllocations: Asset[] = [
    {
      id: 'ast-1',
      assetId: 'A1001',
      name: 'MacBook Pro 16',
      category: 'Laptop',
      status: 'Allocated',
      location: 'HQ',
      purchaseCost: 2499,
      purchaseDate: '2023-01-01',
      assignedTo: {
        id: 'emp-1',
        name: 'John Doe',
        department: 'Engineering',
        assignedDate: '2023-05-15T00:00:00Z',
      },
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    },
    {
      id: 'ast-2',
      assetId: 'A1002',
      name: 'ThinkPad X1',
      category: 'Laptop',
      status: 'Allocated',
      location: 'Branch',
      purchaseCost: 1800,
      purchaseDate: '2023-02-01',
      assignedTo: {
        id: 'emp-2',
        name: 'Sarah Connor',
        department: 'Security',
        assignedDate: '2023-06-01T00:00:00Z',
      },
      createdAt: '2023-02-01T00:00:00Z',
      updatedAt: '2023-02-01T00:00:00Z',
    },
    {
      id: 'ast-3',
      assetId: 'A1003',
      name: 'Dell Precision',
      category: 'Laptop',
      status: 'Allocated',
      location: 'HQ',
      purchaseCost: 2100,
      purchaseDate: '2023-03-01',
      assignedTo: {
        id: 'emp-3',
        name: 'Kyle Reese',
        department: 'Operations',
        assignedDate: '2023-07-01T00:00:00Z',
      },
      createdAt: '2023-03-01T00:00:00Z',
      updatedAt: '2023-03-01T00:00:00Z',
    },
    {
      id: 'ast-4',
      assetId: 'A1004',
      name: 'iPad Pro',
      category: 'Tablet',
      status: 'Allocated',
      location: 'HQ',
      purchaseCost: 1100,
      purchaseDate: '2023-04-01',
      assignedTo: {
        id: 'emp-4',
        name: 'Inactive Person',
        department: 'HR',
        assignedDate: '2023-08-01T00:00:00Z',
      },
      createdAt: '2023-04-01T00:00:00Z',
      updatedAt: '2023-04-01T00:00:00Z',
    },
    {
      id: 'ast-5',
      assetId: 'A1005',
      name: 'Logitech Webcam',
      category: 'Accessories',
      status: 'Available',
      location: 'HQ',
      purchaseCost: 120,
      purchaseDate: '2023-05-01',
      assignedTo: null,
      createdAt: '2023-05-01T00:00:00Z',
      updatedAt: '2023-05-01T00:00:00Z',
    },
    {
      id: 'ast-6',
      assetId: 'A1006',
      name: 'Broken Monitor',
      category: 'Monitor',
      status: 'Maintenance',
      location: 'HQ',
      purchaseCost: 350,
      purchaseDate: '2023-06-01',
      assignedTo: null,
      createdAt: '2023-06-01T00:00:00Z',
      updatedAt: '2023-06-01T00:00:00Z',
    },
    {
      id: 'ast-7',
      assetId: 'A1007',
      name: 'Old Printer',
      category: 'Peripherals',
      status: 'Retired',
      location: 'HQ',
      purchaseCost: 200,
      purchaseDate: '2020-01-01',
      assignedTo: null,
      createdAt: '2020-01-01T00:00:00Z',
      updatedAt: '2020-01-01T00:00:00Z',
    },
  ];

  beforeEach(() => {
    useEmployeeStore.setState({ employees: mockEmployees });
  });

  it('should render loading state when isLoading is true', () => {
    render(<AllocationTable allocations={[]} isLoading={true} />);

    expect(screen.getByText('Loading asset allocations...')).toBeInTheDocument();
  });

  it('should render error state with retry button when error exists', async () => {
    const user = userEvent.setup();
    const handleRetry = vi.fn();

    render(
      <AllocationTable
        allocations={[]}
        error="Network error fetching allocations"
        onRetry={handleRetry}
      />,
    );

    expect(screen.getByText('Failed to load allocations')).toBeInTheDocument();
    expect(screen.getByText('Network error fetching allocations')).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /try again/i });
    await user.click(retryBtn);

    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it('should render empty state when allocations array is empty', async () => {
    const user = userEvent.setup();
    const handleClearFilters = vi.fn();
    const handleNewAllocation = vi.fn();

    render(
      <AllocationTable
        allocations={[]}
        onClearFilters={handleClearFilters}
        onNewAllocation={handleNewAllocation}
      />,
    );

    expect(screen.getByText('No allocations found')).toBeInTheDocument();

    const clearBtn = screen.getByRole('button', { name: /clear filters/i });
    const newBtn = screen.getByRole('button', { name: /new allocation/i });

    await user.click(clearBtn);
    expect(handleClearFilters).toHaveBeenCalledTimes(1);

    await user.click(newBtn);
    expect(handleNewAllocation).toHaveBeenCalledTimes(1);
  });

  it('should render table headers and allocation rows in success state', () => {
    render(<AllocationTable allocations={mockAllocations} />);

    // Table Headers
    expect(screen.getByRole('columnheader', { name: /allocation id/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /^asset$/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /^employee$/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /department/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /^status$/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /allocated on/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /actions/i })).toBeInTheDocument();

    // Data verification
    expect(screen.getByText('AL1001')).toBeInTheDocument();
    expect(screen.getByText('MacBook Pro 16')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Engineering')).toBeInTheDocument();
  });

  it('should resolve and display correct status badges for various asset and employee conditions', () => {
    render(<AllocationTable allocations={mockAllocations} />);

    // Active (Employee active)
    expect(screen.getByText('Active')).toBeInTheDocument();

    // On Leave (Employee on-leave)
    expect(screen.getByText('On Leave')).toBeInTheDocument();

    // Terminated (Employee terminated)
    expect(screen.getByText('Terminated')).toBeInTheDocument();

    // Inactive (Employee inactive)
    expect(screen.getByText('Inactive')).toBeInTheDocument();

    // Returned (Assets with Available / unassigned status)
    expect(screen.getAllByText('Returned').length).toBeGreaterThan(0);
  });
});
