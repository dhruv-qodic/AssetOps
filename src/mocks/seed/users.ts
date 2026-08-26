import type { User, Role } from '@/types/auth';

export interface MockUser extends User {
  password: string;
  department?: string;
  phone?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  joinedDate?: string;
}

export interface DemoAccount {
  role: 'Admin' | 'Manager' | 'Viewer';
  roleKey: Role;
  email: string;
  password: string;
  name: string;
  badgeColor: string;
  iconColor: string;
}

// Seed mock users database supporting ADMIN, MANAGER, EMPLOYEE, VIEWER roles
export const MOCK_USERS: MockUser[] = [
  {
    id: 'usr_admin_01',
    name: 'Dhruv Faldu',
    email: 'admin@assetops.com',
    password: 'password123',
    role: 'ADMIN',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    department: 'IT Administration',
    phone: '+1 (555) 019-2834',
    status: 'ACTIVE',
    joinedDate: '2023-01-15',
  },
  {
    id: 'usr_manager_01',
    name: 'Sarah Jenkins',
    email: 'manager@assetops.com',
    password: 'password123',
    role: 'MANAGER',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    department: 'Operations & Logistics',
    phone: '+1 (555) 014-9921',
    status: 'ACTIVE',
    joinedDate: '2023-06-20',
  },
  {
    id: 'usr_viewer_01',
    name: 'Michael Vance',
    email: 'viewer@assetops.com',
    password: 'password123',
    role: 'VIEWER',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    department: 'Quality Assurance',
    phone: '+1 (555) 012-4490',
    status: 'ACTIVE',
    joinedDate: '2024-05-12',
  },
];

// Pre-configured demo accounts for login page and quick access
export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: 'Admin',
    roleKey: 'ADMIN',
    email: 'admin@assetops.com',
    password: 'password123',
    name: 'Dhruv Faldu',
    badgeColor: 'text-purple-600 dark:text-purple-400',
    iconColor: 'text-purple-500',
  },
  {
    role: 'Manager',
    roleKey: 'MANAGER',
    email: 'manager@assetops.com',
    password: 'password123',
    name: 'Sarah Jenkins',
    badgeColor: 'text-blue-600 dark:text-blue-400',
    iconColor: 'text-blue-500',
  },
  {
    role: 'Viewer',
    roleKey: 'VIEWER',
    email: 'viewer@assetops.com',
    password: 'password123',
    name: 'Michael Vance',
    badgeColor: 'text-emerald-600 dark:text-emerald-400',
    iconColor: 'text-emerald-500',
  },
];

// Helper functions for mock user operations
export const getMockUserByEmail = (email: string): MockUser | undefined => {
  return MOCK_USERS.find(
    (user) => user.email.toLowerCase() === email.trim().toLowerCase()
  );
};

export const getMockUserById = (id: string): MockUser | undefined => {
  return MOCK_USERS.find((user) => user.id === id);
};

export const getMockUsersByRole = (role: Role): MockUser[] => {
  return MOCK_USERS.filter((user) => user.role === role);
};
