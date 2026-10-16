import React, { useState, useRef, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useAssetStore } from '@/store/useAssetStore';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Trash2,
  Plus,
  Download,
  Search,
  X,
  FileText,
  RefreshCw,
  Info,
  Check,
} from 'lucide-react';
import type { CreateAssetInput } from '@/types/asset';
import {
  parseSingleFile,
  validateAssetBatch,
  calculateValidationSummary,
  downloadSampleTemplate,
  generateId,
  type UploadedFileInfo,
  type ParsedAssetRecord,
  type RawFileRow,
} from '@/utils/assetImport';
import { formatCurrency } from '@/utils/currency';
import { cn } from '@/lib/utils';
import {
  IMPORT_ASSETS_TITLES,
  IMPORT_ASSETS_BUTTONS,
  IMPORT_ASSETS_PLACEHOLDERS,
  IMPORT_ASSETS_TABLE_COLUMNS,
  IMPORT_ASSETS_LABELS,
  IMPORT_ASSETS_MESSAGES,
} from './constants/ImportAssetsModal.constants';

/**
 * @ description: Multi-step dialog modal for bulk importing asset records from CSV or XLSX files.
 * @returns {JSX.Element} Import assets modal component JSX.
 */
export const ImportAssetsModal: React.FC = () => {
  const { t: translateAssets } = useTranslation('asset');
  const isImportModalOpen = useAssetStore((s) => s.isImportModalOpen);
  const closeModals = useAssetStore((s) => s.closeModals);
  const bulkAddAssets = useAssetStore((s) => s.bulkAddAssets);
  const existingAssets = useAssetStore((s) => s.assets);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Uploaded files state
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileInfo[]>([]);
  const [rawFileRows, setRawFileRows] = useState<RawFileRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Preview filtering state
  const [activeTab, setActiveTab] = useState<'all' | 'ready' | 'invalid' | 'duplicate'>('all');
  const [previewSearch, setPreviewSearch] = useState('');

  /**
   * @description Validate batch whenever raw rows or existing store assets change
   * @returns {ParsedAssetRecord[]} Parsed asset records
   */
  const parsedRecords: ParsedAssetRecord[] = useMemo(() => {
    return validateAssetBatch(rawFileRows, existingAssets);
  }, [rawFileRows, existingAssets]);

  /**
   * @description Compute summary stats
   * @returns {Object} Validation summary object
   */
  const summary = useMemo(() => {
    return calculateValidationSummary(parsedRecords, uploadedFiles.length);
  }, [parsedRecords, uploadedFiles.length]);

  /**
   * @description: Filter preview records based on tab and search
   * @returns {ParsedAssetRecord[]} Filtered asset records
   */
  const filteredRecords = useMemo(() => {
    return parsedRecords.filter((record) => {
      // Tab filter
      if (activeTab === 'ready' && record.status !== 'ready') return false;
      if (activeTab === 'invalid' && record.status !== 'invalid') return false;
      if (activeTab === 'duplicate' && record.status !== 'duplicate') return false;

      // Search filter
      if (previewSearch.trim()) {
        const query = previewSearch.toLowerCase().trim();
        const matchesId = record.parsedData.assetId?.toLowerCase().includes(query) || false;
        const matchesName = record.parsedData.name?.toLowerCase().includes(query) || false;
        const matchesSerial =
          record.parsedData.serialNumber?.toLowerCase().includes(query) || false;
        const matchesFile = record.fileName.toLowerCase().includes(query);
        const matchesCategory = record.parsedData.category?.toLowerCase().includes(query) || false;
        const matchesLocation = record.parsedData.location?.toLowerCase().includes(query) || false;

        return (
          matchesId ||
          matchesName ||
          matchesSerial ||
          matchesFile ||
          matchesCategory ||
          matchesLocation
        );
      }

      return true;
    });
  }, [parsedRecords, activeTab, previewSearch]);

  /**
   * @ description: Resets the import modal state, clearing uploaded files, preview records, and inputs.
   * @returns {void}
   */
  const handleReset = useCallback(() => {
    setUploadedFiles([]);
    setRawFileRows([]);
    setIsProcessing(false);
    setIsImporting(false);
    setPreviewSearch('');
    setActiveTab('all');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  /**
   * @ description: Closes the import modal dialog and resets state.
   * @returns {void}
   */
  const handleClose = useCallback(() => {
    handleReset();
    closeModals();
  }, [handleReset, closeModals]);

  /**
   * @ description: Process selected file(s) and parse raw records.
   * @param {File[]} files - File array to process.
   * @returns {Promise<void>}
   */
  const processFiles = async (files: File[]) => {
    if (files.length === 0) return;

    setIsProcessing(true);
    try {
      const newFilesInfo: UploadedFileInfo[] = [];
      const newRows: RawFileRow[] = [];

      for (const file of files) {
        const fileId = generateId('file');
        const result = await parseSingleFile(file);

        const fileInfo: UploadedFileInfo = {
          id: fileId,
          file,
          name: file.name,
          size: file.size,
          type: result.format,
          status: result.error ? 'error' : 'success',
          errorMessage: result.error,
          rowCount: result.rows.length,
        };
        newFilesInfo.push(fileInfo);

        if (!result.error && result.rows.length > 0) {
          result.rows.forEach((row, idx) => {
            newRows.push({
              fileId,
              fileName: file.name,
              fileRowNumber: idx + 2, // 1-indexed Excel/CSV row number (header is row 1)
              rawRow: row,
            });
          });
        }
      }

      setUploadedFiles((prev) => [...prev, ...newFilesInfo]);
      setRawFileRows((prev) => [...prev, ...newRows]);

      const successfulRowsCount = newRows.length;
      if (successfulRowsCount > 0) {
        toast.success(`Loaded ${newFilesInfo.length} file(s) with ${successfulRowsCount} records.`);
      } else if (newFilesInfo.some((f) => f.status === 'error')) {
        const errorMsg =
          newFilesInfo.find((f) => f.errorMessage)?.errorMessage || 'Failed to read file';
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error('[processFiles error]:', err);
      toast.error('Unexpected error while reading files');
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * @ description: Handles change event when files are selected via native file input.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Change event from file input.
   * @returns {void}
   */
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      void processFiles(files);
    }
  };

  /**
   * @ description: Handles drag over event for the drag-and-drop file upload zone.
   * @param {React.DragEvent} e - Drag event.
   * @returns {void}
   */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  /**
   * @ description: Handles drag leave event for the file upload zone.
   * @param {React.DragEvent} e - Drag event.
   * @returns {void}
   */
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  /**
   * @ description: Handles file drop event on the file upload zone.
   * @param {React.DragEvent} e - Drag event containing dropped files.
   * @returns {void}
   */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      void processFiles(droppedFiles);
    }
  };

  /**
   * @ description: Removes an uploaded file and its corresponding parsed raw rows.
   * @param {string} fileId - Identifier of the file to remove.
   * @returns {void}
   */
  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
    setRawFileRows((prev) => prev.filter((r) => r.fileId !== fileId));
  };

  /**
   * @ description: Formats file size in bytes to a human-readable unit string (e.g. KB, MB).
   * @param {number} bytes - File size in bytes.
   * @returns {string} Formatted file size string.
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  /**
   * @ description: Execute import of ready/valid records into asset inventory.
   * @returns {void}
   */
  const handleExecuteImport = () => {
    const readyRecords = parsedRecords.filter((r) => r.status === 'ready');
    if (readyRecords.length === 0) {
      toast.error(IMPORT_ASSETS_MESSAGES.NO_VALID_RECORDS);
      return;
    }

    setIsImporting(true);

    const itemsToImport: CreateAssetInput[] = readyRecords.map((r) => ({
      assetId: r.parsedData.assetId ?? '',
      name: r.parsedData.name ?? '',
      model: r.parsedData.model,
      category: r.parsedData.category ?? 'Other',
      status: r.parsedData.status || 'Available',
      location: r.parsedData.location ?? '',
      serialNumber: r.parsedData.serialNumber ?? '',
      purchaseDate: r.parsedData.purchaseDate ?? '',
      purchaseCost: r.parsedData.purchaseCost,
      warrantyExpiry: r.parsedData.warrantyExpiry,
      notes: r.parsedData.notes,
      specifications: r.parsedData.specifications,
    }));

    const addedCount = bulkAddAssets(itemsToImport);
    const skippedCount = parsedRecords.length - readyRecords.length;

    setIsImporting(false);
    toast.success(IMPORT_ASSETS_MESSAGES.IMPORT_SUCCESS(addedCount));

    if (skippedCount > 0) {
      toast.info(IMPORT_ASSETS_MESSAGES.SKIPPED_RECORDS(skippedCount));
    }

    handleClose();
  };

  const hasFiles = uploadedFiles.length > 0;

  return (
    <Dialog open={isImportModalOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        onClose={handleClose}
        className="max-w-5xl lg:max-w-6xl w-full max-h-[92vh] flex flex-col p-0 overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <DialogHeader className="mb-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-primary flex items-center justify-center shrink-0">
                  <UploadCloud className="size-5" />
                </div>
                <div className="space-y-0.5 text-left">
                  <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                    {translateAssets('importModal.title', {
                      defaultValue: IMPORT_ASSETS_TITLES.MODAL_TITLE,
                    })}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                    {translateAssets('importModal.subtitle', {
                      defaultValue: IMPORT_ASSETS_TITLES.MODAL_DESCRIPTION,
                    })}
                  </DialogDescription>
                </div>
              </div>

              {/* Sample Template Download Button */}
              <div className="relative">
                <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-0.5">
                  <button
                    type="button"
                    onClick={() => downloadSampleTemplate('csv')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-primary-foreground hover:bg-primary dark:hover:bg-primary rounded-md transition-all cursor-pointer"
                    title="Download CSV Template"
                  >
                    <Download className="size-3.5" />
                    <span>
                      {translateAssets('importModal.templateCsv', {
                        defaultValue: IMPORT_ASSETS_BUTTONS.TEMPLATE_CSV,
                      })}
                    </span>
                  </button>
                  <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-700 mx-0.5" />
                  <button
                    type="button"
                    onClick={() => downloadSampleTemplate('xlsx')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-primary-foreground hover:bg-primary dark:hover:bg-primary rounded-md transition-all cursor-pointer"
                    title="Download Excel Template"
                  >
                    <FileSpreadsheet className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>
                      {translateAssets('importModal.templateXlsx', {
                        defaultValue: IMPORT_ASSETS_BUTTONS.TEMPLATE_XLSX,
                      })}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-left">
          {/* Hidden native input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            data-testid="file-upload-input"
            accept=".csv, .xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, text/csv"
            className="hidden"
            onChange={handleFileInputChange}
          />

          {/* File Upload Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer select-none',
              hasFiles ? 'p-4 sm:p-5' : 'p-6 sm:p-8',
              isDragOver
                ? 'border-primary bg-indigo-50/60 dark:bg-indigo-950/40 scale-[0.99]'
                : 'border-slate-200 dark:border-slate-800 hover:border-primary/60 hover:bg-slate-50/70 dark:hover:bg-slate-800/40',
            )}
          >
            <div
              className={cn(
                'flex items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-primary shadow-2xs',
                hasFiles ? 'size-9 mb-2' : 'size-12 mb-3',
              )}
            >
              <UploadCloud className={hasFiles ? 'size-5' : 'size-6'} />
            </div>

            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {hasFiles
                ? translateAssets('importModal.dragDropMore', {
                    defaultValue: IMPORT_ASSETS_TITLES.DRAG_DROP_MORE,
                  })
                : translateAssets('importModal.dragDropPrompt', {
                    defaultValue: IMPORT_ASSETS_TITLES.DRAG_DROP_PROMPT,
                  })}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {translateAssets('importModal.supportsMultiFiles', {
                defaultValue:
                  'Supports .csv, .xlsx, and .xls files. You can upload multiple files simultaneously.',
              })}
            </p>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="mt-3 h-8 text-xs font-semibold border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 cursor-pointer"
            >
              {translateAssets('importModal.browseFiles', {
                defaultValue: IMPORT_ASSETS_BUTTONS.BROWSE_FILES,
              })}
            </Button>
          </div>

          {/* Selected Files List */}
          {hasFiles && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {IMPORT_ASSETS_TITLES.UPLOADED_FILES} ({uploadedFiles.length})
                </h4>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="size-3.5" />
                    <span>{IMPORT_ASSETS_BUTTONS.ADD_MORE_FILES}</span>
                  </button>
                  <span className="text-slate-300 dark:text-slate-700">|</span>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-medium cursor-pointer"
                  >
                    {IMPORT_ASSETS_BUTTONS.CLEAR_ALL}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {uploadedFiles.map((fileInfo) => (
                  <div
                    key={fileInfo.id}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-xl border transition-all text-left text-xs',
                      fileInfo.status === 'error'
                        ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200'
                        : 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200',
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                      <div
                        className={cn(
                          'p-1.5 rounded-lg shrink-0',
                          fileInfo.type === 'csv'
                            ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                            : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300',
                        )}
                      >
                        {fileInfo.type === 'csv' ? (
                          <FileText className="size-4" />
                        ) : (
                          <FileSpreadsheet className="size-4" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold truncate text-xs">{fileInfo.name}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {formatFileSize(fileInfo.size)}
                          {fileInfo.status === 'success' && ` • ${fileInfo.rowCount} rows`}
                        </p>
                        {fileInfo.errorMessage && (
                          <p className="text-[11px] text-rose-600 dark:text-rose-400 truncate mt-0.5">
                            {fileInfo.errorMessage}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveFile(fileInfo.id)}
                      className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shrink-0 cursor-pointer"
                      title="Remove file"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Validation Metrics & Summary Cards */}
          {hasFiles && parsedRecords.length > 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Total */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-left">
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {IMPORT_ASSETS_TITLES.TOTAL_ROWS}
                  </p>
                  <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {summary.totalRows}
                  </p>
                </div>

                {/* Ready */}
                <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/60 text-left">
                  <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="size-3.5" />
                    <p className="text-[11px] font-semibold uppercase tracking-wider">
                      {IMPORT_ASSETS_TITLES.READY_TO_IMPORT}
                    </p>
                  </div>
                  <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-0.5">
                    {summary.readyRows}
                  </p>
                </div>

                {/* Invalid */}
                <div className="p-3.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/60 text-left">
                  <div className="flex items-center gap-1 text-rose-700 dark:text-rose-400">
                    <AlertTriangle className="size-3.5" />
                    <p className="text-[11px] font-semibold uppercase tracking-wider">
                      {IMPORT_ASSETS_TITLES.INVALID_ROWS}
                    </p>
                  </div>
                  <p className="text-xl font-extrabold text-rose-700 dark:text-rose-400 mt-0.5">
                    {summary.invalidRows}
                  </p>
                </div>

                {/* Duplicates */}
                <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/60 text-left">
                  <div className="flex items-center gap-1 text-amber-700 dark:text-amber-400">
                    <Copy className="size-3.5" />
                    <p className="text-[11px] font-semibold uppercase tracking-wider">
                      {IMPORT_ASSETS_TITLES.DUPLICATES}
                    </p>
                  </div>
                  <p className="text-xl font-extrabold text-amber-700 dark:text-amber-400 mt-0.5">
                    {summary.duplicateRows}
                  </p>
                </div>
              </div>

              {/* Data Preview Section */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Filter Tabs */}
                  <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setActiveTab('all')}
                      className={cn(
                        'px-3 py-1 rounded-md transition-all cursor-pointer',
                        activeTab === 'all'
                          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white',
                      )}
                    >
                      All ({summary.totalRows})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('ready')}
                      className={cn(
                        'px-3 py-1 rounded-md transition-all cursor-pointer',
                        activeTab === 'ready'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-emerald-700 dark:text-emerald-400 hover:text-emerald-900',
                      )}
                    >
                      Ready ({summary.readyRows})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('invalid')}
                      className={cn(
                        'px-3 py-1 rounded-md transition-all cursor-pointer',
                        activeTab === 'invalid'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'text-rose-700 dark:text-rose-400 hover:text-rose-900',
                      )}
                    >
                      Invalid ({summary.invalidRows})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('duplicate')}
                      className={cn(
                        'px-3 py-1 rounded-md transition-all cursor-pointer',
                        activeTab === 'duplicate'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'text-amber-700 dark:text-amber-400 hover:text-amber-900',
                      )}
                    >
                      Duplicates ({summary.duplicateRows})
                    </button>
                  </div>

                  {/* Preview Search */}
                  <div className="relative flex-1 sm:max-w-xs">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                    <Input
                      value={previewSearch}
                      onChange={(e) => setPreviewSearch(e.target.value)}
                      placeholder={IMPORT_ASSETS_PLACEHOLDERS.SEARCH_PARSED}
                      className="pl-8 h-8 text-xs bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700"
                    />
                    {previewSearch && (
                      <button
                        type="button"
                        onClick={() => setPreviewSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="size-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Table with horizontal & vertical scroll */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto overflow-y-auto shadow-2xs max-h-[360px]">
                  <table className="w-full min-w-[1050px] text-xs text-left border-collapse">
                    <thead className="bg-slate-50/95 dark:bg-slate-800/95 backdrop-blur-xs sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                      <tr>
                        <th className="py-2.5 px-3 w-[110px] min-w-[110px]">
                          {IMPORT_ASSETS_TABLE_COLUMNS.STATUS}
                        </th>
                        <th className="py-2.5 px-3 w-[130px] min-w-[130px]">
                          {IMPORT_ASSETS_TABLE_COLUMNS.SOURCE}
                        </th>
                        <th className="py-2.5 px-3 w-[100px] min-w-[100px]">
                          {IMPORT_ASSETS_TABLE_COLUMNS.ASSET_ID}
                        </th>
                        <th className="py-2.5 px-3 w-[180px] min-w-[180px]">
                          {IMPORT_ASSETS_TABLE_COLUMNS.NAME_MODEL}
                        </th>
                        <th className="py-2.5 px-3 w-[110px] min-w-[110px]">
                          {IMPORT_ASSETS_TABLE_COLUMNS.CATEGORY}
                        </th>
                        <th className="py-2.5 px-3 w-[120px] min-w-[120px]">
                          {IMPORT_ASSETS_TABLE_COLUMNS.LOCATION}
                        </th>
                        <th className="py-2.5 px-3 w-[130px] min-w-[130px]">
                          {IMPORT_ASSETS_TABLE_COLUMNS.SERIAL_NO}
                        </th>
                        <th className="py-2.5 px-3 w-[90px] min-w-[90px]">
                          {IMPORT_ASSETS_TABLE_COLUMNS.COST}
                        </th>
                        <th className="py-2.5 px-3 min-w-[260px]">
                          {IMPORT_ASSETS_TABLE_COLUMNS.ISSUES_ERRORS}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900">
                      {filteredRecords.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="py-8 text-center text-slate-400">
                            {IMPORT_ASSETS_LABELS.NO_RECORDS_MATCH}
                          </td>
                        </tr>
                      ) : (
                        filteredRecords.map((record) => (
                          <tr
                            key={record.tempId}
                            className={cn(
                              'hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors',
                              record.status === 'invalid' && 'bg-rose-50/20 dark:bg-rose-950/10',
                              record.status === 'duplicate' &&
                                'bg-amber-50/20 dark:bg-amber-950/10',
                            )}
                          >
                            {/* Status */}
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              {record.status === 'ready' && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-900/60">
                                  <Check className="size-3" />
                                  {IMPORT_ASSETS_LABELS.READY}
                                </span>
                              )}
                              {record.status === 'invalid' && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200/80 dark:border-rose-900/60">
                                  <AlertTriangle className="size-3" />
                                  {IMPORT_ASSETS_LABELS.INVALID}
                                </span>
                              )}
                              {record.status === 'duplicate' && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/80 dark:border-amber-900/60">
                                  <Copy className="size-3" />
                                  {IMPORT_ASSETS_LABELS.DUPLICATE}
                                </span>
                              )}
                            </td>

                            {/* Source */}
                            <td className="py-2.5 px-3 whitespace-nowrap text-slate-500 dark:text-slate-400">
                              <span
                                className="truncate max-w-[110px] inline-block align-bottom"
                                title={record.fileName}
                              >
                                {record.fileName}
                              </span>{' '}
                              : R{record.fileRowNumber}
                            </td>

                            {/* Asset ID */}
                            <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                              {record.parsedData.assetId || (
                                <span className="text-rose-500 font-normal italic">
                                  {IMPORT_ASSETS_LABELS.MISSING}
                                </span>
                              )}
                            </td>

                            {/* Name & Model */}
                            <td className="py-2.5 px-3 max-w-[180px]">
                              <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                                {record.parsedData.name || (
                                  <span className="text-rose-500 font-normal italic">
                                    {IMPORT_ASSETS_LABELS.MISSING}
                                  </span>
                                )}
                              </p>
                              {record.parsedData.model && (
                                <p className="text-[11px] text-slate-400 truncate">
                                  {record.parsedData.model}
                                </p>
                              )}
                            </td>

                            {/* Category */}
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              {record.parsedData.category ? (
                                <span className="text-slate-700 dark:text-slate-300">
                                  {record.parsedData.category}
                                </span>
                              ) : (
                                <span className="text-rose-500 italic">
                                  {IMPORT_ASSETS_LABELS.INVALID}
                                </span>
                              )}
                            </td>

                            {/* Location */}
                            <td className="py-2.5 px-3 whitespace-nowrap text-slate-600 dark:text-slate-300">
                              {record.parsedData.location || (
                                <span className="text-rose-500 italic">
                                  {IMPORT_ASSETS_LABELS.MISSING}
                                </span>
                              )}
                            </td>

                            {/* Serial Number */}
                            <td className="py-2.5 px-3 whitespace-nowrap font-mono text-[11px] text-slate-600 dark:text-slate-300">
                              {record.parsedData.serialNumber || (
                                <span className="text-rose-500 font-sans italic">
                                  {IMPORT_ASSETS_LABELS.MISSING}
                                </span>
                              )}
                            </td>

                            {/* Cost */}
                            <td className="py-2.5 px-3 whitespace-nowrap text-slate-600 dark:text-slate-300">
                              {record.parsedData.purchaseCost !== undefined
                                ? formatCurrency(record.parsedData.purchaseCost)
                                : '—'}
                            </td>

                            {/* Issues */}
                            <td className="py-2.5 px-3 min-w-[260px]">
                              {record.errors.length > 0 && (
                                <div className="space-y-1">
                                  {record.errors.map((err, i) => (
                                    <div
                                      key={i}
                                      className="flex items-start gap-1.5 text-[11px] text-rose-600 dark:text-rose-400 font-medium"
                                      title={err.message}
                                    >
                                      <span className="shrink-0 mt-0.5 text-rose-500">•</span>
                                      <span className="break-words leading-tight">
                                        {err.message}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {record.duplicateReasons.length > 0 && (
                                <div className="space-y-1">
                                  {record.duplicateReasons.map((dup, i) => (
                                    <div
                                      key={i}
                                      className="flex items-start gap-1.5 text-[11px] text-amber-600 dark:text-amber-400 font-medium"
                                      title={dup}
                                    >
                                      <span className="shrink-0 mt-0.5 text-amber-500">•</span>
                                      <span className="break-words leading-tight">{dup}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {record.status === 'ready' && (
                                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                                  <Check className="size-3" />
                                  {IMPORT_ASSETS_LABELS.READY_TO_IMPORT_CELL}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* No files loaded state info */}
          {!hasFiles && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-400">
              <Info className="size-4 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {translateAssets('importModal.guidelinesTitle', {
                    defaultValue: IMPORT_ASSETS_TITLES.GUIDELINES_TITLE,
                  })}
                </p>
                <p>
                  {translateAssets('importModal.guidelinesDesc', {
                    defaultValue:
                      'Your spreadsheet can include columns for Asset ID, Name, Category, Status, Location, Serial Number, Purchase Date, Purchase Cost, Model, Warranty Expiry, Notes, and Specifications. Download the sample template above for standard column formatting and sample data.',
                  })}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {hasFiles && parsedRecords.length > 0 ? (
              <span>
                <strong className="text-slate-900 dark:text-white font-semibold">
                  {summary.readyRows}
                </strong>{' '}
                of {summary.totalRows} assets ready for import
                {summary.invalidRows + summary.duplicateRows > 0 && (
                  <span className="text-amber-600 dark:text-amber-400 ml-1.5">
                    ({summary.invalidRows + summary.duplicateRows} skipped)
                  </span>
                )}
              </span>
            ) : (
              <span>
                {translateAssets('importModal.beginPrompt', {
                  defaultValue: IMPORT_ASSETS_TITLES.BEGIN_PROMPT,
                })}
              </span>
            )}
          </div>

          <DialogFooter className="mt-0 space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="h-9 text-xs font-semibold"
            >
              {translateAssets('importModal.cancelButton', {
                defaultValue: IMPORT_ASSETS_BUTTONS.CANCEL,
              })}
            </Button>
            {hasFiles && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleReset}
                className="h-9 text-xs font-semibold text-slate-600 dark:text-slate-300"
              >
                {IMPORT_ASSETS_BUTTONS.RESET}
              </Button>
            )}
            <Button
              type="button"
              onClick={handleExecuteImport}
              disabled={isImporting || isProcessing || summary.readyRows === 0}
              className="h-9 px-5 bg-primary hover:bg-primary text-white text-xs font-bold rounded-lg shadow-sm shadow-primary/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isImporting ? (
                <>
                  <RefreshCw className="size-3.5 animate-spin" />
                  <span>{IMPORT_ASSETS_BUTTONS.IMPORTING}</span>
                </>
              ) : (
                <>
                  <UploadCloud className="size-3.5" />
                  <span>
                    {summary.readyRows > 0
                      ? `Import ${summary.readyRows} Asset${summary.readyRows > 1 ? 's' : ''}`
                      : translateAssets('importModal.importAssets', {
                          defaultValue: IMPORT_ASSETS_BUTTONS.IMPORT_ASSETS,
                        })}
                  </span>
                </>
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportAssetsModal;
