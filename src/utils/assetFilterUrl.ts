import type { AssetCategory, AssetStatus } from '@/types/asset';

import type { AssetFilterStateValues } from '@/store/useAssetFilterStore';

export const ASSET_FILTER_QUERY_KEYS = {
  search: 'search',
  category: 'category',
  status: 'status',
  department: 'department',
  minCost: 'minCost',
  maxCost: 'maxCost',
} as const;

export const filtersToSearchParams = (filters: AssetFilterStateValues): URLSearchParams => {
  const params = new URLSearchParams();

  const { searchKeyword, selectedCategories, selectedStatuses, selectedDepartments, costRange } =
    filters;

  // Search
  if (searchKeyword.trim()) {
    params.set(ASSET_FILTER_QUERY_KEYS.search, searchKeyword.trim());
  }

  // Categories
  selectedCategories.forEach((category) => {
    params.append(ASSET_FILTER_QUERY_KEYS.category, category);
  });

  // Statuses
  selectedStatuses.forEach((status) => {
    params.append(ASSET_FILTER_QUERY_KEYS.status, status);
  });

  // Departments
  selectedDepartments.forEach((department) => {
    params.append(ASSET_FILTER_QUERY_KEYS.department, department);
  });

  // Cost range
  if (costRange.min !== null) {
    params.set(ASSET_FILTER_QUERY_KEYS.minCost, String(costRange.min));
  }

  if (costRange.max !== null) {
    params.set(ASSET_FILTER_QUERY_KEYS.maxCost, String(costRange.max));
  }

  return params;
};

export const searchParamsToFilters = (params: URLSearchParams): AssetFilterStateValues => {
  const searchKeyword = params.get(ASSET_FILTER_QUERY_KEYS.search) ?? '';

  const selectedCategories = params.getAll(ASSET_FILTER_QUERY_KEYS.category) as AssetCategory[];

  const selectedStatuses = params.getAll(ASSET_FILTER_QUERY_KEYS.status) as AssetStatus[];

  const selectedDepartments = params.getAll(ASSET_FILTER_QUERY_KEYS.department);

  const minCostParam = params.get(ASSET_FILTER_QUERY_KEYS.minCost);

  const maxCostParam = params.get(ASSET_FILTER_QUERY_KEYS.maxCost);

  const minCost =
    minCostParam !== null && minCostParam !== '' && !Number.isNaN(Number(minCostParam))
      ? Number(minCostParam)
      : null;

  const maxCost =
    maxCostParam !== null && maxCostParam !== '' && !Number.isNaN(Number(maxCostParam))
      ? Number(maxCostParam)
      : null;

  return {
    searchKeyword,
    selectedCategories,
    selectedStatuses,
    selectedDepartments,
    costRange: {
      min: minCost,
      max: maxCost,
    },
  };
};
