import { Role } from "@/types/auth";
import { Permission } from "@/types/permissions";

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

export type { Role };
