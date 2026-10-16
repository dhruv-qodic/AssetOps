import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { AssetKpiCards } from '../AssetKpiCards';
import { useAssetStore } from '@/store/useAssetStore';
import type { Asset } from '@/types/asset';

describe('AssetKpiCards Component', () => {
  const mockAssets: Asset[] = [
    {
      id: 'ast_1',
      assetId: 'A1001',
      name: 'MacBook Pro 16"',
      category: 'Laptop',
      status: 'Allocated',
      location: 'San Francisco',
      serialNumber: 'SN-001',
      purchaseDate: '2026-01-01',
      purchaseCost: 2500,
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    },
    {
      id: 'ast_2',
      assetId: 'A1002',
      name: 'Dell UltraSharp Monitor',
      category: 'Monitor',
      status: 'Available',
      location: 'San Francisco',
      serialNumber: 'SN-002',
      purchaseDate: '2026-01-01',
      purchaseCost: 800,
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    },
    {
      id: 'ast_3',
      assetId: 'A1003',
      name: 'HP EliteBook',
      category: 'Laptop',
      status: 'Maintenance',
      location: 'New York Office',
      serialNumber: 'SN-003',
      purchaseDate: '2026-01-01',
      purchaseCost: 1200,
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    },
    {
      id: 'ast_4',
      assetId: 'A1004',
      name: 'Old Server Rack',
      category: 'Desktop',
      status: 'Retired',
      location: 'London Office',
      serialNumber: 'SN-004',
      purchaseDate: '2026-01-01',
      purchaseCost: 500,
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    },
  ];

  beforeEach(() => {
    useAssetStore.setState({ assets: mockAssets });
  });

  it('should calculate and render total valuation and asset count', () => {
    render(<AssetKpiCards />);

    // Total Valuation = 2500 + 800 + 1200 + 500 = 5000
    expect(screen.getByText('$5,000')).toBeInTheDocument();
    expect(screen.getByText(/Across 4 total registered assets/i)).toBeInTheDocument();
  });

  it('should render available assets count and percentage', () => {
    render(<AssetKpiCards />);

    // Available count = 1 (25%)
    expect(screen.getByText('Available Assets')).toBeInTheDocument();
    expect(screen.getByText('(25%)')).toBeInTheDocument();
  });

  it('should render deployment and utilization metrics accurately', () => {
    render(<AssetKpiCards />);

    expect(screen.getByText('Active Asset Allocations')).toBeInTheDocument();
    // 1 allocated out of 4 total -> 25% utilized
    expect(screen.getByText('25% Utilized')).toBeInTheDocument();
    expect(screen.getByText('/ 4 Assets')).toBeInTheDocument();
    // Allocated valuation = 2500
    expect(screen.getByText('Allocated Value: $2,500')).toBeInTheDocument();
  });

  it('should render maintenance and retired stats', () => {
    render(<AssetKpiCards />);

    expect(screen.getByText(/Maintenance: 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Retired: 1/i)).toBeInTheDocument();
  });

  it('should handle empty asset list without crashing', () => {
    useAssetStore.setState({ assets: [] });
    render(<AssetKpiCards />);

    expect(screen.getByText('$0')).toBeInTheDocument();
    expect(screen.getByText(/Across 0 total registered assets/i)).toBeInTheDocument();
    expect(screen.getByText('0% Utilized')).toBeInTheDocument();
  });
});
