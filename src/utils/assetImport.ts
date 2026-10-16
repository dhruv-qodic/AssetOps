import * as XLSX from 'xlsx';
import type { Asset, AssetCategory, AssetStatus, CreateAssetInput } from '@/types/asset';
import { ASSET_CATEGORIES, ASSET_STATUSES } from '@/constant/asset.constants';

export interface UploadedFileInfo {
  id: string;
  file: File;
  name: string;
  size: number;
  type: 'csv' | 'excel' | 'unknown';
  status: 'idle' | 'parsing' | 'success' | 'error';
  errorMessage?: string;
  rowCount: number;
}

export interface ParsedRowError {
  field: string;
  message: string;
}

export type RowValidationStatus = 'ready' | 'invalid' | 'duplicate';

export interface ParsedAssetRecord {
  tempId: string;
  fileId: string;
  fileName: string;
  fileRowNumber: number;
  rawRow: Record<string, unknown>;
  parsedData: Partial<CreateAssetInput>;
  status: RowValidationStatus;
  errors: ParsedRowError[];
  duplicateReasons: string[];
}

export interface ValidationSummary {
  totalRows: number;
  readyRows: number;
  invalidRows: number;
  duplicateRows: number;
  fileCount: number;
}

/**
 * @description Generate a safe unique identifier in all environments
 * @param {string} prefix - Prefix to be added to the id
 * @returns {string} Unique identifier
 */
export function generateId(prefix = 'id'): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    try {
      return `${prefix}_${crypto.randomUUID().replace(/-/g, '').slice(0, 8)}`;
    } catch {
      // fallback
    }
  }
  return `${prefix}_${Math.random().toString(36).substring(2, 10)}`;
}

/**
 * @description Standard column aliases mapped to canonical CreateAssetInput keys
 * @returns {Object} Mapping of column aliases to CreateAssetInput keys
 */
const HEADER_MAPPINGS: Partial<Record<string, keyof CreateAssetInput>> = {
  // assetId
  assetid: 'assetId',
  asset_id: 'assetId',
  'asset id': 'assetId',
  id: 'assetId',
  tag: 'assetId',
  assettag: 'assetId',
  'asset tag': 'assetId',
  barcode: 'assetId',

  // name
  name: 'name',
  assetname: 'name',
  asset_name: 'name',
  'asset name': 'name',
  title: 'name',
  devicename: 'name',
  'device name': 'name',
  hardwarename: 'name',
  'hardware name': 'name',
  itemname: 'name',
  'item name': 'name',

  // model
  model: 'model',
  modelname: 'model',
  model_name: 'model',
  'model name': 'model',
  variant: 'model',
  version: 'model',

  // category
  category: 'category',
  assetcategory: 'category',
  asset_category: 'category',
  'asset category': 'category',
  type: 'category',
  assettype: 'category',
  'asset type': 'category',
  classification: 'category',

  // status
  status: 'status',
  assetstatus: 'status',
  asset_status: 'status',
  'asset status': 'status',
  state: 'status',
  lifecyclestatus: 'status',
  'lifecycle status': 'status',

  // location
  location: 'location',
  assetlocation: 'location',
  asset_location: 'location',
  'asset location': 'location',
  office: 'location',
  site: 'location',
  branch: 'location',
  workplace: 'location',
  'office location': 'location',

  // serialNumber
  serialnumber: 'serialNumber',
  serial_number: 'serialNumber',
  'serial number': 'serialNumber',
  serial: 'serialNumber',
  serialno: 'serialNumber',
  serial_no: 'serialNumber',
  'serial no': 'serialNumber',
  sn: 'serialNumber',
  's/n': 'serialNumber',

  // purchaseDate
  purchasedate: 'purchaseDate',
  purchase_date: 'purchaseDate',
  'purchase date': 'purchaseDate',
  acquisitiondate: 'purchaseDate',
  'acquisition date': 'purchaseDate',
  datepurchased: 'purchaseDate',
  'date purchased': 'purchaseDate',

  // purchaseCost
  purchasecost: 'purchaseCost',
  purchase_cost: 'purchaseCost',
  'purchase cost': 'purchaseCost',
  cost: 'purchaseCost',
  price: 'purchaseCost',
  amount: 'purchaseCost',
  value: 'purchaseCost',
  'acquisition cost': 'purchaseCost',

  // warrantyExpiry
  warrantyexpiry: 'warrantyExpiry',
  warranty_expiry: 'warrantyExpiry',
  'warranty expiry': 'warrantyExpiry',
  warrantydate: 'warrantyExpiry',
  'warranty date': 'warrantyExpiry',
  warrantyexpiration: 'warrantyExpiry',
  'warranty expiration': 'warrantyExpiry',
  warrantyend: 'warrantyExpiry',
  'warranty end': 'warrantyExpiry',

  // notes
  notes: 'notes',
  note: 'notes',
  remarks: 'notes',
  remark: 'notes',
  comment: 'notes',
  comments: 'notes',
  description: 'notes',

  // specifications
  specifications: 'specifications',
  specs: 'specifications',
  specification: 'specifications',
  attributes: 'specifications',
  'technical specs': 'specifications',
  'technical specifications': 'specifications',
};

