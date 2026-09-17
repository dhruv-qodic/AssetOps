import { create } from 'zustand';
import type { Asset, AssetCategory, AssetStatus } from '@/types/asset';

export interface CostRange {
  min: number | null;
  max: number | null;
}

export interface AssetFilterStateValues {
  searchKeyword: string;
  selectedCategories: AssetCategory[];
  selectedStatuses: AssetStatus[];
  selectedDepartments: string[];
  costRange: CostRange;
}

export interface AssetFilterActions {
  setSearchKeyword: (keyword: string) => void;
  setSelectedCategories: (categories: AssetCategory[]) => void;
  toggleCategory: (category: AssetCategory | string) => void;
  setSelectedStatuses: (statuses: AssetStatus[]) => void;
  toggleStatus: (status: AssetStatus | string) => void;
  setSelectedDepartments: (departments: string[]) => void;
  toggleDepartment: (department: string) => void;
  setCostRange: (range: Partial<CostRange>) => void;
  setMinCost: (min: number | string | null) => void;
  setMaxCost: (max: number | string | null) => void;
  resetFilters: () => void;
  clearFilters: () => void;
}

export type AssetFilterStore = AssetFilterStateValues & AssetFilterActions;

export const INITIAL_ASSET_FILTER_STATE: AssetFilterStateValues = {
  searchKeyword: '',
  selectedCategories: [],
  selectedStatuses: [],
  selectedDepartments: [],
  costRange: {
    min: null,
    max: null,
  },
};

const parseCostValue = (value: number | string | null): number | null => {
  if (value === null || value === undefined || value === '') return null;
  const num = typeof value === 'number' ? value : parseFloat(String(value));
  return isNaN(num) ? null : num;
};

/**
 * Pure helper function to match department names accounting for common variations
 * (e.g., 'HR' <-> 'Human Resources', 'IT' <-> 'IT Administration').
 */
export const matchDepartment = (assetDept: string | undefined, selectedDepartments: string[]): boolean => {
  if (!assetDept || selectedDepartments.length === 0) return false;
  const lowerAssetDept = assetDept.toLowerCase().trim();

  return selectedDepartments.some((selected) => {
    const lowerSelected = selected.toLowerCase().trim();
    if (lowerAssetDept === lowerSelected) return true;

    if (lowerSelected === 'hr' && (lowerAssetDept === 'human resources' || lowerAssetDept.includes('hr'))) {
      return true;
    }
    if (lowerSelected === 'human resources' && (lowerAssetDept === 'hr' || lowerAssetDept.includes('human resources'))) {
      return true;
    }
    if (lowerSelected === 'it' && (lowerAssetDept.startsWith('it') || lowerAssetDept.includes('it administration') || lowerAssetDept.includes('it support'))) {
      return true;
    }

    return lowerAssetDept.includes(lowerSelected) || lowerSelected.includes(lowerAssetDept);
  });
};

/**
 * Pure filtering function for assets based on multi-facet filter criteria.
 * Does not mutate original assets array.
 */
