import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { usePermission } from "@/hooks/usePermission";
import type { Permission } from "@/types/permissions";
import type { Role } from "@/types/auth";

interface PermissionRouteProps {
  permission?: Permission;
  permissions?: Permission[];
  allowedRoles?: Role[];
  path?: string;
}

/**
 * Route guard that hooks into usePermission() to protect routes based on role and permissions.
 */
export default function PermissionRoute({
  permission,
  permissions,
  allowedRoles,
  path,
}: PermissionRouteProps) {
  const { user } = useAuthStore();
  const { hasPermission, hasAnyPermission, canAccessRoute } = usePermission();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 1. Verify allowedRoles if explicitly provided
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 2. Verify single required permission if provided
  if (permission && !hasPermission(permission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 3. Verify list of permissions if provided
  if (permissions && !hasAnyPermission(permissions)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 4. Verify path-based permission
  const targetPath = path || location.pathname;
  if (targetPath && !canAccessRoute(targetPath)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