/**
 *@description Normalizes an arbitrary header string to a canonical key if recognized
 *@param {string} rawHeader - Raw header string
 *@returns {string} Normalized header string
 */
export function normalizeHeader(rawHeader: string): string {
  const clean = rawHeader
    .toLowerCase()
    .trim()
    .replace(/^[*_#\s]+|[*_#\s]+$/g, '');
  const mappedClean = HEADER_MAPPINGS[clean];
  if (mappedClean) {
    return mappedClean;
  }
  const alphanumeric = clean.replace(/[^a-z0-9]/g, '');
  const mappedAlphanumeric = HEADER_MAPPINGS[alphanumeric];
  if (mappedAlphanumeric) {
    return mappedAlphanumeric;
  }
  return clean;
}

/**
 *@description Parse date values from Excel serial numbers, Date objects, or string representations
 *@param {unknown} value - Value to parse
 *@returns {string | null} Parsed date value
 */
export function parseDateValue(value: unknown): string | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  if (value instanceof Date && !isNaN(value.getTime())) {
    return value.toISOString().split('T')[0];
  }

  if (typeof value === 'number' && !isNaN(value)) {
    // Excel date serial number (e.g. 45350)
    // Excel base date starts at 1899-12-30 (due to 1900 leap year bug)
    if (value > 0 && value < 2958465) {
      const utcDays = Math.floor(value - 25569);
      const utcValue = utcDays * 86400 * 1000;
      const dateInfo = new Date(utcValue);
      if (!isNaN(dateInfo.getTime())) {
        return dateInfo.toISOString().split('T')[0];
      }
    }
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;

    // ISO format YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      const d = new Date(trimmed);
      if (!isNaN(d.getTime())) return trimmed;
    }

    // YYYY/MM/DD
    if (/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(trimmed)) {
      const parts = trimmed.split('/');
      const formatted = `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
      const d = new Date(formatted);
      if (!isNaN(d.getTime())) return formatted;
    }

    // MM/DD/YYYY or M/D/YYYY
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(trimmed)) {
      const parts = trimmed.split('/');
      const formatted = `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
      const d = new Date(formatted);
      if (!isNaN(d.getTime())) return formatted;
    }

    // DD-MM-YYYY
    if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(trimmed)) {
      const parts = trimmed.split('-');
      const formatted = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      const d = new Date(formatted);
      if (!isNaN(d.getTime())) return formatted;
    }

    const parsed = Date.parse(trimmed);
    if (!isNaN(parsed)) {
      const d = new Date(parsed);
      return d.toISOString().split('T')[0];
    }
  }

  return null;
}

/**
 *@description Parse numeric purchase costs from numbers or formatted strings (e.g. "$1,299.00")
 *@param {unknown} value - Value to parse
 *@returns {Object} Object with cost and error
 */
export function parseCostValue(value: unknown): { cost?: number; error?: string } {
  if (value === null || value === undefined || value === '') {
    return { cost: undefined };
  }

  if (typeof value === 'number') {
    if (isNaN(value) || value < 0) {
      return { error: 'Cost must be a positive number' };
    }
    return { cost: Math.round(value * 100) / 100 };
  }

  if (typeof value === 'string') {
    const cleanStr = value.replace(/[$€£₹,\s]/g, '').trim();
    if (!cleanStr) return { cost: undefined };

    const parsedNum = Number(cleanStr);
    if (isNaN(parsedNum) || parsedNum < 0) {
      return { error: 'Cost must be a valid non-negative number' };
    }
    return { cost: Math.round(parsedNum * 100) / 100 };
  }

  return { error: 'Invalid cost format' };
}

/**
 *@description Parse specifications from JSON string or key-value format ("RAM: 16GB, Storage: 512GB")
 *@param {unknown} value - Value to parse
 *@returns {Object} Object with specifications
 */
