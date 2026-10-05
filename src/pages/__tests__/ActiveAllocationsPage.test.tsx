import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ActiveAllocationsPage from '../ActiveAllocationsPage';
import { useAssetStore } from '@/store/useAssetStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { useAuthStore } from '@/store/useAuthStore';
import {
  useActiveAllocationFilterStore,
  INITIAL_ACTIVE_ALLOCATION_FILTER_STATE,
} from '@/store/useActiveAllocationFilterStore';
import type { Asset } from '@/types/asset';
import type { Employee } from '@/types/employee';

const mockEmployees: Employee[] = [
  {
    id: 'emp_1',
    employeeId: 'EMP-001',
    firstName: 'Sarah',
    lastName: 'Connor',
    email: 'sarah.connor@example.com',
    phone: '+1 555-0101',
    department: 'IT',
    position: 'DevOps Engineer',
    status: 'active',
    type: 'full-time',
    location: 'Headquarters',
    assignedAssets: ['ast_1'],
    createdAt: '2023-01-15T00:00:00.000Z',
    updatedAt: '2023-01-15T00:00:00.000Z',
  },
  {
    id: 'emp_2',
    employeeId: 'EMP-002',
    firstName: 'John',
    lastName: 'Rambo',
    email: 'john.rambo@example.com',
    phone: '+1 555-0102',
    department: 'Sales',
    position: 'Account Executive',
    status: 'active',
    type: 'full-time',
    location: 'New York Office',
    assignedAssets: ['ast_2'],
    createdAt: '2023-02-10T00:00:00.000Z',
    updatedAt: '2023-02-10T00:00:00.000Z',
  },
  {
    id: 'emp_3',
    employeeId: 'EMP-003',
    firstName: 'Ellen',
    lastName: 'Ripley',
    email: 'ellen.ripley@example.com',
    phone: '+1 555-0103',
    department: 'Marketing',
    position: 'Brand Lead',
    status: 'active',
    type: 'full-time',
    location: 'San Francisco',
    assignedAssets: ['ast_3'],
    createdAt: '2023-03-01T00:00:00.000Z',
    updatedAt: '2023-03-01T00:00:00.000Z',
  },
];

const mockAssets: Asset[] = [
  {
    id: 'ast_1',
    assetId: 'A1001',
    name: 'MacBook Pro 16"',
    model: 'M3 Max',
    category: 'Laptop',
    status: 'Allocated',
    location: 'Headquarters',
    serialNumber: 'MBP16-001',
    purchaseDate: '2024-01-10',
    purchaseCost: 3499,
    assignedTo: {
      id: 'emp_1',
      name: 'Sarah Connor',
      employeeId: 'EMP-001',
      email: 'sarah.connor@example.com',
      department: 'IT',
      assignedDate: '2024-01-15',
    },
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z',
  },
  {
    id: 'ast_2',
    assetId: 'A1002',
    name: 'iPhone 15 Pro',
    model: '256GB Titanium',
    category: 'Mobile',
    status: 'Allocated',
    location: 'New York Office',
    serialNumber: 'IPH15-002',
    purchaseDate: '2024-01-12',
    purchaseCost: 1199,
    assignedTo: {
      id: 'emp_2',
      name: 'John Rambo',
      employeeId: 'EMP-002',
      email: 'john.rambo@example.com',
      department: 'Sales',
      assignedDate: '2024-01-20',
    },
    createdAt: '2024-01-12T00:00:00.000Z',
    updatedAt: '2024-01-20T00:00:00.000Z',
  },
  {
    id: 'ast_3',
    assetId: 'A1003',
    name: 'Dell UltraSharp 27"',
    model: 'U2723QE',
    category: 'Monitor',
    status: 'Allocated',
    location: 'San Francisco',
    serialNumber: 'MON27-003',
    purchaseDate: '2024-02-01',
    purchaseCost: 599,
    assignedTo: {
      id: 'emp_3',
      name: 'Ellen Ripley',
      employeeId: 'EMP-003',
      email: 'ellen.ripley@example.com',
      department: 'Marketing',
      assignedDate: '2024-02-05',
    },
    createdAt: '2024-02-01T00:00:00.000Z',
    updatedAt: '2024-02-05T00:00:00.000Z',
  },
  {
    id: 'ast_4',
    assetId: 'A1004',
    name: 'ThinkPad X1 Carbon',
    model: 'Gen 11',
    category: 'Laptop',
    status: 'Available',
    location: 'Headquarters',
    serialNumber: 'TPX1-004',
    purchaseDate: '2024-02-15',
    purchaseCost: 1899,
    assignedTo: null,
    createdAt: '2024-02-15T00:00:00.000Z',
    updatedAt: '2024-02-15T00:00:00.000Z',
  },
  {
    id: 'ast_5',
    assetId: 'A1005',
    name: 'Logitech MX Master 3S',
    model: 'Wireless',
    category: 'Accessories',
    status: 'Maintenance',
    location: 'Headquarters',
    serialNumber: 'LOGMX-005',
    purchaseDate: '2024-02-20',
    purchaseCost: 99,
    assignedTo: null,
    createdAt: '2024-02-20T00:00:00.000Z',
    updatedAt: '2024-02-20T00:00:00.000Z',
  },
];

