import { describe, it, expect, beforeEach } from 'vitest';
import { useColumnVisibilityStore, DEFAULT_VISIBLE_COLUMN_IDS } from '../useColumnVisibilityStore';
import { AVAILABLE_ASSET_COLUMNS } from '@/constans/asset.constants';

describe('useColumnVisibilityStore', () => {
  beforeEach(() => {
    useColumnVisibilityStore.getState().resetToDefault();
    localStorage.clear();
  });

  it('should initialize with default visible column IDs', () => {
    const state = useColumnVisibilityStore.getState();
    expect(state.visibleColumnIds).toEqual(DEFAULT_VISIBLE_COLUMN_IDS);
    expect(state.isColumnVisible('assetId')).toBe(true);
    expect(state.isColumnVisible('serialNumber')).toBe(false);
  });

  it('should toggle column visibility (add if absent, remove if present)', () => {
    const store = useColumnVisibilityStore.getState();

    // 'serialNumber' is not in default list -> toggle should add it
    store.toggleColumn('serialNumber');
    expect(useColumnVisibilityStore.getState().visibleColumnIds).toContain('serialNumber');
    expect(useColumnVisibilityStore.getState().isColumnVisible('serialNumber')).toBe(true);

    // 'serialNumber' is now present -> toggle should remove it
    useColumnVisibilityStore.getState().toggleColumn('serialNumber');
    expect(useColumnVisibilityStore.getState().visibleColumnIds).not.toContain('serialNumber');
    expect(useColumnVisibilityStore.getState().isColumnVisible('serialNumber')).toBe(false);
  });

  it('should remove a specific column when removeColumn is called', () => {
    const store = useColumnVisibilityStore.getState();
    expect(store.visibleColumnIds).toContain('location');

    store.removeColumn('location');
    expect(useColumnVisibilityStore.getState().visibleColumnIds).not.toContain('location');
  });

  it('should add a column when addColumn is called', () => {
    const store = useColumnVisibilityStore.getState();
    expect(store.visibleColumnIds).not.toContain('warrantyExpiry');

    store.addColumn('warrantyExpiry');
    expect(useColumnVisibilityStore.getState().visibleColumnIds).toContain('warrantyExpiry');

    // Duplicate add should be idempotent
    store.addColumn('warrantyExpiry');
    const occurrences = useColumnVisibilityStore
      .getState()
      .visibleColumnIds.filter((id) => id === 'warrantyExpiry').length;
    expect(occurrences).toBe(1);
  });

  it('should set custom visible columns list', () => {
    const store = useColumnVisibilityStore.getState();
    store.setVisibleColumns(['assetId', 'name']);
    expect(useColumnVisibilityStore.getState().visibleColumnIds).toEqual(['assetId', 'name']);
  });

  it('should select all available columns', () => {
    const store = useColumnVisibilityStore.getState();
    store.selectAll();
    expect(useColumnVisibilityStore.getState().visibleColumnIds.length).toBe(
      AVAILABLE_ASSET_COLUMNS.length,
    );
  });

  it('should clear all visible columns', () => {
    const store = useColumnVisibilityStore.getState();
    store.clearAll();
    expect(useColumnVisibilityStore.getState().visibleColumnIds).toEqual([]);
  });

  it('should reset back to default columns', () => {
    const store = useColumnVisibilityStore.getState();
    store.clearAll();
    expect(useColumnVisibilityStore.getState().visibleColumnIds).toEqual([]);

    store.resetToDefault();
    expect(useColumnVisibilityStore.getState().visibleColumnIds).toEqual(
      DEFAULT_VISIBLE_COLUMN_IDS,
    );
  });
});