export function filterAssets(
  assets: Asset[],
  filters: AssetFilterStateValues,
  additionalFilters?: {
    search?: string;
    category?: AssetCategory | 'All';
    status?: AssetStatus | 'All';
    location?: string;
  },
): Asset[] {
  const { searchKeyword, selectedCategories, selectedStatuses, selectedDepartments, costRange } = filters;

  const keyword = (searchKeyword || additionalFilters?.search || '').trim().toLowerCase();
  const minCost = costRange.min;
  const maxCost = costRange.max;

  return assets.filter((asset) => {
    // 1. Keyword search across name, ID, model, serialNumber, location, assignedTo name/email/department, specifications, notes
    if (keyword) {
      const matchName = asset.name?.toLowerCase().includes(keyword) || false;
      const matchId = asset.assetId?.toLowerCase().includes(keyword) || false;
      const matchModel = asset.model?.toLowerCase().includes(keyword) || false;
      const matchSerial = asset.serialNumber?.toLowerCase().includes(keyword) || false;
      const matchLocation = asset.location?.toLowerCase().includes(keyword) || false;
      const matchAssignedName = asset.assignedTo?.name?.toLowerCase().includes(keyword) || false;
      const matchAssignedEmail = asset.assignedTo?.email?.toLowerCase().includes(keyword) || false;
      const matchAssignedDept = asset.assignedTo?.department?.toLowerCase().includes(keyword) || false;
      const matchNotes = asset.notes?.toLowerCase().includes(keyword) || false;

      let matchSpecs = false;
      if (asset.specifications) {
        matchSpecs = Object.values(asset.specifications).some(
          (val) => typeof val === 'string' && val.toLowerCase().includes(keyword),
        );
      }

      const matchesAnyKeywordField =
        matchName ||
        matchId ||
        matchModel ||
        matchSerial ||
        matchLocation ||
        matchAssignedName ||
        matchAssignedEmail ||
        matchAssignedDept ||
        matchNotes ||
        matchSpecs;

      if (!matchesAnyKeywordField) {
        return false;
      }
    }

    // 2. Category Filter (OR within facet)
    if (selectedCategories.length > 0) {
      if (!selectedCategories.includes(asset.category)) {
        return false;
      }
    } else if (additionalFilters?.category && additionalFilters.category !== 'All') {
      if (asset.category !== additionalFilters.category) {
        return false;
      }
    }

    // 3. Status Filter (OR within facet)
    if (selectedStatuses.length > 0) {
      if (!selectedStatuses.includes(asset.status)) {
        return false;
      }
    } else if (additionalFilters?.status && additionalFilters.status !== 'All') {
      if (asset.status !== additionalFilters.status) {
        return false;
      }
    }

    // 4. Department Filter (OR within facet)
    if (selectedDepartments.length > 0) {
      const matchesDept = matchDepartment(asset.assignedTo?.department, selectedDepartments);
      if (!matchesDept) {
        return false;
      }
    }

    // 5. Cost Range Filter (min, max, or range)
    const cost = asset.purchaseCost ?? 0;
    if (minCost !== null && cost < minCost) {
      return false;
    }
    if (maxCost !== null && cost > maxCost) {
      return false;
    }

    // 6. Additional Location filter
    if (additionalFilters?.location && additionalFilters.location !== 'All') {
      if (asset.location !== additionalFilters.location) {
        return false;
      }
    }

    return true;
  });
}

export const useAssetFilterStore = create<AssetFilterStore>((set) => ({
  ...INITIAL_ASSET_FILTER_STATE,

  setSearchKeyword: (keyword: string) => {
    set({ searchKeyword: keyword });
  },

  setSelectedCategories: (categories: AssetCategory[]) => {
    set({ selectedCategories: categories });
  },

  toggleCategory: (category: AssetCategory | string) => {
    set((state) => {
      const cat = category as AssetCategory;
      const exists = state.selectedCategories.includes(cat);
      return {
        selectedCategories: exists
          ? state.selectedCategories.filter((c) => c !== cat)
          : [...state.selectedCategories, cat],
      };
    });
  },

  setSelectedStatuses: (statuses: AssetStatus[]) => {
    set({ selectedStatuses: statuses });
  },

  toggleStatus: (status: AssetStatus | string) => {
    set((state) => {
      const st = status as AssetStatus;
      const exists = state.selectedStatuses.includes(st);
      return {
        selectedStatuses: exists
          ? state.selectedStatuses.filter((s) => s !== st)
          : [...state.selectedStatuses, st],
      };
    });
  },

  setSelectedDepartments: (departments: string[]) => {
    set({ selectedDepartments: departments });
  },

  toggleDepartment: (dept: string) => {
    set((state) => {
      const exists = state.selectedDepartments.includes(dept);
      return {
        selectedDepartments: exists
          ? state.selectedDepartments.filter((d) => d !== dept)
          : [...state.selectedDepartments, dept],
      };
    });
  },

  setCostRange: (range: Partial<CostRange>) => {
    set((state) => ({
      costRange: {
        min: range.min !== undefined ? parseCostValue(range.min) : state.costRange.min,
        max: range.max !== undefined ? parseCostValue(range.max) : state.costRange.max,
      },
    }));
  },

  setMinCost: (min: number | string | null) => {
    set((state) => ({
      costRange: {
        ...state.costRange,
        min: parseCostValue(min),
      },
    }));
  },

  setMaxCost: (max: number | string | null) => {
    set((state) => ({
      costRange: {
        ...state.costRange,
        max: parseCostValue(max),
      },
    }));
  },

  resetFilters: () => {
    set({ ...INITIAL_ASSET_FILTER_STATE });
  },

  clearFilters: () => {
    set({ ...INITIAL_ASSET_FILTER_STATE });
  },
}));
