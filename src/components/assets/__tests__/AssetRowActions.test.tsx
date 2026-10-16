import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AssetRowActions from '../AssetRowActions';
import { useAuthStore } from '@/store/useAuthStore';
import { useAssetStore } from '@/store/useAssetStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import type { Asset } from '@/types/asset';

const mockUnallocatedAsset: Asset = {
  id: 'ast_unallocated_1',
  assetId: 'AST-1001',
  name: 'MacBook Pro 16',
  category: 'Laptop',
  model: 'M3 Max',
  serialNumber: 'SN-MBP-16-001',
  status: 'Available',
  location: 'San Francisco',
  purchaseCost: 3499,
  purchaseDate: '2024-01-10',
  warrantyExpiry: '2027-01-10',
  assignedTo: null,
  createdAt: '2024-01-10T00:00:00Z',
  updatedAt: '2024-01-10T00:00:00Z',
};

const mockAllocatedAsset: Asset = {
  id: 'ast_allocated_1',
  assetId: 'AST-1002',
  name: 'Dell XPS 15',
  category: 'Laptop',
  model: '9530',
  serialNumber: 'SN-XPS-15-002',
  status: 'Allocated',
  location: 'New York',
  purchaseCost: 2200,
  purchaseDate: '2023-05-15',
  warrantyExpiry: '2026-05-15',
  assignedTo: {
    id: 'emp_01',
    name: 'Alice Johnson',
    department: 'Engineering',
  },
  createdAt: '2023-05-15T00:00:00Z',
  updatedAt: '2023-05-15T00:00:00Z',
};

describe('AssetRowActions Component RBAC', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });

    useAssetStore.setState({
      isAllocateModalOpen: false,
      isEditModalOpen: false,
      isDeleteModalOpen: false,
      isViewModalOpen: false,
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

    it('should allow Manager to allocate an unallocated asset', () => {
      render(<AssetRowActions asset={mockUnallocatedAsset} />);

      // Open actions dropdown
      const actionButton = screen.getByTitle('Asset actions');
      fireEvent.click(actionButton);

      expect(screen.getByText('Asset Details')).toBeInTheDocument();
      expect(screen.getByText('Edit Asset')).toBeInTheDocument();
      expect(screen.getByText('Allocate to Employee')).toBeInTheDocument();

      // Manager must NOT have access to Delete Asset
      expect(screen.queryByText('Delete Asset')).not.toBeInTheDocument();

      // Trigger Allocate
      fireEvent.click(screen.getByText('Allocate to Employee'));
      expect(useAssetStore.getState().isAllocateModalOpen).toBe(true);
    });

    it('should allow Manager to deallocate an allocated asset', () => {
      const deallocateSpy = vi.fn();
      useAssetStore.setState({ deallocateAsset: deallocateSpy });

      const unassignSpy = vi.fn();
      useEmployeeStore.setState({ unassignAssetFromEmployee: unassignSpy });

      render(<AssetRowActions asset={mockAllocatedAsset} />);

      const actionButton = screen.getByTitle('Asset actions');
      fireEvent.click(actionButton);

      expect(screen.getByText('Deallocate Asset')).toBeInTheDocument();
      expect(screen.queryByText('Delete Asset')).not.toBeInTheDocument();

      // Trigger Deallocate
      fireEvent.click(screen.getByText('Deallocate Asset'));
      expect(deallocateSpy).toHaveBeenCalledWith(mockAllocatedAsset.id);
      expect(unassignSpy).toHaveBeenCalledWith('emp_01', mockAllocatedAsset.id);
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

    it('should allow Admin full access including Delete Asset, Edit, and Allocate', () => {
      render(<AssetRowActions asset={mockUnallocatedAsset} />);

      const actionButton = screen.getByTitle('Asset actions');
      fireEvent.click(actionButton);

      expect(screen.getByText('Asset Details')).toBeInTheDocument();
      expect(screen.getByText('Edit Asset')).toBeInTheDocument();
      expect(screen.getByText('Allocate to Employee')).toBeInTheDocument();
      expect(screen.getByText('Delete Asset')).toBeInTheDocument();
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

    it('should restrict Viewer from Edit, Allocate, Deallocate, and Delete', () => {
      render(<AssetRowActions asset={mockAllocatedAsset} />);

      const actionButton = screen.getByTitle('Asset actions');
      fireEvent.click(actionButton);

      expect(screen.getByText('Asset Details')).toBeInTheDocument();
      expect(screen.queryByText('Edit Asset')).not.toBeInTheDocument();
      expect(screen.queryByText('Allocate to Employee')).not.toBeInTheDocument();
      expect(screen.queryByText('Deallocate Asset')).not.toBeInTheDocument();
      expect(screen.queryByText('Delete Asset')).not.toBeInTheDocument();
    });
  });
});
