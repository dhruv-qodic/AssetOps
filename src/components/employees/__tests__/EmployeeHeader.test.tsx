import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { EmployeeHeader } from '../EmployeeHeader';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { useAuthStore } from '@/store/useAuthStore';

describe('EmployeeHeader Component', () => {
  beforeEach(() => {
    useEmployeeStore.setState({ isAddModalOpen: false });
    // Default user as ADMIN with MANAGE_EMPLOYEES permission
    useAuthStore.setState({
      user: {
        id: 'usr-admin',
        name: 'Admin User',
        email: 'admin@assetops.com',
        role: 'ADMIN',
      },
    });
  });

  it('should render header title and subtitle', () => {
    render(<EmployeeHeader />);

    expect(screen.getByText('Employee Management')).toBeInTheDocument();
    expect(
      screen.getByText(/Manage your organization's workforce, departments, and assigned hardware/i),
    ).toBeInTheDocument();
  });

  it('should render Add Employee button when user has MANAGE_EMPLOYEES permission', () => {
    render(<EmployeeHeader />);

    const addButton = screen.getByRole('button', { name: /Add Employee/i });
    expect(addButton).toBeInTheDocument();
  });

  it('should hide Add Employee button when user lacks MANAGE_EMPLOYEES permission', () => {
    // Set user as VIEWER
    useAuthStore.setState({
      user: {
        id: 'usr-viewer',
        name: 'Viewer User',
        email: 'viewer@assetops.com',
        role: 'VIEWER',
      },
    });

    render(<EmployeeHeader />);

    expect(screen.queryByRole('button', { name: /Add Employee/i })).not.toBeInTheDocument();
  });

  it('should trigger openAddModal when Add Employee button is clicked', () => {
    render(<EmployeeHeader />);

    const addButton = screen.getByRole('button', { name: /Add Employee/i });
    fireEvent.click(addButton);

    expect(useEmployeeStore.getState().isAddModalOpen).toBe(true);
  });
});
