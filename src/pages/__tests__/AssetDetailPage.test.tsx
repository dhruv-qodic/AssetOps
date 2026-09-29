import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AssetDetailPage from '../AssetDetailPage';
import { useAssetStore } from '@/store/useAssetStore';
import type { Asset } from '@/types/asset';

const mockTestAsset: Asset = {
  id: 'ast_1025',
  assetId: 'AST-1025',
  name: 'Dell Laptop Latitude 5440',
  model: 'Latitude 5440',
  category: 'Laptop',
  status: 'Allocated',
  location: 'HQ - Floor 2',
  serialNumber: 'DLTS440-001',
  purchaseDate: '2024-04-10',
  purchaseCost: 1450,
  warrantyExpiry: 'Valid (Until Apr 2027)',
  assignedTo: {
    id: 'emp_101',
    name: 'John Doe',
    email: 'john.doe@assetops.com',
    department: 'IT Department',
    assignedDate: '2024-05-20',
  },
  allocationHistory: [
    {
      id: 'hist_1025_3',
      assetId: 'AST-1025',
      employeeId: 'emp_101',
      employeeName: 'John Doe',
      employeeEmail: 'john.doe@assetops.com',
      department: 'IT Department',
      action: 'Allocated',
      date: '2024-05-20',
      notes: 'Workstation re-assigned',
      performedBy: 'IT Operations',
    },
    {
      id: 'hist_1025_2',
      assetId: 'AST-1025',
      employeeId: 'emp_102',
      employeeName: 'Alice Smith',
      employeeEmail: 'alice.smith@assetops.com',
      department: 'Design',
      action: 'Deallocated',
      date: '2024-05-15',
      notes: 'Device returned for reallocation',
      performedBy: 'IT Custodian',
    },
    {
      id: 'hist_1025_1',
      assetId: 'AST-1025',
      employeeId: 'emp_102',
      employeeName: 'Alice Smith',
      employeeEmail: 'alice.smith@assetops.com',
      department: 'Design',
      action: 'Allocated',
      date: '2024-04-12',
      notes: 'Initial assignment',
      performedBy: 'IT Operations',
    },
  ],
  specifications: {
    Processor: 'Intel Core i7-1365U',
    RAM: '32GB DDR5',
    Storage: '512GB NVMe SSD',
    Screen: '14" FHD IPS',
  },
  notes: 'Primary laptop for development work.',
  createdAt: '2024-04-10T08:00:00Z',
  updatedAt: '2024-05-20T08:00:00Z',
};

