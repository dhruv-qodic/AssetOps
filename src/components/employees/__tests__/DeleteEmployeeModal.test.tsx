import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { DeleteEmployeeModal } from '../DeleteEmployeeModal';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { useAssetStore } from '@/store/useAssetStore';
import { toast } from 'sonner';
import type { Employee } from '@/types/employee';
import type { Asset } from '@/types/asset';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe('DeleteEmployeeModal Component', () => {
  const sampleEmployee: Employee = {
    id: 'emp-del-1',
    employeeId: 'E990',
    firstName: 'David',
    lastName: 'Miller',
    email: 'david.miller@company.com',
    phone: '555-1234',
    department: 'Operations',
    position: 'Operations Manager',
    status: 'active',
    type: 'full-time',
    location: 'Headquarters',
    assignedAssets: ['asset-del-1'],
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  };

  const sampleAsset: Asset = {
    id: 'asset-del-1',
    assetId: 'AST-DEL-1',
    name: 'Office Monitor 27"',
    category: 'Monitor',
    status: 'Allocated',
    location: 'Headquarters',
    serialNumber: 'SN-MON-99',
    purchaseDate: '2026-01-01',
    assignedTo: {
      id: 'emp-del-1',
      employeeId: 'E990',
      name: 'David Miller',
      department: 'Operations',
    },
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useEmployeeStore.setState({
      employees: [sampleEmployee],
      selectedEmployee: sampleEmployee,
      isDeleteModalOpen: true,
    });
    useAssetStore.setState({
      assets: [sampleAsset],
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render confirmation modal with employee details when open', () => {
    render(<DeleteEmployeeModal />);

    expect(screen.getByText('Delete Employee')).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to delete/i)).toBeInTheDocument();
    expect(screen.getByText(/David Miller \(E990\)/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('should close the modal when Cancel button is clicked', () => {
    render(<DeleteEmployeeModal />);

    const cancelBtn = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelBtn);

    expect(useEmployeeStore.getState().isDeleteModalOpen).toBe(false);
    expect(useEmployeeStore.getState().employees.length).toBe(1);
  });

  it('should deallocate assigned assets and delete employee on confirm', () => {
    render(<DeleteEmployeeModal />);

    const deleteBtn = screen.getByRole('button', { name: 'Delete' });
    fireEvent.click(deleteBtn);

    // Employee should be deleted from store
    expect(useEmployeeStore.getState().employees.length).toBe(0);
    expect(useEmployeeStore.getState().isDeleteModalOpen).toBe(false);

    // Asset should now be deallocated
    const updatedAsset = useAssetStore.getState().assets[0];
    expect(updatedAsset.status).toBe('Available');
    expect(updatedAsset.assignedTo).toBeNull();

    // Toast success notification should be displayed
    expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('David Miller'));
  });
});
