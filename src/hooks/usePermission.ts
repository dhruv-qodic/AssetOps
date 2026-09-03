import { useAuthStore } from "@/store/useAuthStore";
import type { Permission } from "@/types/permissions";
import { ROLE_PERMISSIONS, type Role } from "@/types/auth";

export interface UsePermissionReturn {
  userRole: Role | undefined;
  permissions: Permission[];
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  canAccessRoute: (path: string) => boolean;
}

/**
 * Custom React hook to inspect current user permissions based on their role stored in Zustand.
 */
export function usePermission(): UsePermissionReturn {
  const { user } = useAuthStore();
  const userRole = user?.role;
  const permissions: Permission[] = userRole ? ROLE_PERMISSIONS[userRole] || [] : [];

  const hasPermission = (permission: Permission): boolean => {
    if (!userRole) return false;
    return permissions.includes(permission);
  };

  const hasAnyPermission = (requiredPermissions: Permission[]): boolean => {
    if (!userRole) return false;
    return requiredPermissions.some((p) => permissions.includes(p));
  };

  const hasAllPermissions = (requiredPermissions: Permission[]): boolean => {
    if (!userRole) return false;
    return requiredPermissions.every((p) => permissions.includes(p));
  };

  /**
   * Maps application route paths to required permissions.
   */
  const canAccessRoute = (path: string): boolean => {
    if (!userRole) return false;

    switch (path) {
      case "/":
        return hasPermission("VIEW_DASHBOARD");
      case "/assets":
        return hasPermission("VIEW_ASSETS");
      case "/employees":
        return hasPermission("VIEW_EMPLOYEES");
      case "/allocations":
        return hasPermission("ALLOCATE_ASSET");
      case "/history":
        return hasPermission("VIEW_HISTORY");
      case "/reports":
        return hasPermission("VIEW_REPORTS");
      case "/settings":
        return hasPermission("MANAGE_SETTINGS");
      default:
        return true;
    }
  };

  return {
    userRole,
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessRoute,
  };
}
