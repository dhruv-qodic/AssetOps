import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { DeleteAssetModal } from '../DeleteAssetModal';
import { useAssetStore } from '@/store/useAssetStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { toast } from 'sonner';
import type { Asset } from '@/types/asset';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe('DeleteAssetModal Component', () => {
  const sampleAsset: Asset = {
    id: 'ast_del_1',
    assetId: 'A1009',
    name: 'MacBook Air M2',
    category: 'Laptop',
    status: 'Allocated',
    location: 'San Francisco',
    serialNumber: 'SN-AIR-99',
    purchaseDate: '2026-01-01',
    assignedTo: {
      id: 'emp_1',
      name: 'John Doe',
      department: 'Engineering',
    },
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useAssetStore.setState({
      assets: [sampleAsset],
      selectedAsset: sampleAsset,
      isDeleteModalOpen: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render modal with asset details and warning text when open', () => {
    render(<DeleteAssetModal />);

    expect(screen.getByRole('heading', { name: 'Delete Asset' })).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to remove this asset/i)).toBeInTheDocument();
    expect(screen.getByText('MacBook Air M2 (A1009)')).toBeInTheDocument();
    expect(screen.getByText(/Category: Laptop • Serial: SN-AIR-99/i)).toBeInTheDocument();
    expect(screen.getByText(/This action cannot be undone/i)).toBeInTheDocument();
  });

  it('should close modal when Cancel button is clicked', () => {
    render(<DeleteAssetModal />);

    const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelBtn);

    expect(useAssetStore.getState().isDeleteModalOpen).toBe(false);
  });

  it('should delete asset, unassign from employee, show toast, and close modal when confirmed', () => {
    const unassignSpy = vi.spyOn(useEmployeeStore.getState(), 'unassignAssetFromEmployee');
    const deleteSpy = vi.spyOn(useAssetStore.getState(), 'deleteAsset');

    render(<DeleteAssetModal />);

    const deleteBtn = screen.getByRole('button', { name: 'Delete Asset' });
    fireEvent.click(deleteBtn);

    expect(unassignSpy).toHaveBeenCalledWith('emp_1', 'ast_del_1');
    expect(deleteSpy).toHaveBeenCalledWith('ast_del_1');
    expect(toast.success).toHaveBeenCalledWith('Asset "MacBook Air M2" deleted successfully');
    expect(useAssetStore.getState().isDeleteModalOpen).toBe(false);
  });

  it('should return null when no selectedAsset is set in store', () => {
    useAssetStore.setState({ selectedAsset: null });
    const { container } = render(<DeleteAssetModal />);
    expect(container).toBeEmptyDOMElement();
  });
});
