import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import AllocateAssetModal from '../AllocateAssetModal';
import { useAssetStore } from '@/store/useAssetStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import type { Asset } from '@/types/asset';
import type { Employee } from '@/types/employee';

const TEST_ASSETS: Asset[] = [
  {
    id: 'ast_1',
    assetId: 'AST-001',
    name: 'MacBook Pro 16',
    category: 'Laptop',
    status: 'Available',
    purchaseCost: 2500,
    purchaseDate: '2024-01-15',
    location: 'Headquarters',
    assignedTo: null,
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z',
  },
  {
    id: 'ast_2',
    assetId: 'AST-002',
    name: 'Dell UltraSharp 27',
    category: 'Monitor',
    status: 'Available',
    purchaseCost: 600,
    purchaseDate: '2024-02-10',
    location: 'New York Office',
    assignedTo: null,
    createdAt: '2024-02-10T00:00:00.000Z',
    updatedAt: '2024-02-10T00:00:00.000Z',
  },
  {
    id: 'ast_3',
    assetId: 'AST-003',
    name: 'ThinkPad X1 Carbon',
    category: 'Laptop',
    status: 'Allocated',
    purchaseCost: 1800,
    purchaseDate: '2024-03-01',
    location: 'Remote',
    assignedTo: {
      id: 'emp_99',
      name: 'Existing User',
      email: 'user@example.com',
      department: 'Engineering',
      position: 'Developer',
      assignedDate: '2024-03-05',
    },
    createdAt: '2024-03-01T00:00:00.000Z',
    updatedAt: '2024-03-01T00:00:00.000Z',
  },
];

const TEST_EMPLOYEES: Employee[] = [
  {
    id: 'emp_1',
    employeeId: 'EMP-001',
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice@assetops.com',
    phone: '555-0101',
    department: 'Engineering',
    position: 'Senior Engineer',
    type: 'full-time',
    location: 'Headquarters',
    assignedAssets: [],
    status: 'active',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'emp_2',
    employeeId: 'EMP-002',
    firstName: 'Bob',
    lastName: 'Smith',
    email: 'bob@assetops.com',
    phone: '555-0102',
    department: 'Design',
    position: 'Product Designer',
    type: 'full-time',
    location: 'New York Office',
    assignedAssets: ['ast_99'],
    status: 'active',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

describe('AllocateAssetModal Component', () => {
  beforeEach(() => {
    useAssetStore.setState({
      assets: [...TEST_ASSETS],
      isAllocateModalOpen: true,
      selectedAsset: null,
    });

    useEmployeeStore.setState({
      employees: [...TEST_EMPLOYEES],
    });
  });

  it('should render all available assets in the asset selection area', () => {
    render(<AllocateAssetModal />);

    // Shows modal title
    expect(screen.getByText('Allocate Asset to Employee')).toBeInTheDocument();

    // Available assets badge should show count of 2 available assets
    expect(screen.getByText('2 Available')).toBeInTheDocument();

    // Available assets should be in document
    expect(screen.getByText('MacBook Pro 16')).toBeInTheDocument();
    expect(screen.getByText('Dell UltraSharp 27')).toBeInTheDocument();

    // Already allocated asset should NOT be in the available assets list
    expect(screen.queryByText('ThinkPad X1 Carbon')).not.toBeInTheDocument();
  });

  it('should allow user to select a specific available asset and an employee, then allocate correctly', () => {
    render(<AllocateAssetModal />);

    // Click to select the second available asset (Dell UltraSharp 27)
    const dellAsset = screen.getByText('Dell UltraSharp 27');
    fireEvent.click(dellAsset);

    // Select employee Alice Johnson
    const aliceEmployee = screen.getByText('Alice Johnson');
    fireEvent.click(aliceEmployee);

    // Submit allocation
    const allocateButton = screen.getByRole('button', { name: /allocate asset/i });
    expect(allocateButton).not.toBeDisabled();
    fireEvent.click(allocateButton);

    // Check store updates:
    const updatedAssets = useAssetStore.getState().assets;
    const allocatedAsset = updatedAssets.find((a) => a.id === 'ast_2');
    const otherAsset = updatedAssets.find((a) => a.id === 'ast_1');

    // ast_2 (Dell UltraSharp 27) should now be Allocated to Alice Johnson
    expect(allocatedAsset?.status).toBe('Allocated');
    expect(allocatedAsset?.assignedTo?.id).toBe('emp_1');
    expect(allocatedAsset?.assignedTo?.name).toBe('Alice Johnson');

    // ast_1 (MacBook Pro 16) should remain Available
    expect(otherAsset?.status).toBe('Available');
    expect(otherAsset?.assignedTo).toBeNull();

    // Modal should be closed
    expect(useAssetStore.getState().isAllocateModalOpen).toBe(false);
  });

  it('should filter available assets when searching by keyword', () => {
    render(<AllocateAssetModal />);

    const assetSearch = screen.getByPlaceholderText(
      /search available assets by name, ID, category, or location/i,
    );
    fireEvent.change(assetSearch, { target: { value: 'Monitor' } });

    expect(screen.getByText('Dell UltraSharp 27')).toBeInTheDocument();
    expect(screen.queryByText('MacBook Pro 16')).not.toBeInTheDocument();
  });
});
