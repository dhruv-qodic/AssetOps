import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { AssetFilterStateValues } from '@/store/useAssetFilterStore';
import {
  assetFilterPresetsSchema,
  type AssetFilterPreset,
} from '@/schemas/assetFilterPreset.schema';

interface AssetFilterPresetState {
  presets: AssetFilterPreset[];

  savePreset: (name: string, filters: AssetFilterStateValues) => void;
  deletePreset: (id: string) => void;
  getPreset: (id: string) => AssetFilterPreset | undefined;
  clearPresets: () => void;
}

const STORAGE_KEY = 'asset-filter-presets';

export const useAssetFilterPresetStore = create<AssetFilterPresetState>()(
  persist(
    (set, get) => ({
      presets: [],

      savePreset: (name, filters) => {
        const newPreset: AssetFilterPreset = {
          id: crypto.randomUUID(),
          name: name.trim(),
          filters: structuredClone(filters),
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          presets: [...state.presets, newPreset],
        }));
      },

      deletePreset: (id) => {
        set((state) => ({
          presets: state.presets.filter((preset) => preset.id !== id),
        }));
      },

      getPreset: (id) => {
        return get().presets.find((preset) => preset.id === id);
      },

      clearPresets: () => {
        set({ presets: [] });
      },
    }),
    {
      name: STORAGE_KEY,
      // Validate persisted data before putting it into Zustand state.
      onRehydrateStorage: () => {
        return (state) => {
          if (!state) return;

          const result = assetFilterPresetsSchema.safeParse(state.presets);

          if (!result.success) {
            console.error('Invalid asset filter presets:', result.error);

            useAssetFilterPresetStore.setState({
              presets: [],
            });

            return;
          }

          useAssetFilterPresetStore.setState({
            presets: result.data,
          });
        };
      },
    },
  ),
);
