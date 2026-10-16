import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AssetTable } from '../AssetTable';
import { useColumnVisibilityStore } from '@/store/useColumnVisibilityStore';
import type { Asset } from '@/types/asset';

const MOCK_TABLE_ASSETS: Asset[] = [
  {
    id: 'test-1',
    assetId: 'A1001',
    name: 'Dell Precision 5570',
    model: 'Precision 5570',
    category: 'Laptop',
    status: 'Allocated',
    location: 'Headquarters',
    purchaseCost: 1999,
    assignedTo: {
      id: 'emp-1',
      name: 'John Doe',
      department: 'Engineering',
    },
    serialNumber: 'SN-987654321',
    purchaseDate: '2023-01-15',
    warrantyExpiry: '2026-01-15',
    notes: 'Primary dev laptop',
    specifications: { RAM: '32GB', Storage: '1TB SSD' },
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2023-05-10T00:00:00Z',
  },
  {
    id: 'test-2',
    assetId: 'A1002',
    name: 'Apple iPhone 15 Pro',
    model: '15 Pro 256GB',
    category: 'Mobile',
    status: 'Available',
    location: 'New York Office',
    purchaseCost: 1099,
    assignedTo: null,
    serialNumber: 'SN-123456789',
    purchaseDate: '2023-09-20',
    warrantyExpiry: '2025-09-20',
    createdAt: '2023-09-20T00:00:00Z',
    updatedAt: '2023-09-20T00:00:00Z',
  },
];

describe('AssetTable Component', () => {
  beforeEach(() => {
    useColumnVisibilityStore.getState().resetToDefault();
  });

  it('should render default table headers and row data', () => {
    render(<AssetTable assets={MOCK_TABLE_ASSETS} />);

    // Default visible columns: Asset ID, Name, Category, Status, Location, Cost, Assigned To, Actions
    expect(screen.getByRole('columnheader', { name: /asset id/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /name/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /category/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /status/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /location/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /cost/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /assigned to/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /actions/i })).toBeInTheDocument();

    // Data verification
    expect(screen.getByText('A1001')).toBeInTheDocument();
    expect(screen.getByText('Dell Precision 5570')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('A1002')).toBeInTheDocument();
    expect(screen.getByText('Apple iPhone 15 Pro')).toBeInTheDocument();
  });

  it('should remove a column when clicking on its header', async () => {
    const user = userEvent.setup();
    render(<AssetTable assets={MOCK_TABLE_ASSETS} />);

    // Location is initially visible
    const locationHeader = screen.getByRole('columnheader', { name: /location/i });
    expect(locationHeader).toBeInTheDocument();
    expect(screen.getByText('Headquarters')).toBeInTheDocument();

    // Click on Location header to hide/remove it
    await user.click(locationHeader);

    // Location header and data should no longer be rendered
    expect(screen.queryByRole('columnheader', { name: /location/i })).not.toBeInTheDocument();
    expect(screen.queryByText('Headquarters')).not.toBeInTheDocument();

    // Zustand store should also reflect this change
    expect(useColumnVisibilityStore.getState().visibleColumnIds).not.toContain('location');
  });

  it('should render newly added columns when store visibleColumnIds updates', () => {
    // Add Serial Number and Warranty Expiry to visible columns
    useColumnVisibilityStore
      .getState()
      .setVisibleColumns(['assetId', 'serialNumber', 'warrantyExpiry']);

    render(<AssetTable assets={MOCK_TABLE_ASSETS} />);

    expect(screen.getByRole('columnheader', { name: /serial number/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /warranty expiry/i })).toBeInTheDocument();
    expect(screen.getByText('SN-987654321')).toBeInTheDocument();
    expect(screen.getByText('SN-123456789')).toBeInTheDocument();
  });

  it('should display empty message when no columns are visible', () => {
    useColumnVisibilityStore.getState().clearAll();

    render(<AssetTable assets={MOCK_TABLE_ASSETS} />);

    expect(screen.getByText(/no columns currently visible/i)).toBeInTheDocument();
  });

  it('should render loading state when isLoading is true', () => {
    render(<AssetTable assets={[]} isLoading={true} />);
    expect(screen.getByText(/loading assets\.\.\./i)).toBeInTheDocument();
  });

  it('should render error state with retry button', async () => {
    const user = userEvent.setup();
    const handleRetry = vi.fn();
    render(<AssetTable assets={[]} error="Network timeout error" onRetry={handleRetry} />);

    expect(screen.getByText(/failed to load assets/i)).toBeInTheDocument();
    expect(screen.getByText(/network timeout error/i)).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /try again/i });
    await user.click(retryBtn);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });
});
