import { describe, it, expect, beforeEach } from 'vitest';
import { useActivityStore } from '../useActivityStore';
import { useAssetStore } from '../useAssetStore';
import { useEmployeeStore } from '../useEmployeeStore';
import { MOCK_ASSETS } from '@/mocks/seed/assets';
import { MOCK_EMPLOYEES } from '@/mocks/seed/employees';

describe('useActivityStore', () => {
  beforeEach(() => {
    useActivityStore.getState().resetActivities();
    useAssetStore.setState({
      assets: [...MOCK_ASSETS],
    });
    useEmployeeStore.setState({
      employees: [...MOCK_EMPLOYEES],
    });
  });

  it('should initialize with empty activities list', () => {
    const activities = useActivityStore.getState().activities;
    expect(activities.length).toBe(0);
  });

  it('should allow logging a new activity and prepend to the top of list', () => {
    const newAct = useActivityStore.getState().logActivity({
      type: 'asset_created',
      title: 'New Hardware Added',
      entityName: 'Dell Monitor (MON-999)',
      actor: 'Admin',
      department: 'IT',
    });

    const activities = useActivityStore.getState().activities;
    expect(activities[0].id).toBe(newAct.id);
    expect(activities[0].title).toBe('New Hardware Added');
    expect(activities[0].entityName).toBe('Dell Monitor (MON-999)');
  });

  it('should return recent activities with a given limit', () => {
    useActivityStore.getState().logActivity({
      type: 'asset_created',
      title: 'Act 1',
      entityName: 'Device 1',
      actor: 'User 1',
    });
    useActivityStore.getState().logActivity({
      type: 'asset_created',
      title: 'Act 2',
      entityName: 'Device 2',
      actor: 'User 2',
    });
    useActivityStore.getState().logActivity({
      type: 'asset_created',
      title: 'Act 3',
      entityName: 'Device 3',
      actor: 'User 3',
    });
    useActivityStore.getState().logActivity({
      type: 'asset_created',
      title: 'Act 4',
      entityName: 'Device 4',
      actor: 'User 4',
    });

    const recent = useActivityStore.getState().getRecentActivities(3);
    expect(recent.length).toBe(3);
    expect(recent[0].title).toBe('Act 4');
  });

  it('should allow clearing and resetting activities', () => {
    useActivityStore.getState().logActivity({
      type: 'asset_created',
      title: 'Act 1',
      entityName: 'Device 1',
      actor: 'User 1',
    });
    expect(useActivityStore.getState().activities.length).toBe(1);

    useActivityStore.getState().clearActivities();
    expect(useActivityStore.getState().activities.length).toBe(0);

    useActivityStore.getState().resetActivities();
    expect(useActivityStore.getState().activities.length).toBe(0);
  });

  it('should automatically log activity when addAsset is called in useAssetStore', () => {
    const asset = useAssetStore.getState().addAsset({
      assetId: 'TEST-AST-01',
      name: 'MacBook Air M3',
      category: 'Laptop',
      status: 'Available',
      location: 'Headquarters',
      serialNumber: 'SN-TEST-123',
      purchaseDate: '2026-01-01',
    });

    const activities = useActivityStore.getState().activities;
    expect(activities[0].type).toBe('asset_created');
    expect(activities[0].entityId).toBe(asset.assetId);
    expect(activities[0].entityName).toContain('MacBook Air M3');
  });

  it('should automatically log activity when allocateAsset is called in useAssetStore', () => {
    const asset = useAssetStore.getState().assets[0];
    useAssetStore.getState().allocateAsset(asset.id, {
      id: 'EMP-TEST-1',
      name: 'John Test',
      department: 'Engineering',
    });

    const activities = useActivityStore.getState().activities;
    expect(activities[0].type).toBe('asset_allocated');
    expect(activities[0].actor.name).toBe('John Test');
    expect(activities[0].badge).toBe('Allocated');
  });

  it('should automatically log activity when deallocateAsset is called in useAssetStore', () => {
    const allocatedAsset = useAssetStore
      .getState()
      .assets.find((a) => a.status === 'Allocated' && a.assignedTo);
    expect(allocatedAsset).toBeDefined();

    if (allocatedAsset) {
      useAssetStore.getState().deallocateAsset(allocatedAsset.id);
      const activities = useActivityStore.getState().activities;
      expect(activities[0].type).toBe('asset_deallocated');
      expect(activities[0].badge).toBe('Returned');
    }
  });

  it('should automatically log activity when deleteAsset is called in useAssetStore', () => {
    const asset = useAssetStore.getState().assets[0];
    useAssetStore.getState().deleteAsset(asset.id);

    const activities = useActivityStore.getState().activities;
    expect(activities[0].type).toBe('asset_deleted');
    expect(activities[0].entityId).toBe(asset.assetId);
    expect(activities[0].badge).toBe('Deleted');
  });

  it('should automatically log activity when addEmployee is called in useEmployeeStore', () => {
    useEmployeeStore.getState().addEmployee({
      firstName: 'Samantha',
      lastName: 'Carter',
      email: 'samantha@assetops.com',
      department: 'Engineering',
      position: 'Staff Engineer',
      status: 'active',
      type: 'full-time',
      location: 'Headquarters',
    });

    const activities = useActivityStore.getState().activities;
    expect(activities[0].type).toBe('employee_created');
    expect(activities[0].entityName).toContain('Samantha Carter');
    expect(activities[0].badge).toBe('Onboarded');
  });

  it('should automatically log activity when updateEmployee is called in useEmployeeStore', () => {
    const emp = useEmployeeStore.getState().employees[0];
    useEmployeeStore.getState().updateEmployee(emp.id, {
      position: 'Principal Engineer',
    });

    const activities = useActivityStore.getState().activities;
    expect(activities[0].type).toBe('employee_updated');
    expect(activities[0].entityName).toContain(emp.firstName);
    expect(activities[0].badge).toBe('Updated');
  });

  it('should automatically log activity when deleteEmployee is called in useEmployeeStore', () => {
    const emp = useEmployeeStore.getState().employees[0];
    useEmployeeStore.getState().deleteEmployee(emp.id);

    const activities = useActivityStore.getState().activities;
    expect(activities[0].type).toBe('employee_deleted');
    expect(activities[0].entityName).toContain(emp.firstName);
    expect(activities[0].badge).toBe('Removed');
  });

  it('should compute dynamic KPI metrics and unread counts accurately', () => {
    useActivityStore.getState().clearActivities();

    useActivityStore.getState().logActivity({
      category: 'asset',
      actionType: 'asset_created',
      title: 'Added Laptop',
      entityName: 'MacBook Pro',
      isUnread: true,
    });
    useActivityStore.getState().logActivity({
      category: 'asset',
      actionType: 'asset_updated',
      title: 'Updated Laptop',
      entityName: 'MacBook Pro',
      isUnread: false,
    });
    useActivityStore.getState().logActivity({
      category: 'employee',
      actionType: 'employee_onboarded',
      title: 'Added Employee',
      entityName: 'Jane Doe',
      isUnread: true,
    });
    useActivityStore.getState().logActivity({
      category: 'allocation',
      actionType: 'allocation_assigned',
      title: 'Assigned Device',
      entityName: 'MacBook Pro',
      isUnread: true,
    });

    const kpi = useActivityStore.getState().getKpiSummary();
    expect(kpi.totalHistory).toBe(4);
    expect(kpi.assetActions).toBe(2);
    expect(kpi.employeeActions).toBe(1);
    expect(kpi.allocationActions).toBe(1);

    expect(kpi.unreadCounts.all).toBe(3);
    expect(kpi.unreadCounts.asset).toBe(1);
    expect(kpi.unreadCounts.employee).toBe(1);
    expect(kpi.unreadCounts.allocation).toBe(1);

    expect(useActivityStore.getState().getUnreadCount('all')).toBe(3);
    expect(useActivityStore.getState().getUnreadCount('asset')).toBe(1);
  });

  it('should mark all activities as read when markAllAsRead is invoked', () => {
    useActivityStore.getState().clearActivities();
    useActivityStore.getState().logActivity({
      title: 'Event 1',
      entityName: 'Device 1',
      isUnread: true,
    });
    useActivityStore.getState().logActivity({
      title: 'Event 2',
      entityName: 'Device 2',
      isUnread: true,
    });

    expect(useActivityStore.getState().getUnreadCount('all')).toBe(2);

    useActivityStore.getState().markAllAsRead();

    expect(useActivityStore.getState().getUnreadCount('all')).toBe(0);
    expect(useActivityStore.getState().activities.every((a) => !a.isUnread)).toBe(true);
  });

  it('should mark an individual activity as read when markAsRead is called', () => {
    useActivityStore.getState().clearActivities();
    const act1 = useActivityStore.getState().logActivity({
      title: 'Event 1',
      entityName: 'Device 1',
      isUnread: true,
    });
    const act2 = useActivityStore.getState().logActivity({
      title: 'Event 2',
      entityName: 'Device 2',
      isUnread: true,
    });

    useActivityStore.getState().markAsRead(act1.id);

    const updated1 = useActivityStore.getState().activities.find((a) => a.id === act1.id);
    const updated2 = useActivityStore.getState().activities.find((a) => a.id === act2.id);

    expect(updated1?.isUnread).toBe(false);
    expect(updated2?.isUnread).toBe(true);
    expect(useActivityStore.getState().getUnreadCount('all')).toBe(1);
  });
});
