import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Asset,
  AssetFilters,
} from '@/types/asset';
import { DEFAULT_ASSET_FILTERS } from '@/constans/asset.constants';
import { MOCK_ASSETS } from '@/mocks/seed/assets';

interface AssetStoreState {
  assets: Asset[];
  filters: AssetFilters;
  isLoading: boolean;
  selectedAsset: Asset | null;


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


    }),
    {
      name: 'assetops_assets_store_v1',
      partialize: (state) => ({
        assets: state.assets,
      }),
    }
  )
);
