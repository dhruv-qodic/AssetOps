import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Dashboard } from '../Dashboard';
import { useAuthStore } from '@/store/useAuthStore';
import { useAssetStore } from '@/store/useAssetStore';
import { useDashboardStore } from '@/store/useDashboardStore';
import { MOCK_ASSETS } from '@/mocks/seed/assets';

const renderDashboard = () =>
  render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>,
  );

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

describe('Dashboard Component', () => {
  beforeEach(() => {
    // Set authenticated user
    useAuthStore.setState({
      user: {
        id: 'usr_admin_01',
        name: 'Admin User',
        email: 'admin@assetops.com',
        role: 'ADMIN',
      },
      isAuthenticated: true,
    });

    // Reset stores with initial seed data
    useAssetStore.setState({
      assets: [...MOCK_ASSETS],
      isLoading: false,
      error: null,
    });

    useDashboardStore.setState({
      timeRange: 'Last 30 Days',
      selectedLocation: 'All',
      isCustomizationOpen: false,
      visibleCardIds: [
        'total_assets',
        'available_assets',
        'assigned_assets',
        'maintenance_assets',
        'total_asset_value',
      ],
      visibleWidgetIds: [
        'lifecycle_chart',
        'recent_activity',
        'growth_line_chart',
        'valuation_area_chart',
        'depreciation_chart',
        'distribution_pie_chart',
      ],
    });
  });

  it('should render the Dashboard Header with title, description, and controls', () => {
    renderDashboard();

    expect(screen.getByRole('heading', { name: /assetops dashboard/i })).toBeInTheDocument();
    expect(screen.getByText(/real-time overview of hardware inventory/i)).toBeInTheDocument();
    expect(screen.getByText('Last 30 Days')).toBeInTheDocument();
    expect(screen.getByText('All Locations')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /customize/i })).toBeInTheDocument();
  });

  it('should render all Summary KPI cards with dynamic calculations from asset store', () => {
    renderDashboard();

    const totalCount = MOCK_ASSETS.length;
    const availableCount = MOCK_ASSETS.filter((a) => a.status === 'Available').length;
    const assignedCount = MOCK_ASSETS.filter((a) => a.status === 'Allocated').length;
    const maintenanceCount = MOCK_ASSETS.filter((a) => a.status === 'Maintenance').length;

    expect(screen.getByText(/total assets/i)).toBeInTheDocument();
    expect(screen.getByText(/available assets/i)).toBeInTheDocument();
    expect(screen.getByText(/assigned assets/i)).toBeInTheDocument();
    expect(screen.getAllByText(/in maintenance/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/total asset value/i)).toBeInTheDocument();

    expect(screen.getAllByText(totalCount.toLocaleString()).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(availableCount.toLocaleString()).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(assignedCount.toLocaleString()).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(maintenanceCount.toLocaleString()).length).toBeGreaterThanOrEqual(1);
  });

  it('should render Section 3: Asset Status Distribution pie chart and Recent Activity feed', async () => {
    renderDashboard();

    // Recent Activity feed (eagerly loaded)
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    expect(
      screen.getByText(/real-time audit log of hardware lifecycle events/i),
    ).toBeInTheDocument();
    expect(screen.getByText('Live Feed')).toBeInTheDocument();

    // Asset status distribution chart (lazy loaded)
    expect(
      await screen.findByText('Asset Status Distribution', {}, { timeout: 4000 }),
    ).toBeInTheDocument();
    expect(
      (await screen.findAllByText('In Use', {}, { timeout: 4000 })).length,
    ).toBeGreaterThanOrEqual(1);
    expect(
      (await screen.findAllByText('In Storage', {}, { timeout: 4000 })).length,
    ).toBeGreaterThanOrEqual(1);
    expect(
      (await screen.findAllByText('Deployed', {}, { timeout: 4000 })).length,
    ).toBeGreaterThanOrEqual(1);
  });

  it('should render Section 4: Analytics Charts (Lifecycle, Line, Area, and Depreciation charts)', async () => {
    renderDashboard();

    expect(
      screen.getByRole('heading', { name: /operational analytics & forecasting/i }),
    ).toBeInTheDocument();

    // Lifecycle Chart (lazy loaded)
    expect(
      await screen.findByText('Asset Status by Category', {}, { timeout: 4000 }),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        /operational status breakdown across hardware categories/i,
        {},
        { timeout: 4000 },
      ),
    ).toBeInTheDocument();

    // Line Chart (lazy loaded)
    expect(
      await screen.findByText('Fleet Growth & Allocation Trend', {}, { timeout: 4000 }),
    ).toBeInTheDocument();

    // Area Chart (lazy loaded)
    expect(
      await screen.findByText('Asset Valuation & Capital Spend', {}, { timeout: 4000 }),
    ).toBeInTheDocument();

    // Depreciation Chart (lazy loaded)
    expect(
      await screen.findByText('Asset Depreciation & Book Value', {}, { timeout: 4000 }),
    ).toBeInTheDocument();
    expect(
      await screen.findByText('Straight-Line Model', {}, { timeout: 4000 }),
    ).toBeInTheDocument();
  });

  it('should open Customization modal when Customize button is clicked', async () => {
    const user = userEvent.setup();
    renderDashboard();

    const customizeBtn = screen.getByRole('button', { name: /customize/i });
    await user.click(customizeBtn);

    expect(
      screen.getByRole('heading', { name: /customize dashboard layout & widgets/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('Dashboard Customizer')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset defaults/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /apply & done/i })).toBeInTheDocument();
  });

  it('should allow toggling card visibility in customization modal', async () => {
    const user = userEvent.setup();
    renderDashboard();

    // Open modal
    await user.click(screen.getByRole('button', { name: /customize/i }));

    // Find and click 'Total Assets' in modal to hide it
    const totalAssetsToggle = screen.getByText('Total hardware count in the entire inventory');
    await user.click(totalAssetsToggle);

    // Apply & Done
    await user.click(screen.getByRole('button', { name: /apply & done/i }));

    // Total Assets card should no longer be rendered on dashboard
    expect(screen.queryByText('Total Assets')).not.toBeInTheDocument();
  });

  it('should render loading state when assets are reloading', () => {
    useAssetStore.setState({ isLoading: true });
    renderDashboard();

    expect(screen.getByText(/loading dashboard metrics/i)).toBeInTheDocument();
  });

  it('should render error state with retry button when error occurs', () => {
    useAssetStore.setState({ isLoading: false, error: 'Database connection failed' });
    renderDashboard();

    expect(screen.getByText(/failed to load dashboard data/i)).toBeInTheDocument();
    expect(screen.getByText('Database connection failed')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('should dynamically update Recent Activity when an asset is added or modified', () => {
    renderDashboard();

    expect(screen.getByText('Recent Activity')).toBeInTheDocument();

    act(() => {
      useAssetStore.getState().addAsset({
        assetId: 'DASH-AST-999',
        name: 'Dynamic Test Workstation',
        category: 'Desktop',
        status: 'Available',
        location: 'San Francisco',
        serialNumber: 'SN-DASH-999',
        purchaseDate: '2026-03-01',
      });
    });

    expect(screen.getByText('Dynamic Test Workstation (DASH-AST-999)')).toBeInTheDocument();
  });

  it('should render the View All button in Recent Activity', () => {
    renderDashboard();

    const viewAllBtn = screen.getByRole('button', { name: /view all/i });
    expect(viewAllBtn).toBeInTheDocument();
  });
});
