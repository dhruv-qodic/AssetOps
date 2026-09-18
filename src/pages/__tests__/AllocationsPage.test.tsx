import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AllocationsPage } from '../AllocationsPage';
import { useAuthStore } from '@/store/useAuthStore';
import { useAssetStore } from '@/store/useAssetStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { MOCK_ASSETS } from '@/mocks/seed/assets';
import { MOCK_EMPLOYEES } from '@/mocks/seed/employees';

describe('AllocationsPage Component', () => {
  beforeEach(() => {
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
      isLoading: false,
      error: null,
    });

    useEmployeeStore.setState({
      employees: [...MOCK_EMPLOYEES],
      isLoading: false,
      error: null,
    });
  });

  it('should render page title, subtitle, and New Allocation button', () => {
    render(<AllocationsPage />);

    expect(screen.getByRole('heading', { name: /asset allocations/i })).toBeInTheDocument();
    expect(screen.getByText(/track and manage asset allocation to employees/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /new allocation/i })).toBeInTheDocument();
  });

  it('should render allocation table headers and rows in success state', () => {
    render(<AllocationsPage />);

    expect(screen.getByText('Allocation ID')).toBeInTheDocument();
    expect(screen.getAllByText('Asset').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Employee').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Department').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Allocated On')).toBeInTheDocument();
  });

  it('should render loading state when assets or employees are loading', () => {
    useAssetStore.setState({ isLoading: true });
    render(<AllocationsPage />);

    expect(screen.getByText(/loading asset allocations\.\.\./i)).toBeInTheDocument();
  });

  it('should render error state with retry button when error occurs', () => {
    useAssetStore.setState({ isLoading: false, error: 'Database connection failed' });
    render(<AllocationsPage />);

    expect(screen.getByText(/failed to load allocations/i)).toBeInTheDocument();
    expect(screen.getByText('Database connection failed')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('should render empty state when no allocations exist', () => {
    useAssetStore.setState({ assets: [], isLoading: false, error: null });
    render(<AllocationsPage />);

    expect(screen.getByText(/no allocations found/i)).toBeInTheDocument();
    expect(
      screen.getAllByRole('button', { name: /new allocation/i }).length,
    ).toBeGreaterThanOrEqual(1);
  });
});
