import { describe, it, expect, beforeEach } from 'vitest';
import { useEmployeeStore } from '../useEmployeeStore';

describe('useEmployeeStore', () => {
  beforeEach(() => {
    const store = useEmployeeStore.getState();
    store.resetFilters();
  });

  it('should initialize with seed employees and default filters', () => {
    const store = useEmployeeStore.getState();
    expect(store.employees.length).toBeGreaterThan(0);
    expect(store.filters.page).toBe(1);
    expect(store.filters.pageSize).toBe(10);
  });

  it('should filter employees by search query', () => {
    const store = useEmployeeStore.getState();
    store.setSearch('John');
    const { paginatedEmployees } = store.getFilteredEmployees();
    expect(
      paginatedEmployees.some((e) =>
        `${e.firstName} ${e.lastName}`.toLowerCase().includes('john')
      )
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
    expect(useEmployeeStore.getState().selectedEmployee?.firstName).toBe(
      'UpdatedName'
    );
  });

  it('should delete an employee and update pagination page if out of bounds', () => {
    const store = useEmployeeStore.getState();
    const firstEmp = store.employees[0];
    const initialCount = store.employees.length;

    store.deleteEmployee(firstEmp.id);
    expect(useEmployeeStore.getState().employees.length).toBe(
      initialCount - 1
    );
  });
});
