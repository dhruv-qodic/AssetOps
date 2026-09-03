import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePermission } from '../usePermission';
import { useAuthStore } from '@/store/useAuthStore';
import { hasPermission as hasRolePermission } from '@/types/auth';

describe('hooks/usePermission & auth permission helpers', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  });

  describe('hasPermission standalone function', () => {
    it('should correctly evaluate role-based permissions', () => {
      expect(hasRolePermission('ADMIN', 'MANAGE_SETTINGS')).toBe(true);
      expect(hasRolePermission('ADMIN', 'DELETE_ASSET')).toBe(true);
      expect(hasRolePermission('MANAGER', 'CREATE_ASSET')).toBe(true);
      expect(hasRolePermission('MANAGER', 'MANAGE_SETTINGS')).toBe(false);
      expect(hasRolePermission('VIEWER', 'VIEW_DASHBOARD')).toBe(true);
      expect(hasRolePermission('VIEWER', 'CREATE_ASSET')).toBe(false);
    });
  });

  describe('usePermission hook', () => {
    it('should return empty permissions and false checks when unauthenticated', () => {
      const { result } = renderHook(() => usePermission());

      expect(result.current.userRole).toBeUndefined();
      expect(result.current.permissions).toEqual([]);
      expect(result.current.hasPermission('VIEW_DASHBOARD')).toBe(false);
      expect(result.current.hasAnyPermission(['VIEW_DASHBOARD', 'VIEW_ASSETS'])).toBe(false);
      expect(result.current.hasAllPermissions(['VIEW_DASHBOARD'])).toBe(false);
      expect(result.current.canAccessRoute('/')).toBe(false);
    });

    it('should return full admin permissions for ADMIN user', () => {
      useAuthStore.setState({
        user: {
          id: 'usr_admin_01',
          name: 'Admin User',
          email: 'admin@assetops.com',
          role: 'ADMIN',
        },
        isAuthenticated: true,
      });

      const { result } = renderHook(() => usePermission());

      expect(result.current.userRole).toBe('ADMIN');
      expect(result.current.hasPermission('MANAGE_SETTINGS')).toBe(true);
      expect(result.current.hasPermission('DELETE_ASSET')).toBe(true);

      expect(
        result.current.hasAnyPermission(['MANAGE_SETTINGS', 'NON_EXISTENT' as any])
      ).toBe(true);
      expect(
        result.current.hasAllPermissions(['VIEW_DASHBOARD', 'MANAGE_SETTINGS', 'VIEW_ASSETS'])
      ).toBe(true);

      expect(result.current.canAccessRoute('/')).toBe(true);
      expect(result.current.canAccessRoute('/assets')).toBe(true);
      expect(result.current.canAccessRoute('/settings')).toBe(true);
    });

    it('should return restricted permissions for MANAGER user', () => {
      useAuthStore.setState({
        user: {
          id: 'usr_manager_01',
          name: 'Manager User',
          email: 'manager@assetops.com',
          role: 'MANAGER',
        },
        isAuthenticated: true,
      });

      const { result } = renderHook(() => usePermission());

      expect(result.current.userRole).toBe('MANAGER');
      expect(result.current.hasPermission('CREATE_ASSET')).toBe(true);
      expect(result.current.hasPermission('MANAGE_SETTINGS')).toBe(false);

      expect(result.current.canAccessRoute('/assets')).toBe(true);
      expect(result.current.canAccessRoute('/settings')).toBe(false);
    });

    it('should return view-only permissions for VIEWER user', () => {
      useAuthStore.setState({
        user: {
          id: 'usr_viewer_01',
          name: 'Viewer User',
          email: 'viewer@assetops.com',
          role: 'VIEWER',
        },
        isAuthenticated: true,
      });

      const { result } = renderHook(() => usePermission());

      expect(result.current.userRole).toBe('VIEWER');
      expect(result.current.hasPermission('VIEW_DASHBOARD')).toBe(true);
      expect(result.current.hasPermission('VIEW_ASSETS')).toBe(true);
      expect(result.current.hasPermission('CREATE_ASSET')).toBe(false);
      expect(result.current.hasPermission('ALLOCATE_ASSET')).toBe(false);

      expect(result.current.canAccessRoute('/')).toBe(true);
      expect(result.current.canAccessRoute('/assets')).toBe(true);
      expect(result.current.canAccessRoute('/allocations')).toBe(false);
      expect(result.current.canAccessRoute('/reports')).toBe(false);
    });

    it('should allow unknown/unmapped paths by default in canAccessRoute', () => {
      useAuthStore.setState({
        user: {
          id: 'usr_viewer_01',
          name: 'Viewer User',
          email: 'viewer@assetops.com',
          role: 'VIEWER',
        },
        isAuthenticated: true,
      });

      const { result } = renderHook(() => usePermission());
      expect(result.current.canAccessRoute('/some-unmapped-custom-page')).toBe(true);
    });
  });
});
