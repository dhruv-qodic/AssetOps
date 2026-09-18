import { describe, it, expect, beforeEach } from 'vitest';
import { useAssetStore } from '../useAssetStore';
import { MOCK_ASSETS, generateAssetSeedData } from '@/mocks/seed/assets';

describe('store/useAssetStore', () => {
  beforeEach(() => {
    useAssetStore.setState({
      assets: [...MOCK_ASSETS],
      filters: {
        search: '',
        category: 'All',
        status: 'All',
        location: 'All',
        sortBy: 'recently_added',
        page: 1,
        pageSize: 5,
      },
      viewMode: 'virtualized',
      selectedAsset: null,
      isAddModalOpen: false,
      isEditModalOpen: false,
      isDeleteModalOpen: false,
      isViewModalOpen: false,
      isImportModalOpen: false,
    });
  });

  it('should initialize with mock seed assets', () => {
    const state = useAssetStore.getState();
    expect(state.assets.length).toBeGreaterThanOrEqual(500);
    expect(state.assets[0].assetId).toBe('A1001');
    expect(state.assets[0].name).toBe('Dell Laptop');
  });

  it('should generate requested number of asset seeds accurately', () => {
    const seeds = generateAssetSeedData(500);
    expect(seeds.length).toBe(500);
    expect(seeds[0].assetId).toBe('A1001');
    expect(seeds[499].assetId).toBe('A1500');
  });

  it('should filter 10,000 assets by search keyword', () => {
    useAssetStore.getState().setSearch('A1002');
    const { allFilteredAssets, totalFiltered } = useAssetStore.getState().getFilteredAssets();

    expect(totalFiltered).toBeGreaterThanOrEqual(1);
    expect(allFilteredAssets[0].assetId).toBe('A1002');
    expect(allFilteredAssets[0].name).toBe('iPhone 15');
  });

  it('should filter 10,000 assets by category', () => {
    useAssetStore.getState().setCategory('Laptop');
    const { allFilteredAssets } = useAssetStore.getState().getFilteredAssets();

    expect(allFilteredAssets.length).toBeGreaterThan(0);
    expect(allFilteredAssets.every((a) => a.category === 'Laptop')).toBe(true);
  });

  it('should filter assets by status', () => {
    useAssetStore.getState().setStatus('Maintenance');
    const { allFilteredAssets } = useAssetStore.getState().getFilteredAssets();

    expect(allFilteredAssets.length).toBeGreaterThan(0);
    expect(allFilteredAssets.every((a) => a.status === 'Maintenance')).toBe(true);
  });

  it('should toggle viewMode between virtualized and table', () => {
    expect(useAssetStore.getState().viewMode).toBe('virtualized');
    useAssetStore.getState().setViewMode('table');
    expect(useAssetStore.getState().viewMode).toBe('table');
  });

  it('should add a new asset to 10,000 dataset', () => {
    const newAssetData = {
      assetId: 'A99999',
      name: 'Test Mechanical Keyboard',
      category: 'Accessories' as const,
      status: 'Available' as const,
      location: 'Headquarters',
      serialNumber: 'TEST-1234',
      purchaseDate: '2024-01-01',
    };

    useAssetStore.getState().addAsset(newAssetData);
    const state = useAssetStore.getState();

    const added = state.assets.find((a) => a.assetId === 'A99999');
    expect(added).toBeDefined();
    expect(added?.name).toBe('Test Mechanical Keyboard');
    expect(state.assets.length).toBeGreaterThanOrEqual(501);
  });

  it('should update an existing asset', () => {
    const assetToUpdate = useAssetStore.getState().assets[0];
    useAssetStore.getState().updateAsset(assetToUpdate.id, { name: 'Updated Laptop Name' });

    const updated = useAssetStore.getState().getAssetById(assetToUpdate.id);
    expect(updated?.name).toBe('Updated Laptop Name');
  });

  it('should delete an asset from 10,000 dataset', () => {
    const assetToDelete = useAssetStore.getState().assets[0];
    const initialCount = useAssetStore.getState().assets.length;

    useAssetStore.getState().deleteAsset(assetToDelete.id);
    const state = useAssetStore.getState();

    expect(state.assets.length).toBe(initialCount - 1);
    expect(state.assets.find((a) => a.id === assetToDelete.id)).toBeUndefined();
  });

  it('should allocate asset to employee', () => {
    const asset = useAssetStore.getState().assets[1]; // A1002 (Available)
    useAssetStore.getState().allocateAsset(asset.id, {
      id: 'emp_99',
      name: 'Alex Johnson',
      email: 'alex@company.com',
    });

    const updated = useAssetStore.getState().getAssetById(asset.id);
    expect(updated?.status).toBe('Allocated');
    expect(updated?.assignedTo?.name).toBe('Alex Johnson');
  });

  it('should deallocate asset from employee', () => {
    const asset = useAssetStore.getState().assets[0]; // A1001 (Allocated)
    useAssetStore.getState().deallocateAsset(asset.id);

    const updated = useAssetStore.getState().getAssetById(asset.id);
    expect(updated?.status).toBe('Available');
    expect(updated?.assignedTo).toBeNull();
  });
});
