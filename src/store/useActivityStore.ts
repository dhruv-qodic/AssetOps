import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import type {
  HistoryRecord,
  CreateActivityInput,
  HistoryCategory,
  HistoryActor,
} from '@/types/activity';
import { MOCK_HISTORY_RECORDS } from '@/mocks/seed/history';

export interface HistoryKpiSummary {
  totalHistory: number;
  totalHistoryGrowth: string;
  assetActions: number;
  assetActionsRate: string;
  employeeActions: number;
  employeeActionsRate: string;
  allocationActions: number;
  allocationActionsRate: string;
  unreadCounts: {
    all: number;
    asset: number;
    employee: number;
    allocation: number;
  };
}

interface ActivityStoreState {
  activities: HistoryRecord[];
  logActivity: (input: CreateActivityInput) => HistoryRecord;
  markAllAsRead: () => void;
  markAsRead: (id: string) => void;
  clearActivities: () => void;
  resetActivities: (seedWithMocks?: boolean) => void;
  getRecentActivities: (limit?: number) => HistoryRecord[];
  getKpiSummary: () => HistoryKpiSummary;
  getUnreadCount: (category?: HistoryCategory) => number;
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
      // Gracefully handle storage quota limits
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

export function formatRelativeTime(dateString: string): string {
  if (!dateString) return 'Just now';
  if (dateString.includes('ago') || dateString === 'Just now' || dateString.includes('Yesterday')) {
    return dateString;
  }

  const parsed = new Date(dateString).getTime();
  if (isNaN(parsed)) return dateString;

  const diffMs = Date.now() - parsed;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 45) return 'Just now';
  if (diffMin < 60) return `${Math.max(1, diffMin)}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay === 1) return 'Yesterday';
  if (diffDay < 30) return `${diffDay}d ago`;

  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function getInitials(name: string): string {
  if (!name) return 'OP';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function normalizeActor(actor?: string | Partial<HistoryActor>): HistoryActor {
  if (!actor) {
    return {
      name: 'IT Operations',
      email: 'operations@assetops.com',
      role: 'IT Administrator',
      avatarInitials: 'IT',
    };
  }
  if (typeof actor === 'string') {
    const initials = getInitials(actor);
    const emailName = actor.toLowerCase().replace(/[^a-z0-9]+/g, '.');
    return {
      name: actor,
      email: `${emailName}@assetops.com`,
      role: actor.includes('Admin') ? 'IT Administrator' : 'Staff Member',
      avatarInitials: initials,
    };
  }
  const name = actor.name || 'IT Operations';
  return {
    name,
    email: actor.email || `${name.toLowerCase().replace(/[^a-z0-9]+/g, '.')}@assetops.com`,
    role: actor.role || 'Staff Member',
    avatarInitials: actor.avatarInitials || getInitials(name),
  };
}

function deriveActivityDefaults(input: CreateActivityInput) {
  const typeKey = (input.actionType || input.type || 'asset_updated').toLowerCase();

  let category: 'asset' | 'employee' | 'allocation';
  let action: string;
  let entityType: 'Asset' | 'Employee' | 'Allocation';
  let badgeLabel: string;
  let badgeVariant: 'emerald' | 'blue' | 'indigo' | 'amber' | 'rose' | 'purple' | 'slate';

  if (
    typeKey.includes('allocat') ||
    typeKey === 'assigned' ||
    typeKey === 'returned' ||
    typeKey === 'allocation_reallocated'
  ) {
    category = 'allocation';
    entityType = 'Allocation';
    if (typeKey.includes('return') || typeKey === 'returned') {
      action = 'Hardware Returned';
      badgeLabel = 'Returned';
      badgeVariant = 'blue';
    } else if (typeKey.includes('reallocat')) {
      action = 'Hardware Reallocated';
      badgeLabel = 'Reallocated';
      badgeVariant = 'indigo';
    } else {
      action = 'Hardware Allocated';
      badgeLabel = 'Allocated';
      badgeVariant = 'indigo';
    }
  } else if (typeKey.startsWith('employee_') || input.category === 'employee') {
    category = 'employee';
    entityType = 'Employee';
    if (typeKey.includes('create') || typeKey.includes('onboard')) {
      action = 'Employee Onboarded';
      badgeLabel = 'Onboarded';
      badgeVariant = 'emerald';
    } else if (typeKey.includes('delete') || typeKey.includes('offboard')) {
      action = 'Employee Removed';
      badgeLabel = 'Removed';
      badgeVariant = 'rose';
    } else if (typeKey.includes('transfer')) {
      action = 'Department Transfer';
      badgeLabel = 'Transferred';
      badgeVariant = 'purple';
    } else {
      action = 'Profile Updated';
      badgeLabel = 'Updated';
      badgeVariant = 'purple';
    }
  } else {
    category = 'asset';
    entityType = 'Asset';
    if (typeKey.includes('create')) {
      action = 'New Asset Added';
      badgeLabel = 'Created';
      badgeVariant = 'emerald';
    } else if (typeKey.includes('delete')) {
      action = 'Asset Deleted';
      badgeLabel = 'Deleted';
      badgeVariant = 'rose';
    } else if (typeKey.includes('retire')) {
      action = 'Asset Decommissioned';
      badgeLabel = 'Retired';
      badgeVariant = 'rose';
    } else if (typeKey.includes('mainten')) {
      action = 'Maintenance Scheduled';
      badgeLabel = 'Maintenance';
      badgeVariant = 'amber';
    } else {
      action = 'Specifications Updated';
      badgeLabel = 'Updated';
      badgeVariant = 'slate';
    }
  }

  return {
    category: input.category || category,
    action: input.action || action,
    entityType: input.entityType || entityType,
    statusBadge: input.statusBadge || {
      label: badgeLabel,
      variant: badgeVariant,
    },
  };
}

export const useActivityStore = create<ActivityStoreState>()(
  persist(
    (set, get) => ({
      activities: [],

      logActivity: (input) => {
        const now = new Date().toISOString();
        const defaults = deriveActivityDefaults(input);
        const actionType = input.actionType || input.type || 'asset_updated';
        const actor = normalizeActor(input.actor);
        const relative = input.relativeTime || formatRelativeTime(input.timestamp || now);

        const newActivity: HistoryRecord = {
          id: input.id || `HIST-${Math.floor(1000 + Math.random() * 9000)}`,
          category: defaults.category,
          action: defaults.action,
          actionType: actionType,
          type: input.type || actionType,
          title: input.title,
          description: input.description || `${input.title} - ${input.entityName}`,
          entityName: input.entityName,
          entityId: input.entityId || `ENT-${Math.floor(1000 + Math.random() * 9000)}`,
          entityType: defaults.entityType,
          actor,
          department: input.department,
          location: input.location || 'Headquarters',
          timestamp: input.timestamp || now,
          relativeTime: relative,
          statusBadge: defaults.statusBadge,
          badge: input.badge || defaults.statusBadge.label,
          badgeClass: input.badgeClass,
          isUnread: input.isUnread !== undefined ? input.isUnread : true,
          metadata: input.metadata,
        };

        set((state) => ({
          activities: [newActivity, ...state.activities],
        }));

        return newActivity;
      },

      markAllAsRead: () => {
        set((state) => ({
          activities: state.activities.map((a) => (a.isUnread ? { ...a, isUnread: false } : a)),
        }));
      },

      markAsRead: (id: string) => {
        set((state) => ({
          activities: state.activities.map((a) => (a.id === id ? { ...a, isUnread: false } : a)),
        }));
      },

      clearActivities: () => set({ activities: [] }),

      resetActivities: (seedWithMocks = false) =>
        set({ activities: seedWithMocks ? [...MOCK_HISTORY_RECORDS] : [] }),

      getRecentActivities: (limit = 5) => {
        return get().activities.slice(0, limit);
      },

      getKpiSummary: (): HistoryKpiSummary => {
        const activities = get().activities;
        const totalHistory = activities.length;
        const assetActions = activities.filter((a) => a.category === 'asset').length;
        const employeeActions = activities.filter((a) => a.category === 'employee').length;
        const allocationActions = activities.filter((a) => a.category === 'allocation').length;

        const unreadAll = activities.filter((a) => a.isUnread).length;
        const unreadAsset = activities.filter((a) => a.category === 'asset' && a.isUnread).length;
        const unreadEmployee = activities.filter(
          (a) => a.category === 'employee' && a.isUnread,
        ).length;
        const unreadAllocation = activities.filter(
          (a) => a.category === 'allocation' && a.isUnread,
        ).length;

        const assetRate =
          totalHistory > 0
            ? `${((assetActions / totalHistory) * 100).toFixed(1)}% of total logs`
            : '0.0% of total logs';
        const empRate =
          totalHistory > 0
            ? `${((employeeActions / totalHistory) * 100).toFixed(1)}% of total logs`
            : '0.0% of total logs';
        const allocRate =
          totalHistory > 0
            ? `${((allocationActions / totalHistory) * 100).toFixed(1)}% of total logs`
            : '0.0% of total logs';

        return {
          totalHistory,
          totalHistoryGrowth: totalHistory > 0 ? '+14.2% this month' : '0.0% this month',
          assetActions,
          assetActionsRate: assetRate,
          employeeActions,
          employeeActionsRate: empRate,
          allocationActions,
          allocationActionsRate: allocRate,
          unreadCounts: {
            all: unreadAll,
            asset: unreadAsset,
            employee: unreadEmployee,
            allocation: unreadAllocation,
          },
        };
      },

      getUnreadCount: (category = 'all') => {
        const activities = get().activities;
        if (category === 'all') {
          return activities.filter((a) => a.isUnread).length;
        }
        return activities.filter((a) => a.category === category && a.isUnread).length;
      },
    }),
    {
      name: 'assetops_history_activities_v3',
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({
        activities: state.activities,
      }),
    },
  ),
);
