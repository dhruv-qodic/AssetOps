import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAssetStore } from '@/store/useAssetStore';
import { AlertTriangle } from 'lucide-react';

export const DeleteAssetModal: React.FC = () => {
  const { isDeleteModalOpen, selectedAsset, closeModals, deleteAsset } =
    useAssetStore();

  if (!selectedAsset) return null;

  const handleDelete = () => {
    deleteAsset(selectedAsset.id);
    closeModals();
  };

  return (
    <Dialog open={isDeleteModalOpen} onOpenChange={closeModals}>
      <DialogContent onClose={closeModals} className="max-w-md">
        <div className="flex items-center gap-3.5 mb-2">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600">
            <AlertTriangle className="size-6" />
          </div>
          <div>
            <DialogTitle className="text-base text-slate-900 dark:text-slate-100">
              Delete Asset
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Are you sure you want to remove this asset?
            </DialogDescription>
          </div>
        </div>

        <div className="p-3.5 my-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs text-left space-y-1">
          <p className="font-semibold text-slate-800 dark:text-slate-200">
            {selectedAsset.name} ({selectedAsset.assetId})
          </p>
          <p className="text-slate-500">
            Category: {selectedAsset.category} • Serial: {selectedAsset.serialNumber}
          </p>
        </div>

        <p className="text-xs text-slate-500 text-left">
          This action cannot be undone. All assignment logs and status records for this asset will be permanently removed.
        </p>

        <DialogFooter className="mt-4">
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
            onClick={handleDelete}
            className="h-9 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium px-4"
          >
            Delete Asset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAssetModal;
