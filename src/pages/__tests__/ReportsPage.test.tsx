import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReportsPage } from '../ReportsPage';
import { useAuthStore } from '@/store/useAuthStore';
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

describe('ReportsPage Component', () => {
  beforeEach(() => {
    // Authenticate as Admin user with VIEW_REPORTS permission
    useAuthStore.setState({
      user: {
        id: 'usr_admin_01',
        name: 'Admin',
        email: 'admin@assetops.com',
        role: 'ADMIN',
      },
      isAuthenticated: true,
    });

    useAssetStore.setState({
      assets: [...MOCK_ASSETS],
    });
  });

  it('should render page title and subtitle', () => {
    render(<ReportsPage />);

    expect(screen.getByRole('heading', { name: /reports & analytics/i })).toBeInTheDocument();
    expect(
      screen.getByText(/insights and analytics for better decision making/i),
    ).toBeInTheDocument();
  });

  it('should render all filter controls and Generate Report button', () => {
    render(<ReportsPage />);

    expect(screen.getByLabelText(/report type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/time range/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/department/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate report/i })).toBeInTheDocument();
  });

  it('should render all 4 KPI metric cards with expected baseline values', () => {
    render(<ReportsPage />);

    expect(screen.getAllByText('Total Assets').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Allocated').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Available').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Maintenance')).toBeInTheDocument();

    // Verify actual count of assets in system is rendered
    expect(screen.getAllByText(/500|10,?000/).length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText(/12% vs. last month/i)).toBeInTheDocument();
    expect(screen.getByText(/8% vs. last month/i)).toBeInTheDocument();
    expect(screen.getByText(/4% vs. last month/i)).toBeInTheDocument();
    expect(screen.getByText(/6% vs. last month/i)).toBeInTheDocument();
  });

  it('should render all 3 visualization cards matching reference layout', () => {
    render(<ReportsPage />);

    // Donut Chart card
    expect(screen.getByText('Asset Category Distribution')).toBeInTheDocument();
    expect(screen.getByText('Laptop')).toBeInTheDocument();
    expect(screen.getAllByText(/%/).length).toBeGreaterThanOrEqual(1);

    // Area Trend Chart card
    expect(screen.getByText('Asset Growth Trend')).toBeInTheDocument();

    // Top Departments card
    expect(screen.getByText('Top Departments')).toBeInTheDocument();
    expect(screen.getAllByText('IT').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Across 5 primary units')).toBeInTheDocument();
  });

  it('should open Generate Report modal when Generate Report button is clicked', async () => {
    const user = userEvent.setup();
    render(<ReportsPage />);

    const generateBtn = screen.getByRole('button', { name: /generate report/i });
    await user.click(generateBtn);

    expect(screen.getByRole('heading', { name: /export & generate report/i })).toBeInTheDocument();
    expect(screen.getByText(/pdf document/i)).toBeInTheDocument();
    expect(screen.getByText(/csv spreadsheet/i)).toBeInTheDocument();
  });

  it('should render loading state when assets are being loaded', () => {
    useAssetStore.setState({ isLoading: true });
    render(<ReportsPage />);

    expect(screen.getByText(/compiling analytics and operational reports/i)).toBeInTheDocument();
  });

  it('should render error state with retry button when error occurs', () => {
    useAssetStore.setState({ isLoading: false, error: 'Failed to compile report metrics' });
    render(<ReportsPage />);

    expect(screen.getByText(/failed to generate reports/i)).toBeInTheDocument();
    expect(screen.getByText('Failed to compile report metrics')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('should render empty state when no asset records exist', () => {
    useAssetStore.setState({ assets: [], isLoading: false, error: null });
    render(<ReportsPage />);

    expect(screen.getByText(/no asset data available for reports/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add asset/i })).toBeInTheDocument();
  });
});
