import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { EmployeeModal } from '../EmployeeModal';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { toast } from 'sonner';
import type { Employee } from '@/types/employee';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe('EmployeeModal Component', () => {
  const sampleEmployee: Employee = {
    id: 'emp-edit-1',
    employeeId: 'E100',
    firstName: 'Sarah',
    lastName: 'Connor',
    email: 'sarah.connor@company.com',
    phone: '555-0100',
    department: 'Engineering',
    position: 'Security Lead',
    status: 'active',
    type: 'full-time',
    location: 'Headquarters',
    assignedAssets: [],
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useEmployeeStore.setState({
      employees: [sampleEmployee],
      selectedEmployee: null,
      isAddModalOpen: false,
      isEditModalOpen: false,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render Add New Employee modal when isAddModalOpen is true', () => {
    useEmployeeStore.setState({ isAddModalOpen: true });
    render(<EmployeeModal />);

    expect(screen.getByRole('heading', { name: 'Add New Employee' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Employee' })).toBeInTheDocument();
  });

  it('should display validation errors when submitting empty form in add mode', async () => {
    useEmployeeStore.setState({ isAddModalOpen: true });
    render(<EmployeeModal />);

    // Clear auto-filled employee ID
    const empIdInput = screen.getByLabelText(/Employee ID/i);
    fireEvent.change(empIdInput, { target: { value: '' } });

    const submitBtn = screen.getByRole('button', { name: 'Add Employee' });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Employee ID is required')).toBeInTheDocument();
      expect(screen.getByText('First name is required')).toBeInTheDocument();
      expect(screen.getByText('Last name is required')).toBeInTheDocument();
      expect(screen.getByText('Email address is required')).toBeInTheDocument();
    });
  });

  it('should successfully add new employee on valid submission', async () => {
    useEmployeeStore.setState({ isAddModalOpen: true, employees: [] });
    render(<EmployeeModal />);

    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'john.doe@company.com' },
    });
    fireEvent.change(screen.getByLabelText(/Position/i), {
      target: { value: 'Software Engineer' },
    });

    const submitBtn = screen.getByRole('button', { name: 'Add Employee' });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('John Doe'));
      expect(useEmployeeStore.getState().isAddModalOpen).toBe(false);
      expect(useEmployeeStore.getState().employees.length).toBe(1);
      expect(useEmployeeStore.getState().employees[0].email).toBe('john.doe@company.com');
    });
  });

  it('should render Edit Employee modal with prefilled data when isEditModalOpen is true', () => {
    useEmployeeStore.setState({
      isEditModalOpen: true,
      selectedEmployee: sampleEmployee,
    });
    render(<EmployeeModal />);

    expect(screen.getByRole('heading', { name: 'Edit Employee' })).toBeInTheDocument();
    expect(screen.getByDisplayValue('Sarah')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Connor')).toBeInTheDocument();
    expect(screen.getByDisplayValue('sarah.connor@company.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument();
  });

  it('should successfully update existing employee on form submission', async () => {
    useEmployeeStore.setState({
      isEditModalOpen: true,
      selectedEmployee: sampleEmployee,
      employees: [sampleEmployee],
    });
    render(<EmployeeModal />);

    const firstNameInput = screen.getByDisplayValue('Sarah');
    fireEvent.change(firstNameInput, { target: { value: 'Samantha' } });

    const submitBtn = screen.getByRole('button', { name: 'Save Changes' });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('Samantha Connor'));
      expect(useEmployeeStore.getState().isEditModalOpen).toBe(false);
      expect(useEmployeeStore.getState().employees[0].firstName).toBe('Samantha');
    });
  });

  it('should close the modal when Cancel button is clicked', () => {
    useEmployeeStore.setState({ isAddModalOpen: true });
    render(<EmployeeModal />);

    const cancelBtn = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelBtn);

    expect(useEmployeeStore.getState().isAddModalOpen).toBe(false);
  });
});
