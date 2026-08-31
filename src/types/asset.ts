/**
 * Asset Management Type Definitions
 * Based on the AssetOps Assets Management Specification
 */

export type AssetCategory =
  | 'Laptop'
  | 'Mobile'
  | 'Monitor'
  | 'Accessories'
  | 'Desktop'
  | 'Tablet'
  | 'Audio'
  | 'Networking'
  | 'Other';

export type AssetStatus =
  | 'Allocated'
  | 'Available'
  | 'Maintenance'
  | 'Retired'
  | 'Lost';

export type AssetLocation =
  | 'Headquarters'
  | 'New York Office'
  | 'San Francisco'
  | 'London Office'
  | 'Remote';

export interface AssignedEmployee {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  department?: string;
  assignedDate?: string;
}

export interface Asset {
  id: string;
  assetId: string; // e.g., 'A1001'
  name: string; // e.g., 'Dell Laptop'
  model?: string; // e.g., 'Latitude 5440', '27"'
  category: AssetCategory;
  status: AssetStatus;
  location: string;
  assignedTo?: AssignedEmployee | null; // e.g., 'John Doe' or null
  serialNumber: string;
  purchaseDate: string;
  purchaseCost?: number;
  warrantyExpiry?: string;
  image?: string; // thumbnail / illustration URL
  specifications?: Record<string, string>;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type AssetSortOption =
  | 'recently_added'
  | 'name_asc'
  | 'name_desc'
  | 'asset_id_asc'
  | 'asset_id_desc'
  | 'purchase_date_desc';

export interface AssetFilters {
  search: string;
  category: AssetCategory | 'All';
  status: AssetStatus | 'All';
  location: string | 'All';
  sortBy: AssetSortOption;
  page: number;
  pageSize: number;
}

export interface CreateAssetInput {
  assetId: string;
  name: string;
  model?: string;
  category: AssetCategory;
  status: AssetStatus;
  location: string;
  serialNumber: string;
  purchaseDate: string;
  purchaseCost?: number;
  warrantyExpiry?: string;
  assignedToId?: string | null;
  image?: string;
  specifications?: Record<string, string>;
  notes?: string;
}

export type UpdateAssetInput = Partial<CreateAssetInput> & {
  id: string;
};

export interface AssetStats {
  totalAssets: number;
  allocated: number;
  available: number;
  maintenance: number;
  retired: number;
}
