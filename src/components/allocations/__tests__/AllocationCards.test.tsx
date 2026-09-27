import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AllocationCards } from '../AllocationCards';
import { useAssetStore } from '@/store/useAssetStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import type { Asset } from '@/types/asset';
import type { Employee } from '@/types/employee';

describe('AllocationCards Component', () => {
  const mockAssets: Asset[] = [
    {
      id: 'ast-1',
      assetId: 'A1001',
      name: 'MacBook Pro 16',
      category: 'Laptop',
      status: 'Allocated',
      location: 'New York',
      purchaseCost: 2499,
      purchaseDate: '2023-01-01',
      assignedTo: { id: 'emp-1', name: 'John Doe', department: 'Engineering' },
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    },
    {
      id: 'ast-2',
      assetId: 'A1002',
      name: 'Dell UltraSharp Monitor',
      category: 'Monitor',
      status: 'Allocated',
      location: 'San Francisco',
      purchaseCost: 799,
      purchaseDate: '2023-02-01',
      assignedTo: { id: 'emp-2', name: 'Jane Smith', department: 'Design' },
      createdAt: '2023-02-01T00:00:00Z',
      updatedAt: '2023-02-01T00:00:00Z',
    },
    {
      id: 'ast-3',
      assetId: 'A1003',
      name: 'Keychron Keyboard',
      category: 'Accessories',
      status: 'Available',
      location: 'New York',
      purchaseCost: 150,
      purchaseDate: '2023-03-01',
      assignedTo: null,
      createdAt: '2023-03-01T00:00:00Z',
      updatedAt: '2023-03-01T00:00:00Z',
    },
    {
      id: 'ast-4',
      assetId: 'A1004',
      name: 'Logitech Mouse',
      category: 'Accessories',
      status: 'Maintenance',
      location: 'New York',
      purchaseCost: 80,
      purchaseDate: '2023-04-01',
      assignedTo: null,
      createdAt: '2023-04-01T00:00:00Z',
      updatedAt: '2023-04-01T00:00:00Z',
    },
  ];

  const mockEmployees: Employee[] = [
    {
      id: 'emp-1',
      employeeId: 'EMP001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      department: 'Engineering',
      position: 'Senior Engineer',
      status: 'active',
      avatar: '',
      phone: '1234567890',
      location: 'New York',
      joinDate: '2022-01-01',
      allocatedAssetsCount: 1,
    },
    {
      id: 'emp-2',
      employeeId: 'EMP002',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      department: 'Design',
      position: 'Lead Designer',
      status: 'active',
      avatar: '',
      phone: '0987654321',
      location: 'San Francisco',
      joinDate: '2022-03-01',
      allocatedAssetsCount: 1,
    },
  ];

  beforeEach(() => {
    useAssetStore.setState({ assets: mockAssets });
    useEmployeeStore.setState({ employees: mockEmployees });
  });

  it('should render all 4 metric cards with computed metrics', () => {
    render(<AllocationCards />);

    // Total Allocations (2 allocated out of 4 = 50%)
    expect(screen.getByText('Total Allocations')).toBeInTheDocument();
    expect(screen.getByText('50% allocated')).toBeInTheDocument();
    expect(screen.getByText('Currently assigned hardware')).toBeInTheDocument();

    // Available Assets (1 available out of 4 = 25%)
    expect(screen.getByText('Available Assets')).toBeInTheDocument();
    expect(screen.getByText('25% ready')).toBeInTheDocument();
    expect(screen.getByText('Ready for assignment')).toBeInTheDocument();

    // Total Employees (2 total employees)
    expect(screen.getByText('Total Employees')).toBeInTheDocument();
    expect(screen.getByText('All staff')).toBeInTheDocument();
    expect(screen.getByText('Staff directory members')).toBeInTheDocument();

    // Deployment Rate (50%)
    expect(screen.getByText('Deployment Rate')).toBeInTheDocument();
    expect(screen.getByText('2/4 active')).toBeInTheDocument();
    expect(screen.getByText('Asset utilization efficiency')).toBeInTheDocument();
  });

  it('should handle zero assets and zero employees gracefully', () => {
    useAssetStore.setState({ assets: [] });
    useEmployeeStore.setState({ employees: [] });

    render(<AllocationCards />);

    expect(screen.getByText('0% allocated')).toBeInTheDocument();
    expect(screen.getByText('0% ready')).toBeInTheDocument();
    expect(screen.getByText('0/0 active')).toBeInTheDocument();
  });
});
