import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AssetDetailsModal } from '../AssetDetailsModal';
import { useAssetStore } from '@/store/useAssetStore';
import type { Asset } from '@/types/asset';

describe('AssetDetailsModal Component', () => {
  const mockAsset: Asset = {
    id: 'ast-details-1',
    assetId: 'A1050',
    name: 'MacBook Air M2',
    model: 'Air M2 2023',
    category: 'Laptop',
    status: 'Allocated',
    location: 'Headquarters',
    purchaseCost: 1199,
    purchaseDate: '2023-05-01',
    serialNumber: 'SN-MBA-9988',
    assignedTo: { id: 'emp-1', name: 'Alice Cooper', department: 'Engineering' },
    specifications: { RAM: '16GB', SSD: '512GB' },
    notes: 'Standard engineering issue',
    createdAt: '2023-05-01T00:00:00Z',
    updatedAt: '2023-05-01T00:00:00Z',
  };

  const mockOpenEditModal = vi.fn();
  const mockCloseModals = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAssetStore.setState({
      isViewModalOpen: true,
      selectedAsset: mockAsset,
      openEditModal: mockOpenEditModal,
      closeModals: mockCloseModals,
    });
  });

  it('should render asset name, category, serial number, specifications, and notes', () => {
    render(<AssetDetailsModal />);

    expect(screen.getByText('MacBook Air M2')).toBeInTheDocument();
    expect(screen.getByText('A1050')).toBeInTheDocument();
    expect(screen.getByText('SN-MBA-9988')).toBeInTheDocument();
    expect(screen.getByText('Alice Cooper')).toBeInTheDocument();
    expect(screen.getByText('RAM')).toBeInTheDocument();
    expect(screen.getByText('16GB')).toBeInTheDocument();
    expect(screen.getByText('SSD')).toBeInTheDocument();
    expect(screen.getByText('512GB')).toBeInTheDocument();
    expect(screen.getByText(/Standard engineering issue/i)).toBeInTheDocument();
  });

  it('should call closeModals and openEditModal when Edit Asset button is clicked', async () => {
    const user = userEvent.setup();
    render(<AssetDetailsModal />);

    const editBtn = screen.getByRole('button', { name: /edit asset/i });
    await user.click(editBtn);

    expect(mockCloseModals).toHaveBeenCalledTimes(1);
    expect(mockOpenEditModal).toHaveBeenCalledWith(mockAsset);
  });

  it('should close modal when Close button is clicked', async () => {
    const user = userEvent.setup();
    render(<AssetDetailsModal />);

    const closeButtons = screen.getAllByRole('button', { name: /close/i });
    await user.click(closeButtons[0]);

    expect(mockCloseModals).toHaveBeenCalledTimes(1);
  });
});
