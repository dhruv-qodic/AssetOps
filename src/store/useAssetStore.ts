import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
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
  AllocationHistoryRecord,
} from '@/types/asset';
import { DEFAULT_ASSET_FILTERS } from '@/constant/asset.constants';
import { MOCK_ASSETS } from '@/mocks/seed/assets';
import {
  filterAssets,
  useAssetFilterStore,
  type AssetFilterStateValues,
} from './useAssetFilterStore';

interface AssetStoreState {
  assets: Asset[];
  filters: AssetFilters;
  isLoading: boolean;
  error: string | null;
  selectedAsset: Asset | null;

  // Modal dialog states
  isAddModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  isViewModalOpen: boolean;
  isImportModalOpen: boolean;
  isAllocateModalOpen: boolean;
  isQrModalOpen: boolean;

  // State actions
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reloadAssets: () => Promise<void>;

  // Filter & Pagination actions
  setSearch: (search: string) => void;
  setCategory: (category: AssetCategory | 'All') => void;
  setStatus: (status: AssetStatus | 'All') => void;
  setLocation: (location: string) => void;
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
  getFilteredAssets: (overrideFilters?: Partial<AssetFilterStateValues>) => {
    allFilteredAssets: Asset[];
    paginatedAssets: Asset[];
    totalFiltered: number;
    totalPages: number;
    startIndex: number;
    endIndex: number;
  };
  getStats: () => AssetStats;
  getAssetById: (id: string) => Asset | undefined;
  getAssetAllocationHistory: (idOrAsset: string | Asset) => AllocationHistoryRecord[];

  // Modal actions
  openAddModal: () => void;
  openEditModal: (asset: Asset) => void;
  openDeleteModal: (asset: Asset) => void;
  openViewModal: (asset: Asset) => void;
  openImportModal: () => void;
  openAllocateModal: (asset?: Asset | null) => void;
  openQrModal: (asset?: Asset | null) => void;
  closeQrModal: () => void;
  closeModals: () => void;

