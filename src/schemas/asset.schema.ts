import { z } from 'zod';
import { ASSET_CATEGORIES, ASSET_STATUSES } from '@/constans/asset.constants';

export const assetSchema = z.object({
  assetId: z
    .string()
    .trim()
    .min(1, { message: 'Asset ID is required' })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message: 'Asset ID can only contain letters, numbers, hyphens, and underscores',
    }),
  name: z
    .string()
    .trim()
    .min(1, { message: 'Asset name is required' })
    .min(2, { message: 'Asset name must be at least 2 characters' }),
  model: z.string().trim().optional(),
  category: z.enum(ASSET_CATEGORIES as [string, ...string[]], {
    error: 'Please select a valid category',
  }),
  status: z.enum(ASSET_STATUSES as [string, ...string[]], {
    error: 'Please select a valid status',
  }),
  location: z.string().trim().min(1, { message: 'Location is required' }),
  serialNumber: z
    .string()
    .trim()
    .min(1, { message: 'Serial number is required' }),
  purchaseDate: z
    .string()
    .min(1, { message: 'Purchase date is required' }),
  purchaseCost: z.coerce.number().min(0).optional(),
  warrantyExpiry: z.string().optional(),
  notes: z.string().optional(),
  specifications: z.record(z.string(), z.string()).optional(),
});

export type AssetFormData = z.infer<typeof assetSchema>;
