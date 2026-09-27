import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DashboardSummaryCards } from '../DashboardSummaryCards';
import { useAssetStore } from '@/store/useAssetStore';
import { useDashboardStore } from '@/store/useDashboardStore';
import type { Asset } from '@/types/asset';

describe('DashboardSummaryCards Component', () => {
  const mockAssets: Asset[] = [
    {
      id: 'a1',
      assetId: 'A1001',
      name: 'MacBook Pro 16',
      category: 'Laptop',
      status: 'Allocated',
      location: 'Headquarters',
      purchaseCost: 2500,
      purchaseDate: '2023-01-01',
      serialNumber: 'SN-A1001-01',
      assignedTo: { id: 'e1', name: 'John Doe', department: 'Engineering' },
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    },
    {
      id: 'a2',
      assetId: 'A1002',
      name: 'Dell Monitor',
      category: 'Monitor',
      status: 'Available',
      location: 'Headquarters',
      purchaseCost: 500,
      purchaseDate: '2023-02-01',
      serialNumber: 'SN-A1002-02',
      assignedTo: null,
      createdAt: '2023-02-01T00:00:00Z',
      updatedAt: '2023-02-01T00:00:00Z',
    },
    {
      id: 'a3',
      assetId: 'A1003',
      name: 'Keychron K2',
      category: 'Accessories',
      status: 'Maintenance',
      location: 'London Office',
      purchaseCost: 100,
      purchaseDate: '2023-03-01',
      serialNumber: 'SN-A1003-03',
      assignedTo: null,
      createdAt: '2023-03-01T00:00:00Z',
      updatedAt: '2023-03-01T00:00:00Z',
    },
  ];

  beforeEach(() => {
    useAssetStore.setState({ assets: mockAssets });
    useDashboardStore.setState({
      visibleCardIds: [
        'total_assets',
        'available_assets',
        'assigned_assets',
        'maintenance_assets',
        'total_asset_value',
      ],
      selectedLocation: 'All',
    });
  });

  it('should render all summary KPI metric cards with calculated values', () => {
    render(<DashboardSummaryCards />);

    expect(screen.getByText('Total Assets')).toBeInTheDocument();
    expect(screen.getByText('Available Assets')).toBeInTheDocument();
    expect(screen.getByText('Assigned Assets')).toBeInTheDocument();
    expect(screen.getByText('In Maintenance')).toBeInTheDocument();
    expect(screen.getByText('Total Asset Value')).toBeInTheDocument();

    // Total valuation = $2500 + $500 + $100 = $3,100
    expect(screen.getByText('$3,100')).toBeInTheDocument();
  });

  it('should filter summary metrics dynamically based on selectedLocation', () => {
    useDashboardStore.setState({ selectedLocation: 'London Office' });

    render(<DashboardSummaryCards />);

    expect(screen.getByText('Located in London Office')).toBeInTheDocument();
    // Only 1 asset in London Office ($100)
    expect(screen.getByText('$100')).toBeInTheDocument();
  });

  it('should respect visibleCardIds configuration and hide excluded cards', () => {
    useDashboardStore.setState({
      visibleCardIds: ['total_assets', 'total_asset_value'],
    });

    render(<DashboardSummaryCards />);

    expect(screen.getByText('Total Assets')).toBeInTheDocument();
    expect(screen.getByText('Total Asset Value')).toBeInTheDocument();
    expect(screen.queryByText('Available Assets')).not.toBeInTheDocument();
    expect(screen.queryByText('In Maintenance')).not.toBeInTheDocument();
  });

  it('should return null when visibleCardIds is empty', () => {
    useDashboardStore.setState({ visibleCardIds: [] });

    const { container } = render(<DashboardSummaryCards />);
    expect(container.firstChild).toBeNull();
  });
});
