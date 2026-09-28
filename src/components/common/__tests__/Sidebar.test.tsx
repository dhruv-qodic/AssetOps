import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from '../Sidebar';
import { useAuthStore } from '@/store/useAuthStore';
import { useAssetStore } from '@/store/useAssetStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { useSidebarStore } from '@/store/useSidebarStore';

describe('Sidebar Component & RBAC Submenu Access', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });

    useSidebarStore.setState({
      isCollapsed: false,
      isMobileOpen: false,
    });

    // Reset asset store modal states
    useAssetStore.setState({
      isAddModalOpen: false,
      isAllocateModalOpen: false,
    });

    // Reset employee store modal states
    useEmployeeStore.setState({
      isAddModalOpen: false,
    });
  });

  describe('ADMIN Role', () => {
    beforeEach(() => {
      useAuthStore.setState({
        user: {
          id: 'usr_admin_01',
          name: 'Admin User',
          email: 'admin@assetops.com',
          role: 'ADMIN',
        },
        isAuthenticated: true,
      });
    });

    it('should render all main navigation items for Admin', () => {
      render(
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>,
      );

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Assets')).toBeInTheDocument();
      expect(screen.getByText('Employees')).toBeInTheDocument();
      expect(screen.getByText('Allocations')).toBeInTheDocument();
      expect(screen.getByText('History')).toBeInTheDocument();
      expect(screen.getByText('Reports')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('should enable all submenu items under Assets for Admin and trigger actions', () => {
      render(
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>,
      );

      // Expand Assets submenu
      const expandAssetsBtn = screen.getByLabelText('Expand Assets');
      fireEvent.click(expandAssetsBtn);

      const addAssetBtn = screen.getByRole('button', { name: 'Add Asset' });
      const allocateAssetBtn = screen.getByRole('button', { name: 'Allocate Asset' });

      expect(addAssetBtn).toBeInTheDocument();
      expect(addAssetBtn).not.toBeDisabled();
      expect(allocateAssetBtn).toBeInTheDocument();
      expect(allocateAssetBtn).not.toBeDisabled();

      // Click Add Asset and verify modal state opens
      fireEvent.click(addAssetBtn);
      expect(useAssetStore.getState().isAddModalOpen).toBe(true);

      // Click Allocate Asset and verify modal state opens
      fireEvent.click(allocateAssetBtn);
      expect(useAssetStore.getState().isAllocateModalOpen).toBe(true);
    });

    it('should enable Add Employees submenu item under Employees for Admin', () => {
      render(
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>,
      );

      // Expand Employees submenu
      const expandEmployeesBtn = screen.getByLabelText('Expand Employees');
      fireEvent.click(expandEmployeesBtn);

      const addEmployeeBtn = screen.getByRole('button', { name: 'Add Employees' });
      expect(addEmployeeBtn).toBeInTheDocument();
      expect(addEmployeeBtn).not.toBeDisabled();

      fireEvent.click(addEmployeeBtn);
      expect(useEmployeeStore.getState().isAddModalOpen).toBe(true);
    });

    it('should enable Allocations submenu items for Admin', () => {
      render(
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>,
      );

      // Expand Allocations submenu
      const expandAllocationsBtn = screen.getByLabelText('Expand Allocations');
      fireEvent.click(expandAllocationsBtn);

      const newAllocationBtn = screen.getByRole('button', { name: 'New Allocation' });
      const activeAllocationsBtn = screen.getByRole('button', { name: 'Active Allocations' });

      expect(newAllocationBtn).toBeInTheDocument();
      expect(newAllocationBtn).not.toBeDisabled();
      expect(activeAllocationsBtn).toBeInTheDocument();
      expect(activeAllocationsBtn).not.toBeDisabled();
    });
  });

  describe('MANAGER Role', () => {
    beforeEach(() => {
      useAuthStore.setState({
        user: {
          id: 'usr_manager_01',
          name: 'Sarah Jenkins',
          email: 'manager@assetops.com',
          role: 'MANAGER',
        },
        isAuthenticated: true,
      });
    });

    it('should render allowed navigation items (including Allocations) and hide restricted modules for Manager', () => {
      render(
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>,
      );

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Assets')).toBeInTheDocument();
      expect(screen.getByText('Employees')).toBeInTheDocument();
      expect(screen.getByText('Allocations')).toBeInTheDocument();
      expect(screen.getByText('History')).toBeInTheDocument();

      // Restricted top-level modules should not be in document
      expect(screen.queryByText('Reports')).not.toBeInTheDocument();
      expect(screen.queryByText('Settings')).not.toBeInTheDocument();
    });

    it('should enable both Add Asset and Allocate Asset under Assets for Manager', () => {
      render(
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>,
      );

      // Expand Assets submenu
      const expandAssetsBtn = screen.getByLabelText('Expand Assets');
      fireEvent.click(expandAssetsBtn);

      const addAssetBtn = screen.getByRole('button', { name: 'Add Asset' });
      const allocateAssetBtn = screen.getByRole('button', { name: 'Allocate Asset' });

      // Add Asset: enabled for Manager
      expect(addAssetBtn).not.toBeDisabled();
      fireEvent.click(addAssetBtn);
      expect(useAssetStore.getState().isAddModalOpen).toBe(true);

      // Allocate Asset: enabled for Manager
      expect(allocateAssetBtn).not.toBeDisabled();
      fireEvent.click(allocateAssetBtn);
      expect(useAssetStore.getState().isAllocateModalOpen).toBe(true);
    });

    it('should enable Allocations submenu items for Manager', () => {
      render(
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>,
      );

      // Expand Allocations submenu
      const expandAllocationsBtn = screen.getByLabelText('Expand Allocations');
      fireEvent.click(expandAllocationsBtn);

      const newAllocationBtn = screen.getByRole('button', { name: 'New Allocation' });
      const activeAllocationsBtn = screen.getByRole('button', { name: 'Active Allocations' });

      expect(newAllocationBtn).toBeInTheDocument();
      expect(newAllocationBtn).not.toBeDisabled();
      expect(activeAllocationsBtn).toBeInTheDocument();
      expect(activeAllocationsBtn).not.toBeDisabled();

      fireEvent.click(newAllocationBtn);
      expect(useAssetStore.getState().isAllocateModalOpen).toBe(true);
    });

    it('should disable Add Employees under Employees for Manager (restricted user admin)', () => {
      render(
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>,
      );

      // Expand Employees submenu
      const expandEmployeesBtn = screen.getByLabelText('Expand Employees');
      fireEvent.click(expandEmployeesBtn);

      const addEmployeeBtn = screen.getByRole('button', { name: 'Add Employees' });
      expect(addEmployeeBtn).toBeInTheDocument();
      expect(addEmployeeBtn).toBeDisabled();
      expect(addEmployeeBtn).toHaveClass('cursor-not-allowed');

      // Clicking disabled Add Employees should not open modal
      fireEvent.click(addEmployeeBtn);
      expect(useEmployeeStore.getState().isAddModalOpen).toBe(false);
    });
  });

  describe('VIEWER Role', () => {
    beforeEach(() => {
      useAuthStore.setState({
        user: {
          id: 'usr_viewer_01',
          name: 'Michael Vance',
          email: 'viewer@assetops.com',
          role: 'VIEWER',
        },
        isAuthenticated: true,
      });
    });

    it('should only show Dashboard, Assets, and History for Viewer', () => {
      render(
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>,
      );

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Assets')).toBeInTheDocument();
      expect(screen.getByText('History')).toBeInTheDocument();

      // Employees, Allocations, Reports, Settings should be hidden
      expect(screen.queryByText('Employees')).not.toBeInTheDocument();
      expect(screen.queryByText('Allocations')).not.toBeInTheDocument();
      expect(screen.queryByText('Reports')).not.toBeInTheDocument();
      expect(screen.queryByText('Settings')).not.toBeInTheDocument();
    });

    it('should disable all submenu items under Assets for Viewer', () => {
      render(
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>,
      );

      // Expand Assets submenu
      const expandAssetsBtn = screen.getByLabelText('Expand Assets');
      fireEvent.click(expandAssetsBtn);

      const addAssetBtn = screen.getByRole('button', { name: 'Add Asset' });
      const allocateAssetBtn = screen.getByRole('button', { name: 'Allocate Asset' });

      expect(addAssetBtn).toBeDisabled();
      expect(addAssetBtn).toHaveClass('cursor-not-allowed');

      expect(allocateAssetBtn).toBeDisabled();
      expect(allocateAssetBtn).toHaveClass('cursor-not-allowed');

      // Clicking disabled buttons does not open modals
      fireEvent.click(addAssetBtn);
      expect(useAssetStore.getState().isAddModalOpen).toBe(false);

      fireEvent.click(allocateAssetBtn);
      expect(useAssetStore.getState().isAllocateModalOpen).toBe(false);
    });
  });

  describe('Mobile Drawer RBAC', () => {
    beforeEach(() => {
      useSidebarStore.setState({
        isMobileOpen: true,
      });

      useAuthStore.setState({
        user: {
          id: 'usr_manager_01',
          name: 'Sarah Jenkins',
          email: 'manager@assetops.com',
          role: 'MANAGER',
        },
        isAuthenticated: true,
      });
    });

    it('should enforce enabled/disabled states in mobile drawer submenu for Manager', () => {
      render(
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>,
      );

      // Find mobile expand buttons for Assets and Employees
      const expandAssetsButtons = screen.getAllByLabelText('Expand Assets');
      expect(expandAssetsButtons.length).toBeGreaterThan(0);
      expandAssetsButtons.forEach((btn) => fireEvent.click(btn));

      const addAssetButtons = screen.getAllByRole('button', { name: 'Add Asset' });
      const allocateAssetButtons = screen.getAllByRole('button', { name: 'Allocate Asset' });

      // Add Asset & Allocate Asset are enabled for Manager
      addAssetButtons.forEach((btn) => expect(btn).not.toBeDisabled());
      allocateAssetButtons.forEach((btn) => expect(btn).not.toBeDisabled());

      // Expand Employees submenu in mobile drawer
      const expandEmpButtons = screen.getAllByLabelText('Expand Employees');
      expandEmpButtons.forEach((btn) => fireEvent.click(btn));

      const addEmpButtons = screen.getAllByRole('button', { name: 'Add Employees' });
      addEmpButtons.forEach((btn) => expect(btn).toBeDisabled());
    });
  });
});