export function parseSpecificationsValue(value: unknown): Record<string, string> | undefined {
  if (!value) return undefined;

  if (typeof value === 'object' && !Array.isArray(value)) {
    const res: Record<string, string> = {};
    for (const [k, v] of Object.entries(value)) {
      if (typeof v === 'string' || typeof v === 'number') {
        res[k.trim()] = String(v).trim();
      }
    }
    return Object.keys(res).length > 0 ? res : undefined;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return undefined;

    // Try parsing JSON
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const parsed: unknown = JSON.parse(trimmed);
        if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
          const res: Record<string, string> = {};
          for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
            if (typeof v === 'string' || typeof v === 'number') {
              res[k.trim()] = String(v).trim();
            }
          }
          return Object.keys(res).length > 0 ? res : undefined;
        }
      } catch {
        // Not valid JSON, continue to key-value delimiter parser
      }
    }

    // Split by comma, semicolon, or newline
    const pairs = trimmed.split(/[,;\n]+/);
    const specs: Record<string, string> = {};
    for (const pair of pairs) {
      const separatorIdx = pair.search(/[:=]/);
      if (separatorIdx !== -1) {
        const k = pair.substring(0, separatorIdx).trim();
        const v = pair.substring(separatorIdx + 1).trim();
        if (k && v) {
          specs[k] = v;
        }
      }
    }
    return Object.keys(specs).length > 0 ? specs : undefined;
  }

  return undefined;
}

/**
 *@description Case-insensitive match for category enum
 *@param {unknown} raw - Raw value to match
 *@returns {AssetCategory | null} Matched category or null
 */
export function matchCategory(raw: unknown): AssetCategory | null {
  if (typeof raw !== 'string') return null;
  const lower = raw.trim().toLowerCase();
  const found = ASSET_CATEGORIES.find((c) => c.toLowerCase() === lower);
  return found || null;
}

/**
 *@description Case-insensitive match for status enum
 *@param {unknown} raw - Raw value to match
 *@returns {AssetStatus | null} Matched status or null
 */
export function matchStatus(raw: unknown): AssetStatus | null {
  if (typeof raw !== 'string') return null;
  const lower = raw.trim().toLowerCase();
  const found = ASSET_STATUSES.find((s) => s.toLowerCase() === lower);
  return found || null;
}

/**
 *@description Read file as text with fallback support
 *@param {File} file - File to read
 *@returns {Promise<string>} Promise that resolves to the text content of the file
 */
export async function readFileAsText(file: File): Promise<string> {
  if (typeof file.text === 'function') {
    try {
      const t = await file.text();
      return t;
    } catch {
      // fallback to FileReader
    }
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(typeof reader.result === 'string' ? reader.result : '');
    };
    reader.onerror = () => reject(reader.error || new Error('Failed to read file as text'));
    reader.readAsText(file);
  });
}

/**
 *@description Read file as ArrayBuffer with fallback support
 *@param {File} file - File to read
 *@returns {Promise<ArrayBuffer>} Promise that resolves to the ArrayBuffer content of the file
 */
export async function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  if (typeof file.arrayBuffer === 'function') {
    try {
      const buf = await file.arrayBuffer();
      if (buf.byteLength > 0) {
        return buf;
      }
    } catch {
      // fallback to FileReader
    }
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result);
      } else {
        const encoder = new TextEncoder();
        const str = typeof reader.result === 'string' ? reader.result : '';
        resolve(encoder.encode(str).buffer);
      }
    };
    reader.onerror = () => reject(reader.error || new Error('Failed to read file buffer'));
    reader.readAsArrayBuffer(file);
  });
}

function toCleanString(val: unknown): string {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val.trim();
  if (typeof val === 'number' || typeof val === 'boolean') return String(val).trim();
  return '';
}

/**
 *@description Parse an individual uploaded file (CSV or Excel) into raw row objects
 *@param {File} file - File to parse
 *@returns {Promise<Object>} Promise that resolves to an object with rows, error, and format
 */