  viewMode: 'virtualized' | 'table';
  setViewMode: (mode: 'virtualized' | 'table') => void;
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
      // Gracefully handle storage quota limits for large datasets
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

export const useAssetStore = create<AssetStoreState>()(
  persist(
    (set, get) => ({
      assets: MOCK_ASSETS,
      filters: DEFAULT_ASSET_FILTERS,
      isLoading: false,
      error: null,
      selectedAsset: null,

      isAddModalOpen: false,
      isEditModalOpen: false,
      isDeleteModalOpen: false,
      isViewModalOpen: false,
      isImportModalOpen: false,
      isAllocateModalOpen: false,
      isQrModalOpen: false,

      viewMode: 'virtualized',
      setViewMode: (mode) => set({ viewMode: mode }),

      // State Actions
      setIsLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      reloadAssets: async () => {
        set({ isLoading: true, error: null });
        try {
          // Simulate async fetch / store refresh
          await new Promise((resolve) => setTimeout(resolve, 300));
          set({ isLoading: false, error: null });
        } catch {
          set({ isLoading: false, error: 'Failed to reload assets. Please try again.' });
        }
      },

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

      resetFilters: () => {
        useAssetFilterStore.getState().resetFilters();
        set(() => ({
          filters: DEFAULT_ASSET_FILTERS,
        }));
      },

      // CRUD Actions
      addAsset: (input) => {
        const now = new Date().toISOString();
        const newAsset: Asset = {
          ...input,
          id: `ast_${crypto.randomUUID()}`,
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
            selectedAsset: state.selectedAsset?.id === id ? null : state.selectedAsset,
          };
        });
        return deleted;
      },

      allocateAsset: (id, employee) => {
        let success = false;
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        set((state) => {
          const newAssets = state.assets.map((asset) => {
            if (asset.id === id) {
              success = true;
              const newRecord: AllocationHistoryRecord = {
                id: `hist_${crypto.randomUUID()}`,
                assetId: asset.assetId,
                employeeId: employee.id || employee.employeeId,
                employeeName: employee.name,
                employeeEmail: employee.email,
                department: employee.department,
                avatar: employee.avatar,
                action: 'Allocated',
                date: dateStr,
                performedBy: 'IT Operations',
              };

              const existingHistory = asset.allocationHistory || [];

              return {
                ...asset,
                status: 'Allocated' as const,
                assignedTo: {
                  ...employee,
                  assignedDate: dateStr,
                },
                allocationHistory: [newRecord, ...existingHistory],
                updatedAt: now.toISOString(),
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
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        set((state) => {
          const newAssets = state.assets.map((asset) => {
            if (asset.id === id) {
              success = true;
              const prevEmp = asset.assignedTo;
              const deallocRecord: AllocationHistoryRecord | null = prevEmp
                ? {
                    id: `hist_${crypto.randomUUID()}`,
                    assetId: asset.assetId,
                    employeeId: prevEmp.id || prevEmp.employeeId,
                    employeeName: prevEmp.name,
                    employeeEmail: prevEmp.email,
                    department: prevEmp.department,
                    avatar: prevEmp.avatar,
                    action: 'Deallocated',
                    date: dateStr,
                    performedBy: 'IT Operations',
                  }
                : null;

              const existingHistory = asset.allocationHistory || [];
              const updatedHistory = deallocRecord
                ? [deallocRecord, ...existingHistory]
                : existingHistory;

              return {
                ...asset,
                status: 'Available' as const,
                assignedTo: null,
                allocationHistory: updatedHistory,
                updatedAt: now.toISOString(),
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
        const formatted: Asset[] = newItems.map((item) => ({
          ...item,
          id: `ast_${crypto.randomUUID()}`,
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
      getFilteredAssets: (overrideFilters?: Partial<AssetFilterStateValues>) => {
        const { assets, filters } = get();
        const multiFacetFilters = {
          ...useAssetFilterStore.getState(),
          ...overrideFilters,
        };
        const { search, category, status, location, sortBy, page, pageSize } = filters;

        // Apply multi-facet filters combined with legacy filters (pure derivation)
        const filtered = filterAssets(assets, multiFacetFilters, {
          search,
          category,
          status,
          location,
        });

        // Sorting
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
              return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
            case 'recently_added':
            default:
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
        });

        const totalFiltered = filtered.length;
        const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
        const safePage = Math.min(page, totalPages);
        const startIndex = (safePage - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, totalFiltered);
        const paginatedAssets = filtered.slice(startIndex, endIndex);

        return {
          allFilteredAssets: filtered,
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
        if (!id) return undefined;
        const normalized = id.toLowerCase().trim();
        return get().assets.find(
          (a) => a.id.toLowerCase() === normalized || a.assetId.toLowerCase() === normalized,
        );
      },

      getAssetAllocationHistory: (idOrAsset) => {
        const asset = typeof idOrAsset === 'string' ? get().getAssetById(idOrAsset) : idOrAsset;
        if (!asset) return [];

        if (asset.allocationHistory && asset.allocationHistory.length > 0) {
          return [...asset.allocationHistory].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          );
        }

        // Fallback: If currently assigned, synthesize an allocation event
        if (asset.assignedTo) {
          return [
            {
              id: `hist_${asset.id}_current`,
              assetId: asset.assetId,
              employeeId: asset.assignedTo.id || asset.assignedTo.employeeId,
              employeeName: asset.assignedTo.name,
              employeeEmail: asset.assignedTo.email,
              department: asset.assignedTo.department,
              avatar: asset.assignedTo.avatar,
              action: 'Allocated',
              date: asset.assignedTo.assignedDate || asset.purchaseDate,
              performedBy: 'IT Operations',
            },
          ];
        }

        return [];
      },

      // Modal Actions
      openAddModal: () => set({ isAddModalOpen: true, selectedAsset: null }),
      openEditModal: (asset) => set({ isEditModalOpen: true, selectedAsset: asset }),
      openDeleteModal: (asset) => set({ isDeleteModalOpen: true, selectedAsset: asset }),
      openViewModal: (asset) => set({ isViewModalOpen: true, selectedAsset: asset }),
      openImportModal: () => set({ isImportModalOpen: true }),
      openAllocateModal: (asset) =>
        set({ isAllocateModalOpen: true, selectedAsset: asset || null }),
      openQrModal: (asset) =>
        set((state) => ({
          isQrModalOpen: true,
          selectedAsset: asset !== undefined ? asset : state.selectedAsset,
        })),
      closeQrModal: () => set({ isQrModalOpen: false }),
      closeModals: () =>
        set({
          isAddModalOpen: false,
          isEditModalOpen: false,
          isDeleteModalOpen: false,
          isViewModalOpen: false,
          isImportModalOpen: false,
          isAllocateModalOpen: false,
          isQrModalOpen: false,
          selectedAsset: null,
        }),
    }),
    {
      name: 'assetops_assets_store_v1',
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({
        viewMode: state.viewMode,
        assets: state.assets,
      }),
    },
  ),
);
