import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { SuspenseLoader } from '@/components/common/SuspenseLoader';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

// Guard routes (Direct imports for immediate resolution)
import ProtectedRoute from '@/routes/ProtectedRoute';
import PermissionRoute from '@/routes/PermissionRoute';
import PublicOnlyRoute from '@/routes/PublicOnlyRoute';

// Lazy-loaded layout & pages (ensures root Suspense loader appears on initial bootstrap)
const Dashboardlayout = lazy(() => import('@/layout/Dashboardlayout'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const AssetListPage = lazy(() => import('@/pages/AssetListPage'));
const AssetDetailPage = lazy(() => import('@/pages/AssetDetailPage'));
const EmployeeListPage = lazy(() => import('@/pages/EmployeeListPage'));
const AllocationsPage = lazy(() => import('@/pages/AllocationsPage'));
const HistoryPage = lazy(() => import('@/pages/HistoryPage'));
const ReportsPage = lazy(() => import('@/pages/ReportsPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const UnauthorizedPage = lazy(() => import('@/pages/UnauthorizedPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

function AppRoutes() {
  return (
    <ErrorBoundary
      fullScreen
      title="Application Error"
      message="Failed to load application routes. Please try refreshing."
    >
      <Suspense fallback={<SuspenseLoader fullScreen message="Loading AssetOps..." />}>
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
                <Route path="/assets/:assetId" element={<AssetDetailPage />} />
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
      </Suspense>
    </ErrorBoundary>
  );
}

export default AppRoutes;
