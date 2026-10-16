import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { EmployeeFiltersBar } from '../EmployeeFiltersBar';
import { useEmployeeStore } from '@/store/useEmployeeStore';

describe('EmployeeFiltersBar Component', () => {
  beforeEach(() => {
    useEmployeeStore.getState().resetFilters();
  });

  it('should render search input and all filter dropdowns', () => {
    render(<EmployeeFiltersBar />);

    expect(
      screen.getByPlaceholderText('Search employees by name, email, department...'),
    ).toBeInTheDocument();
    expect(screen.getByText('Department')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Sort')).toBeInTheDocument();
  });

  it('should update search query in store when typing into search input', () => {
    render(<EmployeeFiltersBar />);

    const searchInput = screen.getByPlaceholderText(
      'Search employees by name, email, department...',
    );
    fireEvent.change(searchInput, { target: { value: 'Alice' } });

    expect(useEmployeeStore.getState().filters.search).toBe('Alice');
    expect(useEmployeeStore.getState().filters.page).toBe(1);
  });

  it('should show clear button when search has text and clear it on click', () => {
    useEmployeeStore.setState({
      filters: {
        ...useEmployeeStore.getState().filters,
        search: 'Engineering',
      },
    });

    render(<EmployeeFiltersBar />);

    const clearBtn = screen.getByRole('button', { name: '' });
    expect(clearBtn).toBeInTheDocument();

    fireEvent.click(clearBtn);
    expect(useEmployeeStore.getState().filters.search).toBe('');
  });

  it('should update department filter when selecting an option', () => {
    render(<EmployeeFiltersBar />);

    // Open Department select combobox
    const comboboxes = screen.getAllByRole('combobox');
    // Comboboxes order: 0: Department, 1: Status, 2: Type, 3: Sort By
    fireEvent.click(comboboxes[0]);

    // Select IT
    const itOption = screen.getByRole('button', { name: 'IT' });
    fireEvent.click(itOption);

    expect(useEmployeeStore.getState().filters.department).toBe('IT');
  });

  it('should update status filter when selecting an option', () => {
    render(<EmployeeFiltersBar />);

    const comboboxes = screen.getAllByRole('combobox');
    fireEvent.click(comboboxes[1]);

    const activeOption = screen.getByRole('button', { name: 'Active' });
    fireEvent.click(activeOption);

    expect(useEmployeeStore.getState().filters.status).toBe('active');
  });

  it('should show Clear all button when filters are active and reset on click', () => {
    useEmployeeStore.setState({
      filters: {
        ...useEmployeeStore.getState().filters,
        department: 'Sales',
      },
    });

    render(<EmployeeFiltersBar />);

    const clearFiltersBtn = screen.getByRole('button', { name: /clear all/i });
    expect(clearFiltersBtn).toBeInTheDocument();

    fireEvent.click(clearFiltersBtn);
    expect(useEmployeeStore.getState().filters.department).toBe('All');
  });
});
