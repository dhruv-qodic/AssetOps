import { describe, it, expect } from 'vitest';
import {
  normalizeHeader,
  parseDateValue,
  parseCostValue,
  parseSpecificationsValue,
  matchCategory,
  matchStatus,
  parseSingleFile,
  validateAssetBatch,
  calculateValidationSummary,
  downloadSampleTemplate,
  type RawFileRow,
  type ParsedAssetRecord,
  type RowValidationStatus,
} from '@/utils/assetImport';
import type { Asset } from '@/types/asset';
import * as XLSX from 'xlsx';

describe('Asset Import Utilities & Parser', () => {
  describe('normalizeHeader', () => {
    it('should map various header styles to canonical keys', () => {
      expect(normalizeHeader('Asset ID')).toBe('assetId');
      expect(normalizeHeader('asset_id')).toBe('assetId');
      expect(normalizeHeader('ASSETID')).toBe('assetId');
      expect(normalizeHeader('tag')).toBe('assetId');
      expect(normalizeHeader('Device Name')).toBe('name');
      expect(normalizeHeader('Asset Name')).toBe('name');
      expect(normalizeHeader('serial_number')).toBe('serialNumber');
      expect(normalizeHeader('Serial Number')).toBe('serialNumber');
      expect(normalizeHeader('S/N')).toBe('serialNumber');
      expect(normalizeHeader('Purchase Date')).toBe('purchaseDate');
      expect(normalizeHeader('Cost')).toBe('purchaseCost');
      expect(normalizeHeader('Warranty Expiry')).toBe('warrantyExpiry');
      expect(normalizeHeader('Technical Specifications')).toBe('specifications');
      expect(normalizeHeader('Category')).toBe('category');
      expect(normalizeHeader('Location')).toBe('location');
    });

    it('should clean leading/trailing whitespace and symbols', () => {
      expect(normalizeHeader(' * Asset ID * ')).toBe('assetId');
      expect(normalizeHeader('## Serial Number')).toBe('serialNumber');
    });
  });

  describe('parseDateValue', () => {
    it('should parse ISO YYYY-MM-DD dates', () => {
      expect(parseDateValue('2024-03-15')).toBe('2024-03-15');
    });

    it('should parse MM/DD/YYYY dates', () => {
      expect(parseDateValue('03/15/2024')).toBe('2024-03-15');
      expect(parseDateValue('3/5/2024')).toBe('2024-03-05');
    });

    it('should parse DD-MM-YYYY dates', () => {
      expect(parseDateValue('15-03-2024')).toBe('2024-03-15');
    });

    it('should parse Excel date serial numbers', () => {
      // Excel serial 45350 is approx 2024-02-29
      const parsed = parseDateValue(45350);
      expect(parsed).toMatch(/^2024-/);
    });

    it('should return null for empty or invalid values', () => {
      expect(parseDateValue('')).toBeNull();
      expect(parseDateValue(null)).toBeNull();
      expect(parseDateValue(undefined)).toBeNull();
      expect(parseDateValue('invalid-date-string')).toBeNull();
    });
  });

  describe('parseCostValue', () => {
    it('should parse numbers directly', () => {
      expect(parseCostValue(1299.5)).toEqual({ cost: 1299.5 });
      expect(parseCostValue(0)).toEqual({ cost: 0 });
    });

    it('should parse formatted currency strings', () => {
      expect(parseCostValue('$1,299.99')).toEqual({ cost: 1299.99 });
      expect(parseCostValue('  2,500.00 ')).toEqual({ cost: 2500 });
      expect(parseCostValue('€450')).toEqual({ cost: 450 });
    });

    it('should return error for negative or invalid numbers', () => {
      expect(parseCostValue(-50).error).toBeDefined();
      expect(parseCostValue('abc').error).toBeDefined();
    });

    it('should return undefined cost for empty values', () => {
      expect(parseCostValue('')).toEqual({ cost: undefined });
      expect(parseCostValue(null)).toEqual({ cost: undefined });
    });
  });

  describe('parseSpecificationsValue', () => {
    it('should parse JSON strings', () => {
      const jsonStr = JSON.stringify({ RAM: '32GB', Storage: '1TB' });
      expect(parseSpecificationsValue(jsonStr)).toEqual({ RAM: '32GB', Storage: '1TB' });
    });

    it('should parse key-value delimited strings', () => {
      const kvStr = 'RAM: 16GB, Storage: 512GB, CPU: Apple M3';
      expect(parseSpecificationsValue(kvStr)).toEqual({
        RAM: '16GB',
        Storage: '512GB',
        CPU: 'Apple M3',
      });
    });

    it('should parse object dictionaries', () => {
      expect(parseSpecificationsValue({ Screen: '4K', Refresh: '60Hz' })).toEqual({
        Screen: '4K',
        Refresh: '60Hz',
      });
    });

    it('should return undefined for empty values', () => {
      expect(parseSpecificationsValue('')).toBeUndefined();
      expect(parseSpecificationsValue(null)).toBeUndefined();
    });
  });

  describe('matchCategory & matchStatus', () => {
    it('should match categories case-insensitively', () => {
      expect(matchCategory('laptop')).toBe('Laptop');
      expect(matchCategory('MONITOR')).toBe('Monitor');
      expect(matchCategory('Accessories')).toBe('Accessories');
      expect(matchCategory('invalid_category')).toBeNull();
    });

    it('should match statuses case-insensitively', () => {
      expect(matchStatus('available')).toBe('Available');
      expect(matchStatus('ALLOCATED')).toBe('Allocated');
      expect(matchStatus('maintenance')).toBe('Maintenance');
      expect(matchStatus('invalid_status')).toBeNull();
    });
  });

  describe('parseSingleFile', () => {
    it('should reject unsupported file extensions', async () => {
      const file = new File(['dummy'], 'image.png', { type: 'image/png' });
      const res = await parseSingleFile(file);
      expect(res.error).toContain('Unsupported file format');
      expect(res.rows).toHaveLength(0);
    });

    it('should reject empty files', async () => {
      const file = new File([], 'empty.csv', { type: 'text/csv' });
      const res = await parseSingleFile(file);
      expect(res.error).toContain('File is empty');
      expect(res.rows).toHaveLength(0);
    });

    it('should parse CSV file content', async () => {
      const csvData =
        'Asset ID,Asset Name,Category,Status,Location,Serial Number,Purchase Date,Purchase Cost\n' +
        'A2001,MacBook Air,Laptop,Available,Headquarters,SN-TEST-01,2024-01-01,999';
      const file = new File([csvData], 'assets.csv', { type: 'text/csv' });
      const res = await parseSingleFile(file);

      expect(res.error).toBeUndefined();
      expect(res.format).toBe('csv');
      expect(res.rows).toHaveLength(1);
      expect(res.rows[0]['Asset ID']).toBe('A2001');
      expect(res.rows[0]['Asset Name']).toBe('MacBook Air');
    });

    it('should parse Excel workbook content', async () => {
      const ws = XLSX.utils.json_to_sheet([
        {
          'Asset ID': 'A2002',
          'Asset Name': 'Dell Precision',
          Category: 'Desktop',
          Status: 'Available',
          Location: 'New York Office',
          'Serial Number': 'SN-TEST-02',
          'Purchase Date': '2024-02-01',
          'Purchase Cost': 1499,
        },
      ]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' }) as ArrayBuffer;

      const file = new File([buffer], 'assets.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const res = await parseSingleFile(file);

      expect(res.error).toBeUndefined();
      expect(res.format).toBe('excel');
      expect(res.rows).toHaveLength(1);
      expect(res.rows[0]['Asset ID']).toBe('A2002');
    });
  });

  describe('validateAssetBatch', () => {
    const existingAssets: Asset[] = [
      {
        id: 'ast_1',
        assetId: 'A1001',
        name: 'Existing Laptop',
        category: 'Laptop',
        status: 'Available',
        location: 'Headquarters',
        serialNumber: 'SN-EXISTING-01',
        purchaseDate: '2023-01-01',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      },
    ];

    it('should mark completely valid rows as ready', () => {
      const rawRows: RawFileRow[] = [
        {
          fileId: 'f1',
          fileName: 'batch.csv',
          fileRowNumber: 2,
          rawRow: {
            'Asset ID': 'A3001',
            'Asset Name': 'Valid Monitor',
            Category: 'Monitor',
            Status: 'Available',
            Location: 'London Office',
            'Serial Number': 'SN-NEW-99',
            'Purchase Date': '2024-01-10',
            'Purchase Cost': 399,
          },
        },
      ];

      const records = validateAssetBatch(rawRows, existingAssets);
      expect(records).toHaveLength(1);
      expect(records[0].status).toBe('ready');
      expect(records[0].errors).toHaveLength(0);
      expect(records[0].parsedData.assetId).toBe('A3001');
      expect(records[0].parsedData.category).toBe('Monitor');
    });

    it('should collect all errors for invalid rows', () => {
      const rawRows: RawFileRow[] = [
        {
          fileId: 'f1',
          fileName: 'invalid.csv',
          fileRowNumber: 2,
          rawRow: {
            'Asset ID': 'A$Invalid!ID',
            'Asset Name': '', // missing
            Category: 'UnknownCat', // invalid enum
            Status: 'UnknownStatus', // invalid enum
            Location: '', // missing
            'Serial Number': '', // missing
            'Purchase Date': 'not-a-date', // invalid date
            'Purchase Cost': -500, // negative cost
          },
        },
      ];

      const records = validateAssetBatch(rawRows, existingAssets);
      expect(records[0].status).toBe('invalid');
      expect(records[0].errors.length).toBeGreaterThan(4);
      const fields = records[0].errors.map((e) => e.field);
      expect(fields).toContain('assetId');
      expect(fields).toContain('name');
      expect(fields).toContain('category');
      expect(fields).toContain('location');
      expect(fields).toContain('serialNumber');
      expect(fields).toContain('purchaseDate');
      expect(fields).toContain('purchaseCost');
    });

    it('should detect duplicates against existing store assets', () => {
      const rawRows: RawFileRow[] = [
        {
          fileId: 'f1',
          fileName: 'dup_store.csv',
          fileRowNumber: 2,
          rawRow: {
            'Asset ID': 'A1001', // duplicate store assetId
            'Asset Name': 'New Device',
            Category: 'Laptop',
            Status: 'Available',
            Location: 'Headquarters',
            'Serial Number': 'SN-UNIQUE-123',
            'Purchase Date': '2024-01-10',
          },
        },
        {
          fileId: 'f1',
          fileName: 'dup_store.csv',
          fileRowNumber: 3,
          rawRow: {
            'Asset ID': 'A9999',
            'Asset Name': 'Another Device',
            Category: 'Laptop',
            Status: 'Available',
            Location: 'Headquarters',
            'Serial Number': 'SN-EXISTING-01', // duplicate store serial
            'Purchase Date': '2024-01-10',
          },
        },
      ];

      const records = validateAssetBatch(rawRows, existingAssets);
      expect(records[0].status).toBe('duplicate');
      expect(records[0].duplicateReasons[0]).toContain('already exists in AssetOps store');
      expect(records[1].status).toBe('duplicate');
      expect(records[1].duplicateReasons[0]).toContain('already exists in AssetOps store');
    });

    it('should detect internal batch duplicates across rows and files', () => {
      const rawRows: RawFileRow[] = [
        {
          fileId: 'f1',
          fileName: 'file1.csv',
          fileRowNumber: 2,
          rawRow: {
            'Asset ID': 'A5001',
            'Asset Name': 'Device 1',
            Category: 'Laptop',
            Status: 'Available',
            Location: 'Headquarters',
            'Serial Number': 'SN-BATCH-DUP',
            'Purchase Date': '2024-01-10',
          },
        },
        {
          fileId: 'f2',
          fileName: 'file2.xlsx',
          fileRowNumber: 2,
          rawRow: {
            'Asset ID': 'A5001', // duplicate assetId
            'Asset Name': 'Device 2',
            Category: 'Laptop',
            Status: 'Available',
            Location: 'Headquarters',
            'Serial Number': 'SN-BATCH-DUP', // duplicate serial
            'Purchase Date': '2024-01-10',
          },
        },
      ];

      const records = validateAssetBatch(rawRows, existingAssets);
      expect(records[0].status).toBe('ready'); // First one passes
      expect(records[1].status).toBe('duplicate'); // Second one flagged as duplicate
      expect(records[1].duplicateReasons).toHaveLength(2);
      expect(records[1].duplicateReasons[0]).toContain('file1.csv');
    });
  });

  describe('calculateValidationSummary', () => {
    const createMockRecord = (status: RowValidationStatus): ParsedAssetRecord => ({
      tempId: 'mock_id',
      fileId: 'f1',
      fileName: 'f1.csv',
      fileRowNumber: 1,
      rawRow: {},
      parsedData: {},
      status,
      errors: [],
      duplicateReasons: [],
    });

    it('should compute exact counts', () => {
      const summary = calculateValidationSummary(
        [
          createMockRecord('ready'),
          createMockRecord('ready'),
          createMockRecord('invalid'),
          createMockRecord('duplicate'),
        ],
        2,
      );

      expect(summary.totalRows).toBe(4);
      expect(summary.readyRows).toBe(2);
      expect(summary.invalidRows).toBe(1);
      expect(summary.duplicateRows).toBe(1);
      expect(summary.fileCount).toBe(2);
    });
  });

  describe('downloadSampleTemplate', () => {
    it('should generate template without error', () => {
      expect(() => downloadSampleTemplate('csv')).not.toThrow();
      expect(() => downloadSampleTemplate('xlsx')).not.toThrow();
    });
  });
});
