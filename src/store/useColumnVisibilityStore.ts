import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import { AVAILABLE_ASSET_COLUMNS } from '@/constans/asset.constants';

export const DEFAULT_VISIBLE_COLUMN_IDS = AVAILABLE_ASSET_COLUMNS.filter(
  (c) => c.defaultVisible,
).map((c) => c.id);

export interface ColumnVisibilityState {
  visibleColumnIds: string[];
  setVisibleColumns: (columnIds: string[]) => void;
  toggleColumn: (columnId: string) => void;
  removeColumn: (columnId: string) => void;
  addColumn: (columnId: string) => void;
  resetToDefault: () => void;
  selectAll: () => void;
  clearAll: () => void;
  isColumnVisible: (columnId: string) => boolean;
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
      // Gracefully handle storage quota or privacy mode errors
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

export const useColumnVisibilityStore = create<ColumnVisibilityState>()(
  persist(
    (set, get) => ({
      visibleColumnIds: DEFAULT_VISIBLE_COLUMN_IDS,

      setVisibleColumns: (columnIds: string[]) => {
        set({ visibleColumnIds: columnIds });
      },

      toggleColumn: (columnId: string) => {
        set((state) => {
          const isPresent = state.visibleColumnIds.includes(columnId);
          return {
            visibleColumnIds: isPresent
              ? state.visibleColumnIds.filter((id) => id !== columnId)
              : [...state.visibleColumnIds, columnId],
          };
        });
      },

      removeColumn: (columnId: string) => {
        set((state) => ({
          visibleColumnIds: state.visibleColumnIds.filter((id) => id !== columnId),
        }));
      },

      addColumn: (columnId: string) => {
        set((state) => {
          if (state.visibleColumnIds.includes(columnId)) return state;
          return { visibleColumnIds: [...state.visibleColumnIds, columnId] };
        });
      },

      resetToDefault: () => {
        set({ visibleColumnIds: DEFAULT_VISIBLE_COLUMN_IDS });
      },

      selectAll: () => {
        set({ visibleColumnIds: AVAILABLE_ASSET_COLUMNS.map((c) => c.id) });
      },

      clearAll: () => {
        set({ visibleColumnIds: [] });
      },

      isColumnVisible: (columnId: string) => {
        return get().visibleColumnIds.includes(columnId);
      },
    }),
    {
      name: 'assetops_asset_columns_visibility',
      storage: createJSONStorage(() => safeStorage),
    },
  ),
);
