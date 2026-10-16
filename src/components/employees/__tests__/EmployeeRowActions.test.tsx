import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { EmployeeRowActions } from '../EmployeeRowActions';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { useAuthStore } from '@/store/useAuthStore';
import type { Employee } from '@/types/employee';

describe('EmployeeRowActions Component', () => {
  const sampleEmployee: Employee = {
    id: 'emp-1',
    employeeId: 'E101',
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice@company.com',
    phone: '123',
    department: 'Engineering',
    position: 'Staff Engineer',
    status: 'active',
    type: 'full-time',
    location: 'Headquarters',
    assignedAssets: [],
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  };

  beforeEach(() => {
    useEmployeeStore.setState({
      selectedEmployee: null,
      isViewModalOpen: false,
      isEditModalOpen: false,
      isDeleteModalOpen: false,
    });
    // Default admin with MANAGE_EMPLOYEES permission
    useAuthStore.setState({
      user: {
        id: 'usr-1',
        name: 'Admin User',
        email: 'admin@assetops.com',
        role: 'ADMIN',
      },
    });
  });

  it('should toggle dropdown menu on click', () => {
    render(<EmployeeRowActions employee={sampleEmployee} />);

    const triggerBtn = screen.getByRole('button', { name: /Employee actions/i });
    expect(screen.queryByText('View Details')).not.toBeInTheDocument();

    fireEvent.click(triggerBtn);
    expect(screen.getByText('View Details')).toBeInTheDocument();
  });

  it('should open View Details modal when clicking View Details action', () => {
    render(<EmployeeRowActions employee={sampleEmployee} />);

    const triggerBtn = screen.getByRole('button', { name: /Employee actions/i });
    fireEvent.click(triggerBtn);

    const viewAction = screen.getByText('View Details');
    fireEvent.click(viewAction);

    expect(useEmployeeStore.getState().isViewModalOpen).toBe(true);
    expect(useEmployeeStore.getState().selectedEmployee?.id).toBe('emp-1');
  });

  it('should render Edit and Delete actions when user has MANAGE_EMPLOYEES permission', () => {
    render(<EmployeeRowActions employee={sampleEmployee} />);

    const triggerBtn = screen.getByRole('button', { name: /Employee actions/i });
    fireEvent.click(triggerBtn);

    expect(screen.getByText('Edit Employee')).toBeInTheDocument();
    expect(screen.getByText('Delete Employee')).toBeInTheDocument();
  });

  it('should hide Edit and Delete actions when user lacks MANAGE_EMPLOYEES permission', () => {
    useAuthStore.setState({
      user: {
        id: 'usr-viewer',
        name: 'Viewer User',
        email: 'viewer@assetops.com',
        role: 'VIEWER',
      },
    });

    render(<EmployeeRowActions employee={sampleEmployee} />);

    const triggerBtn = screen.getByRole('button', { name: /Employee actions/i });
    fireEvent.click(triggerBtn);

    expect(screen.getByText('View Details')).toBeInTheDocument();
    expect(screen.queryByText('Edit Employee')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete Employee')).not.toBeInTheDocument();
  });

  it('should open Edit modal when clicking Edit Employee action', () => {
    render(<EmployeeRowActions employee={sampleEmployee} />);

    const triggerBtn = screen.getByRole('button', { name: /Employee actions/i });
    fireEvent.click(triggerBtn);

    const editAction = screen.getByText('Edit Employee');
    fireEvent.click(editAction);

    expect(useEmployeeStore.getState().isEditModalOpen).toBe(true);
    expect(useEmployeeStore.getState().selectedEmployee?.id).toBe('emp-1');
  });

  it('should open Delete modal when clicking Delete Employee action', () => {
    render(<EmployeeRowActions employee={sampleEmployee} />);

    const triggerBtn = screen.getByRole('button', { name: /Employee actions/i });
    fireEvent.click(triggerBtn);

    const deleteAction = screen.getByText('Delete Employee');
    fireEvent.click(deleteAction);

    expect(useEmployeeStore.getState().isDeleteModalOpen).toBe(true);
    expect(useEmployeeStore.getState().selectedEmployee?.id).toBe('emp-1');
  });
});
