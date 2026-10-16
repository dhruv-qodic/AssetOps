import { describe, it, expect, beforeEach } from 'vitest';
import {
  useAssetFilterStore,
  filterAssets,
  matchDepartment,
  INITIAL_ASSET_FILTER_STATE,
} from '../useAssetFilterStore';
import type { Asset } from '@/types/asset';

const MOCK_TEST_ASSETS: Asset[] = [
  {
    id: 'test_1',
    assetId: 'A1001',
    name: 'Dell Latitude Laptop',
    model: '5440',
    category: 'Laptop',
    status: 'Allocated',
    location: 'Headquarters',
    assignedTo: {
      id: 'emp_1',
      name: 'John Doe',
      email: 'john.doe@company.com',
      department: 'IT',
    },
    serialNumber: 'DL-5440-111',
    purchaseDate: '2023-01-01',
    purchaseCost: 1200,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    specifications: { CPU: 'Intel i7', RAM: '16GB' },
    notes: 'Primary developer machine',
  },
  {
    id: 'test_2',
    assetId: 'A1002',
    name: 'Apple MacBook Pro',
    model: 'M3 Pro',
    category: 'Laptop',
    status: 'Available',
    location: 'New York Office',
    assignedTo: null,
    serialNumber: 'MBP-M3-222',
    purchaseDate: '2023-05-01',
    purchaseCost: 2400,
    createdAt: '2023-05-01T00:00:00Z',
    updatedAt: '2023-05-01T00:00:00Z',
  },
  {
    id: 'test_3',
    assetId: 'A1003',
    name: 'Dell UltraSharp Monitor',
    model: '27-inch',
    category: 'Monitor',
    status: 'Allocated',
    location: 'San Francisco',
    assignedTo: {
      id: 'emp_2',
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      department: 'HR',
    },
    serialNumber: 'DM-27-333',
    purchaseDate: '2023-03-01',
    purchaseCost: 450,
    createdAt: '2023-03-01T00:00:00Z',
    updatedAt: '2023-03-01T00:00:00Z',
  },
  {
    id: 'test_4',
    assetId: 'A1004',
    name: 'iPhone 15 Pro',
    model: '256GB',
    category: 'Mobile',
    status: 'Maintenance',
    location: 'Headquarters',
    assignedTo: {
      id: 'emp_3',
      name: 'Alice Wonder',
      email: 'alice@company.com',
      department: 'Finance',
    },
    serialNumber: 'IP15-444',
    purchaseDate: '2023-09-01',
    purchaseCost: 999,
    createdAt: '2023-09-01T00:00:00Z',
    updatedAt: '2023-09-01T00:00:00Z',
  },
  {
    id: 'test_5',
    assetId: 'A1005',
    name: 'Cisco Gateway Switch',
    category: 'Networking',
    status: 'Retired',
    location: 'London Office',
    assignedTo: null,
    serialNumber: 'CS-555',
    purchaseDate: '2021-01-01',
    purchaseCost: 3500,
    createdAt: '2021-01-01T00:00:00Z',
    updatedAt: '2021-01-01T00:00:00Z',
  },
];

