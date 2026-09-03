import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAssetStore } from '@/store/useAssetStore';
import { UploadCloud, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import type { CreateAssetInput } from '@/types/asset';

export const ImportAssetsModal: React.FC = () => {
  const { isImportModalOpen, closeModals, bulkAddAssets } = useAssetStore();
  const [isImporting, setIsImporting] = useState(false);
  const [successCount, setSuccessCount] = useState<number | null>(null);

  const sampleDemoImports: CreateAssetInput[] = [
    {
      assetId: 'A1011',
      name: 'Sony WH-1000XM5',
      model: 'Noise Cancelling Headphones',
      category: 'Audio',
      status: 'Available',
      location: 'Headquarters',
      serialNumber: 'SNY-XM5-1029',
      purchaseDate: '2024-02-01',
      purchaseCost: 399,
      notes: 'Imported batch inventory',
    },
    {
      assetId: 'A1012',
      name: 'Samsung Galaxy S24 Ultra',
      model: '512GB Titanium Gray',
      category: 'Mobile',
      status: 'Available',
      location: 'New York Office',
      serialNumber: 'SSG-S24-8831',
      purchaseDate: '2024-02-15',
      purchaseCost: 1299,
      notes: 'Imported batch inventory',
    },
  ];

  const handleSimulateImport = () => {
    setIsImporting(true);
    setTimeout(() => {
      const added = bulkAddAssets(sampleDemoImports);
      setIsImporting(false);
      setSuccessCount(added);
      setTimeout(() => {
        setSuccessCount(null);
        closeModals();
      }, 1200);
    }, 800);
  };

  return (
    <Dialog open={isImportModalOpen} onOpenChange={closeModals}>
      <DialogContent onClose={closeModals} className="max-w-md">
        <DialogHeader>
          <DialogTitle>Import Assets</DialogTitle>
          <DialogDescription>
            Upload a CSV / Excel file to bulk import inventory into AssetOps.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-[#4C40F7] mb-2.5">
              <UploadCloud className="size-6" />
            </div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Drag & Drop your CSV file here
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Supports .csv, .xlsx up to 10MB
            </p>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
              <FileSpreadsheet className="size-4 text-emerald-600" />
              <span>Sample import template</span>
            </div>
            <button
              type="button"
              onClick={handleSimulateImport}
              className="text-[#4C40F7] font-medium hover:underline cursor-pointer"
            >
              Load Demo Batch
            </button>
          </div>

          {successCount !== null && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs animate-in fade-in">
              <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
              <span>Successfully imported {successCount} new assets!</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={closeModals}
            className="h-9 text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSimulateImport}
            disabled={isImporting}
            className="h-9 bg-[#4C40F7] hover:bg-[#3D31E5] text-white text-xs font-medium"
          >
            {isImporting ? 'Importing...' : 'Upload & Import'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportAssetsModal;
