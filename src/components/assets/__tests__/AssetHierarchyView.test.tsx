import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AssetHierarchyView } from '../AssetHierarchyView';
import { useAssetStore } from '@/store/useAssetStore';
import type { Asset } from '@/types/asset';

const mockAssets: Asset[] = [
  {
    id: 'ast_101',
    assetId: 'AST-101',
    name: 'Dell Precision 5570',
    model: 'Precision 5570',
    category: 'Laptop',
    status: 'Allocated',
    location: 'Headquarters',
    purchaseDate: '2023-01-10',
    purchaseCost: 2200,
    serialNumber: 'DP-5570-9988',
    assignedTo: {
      id: 'emp_01',
      name: 'Rahul Sharma',
      email: 'rahul@company.com',
      department: 'Engineering',
    },
    createdAt: '2023-01-10T00:00:00Z',
    updatedAt: '2023-01-10T00:00:00Z',
  },
  {
    id: 'ast_102',
    assetId: 'AST-102',
    name: 'MacBook Pro 16',
    model: 'M2 Max',
    category: 'Laptop',
    status: 'Allocated',
    location: 'Headquarters',
    purchaseDate: '2023-03-15',
    purchaseCost: 2800,
    serialNumber: 'MBP-16-7711',
    assignedTo: {
      id: 'emp_02',
      name: 'Sarah Jenkins',
      email: 'sarah@company.com',
      department: 'Design',
    },
    createdAt: '2023-03-15T00:00:00Z',
    updatedAt: '2023-03-15T00:00:00Z',
  },
  {
    id: 'ast_103',
    assetId: 'AST-103',
    name: 'Apple Studio Display',
    model: '27" 5K',
    category: 'Monitor',
    status: 'Available',
    location: 'New York Office',
    purchaseDate: '2023-06-20',
    purchaseCost: 1599,
    serialNumber: 'ASD-27-3344',
    assignedTo: null,
    createdAt: '2023-06-20T00:00:00Z',
    updatedAt: '2023-06-20T00:00:00Z',
  },
];

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('AssetHierarchyView Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAssetStore.setState({
      assets: mockAssets,
      isQrModalOpen: false,
      isEditModalOpen: false,
      selectedAsset: null,
    });
  });

  it('should render hierarchy tree grouped by Location, Department, Employee and Assets', () => {
    renderWithRouter(<AssetHierarchyView assets={mockAssets} />);

    // Top Summary
    expect(screen.getByText('Asset Hierarchy Tree')).toBeInTheDocument();
    expect(screen.getByText(/Offices/i)).toBeInTheDocument();

    // Locations
    expect(screen.getByText('Headquarters')).toBeInTheDocument();
    expect(screen.getByText('New York Office')).toBeInTheDocument();

    // Departments under Headquarters
    expect(screen.getByText('Engineering')).toBeInTheDocument();
    expect(screen.getByText('Design')).toBeInTheDocument();

    // Employees
    expect(screen.getByText('Rahul Sharma')).toBeInTheDocument();
    expect(screen.getByText('Sarah Jenkins')).toBeInTheDocument();

    // Assets
    expect(screen.getByText('Dell Precision 5570')).toBeInTheDocument();
    expect(screen.getByText('AST-101')).toBeInTheDocument();
  });

  it('should toggle collapse and expand for hierarchy nodes', () => {
    renderWithRouter(<AssetHierarchyView assets={mockAssets} />);

    // Click Headquarters to collapse it
    const hqButton = screen.getByRole('button', { name: /Headquarters/i });
    fireEvent.click(hqButton);

    // Children under HQ should now be hidden
    expect(screen.queryByText('Rahul Sharma')).not.toBeInTheDocument();

    // Click again to re-expand
    fireEvent.click(hqButton);
    expect(screen.getByText('Rahul Sharma')).toBeInTheDocument();
  });

  it('should expand and collapse all nodes when clicking control buttons', () => {
    renderWithRouter(<AssetHierarchyView assets={mockAssets} />);

    // Collapse All
    const collapseAllBtn = screen.getByRole('button', { name: /collapse all/i });
    fireEvent.click(collapseAllBtn);

    expect(screen.queryByText('Rahul Sharma')).not.toBeInTheDocument();
    expect(screen.queryByText('Engineering')).not.toBeInTheDocument();

    // Expand All
    const expandAllBtn = screen.getByRole('button', { name: /expand all/i });
    fireEvent.click(expandAllBtn);

    expect(screen.getByText('Rahul Sharma')).toBeInTheDocument();
    expect(screen.getByText('Engineering')).toBeInTheDocument();
  });

  it('should filter hierarchy tree using tree search input', () => {
    renderWithRouter(<AssetHierarchyView assets={mockAssets} />);

    const searchInput = screen.getByPlaceholderText(/search tree\.\.\./i);
    fireEvent.change(searchInput, { target: { value: 'Studio Display' } });

    // Only Studio Display and New York Office should be present
    expect(screen.getByText('Apple Studio Display')).toBeInTheDocument();
    expect(screen.queryByText('Dell Precision 5570')).not.toBeInTheDocument();
  });

  it('should open QR modal and Edit modal when action buttons are clicked on asset leaf', () => {
    renderWithRouter(<AssetHierarchyView assets={mockAssets} />);

    const qrBtns = screen.getAllByTitle(/view qr code/i);
    fireEvent.click(qrBtns[0]);

    expect(useAssetStore.getState().isQrModalOpen).toBe(true);

    const editBtns = screen.getAllByTitle(/edit asset/i);
    fireEvent.click(editBtns[0]);

    expect(useAssetStore.getState().isEditModalOpen).toBe(true);
  });

  it('should render empty state when asset list is empty', () => {
    const onClearMock = vi.fn();
    renderWithRouter(<AssetHierarchyView assets={[]} onClearFilters={onClearMock} />);

    expect(screen.getByText('No assets available for hierarchy view')).toBeInTheDocument();
  });
});
