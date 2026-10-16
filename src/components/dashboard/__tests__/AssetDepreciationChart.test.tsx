import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AssetDepreciationChart } from '../AssetDepreciationChart';
import { useAssetStore } from '@/store/useAssetStore';
import { useDashboardStore } from '@/store/useDashboardStore';
import type { Asset } from '@/types/asset';

// Mock Recharts ResponsiveContainer for JSDOM
vi.mock('recharts', async () => {
  const actual = await vi.importActual<typeof import('recharts')>('recharts');
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container" style={{ width: 600, height: 300 }}>
        {children}
      </div>
    ),
  };
});

const mockAssets: Asset[] = [
  {
    id: 'ast_1',
    assetId: 'A1001',
    name: 'MacBook Pro 16',
    category: 'Laptop',
    status: 'Allocated',
    location: 'Headquarters',
    purchaseDate: '2023-01-01',
    purchaseCost: 6000,
    serialNumber: 'SN-001',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 'ast_2',
    assetId: 'A1002',
    name: 'Dell Precision',
    category: 'Laptop',
    status: 'Available',
    location: 'Headquarters',
    purchaseDate: '2023-02-01',
    purchaseCost: 6000,
    serialNumber: 'SN-002',
    createdAt: '2023-02-01T00:00:00Z',
    updatedAt: '2023-02-01T00:00:00Z',
  },
  {
    id: 'ast_3',
    assetId: 'A1003',
    name: 'Studio Display',
    category: 'Monitor',
    status: 'Allocated',
    location: 'New York Office',
    purchaseDate: '2023-03-01',
    purchaseCost: 3000,
    serialNumber: 'SN-003',
    createdAt: '2023-03-01T00:00:00Z',
    updatedAt: '2023-03-01T00:00:00Z',
  },
];

describe('AssetDepreciationChart Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAssetStore.setState({
      assets: mockAssets,
      isLoading: false,
      error: null,
    });
    useDashboardStore.setState({
      selectedLocation: 'All',
      timeRange: 'Last 30 Days',
    });
  });

  it('should render chart title, straight-line model badge, and annual depreciation calculations', () => {
    render(<AssetDepreciationChart />);

    // Total cost = 6000 + 6000 + 3000 = $15,000
    // Default useful life = 5 years -> Annual Depreciation = $15,000 / 5 = $3,000 / yr
    expect(screen.getByText('Asset Depreciation & Book Value')).toBeInTheDocument();
    expect(screen.getByText('Straight-Line Model')).toBeInTheDocument();
    expect(screen.getByText('$15,000')).toBeInTheDocument();
    expect(screen.getAllByText('$3,000 / yr').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('5 Years')).toBeInTheDocument();
    expect(screen.getByText('3 Assets')).toBeInTheDocument();
  });

  it('should calculate annual depreciation correctly for different useful life values', async () => {
    const user = userEvent.setup();
    render(<AssetDepreciationChart />);

    // Switch to 3 Years useful life: $15,000 / 3 = $5,000 / yr
    const threeYearsBtn = screen.getByRole('button', { name: /3Y/i });
    await user.click(threeYearsBtn);

    expect(screen.getAllByText('$5,000 / yr').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('3 Years')).toBeInTheDocument();

    // Switch to 10 Years useful life: $15,000 / 10 = $1,500 / yr
    const tenYearsBtn = screen.getByRole('button', { name: /10Y/i });
    await user.click(tenYearsBtn);

    expect(screen.getAllByText('$1,500 / yr').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('10 Years')).toBeInTheDocument();
  });

  it('should filter depreciation calculations when location filter is applied in dashboard store', () => {
    // Filter by 'New York Office' -> only Studio Display ($3,000)
    // At 5 years: $3,000 / 5 = $600 / yr
    useDashboardStore.setState({
      selectedLocation: 'New York Office',
    });

    render(<AssetDepreciationChart />);

    expect(screen.getByText('$3,000')).toBeInTheDocument();
    expect(screen.getAllByText('$600 / yr').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('1 Assets')).toBeInTheDocument();
  });

  it('should accept custom assets prop directly for reusability', () => {
    const customAssetList: Asset[] = [
      {
        id: 'c1',
        assetId: 'C100',
        name: 'Enterprise Server',
        category: 'Desktop',
        status: 'Allocated',
        location: 'Data Center',
        purchaseDate: '2023-01-01',
        purchaseCost: 12000,
        serialNumber: 'SRV-01',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      },
    ];

    // $12,000 / 5 years = $2,400/year (matching the exact example from the requirement)
    render(<AssetDepreciationChart assets={customAssetList} initialUsefulLife={5} />);

    expect(screen.getByText('$12,000')).toBeInTheDocument();
    expect(screen.getAllByText('$2,400 / yr').length).toBeGreaterThanOrEqual(1);
  });

  it('should render empty state when no assets or zero cost are present', () => {
    render(<AssetDepreciationChart assets={[]} />);

    expect(screen.getByText('No depreciation data available')).toBeInTheDocument();
    expect(
      screen.getByText(/hardware assets with recorded acquisition costs are required/i),
    ).toBeInTheDocument();
  });

  it('should render loading skeleton when isLoading is true', () => {
    const { container } = render(<AssetDepreciationChart isLoading={true} />);

    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });
});