export async function parseSingleFile(file: File): Promise<{
  rows: Record<string, unknown>[];
  error?: string;
  format: 'csv' | 'excel' | 'unknown';
}> {
  const fileName = file.name.toLowerCase();
  const isCsv = fileName.endsWith('.csv');
  const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');

  if (!isCsv && !isExcel) {
    return {
      rows: [],
      error: 'Unsupported file format. Please upload .csv, .xlsx, or .xls files.',
      format: 'unknown',
    };
  }

  const format = isCsv ? 'csv' : 'excel';

  try {
    let workbook: XLSX.WorkBook;

    if (isCsv) {
      const text = await readFileAsText(file);
      if (!text.trim()) {
        return {
          rows: [],
          error: 'File is empty (0 bytes).',
          format,
        };
      }
      workbook = XLSX.read(text, {
        type: 'string',
        cellDates: true,
        raw: false,
      });
    } else {
      const buffer = await readFileAsArrayBuffer(file);
      if (buffer.byteLength === 0) {
        return {
          rows: [],
          error: 'File contains no readable data.',
          format,
        };
      }
      workbook = XLSX.read(buffer, {
        type: 'array',
        cellDates: true,
        raw: false,
      });
    }

    if (workbook.SheetNames.length === 0) {
      return {
        rows: [],
        error: 'Workbook contains no sheets.',
        format,
      };
    }

    const firstSheetName = workbook.SheetNames[0];
    const sheetsMap = workbook.Sheets as Record<string, XLSX.WorkSheet | undefined>;
    const sheet = sheetsMap[firstSheetName];

    if (!sheet) {
      return {
        rows: [],
        error: 'Sheet is empty.',
        format,
      };
    }

    const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
      defval: '',
      blankrows: false,
    });

    // Filter out completely blank rows
    const nonBlankRows = rawRows.filter((row) =>
      Object.values(row).some((v) => {
        if (v === null || v === undefined) return false;
        if (typeof v === 'string') return v.trim() !== '';
        return typeof v === 'number' || typeof v === 'boolean';
      }),
    );

    if (nonBlankRows.length === 0) {
      return {
        rows: [],
        error: 'No data rows found in sheet.',
        format,
      };
    }

    return {
      rows: nonBlankRows,
      format,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to parse file';
    return {
      rows: [],
      error: `File parsing error: ${msg}`,
      format,
    };
  }
}

export interface RawFileRow {
  fileId: string;
  fileName: string;
  fileRowNumber: number;
  rawRow: Record<string, unknown>;
}

/**
 *@description Validates a batch of parsed rows from one or more files against AssetOps schemas and duplicate rules
 *@param {RawFileRow[]} allRawRows - Array of raw file rows
 *@param {Asset[]} existingAssets - Array of existing assets
 *@returns {ParsedAssetRecord[]} Parsed asset records with validation results
 */
