import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Role } from '@/types/auth';
import type { LoginFormData, RegisterFormData } from '@/schemas/auth.schema';
import { MOCK_USERS } from '@/mocks/seed/users';

// ─── Stored registered user shape ────────────────────────────────────────────
export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  /** SHA-256 hex hash of the password (never stored in plain text) */
  passwordHash: string;
  createdAt: string;
}

// ─── Helper: SHA-256 via Web Crypto API (browser-native, no extra deps) ──────
async function sha256Hex(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ─── Store shape ─────────────────────────────────────────────────────────────
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  /** Persisted list of users registered via the registration form */
  registeredUsers: RegisteredUser[];

  // Actions
  login: (credentials: LoginFormData) => Promise<boolean>;
  register: (data: RegisterFormData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  clearError: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      registeredUsers: [],

      login: async (credentials: LoginFormData) => {
        set({ isLoading: true, error: null });

        // Simulate network latency
        await new Promise((resolve) => setTimeout(resolve, 500));

        const emailLower = credentials.email.trim().toLowerCase();
        const { registeredUsers } = get();

        // 1. Check against seed/mock users (plain-text passwords, dev only)
        const seedMatch = MOCK_USERS.find(
          (u) => u.email.toLowerCase() === emailLower && u.password === credentials.password,
        );

        if (seedMatch) {
          const { password: _, ...userWithoutPassword } = seedMatch;
          set({
            user: userWithoutPassword,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return true;
        }

        // 2. Check registered users (hashed passwords)
        const registeredMatch = registeredUsers.find((u) => u.email.toLowerCase() === emailLower);

        if (!registeredMatch) {
          set({
            isLoading: false,
            error: 'Invalid email address or password. Please try again.',
          });
          return false;
        }

        // Verify hashed password
        const inputHash = await sha256Hex(credentials.password);
        if (inputHash !== registeredMatch.passwordHash) {
          set({
            isLoading: false,
            error: 'Invalid email address or password. Please try again.',
          });
          return false;
        }

        const { passwordHash: _, createdAt: __, ...userFields } = registeredMatch;
        set({
          user: userFields,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return true;
      },

      register: async (data: RegisterFormData) => {
        set({ isLoading: true, error: null });

        await new Promise((resolve) => setTimeout(resolve, 400));

        const emailLower = data.email.trim().toLowerCase();
        const { registeredUsers } = get();

        // Prevent duplicate accounts (check both seed and registered users)
        const seedDuplicate = MOCK_USERS.find((u) => u.email.toLowerCase() === emailLower);
        const registeredDuplicate = registeredUsers.find(
          (u) => u.email.toLowerCase() === emailLower,
        );

        if (seedDuplicate || registeredDuplicate) {
          set({ isLoading: false, error: null });
          return { success: false, error: 'An account with this email already exists.' };
        }

        const passwordHash = await sha256Hex(data.password);

        const newUser: RegisteredUser = {
          id: `usr_${data.role.toLowerCase()}_${Date.now()}`,
          name: data.name.trim(),
          email: data.email.trim().toLowerCase(),
          role: data.role,
          passwordHash,
          createdAt: new Date().toISOString(),
        };

        set({
          registeredUsers: [...registeredUsers, newUser],
          isLoading: false,
          error: null,
        });

        return { success: true };
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'assetops_auth_store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        registeredUsers: state.registeredUsers,
      }),
    },
  ),
);