describe('useAssetFilterStore', () => {
  beforeEach(() => {
    useAssetFilterStore.setState({
      ...INITIAL_ASSET_FILTER_STATE,
    });
  });

  it('should initialize with empty default filter values', () => {
    const state = useAssetFilterStore.getState();
    expect(state.searchKeyword).toBe('');
    expect(state.selectedCategories).toEqual([]);
    expect(state.selectedStatuses).toEqual([]);
    expect(state.selectedDepartments).toEqual([]);
    expect(state.costRange).toEqual({ min: null, max: null });
  });

  describe('Search Keyword Filtering', () => {
    it('should set search keyword and filter across asset fields case-insensitively', () => {
      useAssetFilterStore.getState().setSearchKeyword('latitude');
      const filtered = filterAssets(MOCK_TEST_ASSETS, useAssetFilterStore.getState());
      expect(filtered.length).toBe(1);
      expect(filtered[0].assetId).toBe('A1001');

      // Search by Asset ID
      useAssetFilterStore.getState().setSearchKeyword('a1002');
      const filteredById = filterAssets(MOCK_TEST_ASSETS, useAssetFilterStore.getState());
      expect(filteredById.length).toBe(1);
      expect(filteredById[0].name).toBe('Apple MacBook Pro');

      // Search by Assigned Employee Name
      useAssetFilterStore.getState().setSearchKeyword('jane');
      const filteredByAssignee = filterAssets(MOCK_TEST_ASSETS, useAssetFilterStore.getState());
      expect(filteredByAssignee.length).toBe(1);
      expect(filteredByAssignee[0].assetId).toBe('A1003');

      // Search by Serial Number
      useAssetFilterStore.getState().setSearchKeyword('cs-555');
      const filteredBySerial = filterAssets(MOCK_TEST_ASSETS, useAssetFilterStore.getState());
      expect(filteredBySerial.length).toBe(1);
      expect(filteredBySerial[0].name).toBe('Cisco Gateway Switch');

      // Search by Specification Value
      useAssetFilterStore.getState().setSearchKeyword('16gb');
      const filteredBySpec = filterAssets(MOCK_TEST_ASSETS, useAssetFilterStore.getState());
      expect(filteredBySpec.length).toBe(1);
      expect(filteredBySpec[0].assetId).toBe('A1001');
    });
  });

  describe('Category Filtering (Multi-Select with OR logic)', () => {
    it('should allow toggling categories and match any selected category', () => {
      // 1. Single category
      useAssetFilterStore.getState().toggleCategory('Laptop');
      expect(useAssetFilterStore.getState().selectedCategories).toEqual(['Laptop']);

      let result = filterAssets(MOCK_TEST_ASSETS, useAssetFilterStore.getState());
      expect(result.length).toBe(2);
      expect(result.map((a) => a.assetId)).toEqual(['A1001', 'A1002']);

      // 2. Multiple categories (OR logic: Laptop + Monitor)
      useAssetFilterStore.getState().toggleCategory('Monitor');
      expect(useAssetFilterStore.getState().selectedCategories).toEqual(['Laptop', 'Monitor']);

      result = filterAssets(MOCK_TEST_ASSETS, useAssetFilterStore.getState());
      expect(result.length).toBe(3);
      expect(result.map((a) => a.assetId)).toEqual(['A1001', 'A1002', 'A1003']);

      // 3. Untoggle category
      useAssetFilterStore.getState().toggleCategory('Laptop');
      expect(useAssetFilterStore.getState().selectedCategories).toEqual(['Monitor']);

      result = filterAssets(MOCK_TEST_ASSETS, useAssetFilterStore.getState());
      expect(result.length).toBe(1);
      expect(result[0].assetId).toBe('A1003');
    });
  });

  describe('Status Filtering (Multi-Select with OR logic)', () => {
    it('should allow toggling statuses and match any selected status', () => {
      // Available + Allocated
      useAssetFilterStore.getState().toggleStatus('Available');
      useAssetFilterStore.getState().toggleStatus('Allocated');

      const result = filterAssets(MOCK_TEST_ASSETS, useAssetFilterStore.getState());
      expect(result.length).toBe(3);
      expect(result.every((a) => a.status === 'Available' || a.status === 'Allocated')).toBe(true);
    });
  });

  describe('Department Filtering (Multi-Select with OR logic)', () => {
    it('should filter assets by employee department', () => {
      // IT + HR
      useAssetFilterStore.getState().toggleDepartment('IT');
      useAssetFilterStore.getState().toggleDepartment('HR');

      const result = filterAssets(MOCK_TEST_ASSETS, useAssetFilterStore.getState());
      expect(result.length).toBe(2);
      expect(result.map((a) => a.assetId)).toEqual(['A1001', 'A1003']);
    });

    it('should match department variations accurately', () => {
      expect(matchDepartment('Human Resources', ['HR'])).toBe(true);
      expect(matchDepartment('HR', ['Human Resources'])).toBe(true);
      expect(matchDepartment('IT Administration', ['IT'])).toBe(true);
      expect(matchDepartment('Finance', ['Finance'])).toBe(true);
      expect(matchDepartment('Sales', ['Engineering'])).toBe(false);
      expect(matchDepartment(undefined, ['IT'])).toBe(false);
    });
  });

  describe('Cost Range Filtering', () => {
    it('should handle minimum cost only', () => {
      useAssetFilterStore.getState().setMinCost(1500);
      const result = filterAssets(MOCK_TEST_ASSETS, useAssetFilterStore.getState());
      expect(result.length).toBe(2);
      expect(result.map((a) => a.assetId)).toEqual(['A1002', 'A1005']);
    });

    it('should handle maximum cost only', () => {
      useAssetFilterStore.getState().setMaxCost(1000);
      const result = filterAssets(MOCK_TEST_ASSETS, useAssetFilterStore.getState());
      expect(result.length).toBe(2);
      expect(result.map((a) => a.assetId)).toEqual(['A1003', 'A1004']);
    });

    it('should handle min and max range bounded', () => {
      useAssetFilterStore.getState().setCostRange({ min: 500, max: 1500 });
      const result = filterAssets(MOCK_TEST_ASSETS, useAssetFilterStore.getState());
      expect(result.length).toBe(2);
      expect(result.map((a) => a.assetId)).toEqual(['A1001', 'A1004']);
    });
  });

  describe('Multi-Facet Combined Filtering (AND across groups, OR within groups)', () => {
    it('should combine Category, Status, Department, Cost Range, and Search Keyword', () => {
      // Category: Laptop OR Monitor
      useAssetFilterStore.getState().toggleCategory('Laptop');
      useAssetFilterStore.getState().toggleCategory('Monitor');

      // Status: Allocated
      useAssetFilterStore.getState().toggleStatus('Allocated');

      // Department: IT
      useAssetFilterStore.getState().toggleDepartment('IT');

      // Cost: 500 to 2000
      useAssetFilterStore.getState().setCostRange({ min: 500, max: 2000 });

      // Search: Latitude
      useAssetFilterStore.getState().setSearchKeyword('Latitude');

      const result = filterAssets(MOCK_TEST_ASSETS, useAssetFilterStore.getState());
      expect(result.length).toBe(1);
      expect(result[0].assetId).toBe('A1001');
      expect(result[0].name).toBe('Dell Latitude Laptop');
    });

    it('should return empty array when no assets match all facets without mutating original', () => {
      const originalLength = MOCK_TEST_ASSETS.length;
      useAssetFilterStore.getState().toggleCategory('Mobile');
      useAssetFilterStore.getState().toggleStatus('Retired'); // Mobile has status 'Maintenance', none are 'Retired'

      const result = filterAssets(MOCK_TEST_ASSETS, useAssetFilterStore.getState());
      expect(result).toEqual([]);
      expect(MOCK_TEST_ASSETS.length).toBe(originalLength);
    });
  });

  describe('Reset and Clear Filters', () => {
    it('should reset all filter values back to initial state', () => {
      useAssetFilterStore.getState().setSearchKeyword('test');
      useAssetFilterStore.getState().toggleCategory('Laptop');
      useAssetFilterStore.getState().toggleStatus('Allocated');
      useAssetFilterStore.getState().toggleDepartment('IT');
      useAssetFilterStore.getState().setCostRange({ min: 100, max: 500 });

      expect(useAssetFilterStore.getState().searchKeyword).toBe('test');
      expect(useAssetFilterStore.getState().selectedCategories.length).toBe(1);

      useAssetFilterStore.getState().resetFilters();

      const state = useAssetFilterStore.getState();
      expect(state.searchKeyword).toBe('');
      expect(state.selectedCategories).toEqual([]);
      expect(state.selectedStatuses).toEqual([]);
      expect(state.selectedDepartments).toEqual([]);
      expect(state.costRange).toEqual({ min: null, max: null });
    });
  });
});
