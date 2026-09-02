import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Employee,
  EmployeeStatus,
  EmployeeType,
  EmployeeSortOption,
  EmployeeFilters,
  CreateEmployeeInput,
  UpdateEmployeeInput,
  EmployeeStats,
} from '@/types/employee';
import { DEFAULT_EMPLOYEE_FILTERS } from '@/constans/employee.constants';
import { MOCK_EMPLOYEES } from '@/mocks/seed/employees';

interface EmployeeStoreState {
  employees: Employee[];
  filters: EmployeeFilters;
  isLoading: boolean;
  selectedEmployee: Employee | null;

  // Modal dialog states
  isAddModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  isViewModalOpen: boolean;
  isImportModalOpen: boolean;

  // Filter & Pagination actions
  setSearch: (search: string) => void;
  setStatus: (status: EmployeeStatus | 'All') => void;
  setType: (type: EmployeeType | 'All') => void;
  setDepartment: (department: string | 'All') => void;
  setLocation: (location: string | 'All') => void;
  setSortBy: (sortBy: EmployeeSortOption) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  resetFilters: () => void;

  // CRUD actions
  addEmployee: (input: CreateEmployeeInput) => Employee;
  updateEmployee: (id: string, updates: Partial<UpdateEmployeeInput>) => boolean;
  deleteEmployee: (id: string) => boolean;
  bulkAddEmployees: (inputs: CreateEmployeeInput[]) => number;

  // Asset allocation helpers
  assignAssetToEmployee: (employeeId: string, assetId: string) => boolean;
  unassignAssetFromEmployee: (employeeId: string, assetId: string) => boolean;

  // Query helpers
  getFilteredEmployees: () => {
    paginatedEmployees: Employee[];
    totalFiltered: number;
    totalPages: number;
    startIndex: number;
    endIndex: number;
  };
  getStats: () => EmployeeStats;
  getEmployeeById: (id: string) => Employee | undefined;

  // Modal actions
  openAddModal: () => void;
  openEditModal: (employee: Employee) => void;
  openDeleteModal: (employee: Employee) => void;
  openViewModal: (employee: Employee) => void;
  openImportModal: () => void;
  closeModals: () => void;
}

