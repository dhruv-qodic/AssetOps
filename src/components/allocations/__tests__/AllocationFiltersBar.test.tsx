import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AllocationFiltersBar } from '../AllocationFiltersBar';
import type { Employee } from '@/types/employee';

describe('AllocationFiltersBar Component', () => {
  const mockEmployees: Employee[] = [
    {
      id: 'emp-1',
      employeeId: 'EMP001',
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice@example.com',
      department: 'Engineering',
      position: 'Developer',
      status: 'active',
      avatar: '',
      phone: '12345',
      location: 'HQ',
      joinDate: '2023-01-01',
      allocatedAssetsCount: 1,
    },
    {
      id: 'emp-2',
      employeeId: 'EMP002',
      firstName: 'Bob',
      lastName: 'Williams',
      email: 'bob@example.com',
      department: 'HR',
      position: 'HR Lead',
      status: 'active',
      avatar: '',
      phone: '67890',
      location: 'Branch',
      joinDate: '2023-02-01',
      allocatedAssetsCount: 0,
    },
  ];

  const defaultProps = {
    search: '',
    onSearchChange: vi.fn(),
    assetCategory: 'All',
    onAssetCategoryChange: vi.fn(),
    employeeFilter: 'All',
    onEmployeeFilterChange: vi.fn(),
    statusFilter: 'All',
    onStatusFilterChange: vi.fn(),
    locationFilter: 'All',
    onLocationFilterChange: vi.fn(),
    onClearFilters: vi.fn(),
    employees: mockEmployees,
  };

  it('should render all filter select labels and search input', () => {
    render(<AllocationFiltersBar {...defaultProps} />);

    expect(screen.getByText('Asset')).toBeInTheDocument();
    expect(screen.getByText('Employee')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Location')).toBeInTheDocument();
    expect(screen.getByText('Clear Filters')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Search by asset, employee, or department...'),
    ).toBeInTheDocument();
  });

  it('should allow opening dropdown and selecting an option', async () => {
    const user = userEvent.setup();
    const handleAssetChange = vi.fn();

    render(<AllocationFiltersBar {...defaultProps} onAssetCategoryChange={handleAssetChange} />);

    // Click on Asset dropdown trigger (initially showing 'All')
    const assetDropdownTrigger = screen.getAllByRole('button', { name: /all/i })[0];
    await user.click(assetDropdownTrigger);

    // Laptop option should now be visible
    const laptopOption = screen.getByRole('button', { name: /^laptop$/i });
    expect(laptopOption).toBeInTheDocument();

    await user.click(laptopOption);
    expect(handleAssetChange).toHaveBeenCalledWith('Laptop');
  });

  it('should close dropdown when clicking outside', async () => {
    const user = userEvent.setup();
    render(<AllocationFiltersBar {...defaultProps} />);

    const assetDropdownTrigger = screen.getAllByRole('button', { name: /all/i })[0];
    await user.click(assetDropdownTrigger);

    expect(screen.getByRole('button', { name: /^laptop$/i })).toBeInTheDocument();

    // Click outside on document body
    fireEvent.mouseDown(document.body);

    expect(screen.queryByRole('button', { name: /^laptop$/i })).not.toBeInTheDocument();
  });

  it('should trigger onSearchChange when typing in the search box', async () => {
    const user = userEvent.setup();
    const handleSearchChange = vi.fn();

    render(<AllocationFiltersBar {...defaultProps} onSearchChange={handleSearchChange} />);

    const searchInput = screen.getByPlaceholderText('Search by asset, employee, or department...');
    await user.type(searchInput, 'MacBook');

    expect(handleSearchChange).toHaveBeenCalled();
  });

  it('should render clear search button when search is non-empty and allow clearing', async () => {
    const user = userEvent.setup();
    const handleSearchChange = vi.fn();

    render(
      <AllocationFiltersBar
        {...defaultProps}
        search="MacBook"
        onSearchChange={handleSearchChange}
      />,
    );

    const clearSearchBtn = screen.getByRole('textbox').parentElement?.querySelector('button');
    expect(clearSearchBtn).toBeInTheDocument();

    if (clearSearchBtn) {
      await user.click(clearSearchBtn);
      expect(handleSearchChange).toHaveBeenCalledWith('');
    }
  });

  it('should trigger onClearFilters when Clear Filters link is clicked', async () => {
    const user = userEvent.setup();
    const handleClear = vi.fn();

    render(
      <AllocationFiltersBar
        {...defaultProps}
        assetCategory="Laptop"
        onClearFilters={handleClear}
      />,
    );

    const clearFiltersBtn = screen.getByRole('button', { name: /clear filters/i });
    await user.click(clearFiltersBtn);

    expect(handleClear).toHaveBeenCalledTimes(1);
  });
});
