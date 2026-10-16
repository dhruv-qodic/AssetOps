import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import EmployeeListPage from '../EmployeeListPage';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { MOCK_EMPLOYEES } from '@/mocks/seed/employees';

describe('EmployeeListPage Component', () => {
  beforeEach(() => {
    useEmployeeStore.setState({
      employees: [...MOCK_EMPLOYEES],
      isLoading: false,
      error: null,
    });
    useEmployeeStore.getState().resetFilters();
  });

  it('should render Employee Management page header, filters, and table', () => {
    render(<EmployeeListPage />);

    expect(screen.getByText('Employee Management')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Search employees by name, email, department...'),
    ).toBeInTheDocument();

    // Headers
    expect(screen.getByText('Employee ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getAllByText('Department').length).toBeGreaterThan(0);
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getAllByText('Status').length).toBeGreaterThan(0);
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('should render first page of employees matching seed data', () => {
    render(<EmployeeListPage />);

    expect(screen.getByText('E001')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@company.com')).toBeInTheDocument();
  });

  it('should filter employee rows when typing in the search input', () => {
    render(<EmployeeListPage />);

    const searchInput = screen.getByPlaceholderText(
      'Search employees by name, email, department...',
    );

    fireEvent.change(searchInput, { target: { value: 'Jane Smith' } });

    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('should render all 4 employee summary cards', () => {
    render(<EmployeeListPage />);

    expect(screen.getByText('Total Employees')).toBeInTheDocument();
    expect(screen.getByText('Active Employees')).toBeInTheDocument();
    expect(screen.getByText('Inactive & Terminated')).toBeInTheDocument();
    expect(screen.getByText('Full-Time Staff')).toBeInTheDocument();
  });

  it('should render loading state when isLoading is true', () => {
    useEmployeeStore.setState({ isLoading: true });
    render(<EmployeeListPage />);

    expect(screen.getByText(/loading employee directory\.\.\./i)).toBeInTheDocument();
  });

  it('should render error state with retry button when error exists', () => {
    useEmployeeStore.setState({ isLoading: false, error: 'Database connection failed' });
    render(<EmployeeListPage />);

    expect(screen.getByText(/failed to load employee directory/i)).toBeInTheDocument();
    expect(screen.getByText('Database connection failed')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('should render empty state when employee list is empty', () => {
    useEmployeeStore.setState({ employees: [], isLoading: false, error: null });
    render(<EmployeeListPage />);

    expect(screen.getByText(/no employees found/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /add employee/i }).length).toBeGreaterThanOrEqual(
      1,
    );
  });

  it('should immediately display newly added employee in the table without page refresh', () => {
    render(<EmployeeListPage />);

    expect(screen.queryByText('E000')).not.toBeInTheDocument();
    expect(screen.queryByText('Aaron Aaronson')).not.toBeInTheDocument();

    // Call addEmployee with name starting with A to appear on page 1 for name_asc sorting
    act(() => {
      useEmployeeStore.getState().addEmployee({
        employeeId: 'E000',
        firstName: 'Aaron',
        lastName: 'Aaronson',
        email: 'aaron.aaronson@company.com',
        department: 'Finance',
        position: 'Treasury Lead',
        status: 'active',
        type: 'full-time',
        location: 'New York Office',
      });
    });

    // Should immediately appear in the table
    expect(screen.getByText('E000')).toBeInTheDocument();
    expect(screen.getByText('Aaron Aaronson')).toBeInTheDocument();
  });
});
