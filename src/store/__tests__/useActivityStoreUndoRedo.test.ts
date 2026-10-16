import { describe, it, expect, beforeEach } from 'vitest';
import {
  useActivityStore,
  selectCanUndo,
  selectCanRedo,
  selectUndoCount,
  selectRedoCount,
  selectUndoneCount,
} from '@/store/useActivityStore';
import { useAssetStore } from '@/store/useAssetStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { MOCK_ASSETS } from '@/mocks/seed/assets';
import { MOCK_EMPLOYEES } from '@/mocks/seed/employees';
import type { Asset } from '@/types/asset';
import type { Employee } from '@/types/employee';

describe('useActivityStore - Undo / Redo Architecture', () => {
  beforeEach(() => {
    useActivityStore.getState().clearActivities();
    useAssetStore.setState({
      assets: JSON.parse(JSON.stringify(MOCK_ASSETS)) as Asset[],
    });
    useEmployeeStore.setState({
      employees: JSON.parse(JSON.stringify(MOCK_EMPLOYEES)) as Employee[],
    });
  });

  it('should initialize with empty past, present, and future stacks and disabled undo/redo', () => {
    const state = useActivityStore.getState();
    expect(state.activities).toHaveLength(0);
    expect(state.past).toHaveLength(0);
    expect(state.present).toBeNull();
    expect(state.future).toHaveLength(0);
    expect(selectCanUndo(state)).toBe(false);
    expect(selectCanRedo(state)).toBe(false);
    expect(selectUndoCount(state)).toBe(0);
    expect(selectRedoCount(state)).toBe(0);
    expect(selectUndoneCount(state)).toBe(0);
  });

  it('should transition past, present, and future immutably when actions are logged', () => {
    const act1 = useActivityStore.getState().logActivity({
      title: 'Action 1',
      entityName: 'Device 1',
    });

    let state = useActivityStore.getState();
    expect(state.activities).toHaveLength(1);
    expect(state.present?.id).toBe(act1.id);
    expect(state.past).toHaveLength(0);
    expect(state.future).toHaveLength(0);
    expect(selectCanUndo(state)).toBe(true);
    expect(selectCanRedo(state)).toBe(false);
    expect(selectUndoCount(state)).toBe(1);

    const act2 = useActivityStore.getState().logActivity({
      title: 'Action 2',
      entityName: 'Device 2',
    });

    state = useActivityStore.getState();
    expect(state.activities).toHaveLength(2);
    expect(state.present?.id).toBe(act2.id);
    expect(state.past).toHaveLength(1);
    expect(state.past[0].id).toBe(act1.id);
    expect(state.future).toHaveLength(0);
    expect(selectUndoCount(state)).toBe(2);

    const act3 = useActivityStore.getState().logActivity({
      title: 'Action 3',
      entityName: 'Device 3',
    });

    state = useActivityStore.getState();
    expect(state.activities).toHaveLength(3);
    expect(state.present?.id).toBe(act3.id);
    expect(state.past).toHaveLength(2);
    expect(state.past.map((a) => a.id)).toEqual([act1.id, act2.id]);
    expect(state.future).toHaveLength(0);
    expect(selectUndoCount(state)).toBe(3);
  });

  it('should undo the latest action and update past/present/future stacks', () => {
    const act1 = useActivityStore.getState().logActivity({ title: 'Act 1', entityName: 'D1' });
    const act2 = useActivityStore.getState().logActivity({ title: 'Act 2', entityName: 'D2' });

    expect(useActivityStore.getState().canUndo()).toBe(true);

    const success = useActivityStore.getState().undo();
    expect(success).toBe(true);

    const state = useActivityStore.getState();
    expect(state.activities).toHaveLength(1);
    expect(state.activities[0].id).toBe(act1.id);
    expect(state.present?.id).toBe(act1.id);
    expect(state.past).toHaveLength(0);
    expect(state.future).toHaveLength(1);
    expect(state.future[0].id).toBe(act2.id);

    expect(selectCanUndo(state)).toBe(true);
    expect(selectCanRedo(state)).toBe(true);
    expect(selectRedoCount(state)).toBe(1);
    expect(selectUndoneCount(state)).toBe(1);
  });

  it('should redo undone action and restore activities without duplicates', () => {
    const act1 = useActivityStore.getState().logActivity({ title: 'Act 1', entityName: 'D1' });
    const act2 = useActivityStore.getState().logActivity({ title: 'Act 2', entityName: 'D2' });

    useActivityStore.getState().undo();
    expect(useActivityStore.getState().activities).toHaveLength(1);

    const success = useActivityStore.getState().redo();
    expect(success).toBe(true);

    const state = useActivityStore.getState();
    expect(state.activities).toHaveLength(2);
    expect(state.activities[0].id).toBe(act2.id);
    expect(state.present?.id).toBe(act2.id);
    expect(state.past).toHaveLength(1);
    expect(state.past[0].id).toBe(act1.id);
    expect(state.future).toHaveLength(0);

    // Verify no duplicates in activities list
    const ids = state.activities.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should clear future stack when a new action is performed after undo', () => {
    useActivityStore.getState().logActivity({ title: 'Act 1', entityName: 'D1' });
    useActivityStore.getState().logActivity({ title: 'Act 2', entityName: 'D2' });
    useActivityStore.getState().logActivity({ title: 'Act 3', entityName: 'D3' });

    // Undo twice
    useActivityStore.getState().undo();
    useActivityStore.getState().undo();

    expect(useActivityStore.getState().future).toHaveLength(2);
    expect(useActivityStore.getState().canRedo()).toBe(true);

    // Perform a brand new action
    useActivityStore.getState().logActivity({ title: 'Act 4 (Branch)', entityName: 'D4' });

    const state = useActivityStore.getState();
    expect(state.future).toHaveLength(0);
    expect(selectCanRedo(state)).toBe(false);
    expect(state.present?.title).toBe('Act 4 (Branch)');
    expect(state.past).toHaveLength(1);
    expect(state.past[0].title).toBe('Act 1');
  });

  it('should undo and redo asset allocation and revert/re-apply state accurately', () => {
    const availableAsset = useAssetStore.getState().assets.find((a) => a.status === 'Available');
    expect(availableAsset).toBeDefined();
    if (!availableAsset) return;

    const employee = useEmployeeStore.getState().employees[0];

    // 1. Allocate asset
    useAssetStore.getState().allocateAsset(availableAsset.id, {
      id: employee.id,
      name: `${employee.firstName} ${employee.lastName}`,
      department: employee.department,
    });

    let currentAsset = useAssetStore.getState().getAssetById(availableAsset.id);
    expect(currentAsset?.status).toBe('Allocated');
    expect(currentAsset?.assignedTo?.name).toBe(`${employee.firstName} ${employee.lastName}`);

    // 2. Undo allocation
    const undoTarget = useActivityStore.getState().getUndoTarget();
    expect(undoTarget?.title).toContain('Allocated');

    useActivityStore.getState().undo();

    currentAsset = useAssetStore.getState().getAssetById(availableAsset.id);
    expect(currentAsset?.status).toBe('Available');
    expect(currentAsset?.assignedTo).toBeNull();

    // 3. Redo allocation
    useActivityStore.getState().redo();

    currentAsset = useAssetStore.getState().getAssetById(availableAsset.id);
    expect(currentAsset?.status).toBe('Allocated');
    expect(currentAsset?.assignedTo?.name).toBe(`${employee.firstName} ${employee.lastName}`);
  });

  it('should undo and redo asset deallocation correctly', () => {
    const allocatedAsset = useAssetStore
      .getState()
      .assets.find((a) => a.status === 'Allocated' && a.assignedTo);
    expect(allocatedAsset).toBeDefined();
    if (!allocatedAsset) return;

    const prevEmployeeName = allocatedAsset.assignedTo?.name;

    // 1. Deallocate asset
    useAssetStore.getState().deallocateAsset(allocatedAsset.id);

    let currentAsset = useAssetStore.getState().getAssetById(allocatedAsset.id);
    expect(currentAsset?.status).toBe('Available');
    expect(currentAsset?.assignedTo).toBeNull();

    // 2. Undo deallocation
    useActivityStore.getState().undo();

    currentAsset = useAssetStore.getState().getAssetById(allocatedAsset.id);
    expect(currentAsset?.status).toBe('Allocated');
    expect(currentAsset?.assignedTo?.name).toBe(prevEmployeeName);

    // 3. Redo deallocation
    useActivityStore.getState().redo();

    currentAsset = useAssetStore.getState().getAssetById(allocatedAsset.id);
    expect(currentAsset?.status).toBe('Available');
    expect(currentAsset?.assignedTo).toBeNull();
  });

  it('should undo and redo asset status / specification updates', () => {
    const asset = useAssetStore.getState().assets[0];
    const initialStatus = asset.status;

    // 1. Update asset to Maintenance
    useAssetStore.getState().updateAsset(asset.id, {
      status: 'Maintenance',
      notes: 'Under inspection',
    });

    let current = useAssetStore.getState().getAssetById(asset.id);
    expect(current?.status).toBe('Maintenance');
    expect(current?.notes).toBe('Under inspection');

    // 2. Undo status update
    useActivityStore.getState().undo();

    current = useAssetStore.getState().getAssetById(asset.id);
    expect(current?.status).toBe(initialStatus);

    // 3. Redo status update
    useActivityStore.getState().redo();

    current = useAssetStore.getState().getAssetById(asset.id);
    expect(current?.status).toBe('Maintenance');
    expect(current?.notes).toBe('Under inspection');
  });

  it('should return null targets when past and future stacks are empty', () => {
    expect(useActivityStore.getState().getUndoTarget()).toBeNull();
    expect(useActivityStore.getState().getRedoTarget()).toBeNull();
    expect(useActivityStore.getState().undo()).toBe(false);
    expect(useActivityStore.getState().redo()).toBe(false);
  });
});
