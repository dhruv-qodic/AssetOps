import type { Permission } from "./permissions";

export type Role = "ADMIN" | "MANAGER" | "VIEWER";
export type UserRole = Role;

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface NavItemConfig {
  name: string;
  path: string;
  iconName: string;
  requiredPermission: Permission;
}

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  ADMIN: [
    "VIEW_DASHBOARD",
    "VIEW_ASSETS",
    "CREATE_ASSET",
    "EDIT_ASSET",
    "DELETE_ASSET",
    "ALLOCATE_ASSET",
    "VIEW_EMPLOYEES",
    "MANAGE_EMPLOYEES",
    "VIEW_HISTORY",
    "VIEW_REPORTS",
    "MANAGE_SETTINGS",
  ],

  MANAGER: [
    "VIEW_DASHBOARD",
    "VIEW_ASSETS",
    "CREATE_ASSET",
    "EDIT_ASSET",
    // "ALLOCATE_ASSET",
    "VIEW_EMPLOYEES",
    "VIEW_HISTORY",
  ],

  VIEWER: [
    "VIEW_DASHBOARD",
    "VIEW_ASSETS",
    "VIEW_HISTORY",
  ],
};

/**
 * Checks whether a given role has a specific permission.
 */
export const hasPermission = (role: Role, permission: Permission): boolean => {
  const allowedPermissions = ROLE_PERMISSIONS[role] || [];
  return allowedPermissions.includes(permission);
};
