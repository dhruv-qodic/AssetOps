import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Asset,
  AssetCategory,
  AssetStatus,
  AssetSortOption,
  AssetFilters,
  CreateAssetInput,
  UpdateAssetInput,
  AssetStats,
  AssignedEmployee,
} from '@/types/asset';
import { DEFAULT_ASSET_FILTERS } from '@/constans/asset.constants';
import { MOCK_ASSETS } from '@/mocks/seed/assets';

interface AssetStoreState {
  assets: Asset[];
  filters: AssetFilters;
  isLoading: boolean;
  selectedAsset: Asset | null;

  // Modal dialog states
  isAddModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  isViewModalOpen: boolean;
  isImportModalOpen: boolean;

  // Filter & Pagination actions
  setSearch: (search: string) => void;
  setCategory: (category: AssetCategory | 'All') => void;
  setStatus: (status: AssetStatus | 'All') => void;
  setLocation: (location: string | 'All') => void;
  setSortBy: (sortBy: AssetSortOption) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  resetFilters: () => void;

  // CRUD actions
  addAsset: (input: CreateAssetInput) => Asset;
  updateAsset: (id: string, updates: Partial<UpdateAssetInput>) => boolean;
  deleteAsset: (id: string) => boolean;
  allocateAsset: (id: string, employee: AssignedEmployee) => boolean;
  deallocateAsset: (id: string) => boolean;
  bulkAddAssets: (assets: CreateAssetInput[]) => number;

  // Query helpers
  getFilteredAssets: () => {
    paginatedAssets: Asset[];
    totalFiltered: number;
    totalPages: number;
    startIndex: number;
    endIndex: number;
  };
  getStats: () => AssetStats;
  getAssetById: (id: string) => Asset | undefined;

  // Modal actions
  openAddModal: () => void;
  openEditModal: (asset: Asset) => void;
  openDeleteModal: (asset: Asset) => void;
  openViewModal: (asset: Asset) => void;
  openImportModal: () => void;
  closeModals: () => void;
}

