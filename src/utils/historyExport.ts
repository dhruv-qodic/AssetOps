import * as XLSX from 'xlsx';
import type { HistoryRecord, HistoryCategory } from '@/types/activity';

export interface ExportHistoryOptions {
  filename?: string;
  sheetName?: string;
  category?: HistoryCategory;
}

export interface ExportHistoryResult {
  success: boolean;
  count: number;
  filename: string;
}

/**
 *@description Format timestamp into YYYY-MM-DD HH:mm:ss for clean and consistent Excel display
 * @param {string} timestamp - Timestamp to format
 * @returns {string} Formatted timestamp
 */
export function formatExportDateTime(timestamp?: string): string {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return timestamp;
  return date.toISOString().replace('T', ' ').substring(0, 19);
}

/**
 *@description Format metadata key-value pairs into readable string
 * @param {Record<string, unknown>} metadata - Metadata to format
 * @returns {string} Formatted metadata
 */
export function formatExportMetadata(metadata?: Record<string, unknown>): string {
  if (!metadata || typeof metadata !== 'object') return 'N/A';
  const entries = Object.entries(metadata).filter(
    ([, v]) => v !== undefined && v !== null && v !== '',
  );
  if (entries.length === 0) return 'N/A';
  return entries.map(([k, v]) => `${k}: ${String(v)}`).join('; ');
}

/**
 *@description Derive human-readable Previous and New values from history record and revertPayload
 * @param {HistoryRecord} record - History record to derive values from
 * @returns {{previousValue: string, newValue: string}} Previous and new values
 */
export function derivePreviousAndNewValues(record: HistoryRecord): {
  previousValue: string;
  newValue: string;
} {
  if (record.revertPayload) {
    const { actionKind, previousAsset, updatedAsset, previousEmployee, updatedEmployee } =
      record.revertPayload;

    if (actionKind === 'allocation') {
      const prevAssignee = previousAsset?.assignedTo?.name || 'Unassigned';
      const newAssignee = updatedAsset?.assignedTo?.name || record.actor.name || 'Assigned';
      return { previousValue: prevAssignee, newValue: newAssignee };
    }

    if (actionKind === 'deallocation') {
      const prevAssignee = previousAsset?.assignedTo?.name || 'Assigned';
      return { previousValue: prevAssignee, newValue: 'Unassigned' };
    }

    if (actionKind === 'status_update') {
      return {
        previousValue: previousAsset?.status || '-',
        newValue: updatedAsset?.status || '-',
      };
    }

    if (actionKind === 'asset_update') {
      const prevDesc = previousAsset ? `${previousAsset.name} (${previousAsset.status})` : '-';
      const newDesc = updatedAsset ? `${updatedAsset.name} (${updatedAsset.status})` : '-';
      return { previousValue: prevDesc, newValue: newDesc };
    }

    if (previousEmployee || updatedEmployee) {
      const prevEmp = previousEmployee
        ? `${previousEmployee.firstName} ${previousEmployee.lastName} (${previousEmployee.department})`
        : '-';
      const newEmp = updatedEmployee
        ? `${updatedEmployee.firstName} ${updatedEmployee.lastName} (${updatedEmployee.department})`
        : '-';
      return { previousValue: prevEmp, newValue: newEmp };
    }
  }

  // Action type heuristics
  const actionType = record.actionType.toLowerCase();
  if (actionType.includes('create') || actionType.includes('onboard')) {
    return { previousValue: 'None (New Record)', newValue: record.entityName || 'Created' };
  }
  if (
    actionType.includes('delete') ||
    actionType.includes('retire') ||
    actionType.includes('offboard')
  ) {
    return { previousValue: record.entityName || 'Active', newValue: 'Removed / Deleted' };
  }
  if (actionType.includes('mainten')) {
    return { previousValue: 'Available', newValue: 'Maintenance' };
  }

  return { previousValue: '-', newValue: '-' };
}

/**
 * Transforms history records into structured row objects with descriptive column headers
 */
export function generateHistoryExportRows(records: HistoryRecord[]) {
  return records.map((record) => {
    const { previousValue, newValue } = derivePreviousAndNewValues(record);
    const categoryCapitalized = record.category.charAt(0).toUpperCase() + record.category.slice(1);

    return {
      'History ID': record.id,
      'Date & Time': formatExportDateTime(record.timestamp),
      Category: categoryCapitalized,
      Action: record.action,
      'Action Type': record.actionType,
      Status: record.statusBadge?.label || record.badge || 'N/A',
      Title: record.title,
      Description: record.description,
      'Entity Type': record.entityType,
      'Entity ID': record.entityId,
      'Entity Name': record.entityName,
      Department: record.department || 'N/A',
      Location: record.location || 'N/A',
      'Performed By': record.actor.name,
      'User Email': record.actor.email,
      'User Role': record.actor.role,
      'Previous Value': previousValue,
      'New Value': newValue,
      'Additional Metadata': formatExportMetadata(record.metadata),
    };
  });
}

/**
 * Builds an XLSX WorkBook populated with structured history data and formatted column widths
 */
export function createHistoryExportWorkbook(
  records: HistoryRecord[],
  sheetName = 'History',
): XLSX.WorkBook {
  const rows = generateHistoryExportRows(records);
  const ws = XLSX.utils.json_to_sheet(rows);

  // Set column widths for optimal readability
  ws['!cols'] = [
    { wch: 16 }, // History ID
    { wch: 22 }, // Date & Time
    { wch: 14 }, // Category
    { wch: 24 }, // Action
    { wch: 22 }, // Action Type
    { wch: 14 }, // Status
    { wch: 36 }, // Title
    { wch: 48 }, // Description
    { wch: 14 }, // Entity Type
    { wch: 16 }, // Entity ID
    { wch: 28 }, // Entity Name
    { wch: 18 }, // Department
    { wch: 20 }, // Location
    { wch: 20 }, // Performed By
    { wch: 26 }, // User Email
    { wch: 18 }, // User Role
    { wch: 26 }, // Previous Value
    { wch: 26 }, // New Value
    { wch: 42 }, // Additional Metadata
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  return wb;
}

/**
 * Generates an Excel workbook from the provided History records and triggers a browser file download
 */
export function exportHistoryToExcel(
  records: HistoryRecord[],
  options: ExportHistoryOptions = {},
): ExportHistoryResult {
  if (records.length === 0) {
    throw new Error('No history records available to export with the current filter criteria.');
  }

  const dateStr = new Date().toISOString().split('T')[0];
  const filename = options.filename || `AssetOps_History_${dateStr}.xlsx`;
  const sheetName = options.sheetName || 'History';

  const wb = createHistoryExportWorkbook(records, sheetName);

  // Write array buffer and trigger download in browser
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' }) as ArrayBuffer;
  const blob = new Blob([wbout], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return {
    success: true,
    count: records.length,
    filename,
  };
}
