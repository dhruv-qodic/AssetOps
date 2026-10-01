import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import type { ActivityRecord, CreateActivityInput } from '@/types/activity';

interface ActivityStoreState {
  activities: ActivityRecord[];
  logActivity: (input: CreateActivityInput) => ActivityRecord;
  clearActivities: () => void;
  resetActivities: () => void;
  getRecentActivities: (limit?: number) => ActivityRecord[];
}

const safeStorage: StateStorage = {
  getItem: (name: string): string | null => {
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      localStorage.setItem(name, value);
    } catch {
      // Gracefully handle quota limits
    }
  },
  removeItem: (name: string): void => {
    try {
      localStorage.removeItem(name);
    } catch {
      // ignore
    }
  },
};

export const useActivityStore = create<ActivityStoreState>()(
  persist(
    (set, get) => ({
      activities: [],

      logActivity: (input) => {
        const now = new Date().toISOString();
        const newActivity: ActivityRecord = {
          id: input.id || `act_${crypto.randomUUID()}`,
          type: input.type,
          title: input.title,
          entityName: input.entityName,
          entityId: input.entityId,
          actor: input.actor || 'IT Operations',
          department: input.department,
          timestamp: input.timestamp || now,
          badge: input.badge,
          badgeClass: input.badgeClass,
        };

        set((state) => ({
          activities: [newActivity, ...state.activities],
        }));

        return newActivity;
      },

      clearActivities: () => set({ activities: [] }),

      resetActivities: () => set({ activities: [] }),

      getRecentActivities: (limit = 5) => {
        return get().activities.slice(0, limit);
      },
    }),
    {
      name: 'assetops_recent_activities_v1',
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({
        activities: state.activities,
      }),
    },
  ),
);