export const useAssetStore = create<AssetStoreState>()(
  persist(
    (set, get) => ({
      assets: MOCK_ASSETS,
      filters: DEFAULT_ASSET_FILTERS,
      isLoading: false,
      selectedAsset: null,

      isAddModalOpen: false,
      isEditModalOpen: false,
      isDeleteModalOpen: false,
      isViewModalOpen: false,
      isImportModalOpen: false,

      // Filter Actions
      setSearch: (search) =>
        set((state) => ({
          filters: { ...state.filters, search, page: 1 },
        })),

      setCategory: (category) =>
        set((state) => ({
          filters: { ...state.filters, category, page: 1 },
        })),

      setStatus: (status) =>
        set((state) => ({
          filters: { ...state.filters, status, page: 1 },
        })),

      setLocation: (location) =>
        set((state) => ({
          filters: { ...state.filters, location, page: 1 },
        })),

      setSortBy: (sortBy) =>
        set((state) => ({
          filters: { ...state.filters, sortBy, page: 1 },
        })),

      setPage: (page) =>
        set((state) => ({
          filters: { ...state.filters, page },
        })),

      setPageSize: (pageSize) =>
        set((state) => ({
          filters: { ...state.filters, pageSize, page: 1 },
        })),

      resetFilters: () =>
        set(() => ({
          filters: DEFAULT_ASSET_FILTERS,
        })),

      // CRUD Actions
      addAsset: (input) => {
        const now = new Date().toISOString();
        const newAsset: Asset = {
          ...input,
          id: `ast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          assignedTo: null,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          assets: [newAsset, ...state.assets],
        }));

        return newAsset;
      },

      updateAsset: (id, updates) => {
        let updated = false;
        set((state) => {
          const newAssets = state.assets.map((asset) => {
            if (asset.id === id) {
              updated = true;
              return {
                ...asset,
                ...updates,
                updatedAt: new Date().toISOString(),
              };
            }
            return asset;
          });
          return { assets: newAssets };
        });
        return updated;
      },

      deleteAsset: (id) => {
        let deleted = false;
        set((state) => {
          const initialLength = state.assets.length;
          const filtered = state.assets.filter((a) => a.id !== id);
          deleted = filtered.length !== initialLength;
          return {
            assets: filtered,
            selectedAsset:
              state.selectedAsset?.id === id ? null : state.selectedAsset,
          };
        });
        return deleted;
      },

      allocateAsset: (id, employee) => {
        let success = false;
        set((state) => {
          const newAssets = state.assets.map((asset) => {
            if (asset.id === id) {
              success = true;
              return {
                ...asset,
                status: 'Allocated' as AssetStatus,
                assignedTo: {
                  ...employee,
                  assignedDate: new Date().toISOString().split('T')[0],
                },
                updatedAt: new Date().toISOString(),
              };
            }
            return asset;
          });
          return { assets: newAssets };
        });
        return success;
      },

      deallocateAsset: (id) => {
        let success = false;
        set((state) => {
          const newAssets = state.assets.map((asset) => {
            if (asset.id === id) {
              success = true;
              return {
                ...asset,
                status: 'Available' as AssetStatus,
                assignedTo: null,
                updatedAt: new Date().toISOString(),
              };
            }
            return asset;
          });
          return { assets: newAssets };
        });
        return success;
      },

      bulkAddAssets: (newItems) => {
        const now = new Date().toISOString();
        const formatted: Asset[] = newItems.map((item, idx) => ({
          ...item,
          id: `ast_${Date.now()}_${idx}`,
          assignedTo: null,
          createdAt: now,
          updatedAt: now,
        }));

        set((state) => ({
          assets: [...formatted, ...state.assets],
        }));

        return formatted.length;
      },

      // Query Helpers
      getFilteredAssets: () => {
        const { assets, filters } = get();
        const { search, category, status, location, sortBy, page, pageSize } =
          filters;

        let filtered = [...assets];

        // 1. Text Search across name, model, assetId, serialNumber, and assignedTo
        if (search.trim()) {
          const query = search.trim().toLowerCase();
          filtered = filtered.filter((asset) => {
            const matchName = asset.name.toLowerCase().includes(query);
            const matchId = asset.assetId.toLowerCase().includes(query);
            const matchModel = asset.model?.toLowerCase().includes(query) || false;
            const matchSerial = asset.serialNumber.toLowerCase().includes(query);
            const matchAssigned =
              asset.assignedTo?.name.toLowerCase().includes(query) || false;

            return (
              matchName || matchId || matchModel || matchSerial || matchAssigned
            );
          });
        }

        // 2. Category Filter
        if (category !== 'All') {
          filtered = filtered.filter((a) => a.category === category);
        }

        // 3. Status Filter
        if (status !== 'All') {
          filtered = filtered.filter((a) => a.status === status);
        }

        // 4. Location Filter
        if (location !== 'All') {
          filtered = filtered.filter((a) => a.location === location);
        }

        // 5. Sorting
        filtered.sort((a, b) => {
          switch (sortBy) {
            case 'name_asc':
              return a.name.localeCompare(b.name);
            case 'name_desc':
              return b.name.localeCompare(a.name);
            case 'asset_id_asc':
              return a.assetId.localeCompare(b.assetId, undefined, {
                numeric: true,
              });
            case 'asset_id_desc':
              return b.assetId.localeCompare(a.assetId, undefined, {
                numeric: true,
              });
            case 'purchase_date_desc':
              return (
                new Date(b.purchaseDate).getTime() -
                new Date(a.purchaseDate).getTime()
              );
            case 'recently_added':
            default:
              return (
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              );
          }
        });

        const totalFiltered = filtered.length;
        const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
        const safePage = Math.min(page, totalPages);
        const startIndex = (safePage - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, totalFiltered);
        const paginatedAssets = filtered.slice(startIndex, endIndex);

        return {
          paginatedAssets,
          totalFiltered,
          totalPages,
          startIndex: totalFiltered === 0 ? 0 : startIndex + 1,
          endIndex,
        };
      },

      getStats: () => {
        const { assets } = get();
        return {
          totalAssets: assets.length,
          allocated: assets.filter((a) => a.status === 'Allocated').length,
          available: assets.filter((a) => a.status === 'Available').length,
          maintenance: assets.filter((a) => a.status === 'Maintenance').length,
          retired: assets.filter((a) => a.status === 'Retired').length,
        };
      },

      getAssetById: (id) => {
        return get().assets.find((a) => a.id === id);
      },

      // Modal Actions
      openAddModal: () => set({ isAddModalOpen: true, selectedAsset: null }),
      openEditModal: (asset) =>
        set({ isEditModalOpen: true, selectedAsset: asset }),
      openDeleteModal: (asset) =>
        set({ isDeleteModalOpen: true, selectedAsset: asset }),
      openViewModal: (asset) =>
        set({ isViewModalOpen: true, selectedAsset: asset }),
      openImportModal: () => set({ isImportModalOpen: true }),
      closeModals: () =>
        set({
          isAddModalOpen: false,
          isEditModalOpen: false,
          isDeleteModalOpen: false,
          isViewModalOpen: false,
          isImportModalOpen: false,
          selectedAsset: null,
        }),
    }),
    {
      name: 'assetops_assets_store_v1',
      partialize: (state) => ({
        assets: state.assets,
      }),
    }
  )
);