export function validateAssetBatch(
  allRawRows: RawFileRow[],
  existingAssets: Asset[],
): ParsedAssetRecord[] {
  // Pre-index existing asset store for duplicate checks
  const existingIdMap = new Map<string, Asset>();
  const existingSerialMap = new Map<string, Asset>();

  for (const asset of existingAssets) {
    if (asset.assetId) {
      existingIdMap.set(asset.assetId.trim().toLowerCase(), asset);
    }
    if (asset.serialNumber) {
      existingSerialMap.set(asset.serialNumber.trim().toLowerCase(), asset);
    }
  }

  // Track batch-level IDs and serials to detect internal batch duplicates
  const batchIdMap = new Map<string, { fileName: string; rowNumber: number }>();
  const batchSerialMap = new Map<string, { fileName: string; rowNumber: number }>();

  return allRawRows.map((item, index) => {
    const { fileId, fileName, fileRowNumber, rawRow } = item;
    const errors: ParsedRowError[] = [];
    const duplicateReasons: string[] = [];

    // Map row headers to normalized keys
    const normalizedRow: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(rawRow)) {
      const canonicalKey = normalizeHeader(key);
      normalizedRow[canonicalKey] = val;
    }

    // 1. Asset ID
    const assetId = toCleanString(normalizedRow.assetId);
    if (!assetId) {
      errors.push({ field: 'assetId', message: 'Asset ID is required' });
    } else {
      if (!/^[a-zA-Z0-9_-]+$/.test(assetId)) {
        errors.push({
          field: 'assetId',
          message: 'Asset ID can only contain letters, numbers, hyphens, and underscores',
        });
      }
    }

    // 2. Name
    const name = toCleanString(normalizedRow.name);
    if (!name) {
      errors.push({ field: 'name', message: 'Asset name is required' });
    } else if (name.length < 2) {
      errors.push({ field: 'name', message: 'Asset name must be at least 2 characters' });
    }

    // 3. Model
    const model = toCleanString(normalizedRow.model) || undefined;

    // 4. Category
    const rawCategory = normalizedRow.category;
    const category = matchCategory(rawCategory);
    if (!category) {
      errors.push({
        field: 'category',
        message: `Invalid category "${toCleanString(rawCategory)}". Valid options: ${ASSET_CATEGORIES.join(', ')}`,
      });
    }

    // 5. Status
    const rawStatus = normalizedRow.status;
    const status = matchStatus(rawStatus) || 'Available';
    if (rawStatus && !matchStatus(rawStatus)) {
      errors.push({
        field: 'status',
        message: `Invalid status "${toCleanString(rawStatus)}". Valid options: ${ASSET_STATUSES.join(', ')}`,
      });
    }

    // 6. Location
    const location = toCleanString(normalizedRow.location);
    if (!location) {
      errors.push({ field: 'location', message: 'Location is required' });
    }

    // 7. Serial Number
    const serialNumber = toCleanString(normalizedRow.serialNumber);
    if (!serialNumber) {
      errors.push({ field: 'serialNumber', message: 'Serial number is required' });
    }

    // 8. Purchase Date
    const rawPurchaseDate = normalizedRow.purchaseDate;
    const purchaseDate = parseDateValue(rawPurchaseDate);
    if (!purchaseDate) {
      errors.push({
        field: 'purchaseDate',
        message: 'Purchase date is required and must be a valid date (YYYY-MM-DD)',
      });
    }

    // 9. Purchase Cost
    const costResult = parseCostValue(normalizedRow.purchaseCost);
    if (costResult.error) {
      errors.push({ field: 'purchaseCost', message: costResult.error });
    }
    const purchaseCost = costResult.cost;

    // 10. Warranty Expiry
    let warrantyExpiry: string | undefined = undefined;
    if (normalizedRow.warrantyExpiry) {
      const parsedWarranty = parseDateValue(normalizedRow.warrantyExpiry);
      if (!parsedWarranty) {
        errors.push({
          field: 'warrantyExpiry',
          message: 'Warranty expiry must be a valid date (YYYY-MM-DD)',
        });
      } else {
        warrantyExpiry = parsedWarranty;
      }
    }

    // 11. Notes
    const notes = toCleanString(normalizedRow.notes) || undefined;

    // 12. Specifications
    const specifications = parseSpecificationsValue(normalizedRow.specifications);

    // --- Duplicate Checks ---
    if (assetId) {
      const idKey = assetId.toLowerCase();
      // Check against existing store
      const exist = existingIdMap.get(idKey);
      if (exist) {
        duplicateReasons.push(
          `Asset ID "${assetId}" already exists in AssetOps store (${exist.name})`,
        );
      }
      // Check within uploaded batch
      const prev = batchIdMap.get(idKey);
      if (prev) {
        duplicateReasons.push(
          `Duplicate Asset ID "${assetId}" also found in ${prev.fileName} (Row ${prev.rowNumber})`,
        );
      } else {
        batchIdMap.set(idKey, { fileName, rowNumber: fileRowNumber });
      }
    }

    if (serialNumber) {
      const serialKey = serialNumber.toLowerCase();
      // Check against existing store
      const exist = existingSerialMap.get(serialKey);
      if (exist) {
        duplicateReasons.push(
          `Serial Number "${serialNumber}" already exists in AssetOps store (${exist.name} - ${exist.assetId})`,
        );
      }
      // Check within uploaded batch
      const prev = batchSerialMap.get(serialKey);
      if (prev) {
        duplicateReasons.push(
          `Duplicate Serial Number "${serialNumber}" also found in ${prev.fileName} (Row ${prev.rowNumber})`,
        );
      } else {
        batchSerialMap.set(serialKey, { fileName, rowNumber: fileRowNumber });
      }
    }

    // Determine final status
    let rowStatus: RowValidationStatus = 'ready';
    if (errors.length > 0) {
      rowStatus = 'invalid';
    } else if (duplicateReasons.length > 0) {
      rowStatus = 'duplicate';
    }

    const parsedData: Partial<CreateAssetInput> = {
      assetId,
      name,
      model,
      category: category || undefined,
      status,
      location,
      serialNumber,
      purchaseDate: purchaseDate || undefined,
      purchaseCost,
      warrantyExpiry,
      notes,
      specifications,
    };

    return {
      tempId: generateId(`import_${fileId}_${index}`),
      fileId,
      fileName,
      fileRowNumber,
      rawRow,
      parsedData,
      status: rowStatus,
      errors,
      duplicateReasons,
    };
  });
}