const renderWithRouter = (initialPath: string) => {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/assets" element={<div>Assets List Page</div>} />
        <Route path="/assets/:assetId" element={<AssetDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
};

describe('AssetDetailPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAssetStore.setState({
      assets: [{ ...mockTestAsset }],
      selectedAsset: null,
      isEditModalOpen: false,
      isQrModalOpen: false,
      isLoading: false,
    });
  });

  it('should find and render complete asset details and metadata with icons based on URL param', () => {
    renderWithRouter('/assets/AST-1025');

    // Breadcrumb and Page Title
    expect(screen.getByText('Asset Details')).toBeInTheDocument();
    expect(screen.getAllByText('AST-1025').length).toBeGreaterThan(0);

    // Hero Overview
    expect(screen.getByText('Dell Laptop Latitude 5440')).toBeInTheDocument();
    expect(screen.getByText('DLTS440-001')).toBeInTheDocument();
    expect(screen.getAllByText('Laptop').length).toBeGreaterThan(0);
    expect(screen.getAllByText('HQ - Floor 2').length).toBeGreaterThan(0);
    expect(screen.getAllByText('2024-04-10').length).toBeGreaterThan(0);
    expect(screen.getByText('$1,450')).toBeInTheDocument();
    expect(screen.getByText('Valid (Until Apr 2027)')).toBeInTheDocument();
    expect(screen.getAllByText('Allocated').length).toBeGreaterThan(0);

    // Allocation Card
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText(/IT Department/i)).toBeInTheDocument();
    expect(screen.getByText(/Allocated on 2024-05-20/i)).toBeInTheDocument();

    // Specifications & Notes
    expect(screen.getByText('Intel Core i7-1365U')).toBeInTheDocument();
    expect(screen.getByText('32GB DDR5')).toBeInTheDocument();
    expect(screen.getByText('Primary laptop for development work.')).toBeInTheDocument();
  });

  it('should render complete allocation & deallocation history in chronological order', () => {
    renderWithRouter('/assets/AST-1025');

    // Switch to Allocation History tab
    const historyTab = screen.getByRole('button', { name: /allocation history/i });
    fireEvent.click(historyTab);

    expect(screen.getByText('Complete Allocation & Deallocation History')).toBeInTheDocument();
    expect(screen.getByText(/Total Events:/i)).toBeInTheDocument();

    // Verify all history events (Alice Smith Allocated -> Alice Smith Deallocated -> John Doe Allocated)
    expect(screen.getAllByText('Alice Smith').length).toBe(2);
    expect(screen.getAllByText('John Doe').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Allocated').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Deallocated').length).toBeGreaterThan(0);

    expect(screen.getByText('2024-05-20')).toBeInTheDocument();
    expect(screen.getByText('2024-05-15')).toBeInTheDocument();
    expect(screen.getByText('2024-04-12')).toBeInTheDocument();

    expect(screen.getByText(/"Workstation re-assigned"/i)).toBeInTheDocument();
    expect(screen.getByText(/"Device returned for reallocation"/i)).toBeInTheDocument();
  });

  it('should allow deallocating an allocated asset and update status and history', () => {
    renderWithRouter('/assets/AST-1025');

    const deallocateButton = screen.getByRole('button', { name: /deallocate/i });
    expect(deallocateButton).toBeInTheDocument();

    fireEvent.click(deallocateButton);

    // Asset status should now be Available in store
    const updatedAsset = useAssetStore.getState().assets.find((a) => a.id === 'ast_1025');
    expect(updatedAsset?.status).toBe('Available');
    expect(updatedAsset?.assignedTo).toBeNull();
  });

  it('should render Asset Not Found empty state when given an invalid or non-existing asset ID', () => {
    renderWithRouter('/assets/INVALID_NON_EXISTENT_ID');

    expect(screen.getByText('Asset Not Found')).toBeInTheDocument();
    expect(screen.getByText(/INVALID_NON_EXISTENT_ID/i)).toBeInTheDocument();

    const backButton = screen.getByRole('button', { name: /back to assets list/i });
    expect(backButton).toBeInTheDocument();
    fireEvent.click(backButton);

    expect(screen.getByText('Assets List Page')).toBeInTheDocument();
  });

  it('should open edit modal when Edit Asset button is clicked', () => {
    renderWithRouter('/assets/AST-1025');

    const editButton = screen.getByRole('button', { name: /edit asset/i });
    fireEvent.click(editButton);

    expect(useAssetStore.getState().isEditModalOpen).toBe(true);
    expect(useAssetStore.getState().selectedAsset?.assetId).toBe('AST-1025');
  });

  it('should open QR modal when QR Code button is clicked', () => {
    renderWithRouter('/assets/AST-1025');

    const qrButton = screen.getByRole('button', { name: /qr code/i });
    fireEvent.click(qrButton);

    expect(useAssetStore.getState().isQrModalOpen).toBe(true);
    expect(useAssetStore.getState().selectedAsset?.assetId).toBe('AST-1025');
  });

  it('should allow switching between tabs (Details, Allocation History)', () => {
    renderWithRouter('/assets/AST-1025');

    // Initial tab: Details
    expect(screen.getByText('Current Allocation')).toBeInTheDocument();

    // Switch to Allocation History tab
    const historyTab = screen.getByRole('button', { name: /allocation history/i });
    fireEvent.click(historyTab);
    expect(screen.getByText('Complete Allocation & Deallocation History')).toBeInTheDocument();

    // Switch back to Details tab
    const detailsTab = screen.getByRole('button', { name: /details/i });
    fireEvent.click(detailsTab);
    expect(screen.getByText('Current Allocation')).toBeInTheDocument();
  });

  it('should render unallocated state cleanly when asset is available', () => {
    const availableAsset: Asset = {
      ...mockTestAsset,
      id: 'ast_available_1',
      assetId: 'AST-AVAILABLE',
      status: 'Available',
      assignedTo: null,
      allocationHistory: [],
    };

    useAssetStore.setState({
      assets: [availableAsset],
    });

    renderWithRouter('/assets/AST-AVAILABLE');

    expect(screen.getByText('Available')).toBeInTheDocument();
    expect(
      screen.getByText(/this asset is currently in inventory and not allocated/i),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /allocate asset/i }).length).toBeGreaterThan(0);
  });
});
