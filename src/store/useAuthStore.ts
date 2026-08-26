import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/auth';
import type { LoginFormData } from '@/schemas/auth.schema';
import { MOCK_USERS } from '@/mocks/seed/users';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginFormData) => Promise<boolean>;
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

        const matchedUser = MOCK_USERS.find(
          (u) =>
            u.email.toLowerCase() === credentials.email.trim().toLowerCase() &&
            u.password === credentials.password
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
    }
  )
);
