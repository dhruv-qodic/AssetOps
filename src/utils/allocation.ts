import type { Asset } from '@/types/asset';
import type { Employee } from '@/types/employee';

/**
 * Derives an allocation reference ID code from an asset ID or index.
 * Example: 'A1005' -> 'AL1005', or index 0 -> 'AL1001'
 *
 * @param { { assetId?: string } | null } asset - Asset record with optional assetId
 * @param {number} index - Fallback numerical index (0-based)
 * @param {string} prefix - Prefix to prepend (default: 'AL')
 * @returns {string} Formatted allocation ID string
 */
export function getAllocationId(
  asset?: { assetId?: string } | null,
  index = 0,
  prefix = 'AL',
): string {
  if (asset?.assetId) {
    const numOnly = asset.assetId.replace(/\D/g, '');
    if (numOnly) return `${prefix}${numOnly}`;
    return `${prefix}${asset.assetId.replace('A', '')}`;
  }
  return `${prefix}${1001 + index}`;
}

/**
 * Resolves the matching Employee object from an array of employees for a given Asset.
 * Matches by employee id, employeeId code, or full name.
 *
 * @param {Asset} asset - Target Asset item
 * @param {Employee[]} employees - List of all Employee items
 * @returns {Employee | undefined} Matching Employee or undefined
 */
export function resolveAssignedEmployee(asset: Asset, employees: Employee[]): Employee | undefined {
  if (!asset.assignedTo) return undefined;
  const { id, employeeId, name } = asset.assignedTo;

  return employees.find((e) => {
    if (id && e.id === id) return true;
    if (employeeId && e.employeeId === employeeId) return true;
    if (name && `${e.firstName} ${e.lastName}`.trim().toLowerCase() === name.trim().toLowerCase()) {
      return true;
    }
    return false;
  });
}

/**
 * Resolves the display employee full name from an asset or resolved employee record.
 *
 * @param {Asset} asset - Asset record
 * @param {Employee} assignedEmp - Resolved employee record if available
 * @param {string} fallback - Fallback string if unassigned
 * @returns {string} Full name string
 */
export function resolveEmployeeName(
  asset: Asset,
  assignedEmp?: Employee,
  fallback = 'Unassigned Staff',
): string {
  if (assignedEmp) {
    return `${assignedEmp.firstName} ${assignedEmp.lastName}`.trim();
  }
  return asset.assignedTo?.name || fallback;
}

/**
 * Resolves the department from an asset or resolved employee record.
 *
 * @param {Asset} asset - Asset record
 * @param {Employee} assignedEmp - Resolved employee record if available
 * @param {string} fallback - Fallback string if not found
 * @returns {string} Department string
 */
export function resolveDepartment(
  asset: Asset,
  assignedEmp?: Employee,
  fallback = 'Unassigned',
): string {
  return assignedEmp?.department || asset.assignedTo?.department || fallback;
}

/**
 * Resolves the employee identification code from an asset or resolved employee record.
 *
 * @param {Asset} asset - Asset record
 * @param {Employee} assignedEmp - Resolved employee record if available
 * @param {string} fallback - Fallback string if not found
 * @returns {string} Employee ID code string
 */
export function resolveEmployeeCode(
  asset: Asset,
  assignedEmp?: Employee,
  fallback = 'EMP-0000',
): string {
  return assignedEmp?.employeeId || asset.assignedTo?.employeeId || fallback;
}
