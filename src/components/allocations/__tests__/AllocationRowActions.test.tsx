import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AllocationRowActions } from '../AllocationRowActions';
import { useAssetStore } from '@/store/useAssetStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import type { Asset } from '@/types/asset';

describe('AllocationRowActions Component', () => {
  const mockAllocatedAsset: Asset = {
    id: 'ast-101',
    assetId: 'A1001',
    name: 'MacBook Pro 16',
    category: 'Laptop',
    status: 'Allocated',
    location: 'Headquarters',
    purchaseCost: 2499,
    purchaseDate: '2023-01-01',
    assignedTo: { id: 'emp-1', name: 'John Doe', department: 'Engineering' },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  };

  const mockAvailableAsset: Asset = {
    id: 'ast-102',
    assetId: 'A1002',
    name: 'Dell Monitor',
    category: 'Monitor',
    status: 'Available',
    location: 'Headquarters',
    purchaseCost: 400,
    purchaseDate: '2023-02-01',
    assignedTo: null,
    createdAt: '2023-02-01T00:00:00Z',
    updatedAt: '2023-02-01T00:00:00Z',
  };

  const mockOpenViewModal = vi.fn();
  const mockOpenAllocateModal = vi.fn();
  const mockDeallocateAsset = vi.fn();
  const mockUnassignAssetFromEmployee = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAssetStore.setState({
      openViewModal: mockOpenViewModal,
      openAllocateModal: mockOpenAllocateModal,
      deallocateAsset: mockDeallocateAsset,
    });
    useEmployeeStore.setState({
      unassignAssetFromEmployee: mockUnassignAssetFromEmployee,
    });
  });

  it('should render actions trigger button', () => {
    render(<AllocationRowActions asset={mockAllocatedAsset} />);
    expect(screen.getByRole('button', { name: /allocation actions/i })).toBeInTheDocument();
  });

  it('should open dropdown menu when trigger is clicked', async () => {
    const user = userEvent.setup();
    render(<AllocationRowActions asset={mockAllocatedAsset} />);

    const trigger = screen.getByRole('button', { name: /allocation actions/i });
    await user.click(trigger);

    expect(screen.getByRole('button', { name: /view details/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /deallocate \/ return/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reallocate asset/i })).toBeInTheDocument();
  });

  it('should call openViewModal when View Details is clicked', async () => {
    const user = userEvent.setup();
    render(<AllocationRowActions asset={mockAllocatedAsset} />);

    await user.click(screen.getByRole('button', { name: /allocation actions/i }));
    await user.click(screen.getByRole('button', { name: /view details/i }));

    expect(mockOpenViewModal).toHaveBeenCalledWith(mockAllocatedAsset);
  });

  it('should deallocate asset and unassign from employee when Deallocate / Return is clicked', async () => {
    const user = userEvent.setup();
    render(<AllocationRowActions asset={mockAllocatedAsset} />);

    await user.click(screen.getByRole('button', { name: /allocation actions/i }));
    await user.click(screen.getByRole('button', { name: /deallocate \/ return/i }));

    expect(mockUnassignAssetFromEmployee).toHaveBeenCalledWith('emp-1', 'ast-101');
    expect(mockDeallocateAsset).toHaveBeenCalledWith('ast-101');
  });

  it('should call openAllocateModal when Reallocate Asset is clicked', async () => {
    const user = userEvent.setup();
    render(<AllocationRowActions asset={mockAllocatedAsset} />);

    await user.click(screen.getByRole('button', { name: /allocation actions/i }));
    await user.click(screen.getByRole('button', { name: /reallocate asset/i }));

    expect(mockOpenAllocateModal).toHaveBeenCalledWith(mockAllocatedAsset);
  });

  it('should not display Deallocate button for assets that are not Allocated', async () => {
    const user = userEvent.setup();
    render(<AllocationRowActions asset={mockAvailableAsset} />);

    await user.click(screen.getByRole('button', { name: /allocation actions/i }));

    expect(screen.getByRole('button', { name: /view details/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /deallocate \/ return/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reallocate asset/i })).toBeInTheDocument();
  });

  it('should close dropdown menu when clicking outside', async () => {
    const user = userEvent.setup();
    render(<AllocationRowActions asset={mockAllocatedAsset} />);

    await user.click(screen.getByRole('button', { name: /allocation actions/i }));
    expect(screen.getByRole('button', { name: /view details/i })).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole('button', { name: /view details/i })).not.toBeInTheDocument();
  });
});