describe('ActiveAllocationsPage Component', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: {
        id: 'usr_admin',
        name: 'Admin User',
        email: 'admin@assetops.com',
        role: 'ADMIN',
      },
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });

    useAssetStore.setState({
      assets: mockAssets,
      isLoading: false,
      error: null,
      isAllocateModalOpen: false,
      isQrModalOpen: false,
    });

    useEmployeeStore.setState({
      employees: mockEmployees,
      isLoading: false,
      error: null,
    });

    useActiveAllocationFilterStore.setState({
      ...INITIAL_ACTIVE_ALLOCATION_FILTER_STATE,
    });
  });

  it('should render page header with title, subtitle, icon, and New Allocation button', () => {
    render(
      <MemoryRouter>
        <ActiveAllocationsPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Active Allocations' })).toBeInTheDocument();
    expect(
      screen.getByText(/View, track, and manage all currently active hardware allocations/i),
    ).toBeInTheDocument();

    const newAllocationBtn = screen.getByRole('button', { name: /New Allocation/i });
    expect(newAllocationBtn).toBeInTheDocument();

    fireEvent.click(newAllocationBtn);
    expect(useAssetStore.getState().isAllocateModalOpen).toBe(true);
  });

  it('should render KPI Card with #101726 background color and accurate active assets metrics', () => {
    render(
      <MemoryRouter>
        <ActiveAllocationsPage />
      </MemoryRouter>,
    );

    const kpiCard = screen.getByTestId('active-allocations-kpi-card');
    expect(kpiCard).toBeInTheDocument();

    // Verify background color must be #101726
    expect(kpiCard).toHaveStyle({ backgroundColor: '#101726' });

    // 3 active allocations out of 5 total assets = 60%
    expect(within(kpiCard).getByText('Active Assets')).toBeInTheDocument();
    expect(within(kpiCard).getByText('3')).toBeInTheDocument();
    expect(within(kpiCard).getByText('/ 5 Total')).toBeInTheDocument();
    expect(within(kpiCard).getByText('60% Active')).toBeInTheDocument();
    expect(within(kpiCard).getByText('3 Assigned Staff')).toBeInTheDocument();
  });

  it('should render the active allocations chart with category breakdown', () => {
    render(
      <MemoryRouter>
        <ActiveAllocationsPage />
      </MemoryRouter>,
    );

    const chartContainer = screen.getByTestId('active-allocations-chart');
    expect(chartContainer).toBeInTheDocument();
    expect(screen.getByText('Active Allocations by Category')).toBeInTheDocument();
    expect(screen.getByText('3 Active Devices')).toBeInTheDocument();
  });

  it('should render List View by default and display only active allocations', () => {
    render(
      <MemoryRouter>
        <ActiveAllocationsPage />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('active-allocations-list-view')).toBeInTheDocument();

    // Active allocations: MacBook Pro 16", iPhone 15 Pro, Dell UltraSharp 27"
    expect(screen.getByText('MacBook Pro 16"')).toBeInTheDocument();
    expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
    expect(screen.getByText('Dell UltraSharp 27"')).toBeInTheDocument();

    // Available and Maintenance assets should NOT appear in Active Allocations
    expect(screen.queryByText('ThinkPad X1 Carbon')).not.toBeInTheDocument();
    expect(screen.queryByText('Logitech MX Master 3S')).not.toBeInTheDocument();

    // Verify employee names rendered with initials fallback
    expect(screen.getByText('Sarah Connor')).toBeInTheDocument();
    expect(screen.getByText('John Rambo')).toBeInTheDocument();
    expect(screen.getByText('Ellen Ripley')).toBeInTheDocument();
  });

  it('should switch between List View and Card View with active view indicator', () => {
    render(
      <MemoryRouter>
        <ActiveAllocationsPage />
      </MemoryRouter>,
    );

    const listViewBtn = screen.getByRole('button', { name: 'List View' });
    const cardViewBtn = screen.getByRole('button', { name: 'Card View' });

    expect(listViewBtn).toBeInTheDocument();
    expect(cardViewBtn).toBeInTheDocument();

    // Initially in List View
    expect(screen.getByTestId('active-allocations-list-view')).toBeInTheDocument();
    expect(screen.queryByTestId('active-allocations-card-view')).not.toBeInTheDocument();

    // Switch to Card View
    fireEvent.click(cardViewBtn);

    expect(screen.getByTestId('active-allocations-card-view')).toBeInTheDocument();
    expect(screen.queryByTestId('active-allocations-list-view')).not.toBeInTheDocument();

    // Verify card content
    expect(screen.getByTestId('active-allocation-card-ast_1')).toBeInTheDocument();
    expect(screen.getByTestId('active-allocation-card-ast_2')).toBeInTheDocument();
    expect(screen.getByTestId('active-allocation-card-ast_3')).toBeInTheDocument();

    // CRITICAL REQUIREMENT: No external img/avatar URLs in Card View, only initials fallback
    const cardViewContainer = screen.getByTestId('active-allocations-card-view');
    const imagesInCardView = cardViewContainer.querySelectorAll('img');
    expect(imagesInCardView.length).toBe(0);

    // Verify initials are displayed
    expect(screen.getByText('SC')).toBeInTheDocument(); // Sarah Connor
    expect(screen.getByText('JR')).toBeInTheDocument(); // John Rambo
    expect(screen.getByText('ER')).toBeInTheDocument(); // Ellen Ripley
  });

  it('should filter active allocations via search keyword', () => {
    render(
      <MemoryRouter>
        <ActiveAllocationsPage />
      </MemoryRouter>,
    );

    const searchInput = screen.getByRole('textbox', { name: /Search active allocations/i });

    // Search by employee name
    fireEvent.change(searchInput, { target: { value: 'Sarah' } });

    expect(screen.getByText('MacBook Pro 16"')).toBeInTheDocument();
    expect(screen.queryByText('iPhone 15 Pro')).not.toBeInTheDocument();
    expect(screen.getByText('1 allocation')).toBeInTheDocument();

    // Search by department
    fireEvent.change(searchInput, { target: { value: 'Sales' } });
    expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
    expect(screen.queryByText('MacBook Pro 16"')).not.toBeInTheDocument();
  });

  it('should filter active allocations via category and department checkboxes in filter popup', () => {
    render(
      <MemoryRouter>
        <ActiveAllocationsPage />
      </MemoryRouter>,
    );

    // Open filter popup
    const filterBtn = screen.getByRole('button', { name: /Filter active allocations/i });
    fireEvent.click(filterBtn);

    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Category/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Department/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Location/i })).toBeInTheDocument();

    // Select category 'Mobile' checkbox
    const mobileCheckbox = screen.getByRole('checkbox', { name: 'Mobile' });
    fireEvent.click(mobileCheckbox);

    expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
    expect(screen.queryByText('MacBook Pro 16"')).not.toBeInTheDocument();
    expect(screen.queryByText('Dell UltraSharp 27"')).not.toBeInTheDocument();
  });

  it('should filter active allocations via location checkbox in filter popup', () => {
    render(
      <MemoryRouter>
        <ActiveAllocationsPage />
      </MemoryRouter>,
    );

    // Open filter popup
    const filterBtn = screen.getByRole('button', { name: /Filter active allocations/i });
    fireEvent.click(filterBtn);

    // Click Location tab
    const locationTab = screen.getByRole('button', { name: /^Location/i });
    fireEvent.click(locationTab);

    expect(screen.getByText('Asset Location')).toBeInTheDocument();

    // Select 'San Francisco'
    const sfCheckbox = screen.getByRole('checkbox', { name: 'San Francisco' });
    fireEvent.click(sfCheckbox);

    expect(screen.getByText('Dell UltraSharp 27"')).toBeInTheDocument();
    expect(screen.queryByText('MacBook Pro 16"')).not.toBeInTheDocument();
    expect(screen.queryByText('iPhone 15 Pro')).not.toBeInTheDocument();
  });

  it('should render empty state when no active allocations match criteria and allow clearing filters', () => {
    render(
      <MemoryRouter>
        <ActiveAllocationsPage />
      </MemoryRouter>,
    );

    const searchInput = screen.getByRole('textbox', { name: /Search active allocations/i });
    fireEvent.change(searchInput, { target: { value: 'nonexistent keyword' } });

    expect(screen.getByText('No active allocations found')).toBeInTheDocument();

    const clearFiltersBtn = screen.getByRole('button', { name: 'Clear filters' });
    fireEvent.click(clearFiltersBtn);

    expect(screen.getByText('MacBook Pro 16"')).toBeInTheDocument();
    expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
  });

  it('should render loading state when store is loading', () => {
    useAssetStore.setState({ isLoading: true });

    render(
      <MemoryRouter>
        <ActiveAllocationsPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Loading Active Allocations...')).toBeInTheDocument();
  });

  it('should render error state when store has error', () => {
    useAssetStore.setState({ error: 'Network communication failure' });

    render(
      <MemoryRouter>
        <ActiveAllocationsPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Failed to load active allocations')).toBeInTheDocument();
    expect(screen.getByText('Network communication failure')).toBeInTheDocument();
  });
});
