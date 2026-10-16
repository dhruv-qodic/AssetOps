import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as XLSX from 'xlsx';
import {
  formatExportDateTime,
  formatExportMetadata,
  derivePreviousAndNewValues,
  generateHistoryExportRows,
  createHistoryExportWorkbook,
  exportHistoryToExcel,
} from '@/utils/historyExport';
import type { HistoryRecord } from '@/types/activity';

describe('History Export Utilities (historyExport.ts)', () => {
  const mockRecords: HistoryRecord[] = [
    {
      id: 'HIST-1001',
      category: 'asset',
      action: 'New Asset Added',
      actionType: 'asset_created',
      title: 'Registered MacBook Pro 16"',
      description: 'Added laptop to IT hardware inventory.',
      entityName: 'MacBook Pro 16"',
      entityId: 'AST-5001',
      entityType: 'Asset',
      actor: {
        name: 'Sarah Connor',
        email: 'sarah.connor@assetops.com',
        role: 'IT Administrator',
        avatarInitials: 'SC',
      },
      department: 'Engineering',
      location: 'San Francisco HQ',
      timestamp: '2026-10-09T10:30:00.000Z',
      statusBadge: {
        label: 'Created',
        variant: 'emerald',
      },
      metadata: {
        Category: 'Laptop',
        Cost: 2499,
        Serial: 'SN-MBP-9988',
      },
    },
    {
      id: 'HIST-1002',
      category: 'allocation',
      action: 'Hardware Allocated',
      actionType: 'allocation_assigned',
      title: 'Allocated MacBook Pro to John Doe',
      description: 'Assigned MacBook to John Doe.',
      entityName: 'MacBook Pro 16"',
      entityId: 'AST-5001',
      entityType: 'Allocation',
      actor: {
        name: 'John Doe',
        email: 'john.doe@assetops.com',
        role: 'Senior Developer',
        avatarInitials: 'JD',
      },
      department: 'Engineering',
      location: 'San Francisco HQ',
      timestamp: '2026-10-09T11:45:00.000Z',
      statusBadge: {
        label: 'Allocated',
        variant: 'indigo',
      },
      revertPayload: {
        actionKind: 'allocation',
        assetId: 'ast_1',
        previousAsset: {
          id: 'ast_1',
          name: 'MacBook Pro 16"',
          assetId: 'AST-5001',
          category: 'Laptop',
          status: 'Available',
          location: 'San Francisco HQ',
          assignedTo: null,
          purchaseDate: '2026-01-01',
          serialNumber: 'SN-1001',
          createdAt: '2026-01-01T00:00:00Z',
          updatedAt: '2026-01-01T00:00:00Z',
        },
        updatedAsset: {
          id: 'ast_1',
          name: 'MacBook Pro 16"',
          assetId: 'AST-5001',
          category: 'Laptop',
          status: 'Allocated',
          location: 'San Francisco HQ',
          assignedTo: {
            id: 'emp_1',
            name: 'John Doe',
            email: 'john.doe@assetops.com',
            department: 'Engineering',
            assignedDate: '2026-10-09',
          },
          purchaseDate: '2026-01-01',
          serialNumber: 'SN-1001',
          createdAt: '2026-01-01T00:00:00Z',
          updatedAt: '2026-01-01T00:00:00Z',
        },
      },
    },
    {
      id: 'HIST-1003',
      category: 'employee',
      action: 'Profile Updated',
      actionType: 'employee_updated',
      title: 'Updated Employee Profile',
      description: 'Updated profile for Alice Smith.',
      entityName: 'Alice Smith',
      entityId: 'EMP-2001',
      entityType: 'Employee',
      actor: {
        name: 'HR Lead',
        email: 'hr@assetops.com',
        role: 'HR Lead',
        avatarInitials: 'HR',
      },
      department: 'Product',
      location: 'New York Branch',
      timestamp: '2026-10-09T12:15:00.000Z',
      revertPayload: {
        actionKind: 'employee_assign',
        previousEmployee: {
          id: 'emp_2',
          employeeId: 'EMP-2001',
          firstName: 'Alice',
          lastName: 'Smith',
          email: 'alice@assetops.com',
          phone: '555-0101',
          department: 'Design',
          position: 'Designer',
          status: 'active',
          type: 'full-time',
          location: 'New York Branch',
          assignedAssets: [],
          createdAt: '2026-01-01T00:00:00Z',
          updatedAt: '2026-01-01T00:00:00Z',
        },
        updatedEmployee: {
          id: 'emp_2',
          employeeId: 'EMP-2001',
          firstName: 'Alice',
          lastName: 'Smith',
          email: 'alice@assetops.com',
          phone: '555-0101',
          department: 'Product',
          position: 'Product Designer',
          status: 'active',
          type: 'full-time',
          location: 'New York Branch',
          assignedAssets: [],
          createdAt: '2026-01-01T00:00:00Z',
          updatedAt: '2026-01-01T00:00:00Z',
        },
      },
    },
  ];

  describe('formatExportDateTime', () => {
    it('should format valid ISO timestamp to YYYY-MM-DD HH:mm:ss format', () => {
      const formatted = formatExportDateTime('2026-10-09T10:30:00.000Z');
      expect(formatted).toBe('2026-10-09 10:30:00');
    });

    it('should return N/A for empty or missing timestamps', () => {
      expect(formatExportDateTime('')).toBe('N/A');
      expect(formatExportDateTime(undefined)).toBe('N/A');
    });

    it('should return the raw string if parsing produces an invalid date', () => {
      expect(formatExportDateTime('invalid-date-string')).toBe('invalid-date-string');
    });
  });

  describe('formatExportMetadata', () => {
    it('should format key-value pairs into semi-colon separated string', () => {
      const formatted = formatExportMetadata({
        Category: 'Laptop',
        Cost: '$2,499',
        Serial: 'SN-001',
      });
      expect(formatted).toContain('Category: Laptop');
      expect(formatted).toContain('Cost: $2,499');
      expect(formatted).toContain('Serial: SN-001');
    });

    it('should return N/A when metadata is undefined, null, or empty', () => {
      expect(formatExportMetadata(undefined)).toBe('N/A');
      expect(formatExportMetadata({})).toBe('N/A');
    });
  });

  describe('derivePreviousAndNewValues', () => {
    it('should extract previous and updated assignee for allocation actions', () => {
      const result = derivePreviousAndNewValues(mockRecords[1]);
      expect(result.previousValue).toBe('Unassigned');
      expect(result.newValue).toBe('John Doe');
    });

    it('should extract previous and updated employee values when available', () => {
      const result = derivePreviousAndNewValues(mockRecords[2]);
      expect(result.previousValue).toBe('Alice Smith (Design)');
      expect(result.newValue).toBe('Alice Smith (Product)');
    });

    it('should derive default heuristic values for new creation actions', () => {
      const result = derivePreviousAndNewValues(mockRecords[0]);
      expect(result.previousValue).toBe('None (New Record)');
      expect(result.newValue).toBe('MacBook Pro 16"');
    });

    it('should handle status update revertPayloads', () => {
      const record: HistoryRecord = {
        id: 'HIST-STATUS',
        category: 'asset',
        action: 'Status Changed',
        actionType: 'asset_updated',
        title: 'Status Updated',
        description: 'Status changed to Maintenance',
        entityName: 'Dell XPS',
        entityId: 'AST-100',
        entityType: 'Asset',
        actor: { name: 'Admin', email: 'admin@test.com', role: 'Admin', avatarInitials: 'AD' },
        timestamp: '2026-10-09T10:00:00Z',
        revertPayload: {
          actionKind: 'status_update',
          previousAsset: {
            id: '1',
            name: 'Dell XPS',
            assetId: 'AST-100',
            category: 'Laptop',
            status: 'Available',
            location: 'HQ',
            purchaseDate: '2026-01-01',
            serialNumber: 'SN-DELL-1',
            createdAt: '2026-01-01T00:00:00Z',
            updatedAt: '2026-01-01T00:00:00Z',
          },
          updatedAsset: {
            id: '1',
            name: 'Dell XPS',
            assetId: 'AST-100',
            category: 'Laptop',
            status: 'Maintenance',
            location: 'HQ',
            purchaseDate: '2026-01-01',
            serialNumber: 'SN-DELL-1',
            createdAt: '2026-01-01T00:00:00Z',
            updatedAt: '2026-01-01T00:00:00Z',
          },
        },
      };

      const result = derivePreviousAndNewValues(record);
      expect(result.previousValue).toBe('Available');
      expect(result.newValue).toBe('Maintenance');
    });

    it('should handle deallocation actionKinds', () => {
      const record: HistoryRecord = {
        id: 'HIST-DEALLOC',
        category: 'allocation',
        action: 'Returned',
        actionType: 'allocation_returned',
        title: 'Hardware Returned',
        description: 'Returned hardware',
        entityName: 'Dell XPS',
        entityId: 'AST-100',
        entityType: 'Allocation',
        actor: { name: 'Admin', email: 'admin@test.com', role: 'Admin', avatarInitials: 'AD' },
        timestamp: '2026-10-09T10:00:00Z',
        revertPayload: {
          actionKind: 'deallocation',
          previousAsset: {
            id: '1',
            name: 'Dell XPS',
            assetId: 'AST-100',
            category: 'Laptop',
            status: 'Allocated',
            location: 'HQ',
            purchaseDate: '2026-01-01',
            serialNumber: 'SN-DELL-2',
            createdAt: '2026-01-01T00:00:00Z',
            updatedAt: '2026-01-01T00:00:00Z',
            assignedTo: {
              id: 'emp-1',
              name: 'John Doe',
              department: 'IT',
              assignedDate: '2026-01-01',
            },
          },
          updatedAsset: {
            id: '1',
            name: 'Dell XPS',
            assetId: 'AST-100',
            category: 'Laptop',
            status: 'Available',
            location: 'HQ',
            purchaseDate: '2026-01-01',
            serialNumber: 'SN-DELL-2',
            createdAt: '2026-01-01T00:00:00Z',
            updatedAt: '2026-01-01T00:00:00Z',
            assignedTo: null,
          },
        },
      };

      const result = derivePreviousAndNewValues(record);
      expect(result.previousValue).toBe('John Doe');
      expect(result.newValue).toBe('Unassigned');
    });
  });

  describe('generateHistoryExportRows & createHistoryExportWorkbook', () => {
    it('should generate all required columns matching History data schema', () => {
      const rows = generateHistoryExportRows(mockRecords);
      expect(rows.length).toBe(3);

      const firstRow = rows[0];
      expect(firstRow['History ID']).toBe('HIST-1001');
      expect(firstRow['Date & Time']).toBe('2026-10-09 10:30:00');
      expect(firstRow['Category']).toBe('Asset');
      expect(firstRow['Action']).toBe('New Asset Added');
      expect(firstRow['Action Type']).toBe('asset_created');
      expect(firstRow['Status']).toBe('Created');
      expect(firstRow['Title']).toBe('Registered MacBook Pro 16"');
      expect(firstRow['Description']).toBe('Added laptop to IT hardware inventory.');
      expect(firstRow['Entity Type']).toBe('Asset');
      expect(firstRow['Entity ID']).toBe('AST-5001');
      expect(firstRow['Entity Name']).toBe('MacBook Pro 16"');
      expect(firstRow['Department']).toBe('Engineering');
      expect(firstRow['Location']).toBe('San Francisco HQ');
      expect(firstRow['Performed By']).toBe('Sarah Connor');
      expect(firstRow['User Email']).toBe('sarah.connor@assetops.com');
      expect(firstRow['User Role']).toBe('IT Administrator');
      expect(firstRow['Previous Value']).toBe('None (New Record)');
      expect(firstRow['New Value']).toBe('MacBook Pro 16"');
      expect(firstRow['Additional Metadata']).toContain('Category: Laptop');
    });

    it('should create a valid XLSX WorkBook with proper worksheet name and structure', () => {
      const wb = createHistoryExportWorkbook(mockRecords, 'Activity History');
      expect(wb.SheetNames).toContain('Activity History');

      const ws = wb.Sheets['Activity History'];
      expect(ws).toBeDefined();

      const parsedJson = XLSX.utils.sheet_to_json(ws);
      expect(parsedJson.length).toBe(3);
      expect((parsedJson[0] as Record<string, unknown>)['History ID']).toBe('HIST-1001');
      expect((parsedJson[1] as Record<string, unknown>)['History ID']).toBe('HIST-1002');
      expect((parsedJson[2] as Record<string, unknown>)['History ID']).toBe('HIST-1003');
    });

    it('should handle optional / missing fields gracefully without throwing', () => {
      const minimalRecord: HistoryRecord = {
        id: 'HIST-MIN',
        category: 'asset',
        action: 'Minimal Action',
        actionType: 'asset_updated',
        title: 'Minimal Title',
        description: 'Minimal Desc',
        entityName: 'Minimal Asset',
        entityId: 'MIN-01',
        entityType: 'Asset',
        actor: { name: '', email: '', role: '', avatarInitials: '' },
        timestamp: '',
      };

      const rows = generateHistoryExportRows([minimalRecord]);
      expect(rows.length).toBe(1);
      expect(rows[0]['History ID']).toBe('HIST-MIN');
      expect(rows[0]['Department']).toBe('N/A');
      expect(rows[0]['Location']).toBe('N/A');
      expect(rows[0]['Additional Metadata']).toBe('N/A');
    });
  });

  describe('exportHistoryToExcel', () => {
    beforeEach(() => {
      vi.spyOn(window.URL, 'createObjectURL').mockReturnValue('blob:mock-url');
      vi.spyOn(window.URL, 'revokeObjectURL').mockReturnValue();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should throw an error when exporting an empty list of records', () => {
      expect(() => exportHistoryToExcel([])).toThrow(
        'No history records available to export with the current filter criteria.',
      );
    });

    it('should generate workbook, create object URL, and trigger a download link click', () => {
      const revokeSpy = vi.spyOn(window.URL, 'revokeObjectURL').mockReturnValue();
      const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
      const appendChildSpy = vi.spyOn(document.body, 'appendChild');
      const removeChildSpy = vi.spyOn(document.body, 'removeChild');

      const result = exportHistoryToExcel(mockRecords, {
        filename: 'Custom_History_2026.xlsx',
      });

      expect(result.success).toBe(true);
      expect(result.count).toBe(3);
      expect(result.filename).toBe('Custom_History_2026.xlsx');
      expect(clickSpy).toHaveBeenCalledTimes(1);
      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
      expect(revokeSpy).toHaveBeenCalledWith('blob:mock-url');
    });

    it('should generate default descriptive filename AssetOps_History_YYYY-MM-DD.xlsx when filename is omitted', () => {
      vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

      const result = exportHistoryToExcel(mockRecords);
      const today = new Date().toISOString().split('T')[0];
      expect(result.filename).toBe(`AssetOps_History_${today}.xlsx`);
    });
  });
});
