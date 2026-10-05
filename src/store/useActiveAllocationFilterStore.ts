import { create } from 'zustand';
import type { Asset, AssetCategory } from '@/types/asset';
import type { Employee } from '@/types/employee';
import type { CostRange } from './useAssetFilterStore';
import { matchDepartment } from './useAssetFilterStore';

export interface ActiveAllocationFilterStateValues {
  searchKeyword: string;
  selectedCategories: AssetCategory[];
  selectedDepartments: string[];
  selectedLocations: string[];
  costRange: CostRange;
}

export interface ActiveAllocationFilterActions {
  setSearchKeyword: (keyword: string) => void;
  setSelectedCategories: (categories: AssetCategory[]) => void;
  toggleCategory: (category: AssetCategory) => void;
  setSelectedDepartments: (departments: string[]) => void;
  toggleDepartment: (department: string) => void;
  setSelectedLocations: (locations: string[]) => void;
  toggleLocation: (location: string) => void;
  setCostRange: (range: Partial<CostRange>) => void;
  setMinCost: (min: number | string | null) => void;
  setMaxCost: (max: number | string | null) => void;
  resetFilters: () => void;
  clearFilters: () => void;
}

export type ActiveAllocationFilterStore = ActiveAllocationFilterStateValues &
  ActiveAllocationFilterActions;

export const INITIAL_ACTIVE_ALLOCATION_FILTER_STATE: ActiveAllocationFilterStateValues = {
  searchKeyword: '',
  selectedCategories: [],
  selectedDepartments: [],
  selectedLocations: [],
  costRange: {
    min: null,
    max: null,
  },
};

const parseCostValue = (value: number | string | null): number | null => {
  if (value === null || value === '') return null;
  const num = typeof value === 'number' ? value : parseFloat(value);
  return isNaN(num) ? null : num;
};

/**
 * Pure filtering function for active allocations (strictly status === 'Allocated')
 * based on multi-facet filter criteria.
 */
export function filterActiveAllocations(
  assets: Asset[],
  employees: Employee[],
  filters: ActiveAllocationFilterStateValues,
): Asset[] {
  const { searchKeyword, selectedCategories, selectedDepartments, selectedLocations, costRange } =
    filters;

  const keyword = searchKeyword.trim().toLowerCase();
  const minCost = costRange.min;
  const maxCost = costRange.max;

  // Pre-index employees for O(1) lookup
  const empById = new Map<string, Employee>();
  const empByCode = new Map<string, Employee>();
  const empByName = new Map<string, Employee>();

  for (const e of employees) {
    if (e.id) empById.set(e.id, e);
    if (e.employeeId) empByCode.set(e.employeeId.toLowerCase(), e);
    const nameKey = `${e.firstName} ${e.lastName}`.trim().toLowerCase();
    if (nameKey) empByName.set(nameKey, e);
  }

  return assets.filter((asset) => {
    // 1. Must be an active allocated asset
    if (asset.status !== 'Allocated') {
      return false;
    }

    let assignedEmp: Employee | undefined = undefined;
    if (asset.assignedTo?.id) {
      assignedEmp = empById.get(asset.assignedTo.id);
    }
    if (!assignedEmp && asset.assignedTo?.employeeId) {
      assignedEmp = empByCode.get(asset.assignedTo.employeeId.toLowerCase());
    }
    if (!assignedEmp && asset.assignedTo?.name) {
      assignedEmp = empByName.get(asset.assignedTo.name.trim().toLowerCase());
    }

    const empFullName = assignedEmp
      ? `${assignedEmp.firstName} ${assignedEmp.lastName}`.trim()
      : asset.assignedTo?.name || '';

    const empDepartment = assignedEmp?.department || asset.assignedTo?.department || '';
    const empCode = assignedEmp?.employeeId || asset.assignedTo?.employeeId || '';

    // 2. Keyword search across asset name, assetId, model, serialNumber, location, employee name, employeeId, department
    if (keyword) {
      const matchAsset =
        asset.name.toLowerCase().includes(keyword) ||
        asset.assetId.toLowerCase().includes(keyword) ||
        asset.category.toLowerCase().includes(keyword) ||
        (asset.model?.toLowerCase().includes(keyword) ?? false) ||
        asset.serialNumber.toLowerCase().includes(keyword) ||
        asset.location.toLowerCase().includes(keyword) ||
        (asset.notes?.toLowerCase().includes(keyword) ?? false);

      const matchEmp =
        empFullName.toLowerCase().includes(keyword) ||
        empCode.toLowerCase().includes(keyword) ||
        empDepartment.toLowerCase().includes(keyword);

      if (!matchAsset && !matchEmp) return false;
    }

    // 3. Category Filter (OR within facet)
    if (selectedCategories.length > 0) {
      if (!selectedCategories.includes(asset.category)) {
        return false;
      }
    }

    // 4. Department Filter (OR within facet)
    if (selectedDepartments.length > 0) {
      const matchesDept = matchDepartment(empDepartment, selectedDepartments);
      if (!matchesDept) {
        return false;
      }
    }

    // 5. Location Filter (OR within facet)
    if (selectedLocations.length > 0) {
      if (!selectedLocations.includes(asset.location)) {
        return false;
      }
    }

    // 6. Cost Range Filter (min, max, or range)
    const cost = asset.purchaseCost ?? 0;
    if (minCost !== null && cost < minCost) {
      return false;
    }
    if (maxCost !== null && cost > maxCost) {
      return false;
    }

    return true;
  });
}

export const useActiveAllocationFilterStore = create<ActiveAllocationFilterStore>((set) => ({
  ...INITIAL_ACTIVE_ALLOCATION_FILTER_STATE,

  setSearchKeyword: (keyword: string) => {
    set({ searchKeyword: keyword });
  },

  setSelectedCategories: (categories: AssetCategory[]) => {
    set({ selectedCategories: categories });
  },

  toggleCategory: (category: AssetCategory) => {
    set((state) => {
      const exists = state.selectedCategories.includes(category);
      return {
        selectedCategories: exists
          ? state.selectedCategories.filter((c) => c !== category)
          : [...state.selectedCategories, category],
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

  setSelectedLocations: (locations: string[]) => {
    set({ selectedLocations: locations });
  },

  toggleLocation: (location: string) => {
    set((state) => {
      const exists = state.selectedLocations.includes(location);
      return {
        selectedLocations: exists
          ? state.selectedLocations.filter((l) => l !== location)
          : [...state.selectedLocations, location],
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
    set({ ...INITIAL_ACTIVE_ALLOCATION_FILTER_STATE });
  },

  clearFilters: () => {
    set({ ...INITIAL_ACTIVE_ALLOCATION_FILTER_STATE });
  },
}));
