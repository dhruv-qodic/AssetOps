import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/auth';
import type { LoginFormData, RegisterFormData } from '@/schemas/auth.schema';
import { getAllUsers, saveRegisteredUser, type MockUser } from '@/mocks/seed/users';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginFormData) => Promise<boolean>;
  register: (data: RegisterFormData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginFormData) => {
        set({ isLoading: true, error: null });

        // Simulate network latency
        await new Promise((resolve) => setTimeout(resolve, 500));

        const allUsers = getAllUsers();
        const matchedUser = allUsers.find(
          (u) =>
            u.email.toLowerCase() === credentials.email.trim().toLowerCase() &&
            u.password === credentials.password,
        );

        if (!matchedUser) {
          set({
            isLoading: false,
            error: 'Invalid email address or password. Please try again.',
          });
          return false;
        }

        const { password: _, ...userWithoutPassword } = matchedUser;

        set({
          user: userWithoutPassword,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        return true;
      },

      register: async (data: RegisterFormData) => {
        set({ isLoading: true, error: null });

        // Simulate network latency
        await new Promise((resolve) => setTimeout(resolve, 500));

        const allUsers = getAllUsers();
        const emailLower = data.email.trim().toLowerCase();

        // Check if an account with this email already exists
        const emailExists = allUsers.some((u) => u.email.toLowerCase() === emailLower);
        if (emailExists) {
          const errMsg = 'An account with this email address already exists.';
          set({
            isLoading: false,
            error: errMsg,
          });
          return { success: false, error: errMsg };
        }

        const newUser: MockUser = {
          id: `usr_reg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          name: data.name.trim(),
          email: emailLower,
          password: data.password,
          role: data.role,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name.trim())}`,
          department: 'General Operations',
          status: 'ACTIVE',
          joinedDate: new Date().toISOString().split('T')[0],
        };

        saveRegisteredUser(newUser);

        set({
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
      }),
    },
  ),
);
