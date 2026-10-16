import { describe, it, expect, beforeEach } from 'vitest';
import {
  useActiveAllocationFilterStore,
  filterActiveAllocations,
  INITIAL_ACTIVE_ALLOCATION_FILTER_STATE,
} from '../useActiveAllocationFilterStore';
import type { Asset } from '@/types/asset';
import type { Employee } from '@/types/employee';

const mockEmployees: Employee[] = [
  {
    id: 'emp_1',
    employeeId: 'EMP-001',
    firstName: 'Sarah',
    lastName: 'Connor',
    email: 'sarah.connor@example.com',
    phone: '+1 555-0101',
    department: 'IT',
    position: 'DevOps Engineer',
    status: 'active',
    type: 'full-time',
    location: 'Headquarters',
    assignedAssets: ['ast_1'],
    createdAt: '2023-01-15T00:00:00.000Z',
    updatedAt: '2023-01-15T00:00:00.000Z',
  },
  {
    id: 'emp_2',
    employeeId: 'EMP-002',
    firstName: 'John',
    lastName: 'Rambo',
    email: 'john.rambo@example.com',
    phone: '+1 555-0102',
    department: 'Sales',
    position: 'Account Executive',
    status: 'active',
    type: 'full-time',
    location: 'New York Office',
    assignedAssets: ['ast_2'],
    createdAt: '2023-02-10T00:00:00.000Z',
    updatedAt: '2023-02-10T00:00:00.000Z',
  },
];

const mockAssets: Asset[] = [
  {
    id: 'ast_1',
    assetId: 'A1001',
    name: 'MacBook Pro 16"',
    model: 'M3 Max',
    category: 'Laptop',
    status: 'Allocated',
    location: 'Headquarters',
    serialNumber: 'MBP16-001',
    purchaseDate: '2024-01-10',
    purchaseCost: 3499,
    assignedTo: {
      id: 'emp_1',
      name: 'Sarah Connor',
      employeeId: 'EMP-001',
      email: 'sarah.connor@example.com',
      department: 'IT',
      assignedDate: '2024-01-15',
    },
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z',
  },
  {
    id: 'ast_2',
    assetId: 'A1002',
    name: 'iPhone 15 Pro',
    model: '256GB Titanium',
    category: 'Mobile',
    status: 'Allocated',
    location: 'New York Office',
    serialNumber: 'IPH15-002',
    purchaseDate: '2024-01-12',
    purchaseCost: 1199,
    assignedTo: {
      id: 'emp_2',
      name: 'John Rambo',
      employeeId: 'EMP-002',
      email: 'john.rambo@example.com',
      department: 'Sales',
      assignedDate: '2024-01-20',
    },
    createdAt: '2024-01-12T00:00:00.000Z',
    updatedAt: '2024-01-20T00:00:00.000Z',
  },
  {
    id: 'ast_3',
    assetId: 'A1003',
    name: 'ThinkPad X1 Carbon',
    model: 'Gen 11',
    category: 'Laptop',
    status: 'Available',
    location: 'Headquarters',
    serialNumber: 'TPX1-004',
    purchaseDate: '2024-02-15',
    purchaseCost: 1899,
    assignedTo: null,
    createdAt: '2024-02-15T00:00:00.000Z',
    updatedAt: '2024-02-15T00:00:00.000Z',
  },
];

describe('useActiveAllocationFilterStore', () => {
  beforeEach(() => {
    useActiveAllocationFilterStore.setState({
      ...INITIAL_ACTIVE_ALLOCATION_FILTER_STATE,
    });
  });

  it('should initialize with empty filter state', () => {
    const state = useActiveAllocationFilterStore.getState();
    expect(state.searchKeyword).toBe('');
    expect(state.selectedCategories).toEqual([]);
    expect(state.selectedDepartments).toEqual([]);
    expect(state.selectedLocations).toEqual([]);
    expect(state.costRange).toEqual({ min: null, max: null });
  });

  it('should toggle and set categories', () => {
    const store = useActiveAllocationFilterStore.getState();
    store.toggleCategory('Laptop');
    expect(useActiveAllocationFilterStore.getState().selectedCategories).toEqual(['Laptop']);

    store.toggleCategory('Mobile');
    expect(useActiveAllocationFilterStore.getState().selectedCategories).toEqual([
      'Laptop',
      'Mobile',
    ]);

    store.toggleCategory('Laptop');
    expect(useActiveAllocationFilterStore.getState().selectedCategories).toEqual(['Mobile']);

    store.setSelectedCategories(['Monitor', 'Accessories']);
    expect(useActiveAllocationFilterStore.getState().selectedCategories).toEqual([
      'Monitor',
      'Accessories',
    ]);
  });

  it('should toggle and set departments and locations', () => {
    const store = useActiveAllocationFilterStore.getState();
    store.toggleDepartment('IT');
    expect(useActiveAllocationFilterStore.getState().selectedDepartments).toEqual(['IT']);

    store.toggleLocation('Headquarters');
    expect(useActiveAllocationFilterStore.getState().selectedLocations).toEqual(['Headquarters']);

    store.resetFilters();
    expect(useActiveAllocationFilterStore.getState().selectedDepartments).toEqual([]);
    expect(useActiveAllocationFilterStore.getState().selectedLocations).toEqual([]);
  });

  it('should set cost range, min, and max cost', () => {
    const store = useActiveAllocationFilterStore.getState();
    store.setMinCost(500);
    expect(useActiveAllocationFilterStore.getState().costRange.min).toBe(500);

    store.setMaxCost(2000);
    expect(useActiveAllocationFilterStore.getState().costRange.max).toBe(2000);

    store.setCostRange({ min: null, max: null });
    expect(useActiveAllocationFilterStore.getState().costRange).toEqual({ min: null, max: null });
  });

  it('should filter active allocations strictly by status === Allocated and criteria', () => {
    // ast_3 is Available, so only ast_1 and ast_2 are Allocated
    const results = filterActiveAllocations(
      mockAssets,
      mockEmployees,
      INITIAL_ACTIVE_ALLOCATION_FILTER_STATE,
    );
    expect(results.length).toBe(2);
    expect(results.every((a) => a.status === 'Allocated')).toBe(true);

    // Filter by Category
    const laptopFiltered = filterActiveAllocations(mockAssets, mockEmployees, {
      ...INITIAL_ACTIVE_ALLOCATION_FILTER_STATE,
      selectedCategories: ['Laptop'],
    });
    expect(laptopFiltered.length).toBe(1);
    expect(laptopFiltered[0].assetId).toBe('A1001');

    // Filter by Location
    const nyFiltered = filterActiveAllocations(mockAssets, mockEmployees, {
      ...INITIAL_ACTIVE_ALLOCATION_FILTER_STATE,
      selectedLocations: ['New York Office'],
    });
    expect(nyFiltered.length).toBe(1);
    expect(nyFiltered[0].assetId).toBe('A1002');

    // Filter by Department
    const itFiltered = filterActiveAllocations(mockAssets, mockEmployees, {
      ...INITIAL_ACTIVE_ALLOCATION_FILTER_STATE,
      selectedDepartments: ['IT'],
    });
    expect(itFiltered.length).toBe(1);
    expect(itFiltered[0].assetId).toBe('A1001');
  });
});
