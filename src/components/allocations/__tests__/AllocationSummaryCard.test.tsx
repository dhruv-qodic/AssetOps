import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AllocationSummaryCard } from '../AllocationSummaryCard';
import { useAssetStore } from '@/store/useAssetStore';
import type { Asset } from '@/types/asset';

describe('AllocationSummaryCard Component', () => {
  const mockAssets: Asset[] = [
    {
      id: 'ast-1',
      assetId: 'A1001',
      name: 'Laptop 1',
      category: 'Laptop',
      status: 'Allocated',
      location: 'HQ',
      purchaseCost: 1500,
      purchaseDate: '2023-01-01',
      assignedTo: { id: 'emp-1', name: 'John', department: 'IT' },
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    },
    {
      id: 'ast-2',
      assetId: 'A1002',
      name: 'Laptop 2',
      category: 'Laptop',
      status: 'Allocated',
      location: 'HQ',
      purchaseCost: 1500,
      purchaseDate: '2023-01-01',
      assignedTo: { id: 'emp-2', name: 'Jane', department: 'IT' },
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    },
    {
      id: 'ast-3',
      assetId: 'A1003',
      name: 'Monitor 1',
      category: 'Monitor',
      status: 'Available',
      location: 'HQ',
      purchaseCost: 300,
      purchaseDate: '2023-01-01',
      assignedTo: null,
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    },
    {
      id: 'ast-4',
      assetId: 'A1004',
      name: 'Printer 1',
      category: 'Peripherals',
      status: 'Maintenance',
      location: 'HQ',
      purchaseCost: 500,
      purchaseDate: '2023-01-01',
      assignedTo: null,
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    },
  ];

  beforeEach(() => {
    useAssetStore.setState({ assets: mockAssets });
  });

  it('should render card title and SVG donut chart with total asset label', () => {
    render(<AllocationSummaryCard />);

    expect(screen.getByText('Allocation Summary')).toBeInTheDocument();
    expect(screen.getByText('Total Assets')).toBeInTheDocument();
  });

  it('should compute and render percentages for Allocated, Available, and Maintenance in legend', () => {
    render(<AllocationSummaryCard />);

    // 2 allocated out of 4 = 50%
    expect(screen.getByText('Allocated')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();

    // 1 available out of 4 = 25%, 1 maintenance out of 4 = 25%
    expect(screen.getByText('Available')).toBeInTheDocument();
    expect(screen.getByText('Maintenance')).toBeInTheDocument();
    expect(screen.getAllByText('25%')).toHaveLength(2);
  });

  it('should render default fallback metrics when store has no assets', () => {
    useAssetStore.setState({ assets: [] });

    render(<AllocationSummaryCard />);

    expect(screen.getByText('1,248')).toBeInTheDocument();
    expect(screen.getByText('68%')).toBeInTheDocument();
    expect(screen.getByText('24%')).toBeInTheDocument();
    expect(screen.getByText('8%')).toBeInTheDocument();
  });
});
