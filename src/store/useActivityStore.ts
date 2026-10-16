import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import type {
  HistoryRecord,
  CreateActivityInput,
  HistoryCategory,
  HistoryActor,
} from '@/types/activity';
import { MOCK_HISTORY_RECORDS } from '@/mocks/seed/history';
import { useAssetStore } from '@/store/useAssetStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';

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

export interface ActivityStoreState {
  activities: HistoryRecord[];
  past: HistoryRecord[];
  present: HistoryRecord | null;
  future: HistoryRecord[];

  logActivity: (input: CreateActivityInput) => HistoryRecord;
  undo: () => boolean;
  redo: () => boolean;
  canUndo: () => boolean;
  canRedo: () => boolean;
  getUndoTarget: () => HistoryRecord | null;
  getRedoTarget: () => HistoryRecord | null;
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

import { formatRelativeTime } from '@/utils/date';
import { getInitials } from '@/utils/string';

export { formatRelativeTime };

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
      past: [],
      present: null,
      future: [],

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
          revertPayload: input.revertPayload,
        };

        const state = get();
        const newPast = state.present ? [...state.past, state.present] : state.past;

        set(() => ({
          activities: [newActivity, ...state.activities],
          past: newPast,
          present: newActivity,
          future: [], // Clear future on new action
        }));

        return newActivity;
      },

      undo: () => {
        const state = get();
        // Resolve target action to undo
        let target = state.present;
        let effectivePast = state.past;

        if (!target && effectivePast.length > 0) {
          target = effectivePast[effectivePast.length - 1];
          effectivePast = effectivePast.slice(0, -1);
        }

        // If still no target but activities exist, use the most recent activity
        if (!target && state.activities.length > 0) {
          target = state.activities[0];
          effectivePast = state.activities.slice(1).reverse();
        }

        if (!target) return false;

        // 1. Revert application state
        if (target.revertPayload) {
          const { actionKind, assetId, employeeId, previousAsset } = target.revertPayload;
          const empStore = useEmployeeStore.getState();
          const targetAssetId = assetId ?? previousAsset?.id;

          if (actionKind === 'allocation') {
            if (previousAsset) {
              useAssetStore.setState((s) => ({
                assets: s.assets.map((a) =>
                  a.id === assetId || a.assetId === previousAsset.assetId ? previousAsset : a,
                ),
              }));
            }
            if (employeeId && targetAssetId) {
              empStore.unassignAssetFromEmployee(employeeId, targetAssetId);
            }
          } else if (actionKind === 'deallocation') {
            if (previousAsset) {
              useAssetStore.setState((s) => ({
                assets: s.assets.map((a) =>
                  a.id === assetId || a.assetId === previousAsset.assetId ? previousAsset : a,
                ),
              }));
            }
            if (employeeId && targetAssetId) {
              empStore.assignAssetToEmployee(employeeId, targetAssetId);
            }
          } else if (actionKind === 'status_update' || actionKind === 'asset_update') {
            if (previousAsset) {
              useAssetStore.setState((s) => ({
                assets: s.assets.map((a) =>
                  a.id === assetId || a.assetId === previousAsset.assetId ? previousAsset : a,
                ),
              }));
            }
          }
        } else {
          // Fallback heuristic based on entityId / actionType
          const assetStore = useAssetStore.getState();
          const targetAsset = assetStore.assets.find(
            (a) =>
              a.assetId === target.entityId ||
              a.id === target.entityId ||
              a.name === target.entityName,
          );
          if (targetAsset) {
            if (target.actionType === 'allocation_assigned' || target.type === 'asset_allocated') {
              assetStore.deallocateAsset(targetAsset.id);
            } else if (
              target.actionType === 'allocation_returned' ||
              target.type === 'asset_deallocated'
            ) {
              if (target.actor.name) {
                assetStore.allocateAsset(targetAsset.id, {
                  id: `EMP-${target.actor.name.replace(/\s+/g, '')}`,
                  name: target.actor.name,
                  department: target.department || 'Operations',
                });
              }
            } else if (target.actionType === 'asset_maintenance') {
              assetStore.updateAsset(targetAsset.id, {
                status: targetAsset.status === 'Maintenance' ? 'Available' : 'Maintenance',
              });
            }
          }
        }

        // 2. Immutable state transition
        const newActivities = state.activities.filter((a) => a.id !== target.id);
        const newPresent =
          effectivePast.length > 0 ? effectivePast[effectivePast.length - 1] : null;
        const newPastFinal = effectivePast.length > 0 ? effectivePast.slice(0, -1) : [];
        const newFuture = [target, ...state.future];

        set({
          activities: newActivities,
          past: newPastFinal,
          present: newPresent,
          future: newFuture,
        });

        return true;
      },

      redo: () => {
        const state = get();
        if (state.future.length === 0) return false;

        const target = state.future[0];
        const nextFuture = state.future.slice(1);

        // 1. Re-apply actual state
        if (target.revertPayload) {
          const { actionKind, assetId, employeeId, updatedAsset } = target.revertPayload;
          const empStore = useEmployeeStore.getState();
          const targetAssetId = assetId ?? updatedAsset?.id;

          if (actionKind === 'allocation') {
            if (updatedAsset) {
              useAssetStore.setState((s) => ({
                assets: s.assets.map((a) =>
                  a.id === assetId || a.assetId === updatedAsset.assetId ? updatedAsset : a,
                ),
              }));
            }
            if (employeeId && targetAssetId) {
              empStore.assignAssetToEmployee(employeeId, targetAssetId);
            }
          } else if (actionKind === 'deallocation') {
            if (updatedAsset) {
              useAssetStore.setState((s) => ({
                assets: s.assets.map((a) =>
                  a.id === assetId || a.assetId === updatedAsset.assetId ? updatedAsset : a,
                ),
              }));
            }
            if (employeeId && targetAssetId) {
              empStore.unassignAssetFromEmployee(employeeId, targetAssetId);
            }
          } else if (actionKind === 'status_update' || actionKind === 'asset_update') {
            if (updatedAsset) {
              useAssetStore.setState((s) => ({
                assets: s.assets.map((a) =>
                  a.id === assetId || a.assetId === updatedAsset.assetId ? updatedAsset : a,
                ),
              }));
            }
          }
        } else {
          // Fallback heuristic
          const assetStore = useAssetStore.getState();
          const targetAsset = assetStore.assets.find(
            (a) =>
              a.assetId === target.entityId ||
              a.id === target.entityId ||
              a.name === target.entityName,
          );
          if (targetAsset) {
            if (target.actionType === 'allocation_assigned' || target.type === 'asset_allocated') {
              if (target.actor.name) {
                assetStore.allocateAsset(targetAsset.id, {
                  id: `EMP-${target.actor.name.replace(/\s+/g, '')}`,
                  name: target.actor.name,
                  department: target.department || 'Operations',
                });
              }
            } else if (
              target.actionType === 'allocation_returned' ||
              target.type === 'asset_deallocated'
            ) {
              assetStore.deallocateAsset(targetAsset.id);
            } else if (target.actionType === 'asset_maintenance') {
              assetStore.updateAsset(targetAsset.id, {
                status: 'Maintenance',
              });
            }
          }
        }

        // 2. Add back to activities at top without duplicates, update past, present, future
        const newActivities = [target, ...state.activities.filter((a) => a.id !== target.id)];
        const newPast = state.present ? [...state.past, state.present] : state.past;

        set({
          activities: newActivities,
          past: newPast,
          present: target,
          future: nextFuture,
        });

        return true;
      },

      canUndo: () => {
        const state = get();
        return state.past.length > 0 || state.present !== null || state.activities.length > 0;
      },

      canRedo: () => {
        return get().future.length > 0;
      },

      getUndoTarget: () => {
        const state = get();
        if (state.present) return state.present;
        if (state.past.length > 0) return state.past[state.past.length - 1];
        if (state.activities.length > 0) return state.activities[0];
        return null;
      },

      getRedoTarget: () => {
        const state = get();
        return state.future.length > 0 ? state.future[0] : null;
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

      clearActivities: () =>
        set({
          activities: [],
          past: [],
          present: null,
          future: [],
        }),

      resetActivities: (seedWithMocks = false) => {
        if (seedWithMocks) {
          const mocks = [...MOCK_HISTORY_RECORDS];
          set({
            activities: mocks,
            present: mocks[0] || null,
            past: mocks.slice(1).reverse(),
            future: [],
          });
        } else {
          set({
            activities: [],
            past: [],
            present: null,
            future: [],
          });
        }
      },

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
        past: state.past,
        present: state.present,
        future: state.future,
      }),
    },
  ),
);

// --- Fine-grained Zustand Selectors ---
export const selectCanUndo = (state: ActivityStoreState): boolean =>
  state.past.length > 0 || state.present !== null || state.activities.length > 0;

export const selectCanRedo = (state: ActivityStoreState): boolean => state.future.length > 0;

export const selectUndoCount = (state: ActivityStoreState): number => {
  if (state.present !== null || state.past.length > 0) {
    return state.past.length + (state.present ? 1 : 0);
  }
  return state.activities.length;
};

export const selectRedoCount = (state: ActivityStoreState): number => state.future.length;

export const selectUndoneCount = (state: ActivityStoreState): number => state.future.length;

export const selectPresentAction = (state: ActivityStoreState): HistoryRecord | null => {
  if (state.present) return state.present;
  if (state.past.length > 0) return state.past[state.past.length - 1];
  if (state.activities.length > 0) return state.activities[0];
  return null;
};

export const selectNextRedoAction = (state: ActivityStoreState): HistoryRecord | null =>
  state.future.length > 0 ? state.future[0] : null;
