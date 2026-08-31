import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AssetStatusBadge } from './AssetStatusBadge';
import { AssetDeviceIcon } from './AssetDeviceIcon';
import { useAssetStore } from '@/store/useAssetStore';
import { Calendar, MapPin, Tag, Hash, UserCheck, Shield } from 'lucide-react';

export const AssetDetailsModal: React.FC = () => {
  const { isViewModalOpen, selectedAsset, closeModals, openEditModal } =
    useAssetStore();

  if (!selectedAsset) return null;

  return (
    <Dialog open={isViewModalOpen} onOpenChange={closeModals}>
      <DialogContent onClose={closeModals} className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <AssetDeviceIcon
              category={selectedAsset.category}
              name={selectedAsset.name}
              className="size-11"
            />
            <div>
              <DialogTitle className="text-base sm:text-lg">
                {selectedAsset.name}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-0.5">
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                  {selectedAsset.assetId}
                </span>
                <span>•</span>
                <span>{selectedAsset.model || selectedAsset.category}</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-1 text-left text-xs sm:text-sm">
          {/* Status & Allocation banner */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Current Status:</span>
              <AssetStatusBadge status={selectedAsset.status} />
            </div>
            {selectedAsset.assignedTo ? (
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 font-medium">
                <UserCheck className="size-4 text-emerald-500" />
                <span>{selectedAsset.assignedTo.name}</span>
              </div>
            ) : (
              <span className="text-slate-400 font-normal">Unassigned</span>
            )}
          </div>

          {/* Key Properties Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Tag className="size-3.5" />
                <span>Category</span>
              </div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {selectedAsset.category}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <MapPin className="size-3.5" />
                <span>Location</span>
              </div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {selectedAsset.location}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Hash className="size-3.5" />
                <span>Serial Number</span>
              </div>
              <p className="font-mono font-medium text-slate-800 dark:text-slate-200 text-xs">
                {selectedAsset.serialNumber}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Calendar className="size-3.5" />
                <span>Purchase Date</span>
              </div>
              <p className="font-medium text-slate-800 dark:text-slate-200">
                {selectedAsset.purchaseDate}
              </p>
            </div>
          </div>

          {/* Specs & Hardware Attributes */}
          <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 text-xs">
                <Shield className="size-3.5 text-[#4C40F7]" />
                <span>Technical Specifications</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  closeModals();
                  openEditModal(selectedAsset);
                }}
                className="text-[11px] text-[#4C40F7] hover:underline font-medium cursor-pointer"
              >
                {selectedAsset.specifications && Object.keys(selectedAsset.specifications).length > 0
                  ? 'Edit Specs'
                  : '+ Add Specs'}
              </button>
            </div>

            {selectedAsset.specifications && Object.keys(selectedAsset.specifications).length > 0 ? (
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                {Object.entries(selectedAsset.specifications).map(([k, v]) => (
                  <div key={k} className="flex flex-col bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200/60 dark:border-slate-800">
                    <span className="text-slate-400 text-[10.5px] font-medium">{k}</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-1 italic">
                No technical specifications recorded for this asset yet.
              </p>
            )}
          </div>

          {/* Notes if any */}
          {selectedAsset.notes && (
            <div className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/30 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
              <strong className="text-slate-700 dark:text-slate-300">Notes: </strong>
              {selectedAsset.notes}
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
            Close
          </Button>
          <Button
            type="button"
            onClick={() => {
              closeModals();
              openEditModal(selectedAsset);
            }}
            className="h-9 bg-[#4C40F7] hover:bg-[#3D31E5] text-white text-xs font-medium"
          >
            Edit Asset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssetDetailsModal;
