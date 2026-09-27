import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddEmployeeModal } from '../AddEmployeeModal';
import { useEmployeeStore } from '@/store/useEmployeeStore';

describe('AddEmployeeModal Component', () => {
  const mockAddEmployee = vi.fn();
  const mockCloseModals = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useEmployeeStore.setState({
      isAddModalOpen: true,
      employees: [],
      addEmployee: mockAddEmployee,
      closeModals: mockCloseModals,
    });
  });

  it('should render dialog header, form fields, and submit button', () => {
    render(<AddEmployeeModal />);

    expect(screen.getByText('Add New Employee')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. E156')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('John')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Doe')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('john@company.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add employee/i })).toBeInTheDocument();
  });

  it('should display validation errors when required fields are empty', async () => {
    const user = userEvent.setup();
    render(<AddEmployeeModal />);

    // Clear auto-populated fields if any and submit
    const submitBtn = screen.getByRole('button', { name: /add employee/i });
    await user.click(submitBtn);

    expect(await screen.findByText('First name is required')).toBeInTheDocument();
  });

  it('should close modal when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<AddEmployeeModal />);

    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelBtn);

    expect(mockCloseModals).toHaveBeenCalledTimes(1);
  });
});