/**
 * @description Calculates a summary of the batch validation results
 * @param {ParsedAssetRecord[]} records - Parsed asset records
 * @param {number} fileCount - Number of files uploaded
 * @returns {ValidationSummary} Validation summary object
 */
export function calculateValidationSummary(
  records: ParsedAssetRecord[],
  fileCount: number,
): ValidationSummary {
  let readyRows = 0;
  let invalidRows = 0;
  let duplicateRows = 0;

  for (const record of records) {
    if (record.status === 'ready') {
      readyRows++;
    } else if (record.status === 'duplicate') {
      duplicateRows++;
    } else {
      invalidRows++;
    }
  }

  return {
    totalRows: records.length,
    readyRows,
    invalidRows,
    duplicateRows,
    fileCount,
  };
}

/**
 *@description Sample template definition for asset imports
 */
export const SAMPLE_ASSET_IMPORT_ROWS: Array<Record<string, string | number>> = [
  {
    'Asset ID': 'A1021',
    'Asset Name': 'Apple MacBook Pro 16"',
    Category: 'Laptop',
    Status: 'Available',
    Location: 'Headquarters',
    'Serial Number': 'SN-APL-99201',
    'Purchase Date': '2024-01-15',
    'Purchase Cost': 2499.0,
    Model: 'M3 Max 36GB 1TB',
    'Warranty Expiry': '2027-01-15',
    Notes: 'Engineering design workstation',
    Specifications: 'RAM: 36GB, Storage: 1TB SSD, Processor: Apple M3 Max',
  },
  {
    'Asset ID': 'A1022',
    'Asset Name': 'Dell UltraSharp 27" 4K Monitor',
    Category: 'Monitor',
    Status: 'Available',
    Location: 'New York Office',
    'Serial Number': 'SN-DLL-44021',
    'Purchase Date': '2024-02-10',
    'Purchase Cost': 579.0,
    Model: 'U2723QE IPS Black',
    'Warranty Expiry': '2027-02-10',
    Notes: 'USB-C Hub Display with 90W Power Delivery',
    Specifications: 'Resolution: 3840x2160, Refresh Rate: 60Hz, Panel: IPS Black',
  },
  {
    'Asset ID': 'A1023',
    'Asset Name': 'iPhone 15 Pro Max',
    Category: 'Mobile',
    Status: 'Available',
    Location: 'San Francisco',
    'Serial Number': 'SN-IPH-77290',
    'Purchase Date': '2024-03-01',
    'Purchase Cost': 1199.0,
    Model: '256GB Natural Titanium',
    'Warranty Expiry': '2026-03-01',
    Notes: 'QA mobile testing device',
    Specifications: 'Storage: 256GB, Color: Natural Titanium, Chip: A17 Pro',
  },
  {
    'Asset ID': 'A1024',
    'Asset Name': 'Logitech MX Master 3S',
    Category: 'Accessories',
    Status: 'Available',
    Location: 'London Office',
    'Serial Number': 'SN-LOG-11842',
    'Purchase Date': '2024-03-12',
    'Purchase Cost': 99.0,
    Model: 'Graphite Wireless Mouse',
    'Warranty Expiry': '2026-03-12',
    Notes: 'Ergonomic performance mouse',
    Specifications: 'DPI: 8000, Connectivity: Bluetooth / Bolt Receiver',
  },
];

/**
 *@description Triggers client-side download of a sample CSV or Excel template
 *@param {string} format - Format of the template to download
 */
export function downloadSampleTemplate(format: 'csv' | 'xlsx'): void {
  const ws = XLSX.utils.json_to_sheet(SAMPLE_ASSET_IMPORT_ROWS);

  // Set column widths for clean readability
  ws['!cols'] = [
    { wch: 12 }, // Asset ID
    { wch: 32 }, // Asset Name
    { wch: 16 }, // Category
    { wch: 14 }, // Status
    { wch: 18 }, // Location
    { wch: 18 }, // Serial Number
    { wch: 14 }, // Purchase Date
    { wch: 14 }, // Purchase Cost
    { wch: 24 }, // Model
    { wch: 16 }, // Warranty Expiry
    { wch: 35 }, // Notes
    { wch: 50 }, // Specifications
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Asset_Template');

  const fileName = `assetops_import_template.${format}`;

  if (format === 'csv') {
    const csvContent = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } else {
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' }) as ArrayBuffer;
    const blob = new Blob([wbout], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
