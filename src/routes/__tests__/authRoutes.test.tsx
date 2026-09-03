import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import PublicOnlyRoute from '../PublicOnlyRoute';
import PermissionRoute from '../PermissionRoute';
import { useAuthStore } from '@/store/useAuthStore';

describe('Route Protection Components', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  });

  describe('ProtectedRoute', () => {
    it('should redirect unauthenticated user to /login', () => {
      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<div>Protected Dashboard</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Login Page')).toBeInTheDocument();
      expect(screen.queryByText('Protected Dashboard')).not.toBeInTheDocument();
    });

    it('should render protected route content for authenticated user', () => {
      useAuthStore.setState({
        user: {
          id: 'usr_admin_01',
          name: 'Admin',
          email: 'admin@assetops.com',
          role: 'ADMIN',
        },
        isAuthenticated: true,
      });

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<div>Protected Dashboard</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Protected Dashboard')).toBeInTheDocument();
      expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
    });
  });

  describe('PublicOnlyRoute', () => {
    it('should render public page for unauthenticated user', () => {
      render(
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/" element={<div>Home Dashboard</div>} />
            <Route element={<PublicOnlyRoute />}>
              <Route path="/login" element={<div>Login Page</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Login Page')).toBeInTheDocument();
      expect(screen.queryByText('Home Dashboard')).not.toBeInTheDocument();
    });

    it('should redirect authenticated user away from login page to /', () => {
      useAuthStore.setState({
        user: {
          id: 'usr_admin_01',
          name: 'Admin',
          email: 'admin@assetops.com',
          role: 'ADMIN',
        },
        isAuthenticated: true,
      });

      render(
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/" element={<div>Home Dashboard</div>} />
            <Route element={<PublicOnlyRoute />}>
              <Route path="/login" element={<div>Login Page</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Home Dashboard')).toBeInTheDocument();
      expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
    });
  });

  describe('PermissionRoute', () => {
    it('should redirect unauthenticated user to /login', () => {
      render(
        <MemoryRouter initialEntries={['/settings']}>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route path="/unauthorized" element={<div>Unauthorized Page</div>} />
            <Route element={<PermissionRoute permission="MANAGE_SETTINGS" />}>
              <Route path="/settings" element={<div>Settings Page</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Login Page')).toBeInTheDocument();
      expect(screen.queryByText('Settings Page')).not.toBeInTheDocument();
    });

    it('should redirect user to /unauthorized if role is not in allowedRoles', () => {
      useAuthStore.setState({
        user: {
          id: 'usr_viewer_01',
          name: 'Viewer',
          email: 'viewer@assetops.com',
          role: 'VIEWER',
        },
        isAuthenticated: true,
      });

      render(
        <MemoryRouter initialEntries={['/admin-panel']}>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route path="/unauthorized" element={<div>Unauthorized Page</div>} />
            <Route element={<PermissionRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin-panel" element={<div>Admin Only Page</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Unauthorized Page')).toBeInTheDocument();
      expect(screen.queryByText('Admin Only Page')).not.toBeInTheDocument();
    });

    it('should redirect user to /unauthorized if single permission requirement is missing', () => {
      useAuthStore.setState({
        user: {
          id: 'usr_manager_01',
          name: 'Manager',
          email: 'manager@assetops.com',
          role: 'MANAGER',
        },
        isAuthenticated: true,
      });

      render(
        <MemoryRouter initialEntries={['/settings']}>
          <Routes>
            <Route path="/unauthorized" element={<div>Unauthorized Page</div>} />
            <Route element={<PermissionRoute permission="MANAGE_SETTINGS" />}>
              <Route path="/settings" element={<div>Settings Page</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Unauthorized Page')).toBeInTheDocument();
      expect(screen.queryByText('Settings Page')).not.toBeInTheDocument();
    });

    it('should redirect user to /unauthorized if list of permissions check fails', () => {
      useAuthStore.setState({
        user: {
          id: 'usr_viewer_01',
          name: 'Viewer',
          email: 'viewer@assetops.com',
          role: 'VIEWER',
        },
        isAuthenticated: true,
      });

      render(
        <MemoryRouter initialEntries={['/manage']}>
          <Routes>
            <Route path="/unauthorized" element={<div>Unauthorized Page</div>} />
            <Route
              element={
                <PermissionRoute permissions={['CREATE_ASSET', 'EDIT_ASSET']} />
              }
            >
              <Route path="/manage" element={<div>Management Page</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Unauthorized Page')).toBeInTheDocument();
      expect(screen.queryByText('Management Page')).not.toBeInTheDocument();
    });

    it('should allow access when user has required permissions', () => {
      useAuthStore.setState({
        user: {
          id: 'usr_admin_01',
          name: 'Admin',
          email: 'admin@assetops.com',
          role: 'ADMIN',
        },
        isAuthenticated: true,
      });

      render(
        <MemoryRouter initialEntries={['/settings']}>
          <Routes>
            <Route path="/unauthorized" element={<div>Unauthorized Page</div>} />
            <Route element={<PermissionRoute permission="MANAGE_SETTINGS" path="/settings" />}>
              <Route path="/settings" element={<div>Settings Page</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Settings Page')).toBeInTheDocument();
      expect(screen.queryByText('Unauthorized Page')).not.toBeInTheDocument();
    });
  });
});
