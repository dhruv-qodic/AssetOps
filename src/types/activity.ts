export type ActivityType =
  | 'asset_created'
  | 'asset_updated'
  | 'asset_deleted'
  | 'asset_allocated'
  | 'asset_deallocated'
  | 'asset_maintenance'
  | 'employee_created'
  | 'employee_updated'
  | 'employee_deleted'
  | 'assigned'
  | 'returned'
  | 'created'
  | 'updated'
  | 'maintenance'
  | 'deleted';

export interface ActivityRecord {
  id: string;
  type: ActivityType;
  title: string;
  entityName: string;
  entityId?: string;
  actor: string;
  department?: string;
  timestamp: string;
  badge?: string;
  badgeClass?: string;
}

export type CreateActivityInput = Omit<ActivityRecord, 'id' | 'timestamp'> & {
  id?: string;
  timestamp?: string;
};
