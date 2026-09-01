/**
 * Employee Management Type Definitions
 * Based on the AssetOps Employee Management Specification
 */

export type EmployeeStatus = 'active' | 'inactive' | 'terminated';
export type EmployeeType = 'full-time' | 'contractor' | 'intern';

export type EmployeeDepartment =
    | 'IT'
    | 'HR'
    | 'Sales'
    | 'Marketing'
    | 'Finance'
    | (string & {});

export type EmployeeLocation =
    | 'Headquarters'
    | 'New York Office'
    | 'San Francisco'
    | 'London Office'
    | 'Remote'
    | (string & {});

export type EmployeeSortOption =
    | 'recently_added'
    | 'name_asc'
    | 'name_desc'
    | 'employee_id_asc'
    | 'employee_id_desc'
    | 'date_created_desc';

export interface Employee {
    id: string;
    employeeId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    department: string;
    position: string;
    status: EmployeeStatus;
    type: EmployeeType;
    location: string;
    assignedAssets: string[];
    avatar?: string;
    createdAt: string;
    updatedAt: string;
}

export interface EmployeeFilters {
    search: string;
    status: EmployeeStatus | 'All';
    department: string | 'All';
    location: string | 'All';
    sortBy: EmployeeSortOption;
    page: number;
    pageSize: number;
}

export interface CreateEmployeeInput {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    department: string;
    position: string;
    status: EmployeeStatus;
    type: EmployeeType;
    location: string;
    avatar?: string;
    employeeId?: string;
    name?: string;
}

export type UpdateEmployeeInput = Partial<CreateEmployeeInput> & {
    id: string;
};

export type EmployeeFormData = CreateEmployeeInput;

export interface EmployeeStats {
    totalEmployees: number;
    active: number;
    inactive: number;
    terminated: number;
    byDepartment: Record<string, number>;
    byType: Record<string, number>;
    byLocation: Record<string, number>;
}

export interface EmployeeHistory {
    date: string;
    action: string;
    details: string;
    by: string;
}

export interface AssignedAsset {
    assetId: string;
    assetName: string;
    assetCategory: string;
    assignedDate: string;
    expectedReturnDate?: string;
    status: string;
    location: string;
}

export interface AssignedEmployee {
    id: string;
    name: string;
    employeeId?: string;
    email?: string;
    avatar?: string;
    department?: string;
    position?: string;
    assignedDate?: string;
    expectedReturnDate?: string;
    status?: EmployeeStatus;
}

export interface DepartmentStats {
    department: string;
    totalEmployees: number;
    active: number;
    inactive: number;
    terminated: number;
    percentage: string;
}

export interface TypeDistribution {
    type: EmployeeType;
    totalEmployees: number;
    percentage: string;
}
