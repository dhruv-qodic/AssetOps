import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DashboardAnalyticsSection } from '../DashboardAnalyticsSection';
import { useDashboardStore } from '@/store/useDashboardStore';
import { useAssetStore } from '@/store/useAssetStore';
import { MOCK_ASSETS } from '@/mocks/seed/assets';

// Mock Recharts ResponsiveContainer to support JSDOM sizing
vi.mock('recharts', async () => {
  const actual = await vi.importActual<typeof import('recharts')>('recharts');
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div style={{ width: 600, height: 300 }}>{children}</div>
    ),
  };
});

describe('DashboardAnalyticsSection Component', () => {
  beforeEach(() => {
    useAssetStore.setState({
      assets: [...MOCK_ASSETS],
      isLoading: false,
      error: null,
    });

    useDashboardStore.setState({
      timeRange: 'Last 30 Days',
      selectedLocation: 'All',
      visibleWidgetIds: [
        'lifecycle_chart',
        'growth_line_chart',
        'valuation_area_chart',
        'depreciation_chart',
      ],
    });
  });

  it('should render all visible analytics charts with lazy loading', async () => {
    render(<DashboardAnalyticsSection />);

    expect(
      screen.getByRole('heading', { name: /operational analytics & forecasting/i }),
    ).toBeInTheDocument();

    expect(
      await screen.findByText('Asset Status by Category', {}, { timeout: 4000 }),
    ).toBeInTheDocument();
    expect(
      await screen.findByText('Fleet Growth & Allocation Trend', {}, { timeout: 4000 }),
    ).toBeInTheDocument();
    expect(
      await screen.findByText('Asset Valuation & Capital Spend', {}, { timeout: 4000 }),
    ).toBeInTheDocument();
    expect(
      await screen.findByText('Asset Depreciation & Book Value', {}, { timeout: 4000 }),
    ).toBeInTheDocument();
  });

  it('should only render charts enabled in visibleWidgetIds', async () => {
    useDashboardStore.setState({
      visibleWidgetIds: ['lifecycle_chart', 'depreciation_chart'],
    });

    render(<DashboardAnalyticsSection />);

    expect(
      await screen.findByText('Asset Status by Category', {}, { timeout: 4000 }),
    ).toBeInTheDocument();
    expect(
      await screen.findByText('Asset Depreciation & Book Value', {}, { timeout: 4000 }),
    ).toBeInTheDocument();

    expect(screen.queryByText('Fleet Growth & Allocation Trend')).not.toBeInTheDocument();
    expect(screen.queryByText('Asset Valuation & Capital Spend')).not.toBeInTheDocument();
  });

  it('should render null when no analytics charts are visible', () => {
    useDashboardStore.setState({
      visibleWidgetIds: ['recent_activity', 'distribution_pie_chart'],
    });

    const { container } = render(<DashboardAnalyticsSection />);

    expect(container.firstChild).toBeNull();
  });
});
