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
    expect(activities[0].actor).toBe('John Test');
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
});
