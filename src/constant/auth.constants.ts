import { Role } from '@/types/auth';
import { Permission } from '@/types/permissions';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  ADMIN: [
    'VIEW_DASHBOARD',
    'VIEW_ASSETS',
    'CREATE_ASSET',
    'EDIT_ASSET',
    'DELETE_ASSET',
    'ALLOCATE_ASSET',
    'VIEW_EMPLOYEES',
    'MANAGE_EMPLOYEES',
    'VIEW_HISTORY',
    'VIEW_REPORTS',
    'MANAGE_SETTINGS',
  ],

  MANAGER: [
    'VIEW_DASHBOARD',
    'VIEW_ASSETS',
    'CREATE_ASSET',
    'EDIT_ASSET',
    'ALLOCATE_ASSET',
    'VIEW_EMPLOYEES',
    'VIEW_HISTORY',
  ],

  VIEWER: ['VIEW_DASHBOARD', 'VIEW_ASSETS', 'VIEW_HISTORY'],
};

export const AUTH_BRANDING = {
  APP_NAME: 'AssetOps',
  SLOGAN_LINE_1: 'Smart Asset Management',
  SLOGAN_LINE_2: 'for a Smarter Business',
} as const;

export const AUTH_FEATURES = [
  'Track & manage company assets',
  'Allocate assets to employees',
  'Monitor asset lifecycle & history',
  'Get real-time insights',
] as const;

export const AUTH_LIVE_STATUS = {
  TITLE: 'Live System Status',
  ACTIVE_ASSETS: '10,000 Assets Active',
  HEALTH_LABEL: 'System Health',
  HEALTH_VALUE: '99.98%',
  SPEED_LABEL: 'Grid Speed',
  SPEED_VALUE: '60 FPS',
  SECURITY_LABEL: 'Enterprise Security Active',
} as const;

export type { Role };
