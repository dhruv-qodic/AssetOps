import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import NotFoundPage from '@/pages/NotFoundPage';
import UnauthorizedPage from '@/pages/UnauthorizedPage';
import Dashboardlayout from '@/layout/Dashboardlayout';
import AssetListPage from '@/pages/AssetListPage';
import EmployeeListPage from '@/pages/EmployeeListPage';
import AllocationsPage from '@/pages/AllocationsPage';
import HistoryPage from '@/pages/HistoryPage';
import ReportsPage from '@/pages/ReportsPage';
import SettingsPage from '@/pages/SettingsPage';
import LoginPage from '@/pages/auth/LoginPage';
import ProtectedRoute from '@/routes/ProtectedRoute';
import PermissionRoute from '@/routes/PermissionRoute';
import PublicOnlyRoute from '@/routes/PublicOnlyRoute';

function AppRoutes() {
  return (
    <Routes>
      {/* Public Only Route: /login */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Protected Routes inside Dashboard Layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Dashboardlayout />}>
          <Route path="/" element={<Dashboard />} />

          {/* Assets Module: VIEW_ASSETS permission (Admin, Manager, Viewer) */}
          <Route element={<PermissionRoute permission="VIEW_ASSETS" path="/assets" />}>
            <Route path="/assets" element={<AssetListPage />} />
          </Route>

          {/* Employees Module: VIEW_EMPLOYEES permission (Admin, Manager) */}
          <Route element={<PermissionRoute permission="VIEW_EMPLOYEES" path="/employees" />}>
            <Route path="/employees" element={<EmployeeListPage />} />
          </Route>

          {/* Allocations / Maintenance Module: ALLOCATE_ASSET permission (Admin, Manager) */}
          <Route element={<PermissionRoute permission="ALLOCATE_ASSET" path="/allocations" />}>
            <Route path="/allocations" element={<AllocationsPage />} />
          </Route>

          {/* History Module: VIEW_HISTORY permission (Admin, Manager, Viewer) */}
          <Route element={<PermissionRoute permission="VIEW_HISTORY" path="/history" />}>
            <Route path="/history" element={<HistoryPage />} />
          </Route>

          {/* Reports Module: VIEW_REPORTS permission (Admin only) */}
          <Route element={<PermissionRoute permission="VIEW_REPORTS" path="/reports" />}>
            <Route path="/reports" element={<ReportsPage />} />
          </Route>

          {/* Settings Module: MANAGE_SETTINGS permission (Admin only) */}
          <Route element={<PermissionRoute permission="MANAGE_SETTINGS" path="/settings" />}>
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Unauthorized (403) */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;