import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeleteAssetModal } from '../DeleteAssetModal';
import { useAssetStore } from '@/store/useAssetStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import type { Asset } from '@/types/asset';

describe('DeleteAssetModal Component', () => {
  const mockAsset: Asset = {
    id: 'ast-delete-1',
    assetId: 'A1099',
    name: 'Obsolete Laptop',
    category: 'Laptop',
    status: 'Allocated',
    location: 'HQ',
    purchaseCost: 800,
    purchaseDate: '2021-01-01',
    assignedTo: { id: 'emp-1', name: 'John Doe', department: 'Engineering' },
    serialNumber: 'SN-DEL-01',
    createdAt: '2021-01-01T00:00:00Z',
    updatedAt: '2021-01-01T00:00:00Z',
  };

  const mockDeleteAsset = vi.fn();
  const mockCloseModals = vi.fn();
  const mockUnassign = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAssetStore.setState({
      isDeleteModalOpen: true,
      selectedAsset: mockAsset,
      deleteAsset: mockDeleteAsset,
      closeModals: mockCloseModals,
    });
    useEmployeeStore.setState({
      unassignAssetFromEmployee: mockUnassign,
    });
  });

  it('should render dialog header, asset details, and delete confirmation button', () => {
    render(<DeleteAssetModal />);

    expect(screen.getByRole('heading', { name: 'Delete Asset' })).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to remove this asset/i)).toBeInTheDocument();
    expect(screen.getByText('Obsolete Laptop (A1099)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete Asset' })).toBeInTheDocument();
  });

  it('should call unassignAssetFromEmployee, deleteAsset, and closeModals when confirmed', async () => {
    const user = userEvent.setup();
    render(<DeleteAssetModal />);

    const deleteBtn = screen.getByRole('button', { name: /delete asset/i });
    await user.click(deleteBtn);

    expect(mockUnassign).toHaveBeenCalledWith('emp-1', 'ast-delete-1');
    expect(mockDeleteAsset).toHaveBeenCalledWith('ast-delete-1');
    expect(mockCloseModals).toHaveBeenCalledTimes(1);
  });

  it('should close modal when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<DeleteAssetModal />);

    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelBtn);

    expect(mockCloseModals).toHaveBeenCalledTimes(1);
  });
});
