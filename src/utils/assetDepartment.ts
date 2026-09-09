import type { Asset } from '@/types/asset';
import type { Employee } from '@/types/employee';

/**
 * Resolves the department of an asset by checking:
 * 1. Direct asset assignedTo department
 * 2. Assigned employee matching in the employee store
 * 3. Default fallback to 'Unassigned'
 */
export function getAssetDepartment(asset: Asset, employees: Employee[]): string {
  if (asset.assignedTo?.department) {
    return asset.assignedTo.department;
  }

  if (asset.assignedTo?.id || asset.assignedTo?.employeeId || asset.assignedTo?.name) {
    const assignedEmp = employees.find(
      (e) =>
        (asset.assignedTo?.id && e.id === asset.assignedTo.id) ||
        (asset.assignedTo?.employeeId && e.employeeId === asset.assignedTo.employeeId) ||
        (asset.assignedTo?.name &&
          `${e.firstName} ${e.lastName}`.trim().toLowerCase() ===
            asset.assignedTo.name.trim().toLowerCase())
    );

    if (assignedEmp?.department) {
      return assignedEmp.department;
    }
  }

  return 'Unassigned';
}
