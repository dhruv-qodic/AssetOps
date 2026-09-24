import { z } from 'zod';

import { ASSET_CATEGORIES, ASSET_STATUSES } from '@/constans/asset.constants';

import type { AssetCategory, AssetStatus } from '@/types/asset';

const assetCategorySchema = z.custom<AssetCategory>((value) =>
  ASSET_CATEGORIES.includes(value as AssetCategory),
);

const assetStatusSchema = z.custom<AssetStatus>((value) =>
  ASSET_STATUSES.includes(value as AssetStatus),
);

export const costRangeSchema = z.object({
  min: z.number().nullable(),
  max: z.number().nullable(),
});

export const assetFilterValuesSchema = z.object({
  searchKeyword: z.string(),
  selectedCategories: z.array(assetCategorySchema),
  selectedStatuses: z.array(assetStatusSchema),
  selectedDepartments: z.array(z.string()),
  costRange: costRangeSchema,
});

export const assetFilterPresetSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
  filters: assetFilterValuesSchema,
  createdAt: z.string(),
});

export const assetFilterPresetsSchema = z.array(assetFilterPresetSchema);

export type AssetFilterPreset = z.infer<typeof assetFilterPresetSchema>;
