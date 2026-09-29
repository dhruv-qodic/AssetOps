import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AssetDetailsModal from '../AssetDetailsModal';
import { useAssetStore } from '@/store/useAssetStore';
import type { Asset } from '@/types/asset';

const mockAsset: Asset = {
  id: 'ast_1001',
  assetId: 'A1001',
  name: 'Dell Precision 5570',
  model: 'Precision 5570',
  category: 'Laptop',
  status: 'Allocated',
  location: 'Headquarters',
  assignedTo: {
    id: 'emp_1',
    name: 'John Doe',
    email: 'john@example.com',
  },
  serialNumber: 'DELL-SN-9988',
  purchaseDate: '2023-05-12',
  specifications: {
    RAM: '32GB',
    Storage: '1TB SSD',
  },
  notes: 'Primary workstation assigned to John',
  createdAt: '2023-05-12T00:00:00Z',
  updatedAt: '2023-05-12T00:00:00Z',
};

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('AssetDetailsModal Component', () => {
  beforeEach(() => {
    useAssetStore.setState({
      selectedAsset: { ...mockAsset },
      isViewModalOpen: true,
      isQrModalOpen: false,
      isEditModalOpen: false,
    });
  });

  it('should render asset details correctly', () => {
    renderWithRouter(<AssetDetailsModal />);

    expect(screen.getByText('Dell Precision 5570')).toBeInTheDocument();
    expect(screen.getByText('A1001')).toBeInTheDocument();
    expect(screen.getByText('DELL-SN-9988')).toBeInTheDocument();
    expect(screen.getByText('Laptop')).toBeInTheDocument();
    expect(screen.getByText('Headquarters')).toBeInTheDocument();
    expect(screen.getByText('2023-05-12')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Primary workstation assigned to John')).toBeInTheDocument();
    expect(screen.getByText('32GB')).toBeInTheDocument();
    expect(screen.getByText('1TB SSD')).toBeInTheDocument();
  });

  it('should render the QR Code button at the bottom-left', () => {
    renderWithRouter(<AssetDetailsModal />);

    const qrButton = screen.getByRole('button', { name: /qr code/i });
    expect(qrButton).toBeInTheDocument();
  });

  it('should open QR Code modal beside Asset Details modal when QR Code button is clicked and keep Asset Details open', () => {
    renderWithRouter(<AssetDetailsModal />);

    const qrButton = screen.getByRole('button', { name: /qr code/i });
    fireEvent.click(qrButton);

    // QR Modal should be open in the store
    expect(useAssetStore.getState().isQrModalOpen).toBe(true);
    // Asset Details modal remains open in the store
    expect(useAssetStore.getState().isViewModalOpen).toBe(true);

    // QR modal title and actions should now appear
    expect(screen.getByText('Asset QR Code')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();

    // Asset details are still rendered in the view
    expect(screen.getAllByText('Dell Precision 5570').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Technical Specifications')).toBeInTheDocument();
  });

  it('should close only the QR modal when clicking the QR close button', () => {
    useAssetStore.setState({
      isQrModalOpen: true,
    });

    renderWithRouter(<AssetDetailsModal />);

    // Click close on QR modal
    const qrCloseBtn = screen.getByLabelText(/close qr modal/i);
    fireEvent.click(qrCloseBtn);

    expect(useAssetStore.getState().isQrModalOpen).toBe(false);
    expect(useAssetStore.getState().isViewModalOpen).toBe(true);
  });

  it('should close all modals when Close button in Asset Details footer is clicked', () => {
    useAssetStore.setState({
      isQrModalOpen: true,
    });

    renderWithRouter(<AssetDetailsModal />);

    const closeButtons = screen.getAllByRole('button', { name: /close/i });
    // Footer button with text "Close"
    const footerCloseBtn = closeButtons.find((btn) => btn.textContent === 'Close');
    expect(footerCloseBtn).toBeDefined();
    if (footerCloseBtn) {
      fireEvent.click(footerCloseBtn);
    }

    expect(useAssetStore.getState().isViewModalOpen).toBe(false);
    expect(useAssetStore.getState().isQrModalOpen).toBe(false);
    expect(useAssetStore.getState().selectedAsset).toBeNull();
  });

  it('should open edit modal when Edit Asset button is clicked', () => {
    renderWithRouter(<AssetDetailsModal />);

    const editBtn = screen.getByRole('button', { name: /edit asset/i });
    fireEvent.click(editBtn);

    expect(useAssetStore.getState().isEditModalOpen).toBe(true);
    expect(useAssetStore.getState().isViewModalOpen).toBe(false);
  });
});
