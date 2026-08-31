import type { Permission } from "./permissions";
import { ROLE_PERMISSIONS } from "@/constans/auth.constants";

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

/**
 * Checks whether a given role has a specific permission.
 */
export const hasPermission = (role: Role, permission: Permission): boolean => {
  const allowedPermissions = ROLE_PERMISSIONS[role] || [];
  return allowedPermissions.includes(permission);
};
