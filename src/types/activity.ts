export type HistoryCategory = 'all' | 'asset' | 'employee' | 'allocation';

export type HistoryActionType =
  | 'asset_created'
  | 'asset_updated'
  | 'asset_deleted'
  | 'asset_maintenance'
  | 'asset_retired'
  | 'asset_allocated'
  | 'asset_deallocated'
  | 'employee_created'
  | 'employee_onboarded'
  | 'employee_updated'
  | 'employee_deleted'
  | 'employee_offboarded'
  | 'employee_transferred'
  | 'allocation_assigned'
  | 'allocation_returned'
  | 'allocation_reallocated'
  | 'assigned'
  | 'returned'
  | 'created'
  | 'updated'
  | 'maintenance'
  | 'deleted';

export type ActivityType = HistoryActionType;

export interface HistoryActor {
  name: string;
  email: string;
  role: string;
  avatarInitials: string;
}

import type { Asset } from '@/types/asset';
import type { Employee } from '@/types/employee';

export interface ActivityRevertPayload {
  actionKind:
    | 'allocation'
    | 'deallocation'
    | 'status_update'
    | 'asset_update'
    | 'employee_assign'
    | 'employee_unassign'
    | 'generic';
  assetId?: string;
  employeeId?: string;
  previousAsset?: Asset;
  updatedAsset?: Asset;
  previousEmployee?: Employee;
  updatedEmployee?: Employee;
  metadata?: Record<string, unknown>;
}

export interface HistoryRecord {
  id: string;
  category: 'asset' | 'employee' | 'allocation';
  action: string;
  actionType: HistoryActionType;
  type?: ActivityType;
  title: string;
  description: string;
  entityName: string;
  entityId: string;
  entityType: 'Asset' | 'Employee' | 'Allocation';
  actor: HistoryActor;
  department?: string;
  location?: string;
  timestamp: string;
  relativeTime?: string;
  statusBadge?: {
    label: string;
    variant: 'emerald' | 'blue' | 'indigo' | 'amber' | 'rose' | 'purple' | 'slate';
  };
  badge?: string;
  badgeClass?: string;
  isUnread?: boolean;
  metadata?: Record<string, string | number>;
  revertPayload?: ActivityRevertPayload;
}

export type ActivityRecord = HistoryRecord;

export interface CreateActivityInput {
  id?: string;
  category?: 'asset' | 'employee' | 'allocation';
  action?: string;
  actionType?: HistoryActionType;
  type?: ActivityType;
  title: string;
  description?: string;
  entityName: string;
  entityId?: string;
  entityType?: 'Asset' | 'Employee' | 'Allocation';
  actor?: string | Partial<HistoryActor>;
  department?: string;
  location?: string;
  timestamp?: string;
  relativeTime?: string;
  statusBadge?: {
    label: string;
    variant: 'emerald' | 'blue' | 'indigo' | 'amber' | 'rose' | 'purple' | 'slate';
  };
  badge?: string;
  badgeClass?: string;
  isUnread?: boolean;
  metadata?: Record<string, string | number>;
  revertPayload?: ActivityRevertPayload;
}
