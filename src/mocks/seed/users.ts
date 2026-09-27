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

export const REGISTERED_USERS_STORAGE_KEY = 'assetops_registered_users';

/**
 * Safely retrieve user records registered through the application stored in localStorage.
 */
export const getRegisteredUsers = (): MockUser[] => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(REGISTERED_USERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/**
 * Persist a newly registered user to localStorage without overwriting existing seed or registered users.
 */
export const saveRegisteredUser = (user: MockUser): void => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  try {
    const existing = getRegisteredUsers();
    // Prevent duplicate entries by id or email
    const filtered = existing.filter(
      (u) =>
        u.id !== user.id &&
        u.email.toLowerCase() !== user.email.toLowerCase(),
    );
    const updated = [...filtered, user];
    window.localStorage.setItem(REGISTERED_USERS_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save registered user to localStorage:', error);
  }
};

/**
 * Return all available users (both default seeded users and previously registered users from localStorage).
 */
export const getAllUsers = (): MockUser[] => {
  const registered = getRegisteredUsers();
  // Ensure seed users take precedence, then append registered users with unique emails
  const seedEmails = new Set(MOCK_USERS.map((u) => u.email.toLowerCase()));
  const uniqueRegistered = registered.filter((u) => !seedEmails.has(u.email.toLowerCase()));
  return [...MOCK_USERS, ...uniqueRegistered];
};

// Helper functions for mock user operations across seed and registered users
export const getMockUserByEmail = (email: string): MockUser | undefined => {
  return getAllUsers().find((user) => user.email.toLowerCase() === email.trim().toLowerCase());
};

export const getMockUserById = (id: string): MockUser | undefined => {
  return getAllUsers().find((user) => user.id === id);
};

export const getMockUsersByRole = (role: Role): MockUser[] => {
  return getAllUsers().filter((user) => user.role === role);
};
