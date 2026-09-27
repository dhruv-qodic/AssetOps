import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmployeeRowActions } from '../EmployeeRowActions';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { useAuthStore } from '@/store/useAuthStore';
import type { Employee } from '@/types/employee';

describe('EmployeeRowActions Component', () => {
  const mockEmployee: Employee = {
    id: 'emp-101',
    employeeId: 'EMP101',
    firstName: 'Sarah',
    lastName: 'Connor',
    email: 'sarah@example.com',
    department: 'Security',
    position: 'SecOps',
    status: 'active',
    type: 'full-time',
    avatar: '',
    phone: '12345',
    location: 'HQ',
    assignedAssets: ['A1001'],
    allocatedAssetsCount: 1,
    joinDate: '2023-01-01',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  };

  const mockOpenViewModal = vi.fn();
  const mockOpenEditModal = vi.fn();
  const mockOpenDeleteModal = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      user: {
        id: 'usr-admin',
        name: 'Admin User',
        email: 'admin@assetops.com',
        role: 'ADMIN',
      },
      isAuthenticated: true,
    });
    useEmployeeStore.setState({
      openViewModal: mockOpenViewModal,
      openEditModal: mockOpenEditModal,
      openDeleteModal: mockOpenDeleteModal,
    });
  });

  it('should render actions trigger button and open menu when clicked', async () => {
    const user = userEvent.setup();
    render(<EmployeeRowActions employee={mockEmployee} />);

    const trigger = screen.getByRole('button', { name: /employee actions/i });
    expect(trigger).toBeInTheDocument();

    await user.click(trigger);

    expect(screen.getByRole('button', { name: /view details/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit employee/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete employee/i })).toBeInTheDocument();
  });

  it('should call openViewModal when View Details is clicked', async () => {
    const user = userEvent.setup();
    render(<EmployeeRowActions employee={mockEmployee} />);

    await user.click(screen.getByRole('button', { name: /employee actions/i }));
    await user.click(screen.getByRole('button', { name: /view details/i }));

    expect(mockOpenViewModal).toHaveBeenCalledWith(mockEmployee);
  });

  it('should call openEditModal when Edit Employee is clicked', async () => {
    const user = userEvent.setup();
    render(<EmployeeRowActions employee={mockEmployee} />);

    await user.click(screen.getByRole('button', { name: /employee actions/i }));
    await user.click(screen.getByRole('button', { name: /edit employee/i }));

    expect(mockOpenEditModal).toHaveBeenCalledWith(mockEmployee);
  });

  it('should call openDeleteModal when Delete Employee is clicked', async () => {
    const user = userEvent.setup();
    render(<EmployeeRowActions employee={mockEmployee} />);

    await user.click(screen.getByRole('button', { name: /employee actions/i }));
    await user.click(screen.getByRole('button', { name: /delete employee/i }));

    expect(mockOpenDeleteModal).toHaveBeenCalledWith(mockEmployee);
  });
});
