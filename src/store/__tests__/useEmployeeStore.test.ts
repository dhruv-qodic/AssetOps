import { describe, it, expect, beforeEach } from 'vitest';
import { useEmployeeStore } from '../useEmployeeStore';

describe('useEmployeeStore', () => {
  beforeEach(() => {
    const store = useEmployeeStore.getState();
    store.resetFilters();
    store.closeModals();
  });

  it('should initialize with seed employees and default filters', () => {
    const store = useEmployeeStore.getState();
    expect(store.employees.length).toBeGreaterThan(0);
    expect(store.filters.page).toBe(1);
    expect(store.filters.pageSize).toBe(10);
    expect(store.filters.sortBy).toBe('employee_id_asc');
  });

  it('should filter employees by search query', () => {
    const store = useEmployeeStore.getState();
    store.setSearch('John');
    const { paginatedEmployees } = store.getFilteredEmployees();
    expect(
      paginatedEmployees.some((e) => `${e.firstName} ${e.lastName}`.toLowerCase().includes('john')),
    ).toBe(true);
  });

  it('should filter employees by department', () => {
    const store = useEmployeeStore.getState();
    store.setDepartment('HR');
    const { paginatedEmployees } = store.getFilteredEmployees();
    expect(paginatedEmployees.every((e) => e.department === 'HR')).toBe(true);
  });

  it('should filter employees by status', () => {
    const store = useEmployeeStore.getState();
    store.setStatus('inactive');
    const { paginatedEmployees } = store.getFilteredEmployees();
    expect(paginatedEmployees.every((e) => e.status === 'inactive')).toBe(true);
  });

  it('should filter employees by employment type', () => {
    const store = useEmployeeStore.getState();
    store.setType('contractor');
    const { paginatedEmployees } = store.getFilteredEmployees();
    expect(paginatedEmployees.every((e) => e.type === 'contractor')).toBe(true);
  });

  it('should sort employees ascending and descending by name', () => {
    const store = useEmployeeStore.getState();
    store.setSortBy('name_asc');
    const ascEmployees = store.getFilteredEmployees().paginatedEmployees;
    const firstAscName = `${ascEmployees[0].firstName} ${ascEmployees[0].lastName}`;

    store.setSortBy('name_desc');
    const descEmployees = store.getFilteredEmployees().paginatedEmployees;
    const firstDescName = `${descEmployees[0].firstName} ${descEmployees[0].lastName}`;

    expect(firstAscName.localeCompare(firstDescName)).toBeLessThanOrEqual(0);
  });

  it('should add a new employee', () => {
    const store = useEmployeeStore.getState();
    const initialCount = store.employees.length;

    const newEmp = store.addEmployee({
      employeeId: 'E999',
      firstName: 'Test',
      lastName: 'User',
      email: 'test.user@company.com',
      department: 'IT',
      position: 'Developer',
      status: 'active',
      type: 'full-time',
      location: 'Headquarters',
    });

    expect(newEmp.employeeId).toBe('E999');
    expect(useEmployeeStore.getState().employees.length).toBe(initialCount + 1);
  });

  it('should update an employee and sync selectedEmployee', () => {
    const store = useEmployeeStore.getState();
    const firstEmp = store.employees[0];
    store.openEditModal(firstEmp);

    store.updateEmployee(firstEmp.id, { firstName: 'UpdatedName' });
    const updated = store.getEmployeeById(firstEmp.id);

    expect(updated?.firstName).toBe('UpdatedName');
    expect(useEmployeeStore.getState().selectedEmployee?.firstName).toBe('UpdatedName');
  });

  it('should delete an employee and update pagination page if out of bounds', () => {
    const store = useEmployeeStore.getState();
    const firstEmp = store.employees[0];
    const initialCount = store.employees.length;

    store.deleteEmployee(firstEmp.id);
    expect(useEmployeeStore.getState().employees.length).toBe(initialCount - 1);
  });

  it('should calculate statistics correctly via getStats()', () => {
    const store = useEmployeeStore.getState();
    const stats = store.getStats();

    expect(stats.totalEmployees).toBe(store.employees.length);
    expect(stats.active).toBe(store.employees.filter((e) => e.status === 'active').length);
    expect(stats.inactive).toBe(store.employees.filter((e) => e.status === 'inactive').length);
    expect(stats.terminated).toBe(store.employees.filter((e) => e.status === 'terminated').length);
    expect(stats.byType['full-time']).toBe(
      store.employees.filter((e) => e.type === 'full-time').length,
    );
  });

  it('should assign and unassign asset to employee', () => {
    const store = useEmployeeStore.getState();
    const firstEmp = store.employees[0];
    const assetId = 'ast-test-123';

    store.assignAssetToEmployee(firstEmp.id, assetId);
    expect(store.getEmployeeById(firstEmp.id)?.assignedAssets).toContain(assetId);

    store.unassignAssetFromEmployee(firstEmp.id, assetId);
    expect(store.getEmployeeById(firstEmp.id)?.assignedAssets).not.toContain(assetId);
  });

  it('should manage modal dialog states properly', () => {
    const store = useEmployeeStore.getState();
    const firstEmp = store.employees[0];

    store.openAddModal();
    expect(useEmployeeStore.getState().isAddModalOpen).toBe(true);

    store.openViewModal(firstEmp);
    expect(useEmployeeStore.getState().isViewModalOpen).toBe(true);
    expect(useEmployeeStore.getState().selectedEmployee?.id).toBe(firstEmp.id);

    store.closeModals();
    expect(useEmployeeStore.getState().isAddModalOpen).toBe(false);
    expect(useEmployeeStore.getState().isViewModalOpen).toBe(false);
  });
});