export const useEmployeeStore = create<EmployeeStoreState>()(
  persist(
    (set, get) => ({
      employees: MOCK_EMPLOYEES,
      filters: DEFAULT_EMPLOYEE_FILTERS,
      isLoading: false,
      selectedEmployee: null,

      isAddModalOpen: false,
      isEditModalOpen: false,
      isDeleteModalOpen: false,
      isViewModalOpen: false,
      isImportModalOpen: false,

      // Filter Actions
      setSearch: (search) =>
        set((state) => ({
          filters: { ...state.filters, search, page: 1 },
        })),

      setStatus: (status) =>
        set((state) => ({
          filters: { ...state.filters, status, page: 1 },
        })),

      setType: (type) =>
        set((state) => ({
          filters: { ...state.filters, type, page: 1 },
        })),

      setDepartment: (department) =>
        set((state) => ({
          filters: { ...state.filters, department, page: 1 },
        })),

      setLocation: (location) =>
        set((state) => ({
          filters: { ...state.filters, location, page: 1 },
        })),

      setSortBy: (sortBy) =>
        set((state) => ({
          filters: { ...state.filters, sortBy, page: 1 },
        })),

      setPage: (page) =>
        set((state) => ({
          filters: { ...state.filters, page },
        })),

      setPageSize: (pageSize) =>
        set((state) => ({
          filters: { ...state.filters, pageSize, page: 1 },
        })),

      resetFilters: () =>
        set(() => ({
          filters: DEFAULT_EMPLOYEE_FILTERS,
        })),

      // CRUD Actions
      addEmployee: (input) => {
        const now = new Date().toISOString();
        const firstName = input.firstName || input.name?.split(' ')[0] || 'Employee';
        const lastName =
          input.lastName || input.name?.split(' ').slice(1).join(' ') || '';

        const newEmpIdNum = get().employees.length + 1001;
        const employeeId = input.employeeId || `EMP-${newEmpIdNum}`;

        const newEmployee: Employee = {
          id: `emp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          employeeId,
          firstName,
          lastName,
          email: input.email,
          phone: input.phone || '',
          department: input.department,
          position: input.position,
          status: input.status,
          type: input.type,
          location: input.location,
          avatar:
            input.avatar ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
              `${firstName}${lastName}`
            )}`,
          assignedAssets: [],
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          employees: [newEmployee, ...state.employees],
        }));

        return newEmployee;
      },

      updateEmployee: (id, updates) => {
        let updated = false;
        set((state) => {
          const newEmployees = state.employees.map((employee) => {
            if (employee.id === id) {
              updated = true;
              return {
                ...employee,
                ...updates,
                updatedAt: new Date().toISOString(),
              };
            }
            return employee;
          });
          return { employees: newEmployees };
        });
        return updated;
      },

      deleteEmployee: (id) => {
        let deleted = false;
        set((state) => {
          const initialLength = state.employees.length;
          const filtered = state.employees.filter((e) => e.id !== id);
          deleted = filtered.length !== initialLength;
          return {
            employees: filtered,
            selectedEmployee:
              state.selectedEmployee?.id === id ? null : state.selectedEmployee,
          };
        });
        return deleted;
      },

      bulkAddEmployees: (newItems) => {
        const now = new Date().toISOString();
        const formatted: Employee[] = newItems.map((item, idx) => {
          const firstName = item.firstName || item.name?.split(' ')[0] || 'Employee';
          const lastName =
            item.lastName || item.name?.split(' ').slice(1).join(' ') || '';
          return {
            id: `emp_${Date.now()}_${idx}`,
            employeeId: item.employeeId || `EMP-${1000 + idx}`,
            firstName,
            lastName,
            email: item.email,
            phone: item.phone || '',
            department: item.department,
            position: item.position,
            status: item.status,
            type: item.type,
            location: item.location,
            avatar:
              item.avatar ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                `${firstName}${lastName}`
              )}`,
            assignedAssets: [],
            createdAt: now,
            updatedAt: now,
          };
        });

        set((state) => ({
          employees: [...formatted, ...state.employees],
        }));

        return formatted.length;
      },

      assignAssetToEmployee: (employeeId, assetId) => {
        let success = false;
        set((state) => {
          const newEmployees = state.employees.map((emp) => {
            if (emp.id === employeeId || emp.employeeId === employeeId) {
              if (!emp.assignedAssets.includes(assetId)) {
                success = true;
                return {
                  ...emp,
                  assignedAssets: [...emp.assignedAssets, assetId],
                  updatedAt: new Date().toISOString(),
                };
              }
            }
            return emp;
          });
          return { employees: newEmployees };
        });
        return success;
      },

      unassignAssetFromEmployee: (employeeId, assetId) => {
        let success = false;
        set((state) => {
          const newEmployees = state.employees.map((emp) => {
            if (emp.id === employeeId || emp.employeeId === employeeId) {
              if (emp.assignedAssets.includes(assetId)) {
                success = true;
                return {
                  ...emp,
                  assignedAssets: emp.assignedAssets.filter((a) => a !== assetId),
                  updatedAt: new Date().toISOString(),
                };
              }
            }
            return emp;
          });
          return { employees: newEmployees };
        });
        return success;
      },

      // Query Helpers
      getFilteredEmployees: () => {
        const { employees, filters } = get();
        const { search, status, type, department, location, sortBy, page, pageSize } =
          filters;

        let filtered = [...employees];

        // 1. Text Search (name, employeeId, email, position, department)
        if (search.trim()) {
          const query = search.trim().toLowerCase();
          filtered = filtered.filter((emp) => {
            const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
            const matchName = fullName.includes(query);
            const matchId = emp.employeeId.toLowerCase().includes(query);
            const matchEmail = emp.email.toLowerCase().includes(query);
            const matchPosition = emp.position.toLowerCase().includes(query);
            const matchDept = emp.department.toLowerCase().includes(query);

            return (
              matchName || matchId || matchEmail || matchPosition || matchDept
            );
          });
        }

        // 2. Status Filter
        if (status !== 'All') {
          filtered = filtered.filter((e) => e.status === status);
        }

        // 3. Type Filter
        if (type && type !== 'All') {
          filtered = filtered.filter((e) => e.type === type);
        }

        // 3. Department Filter
        if (department !== 'All') {
          filtered = filtered.filter((e) => e.department === department);
        }

        // 4. Location Filter
        if (location !== 'All') {
          filtered = filtered.filter((e) => e.location === location);
        }

        // 5. Sorting
        filtered.sort((a, b) => {
          const nameA = `${a.firstName} ${a.lastName}`;
          const nameB = `${b.firstName} ${b.lastName}`;

          switch (sortBy) {
            case 'name_asc':
              return nameA.localeCompare(nameB);
            case 'name_desc':
              return nameB.localeCompare(nameA);
            case 'employee_id_asc':
              return a.employeeId.localeCompare(b.employeeId, undefined, {
                numeric: true,
              });
            case 'employee_id_desc':
              return b.employeeId.localeCompare(a.employeeId, undefined, {
                numeric: true,
              });
            case 'date_created_desc':
              return (
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              );
            case 'recently_added':
            default:
              return (
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              );
          }
        });

        const totalFiltered = filtered.length;
        const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
        const safePage = Math.min(page, totalPages);
        const startIndex = (safePage - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, totalFiltered);
        const paginatedEmployees = filtered.slice(startIndex, endIndex);

        return {
          paginatedEmployees,
          totalFiltered,
          totalPages,
          startIndex: totalFiltered === 0 ? 0 : startIndex + 1,
          endIndex,
        };
      },

      getStats: () => {
        const { employees } = get();
        const byDepartment: Record<string, number> = {};
        const byType: Record<string, number> = {};
        const byLocation: Record<string, number> = {};

        employees.forEach((emp) => {
          byDepartment[emp.department] = (byDepartment[emp.department] || 0) + 1;
          byType[emp.type] = (byType[emp.type] || 0) + 1;
          byLocation[emp.location] = (byLocation[emp.location] || 0) + 1;
        });

        return {
          totalEmployees: employees.length,
          active: employees.filter((e) => e.status === 'active').length,
          inactive: employees.filter((e) => e.status === 'inactive').length,
          terminated: employees.filter((e) => e.status === 'terminated').length,
          byDepartment,
          byType,
          byLocation,
        };
      },

      getEmployeeById: (id) => {
        return get().employees.find(
          (e) => e.id === id || e.employeeId === id
        );
      },

      // Modal Actions
      openAddModal: () => set({ isAddModalOpen: true, selectedEmployee: null }),
      openEditModal: (employee) =>
        set({ isEditModalOpen: true, selectedEmployee: employee }),
      openDeleteModal: (employee) =>
        set({ isDeleteModalOpen: true, selectedEmployee: employee }),
      openViewModal: (employee) =>
        set({ isViewModalOpen: true, selectedEmployee: employee }),
      openImportModal: () => set({ isImportModalOpen: true }),
      closeModals: () =>
        set({
          isAddModalOpen: false,
          isEditModalOpen: false,
          isDeleteModalOpen: false,
          isViewModalOpen: false,
          isImportModalOpen: false,
          selectedEmployee: null,
        }),
    }),
    {
      name: 'assetops_employees_store_v1',
      partialize: (state) => ({
        employees: state.employees,
      }),
    }
  )
);
