import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmployeeFiltersBar } from '../EmployeeFiltersBar';
import { useEmployeeStore } from '@/store/useEmployeeStore';

describe('EmployeeFiltersBar Component', () => {
  const mockSetSearch = vi.fn();
  const mockResetFilters = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useEmployeeStore.setState({
      filters: {
        search: '',
        department: 'All',
        status: 'All',
        type: 'All',
        sortBy: 'recently_added',
      },
      setSearch: mockSetSearch,
      resetFilters: mockResetFilters,
    });
  });

  it('should render search input and all filter dropdown labels', () => {
    render(<EmployeeFiltersBar />);

    expect(
      screen.getByPlaceholderText('Search employees by name, email, department...'),
    ).toBeInTheDocument();
    expect(screen.getByText('Department')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Sort')).toBeInTheDocument();
  });

  it('should trigger setSearch when user types in the search input', async () => {
    const user = userEvent.setup();
    render(<EmployeeFiltersBar />);

    const searchInput = screen.getByPlaceholderText(
      'Search employees by name, email, department...',
    );
    await user.type(searchInput, 'John');

    expect(mockSetSearch).toHaveBeenCalled();
  });

  it('should show Clear all button when active filters exist and trigger resetFilters', async () => {
    const user = userEvent.setup();
    useEmployeeStore.setState({
      filters: {
        search: 'Engineering',
        department: 'Engineering',
        status: 'All',
        type: 'All',
        sortBy: 'recently_added',
      },
    });

    render(<EmployeeFiltersBar />);

    const clearAllBtn = screen.getByRole('button', { name: /clear all/i });
    expect(clearAllBtn).toBeInTheDocument();

    await user.click(clearAllBtn);
    expect(mockResetFilters).toHaveBeenCalledTimes(1);
  });
});
