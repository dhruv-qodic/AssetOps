import React from 'react';
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
import { AssetStatusBadge } from '@/components/assets/AssetStatusBadge';
import { AssetDeviceIcon } from '@/components/assets/AssetDeviceIcon';
import { AssetQrModalCard } from '@/components/assets/AssetQrModal';
import { useAssetStore } from '@/store/useAssetStore';
import { Calendar, MapPin, Tag, Hash, UserCheck, Shield, QrCode } from 'lucide-react';
import { ASSET_MODAL_LABELS } from './constants/AddAssetModel.constants';
import {
  ASSET_DETAILS_LABELS,
  ASSET_DETAILS_BUTTONS,
} from './constants/AssetDetailsModel.constants';
import { formatDate } from '@/utils/date';

/**
 * @description: Displays a detailed modal view of the selected asset including specifications, status, and QR code access
 * @returns {JSX.Element | null} Modal component for viewing asset details
 */
export const AssetDetailsModal: React.FC = () => {
  const { t: translateAssets } = useTranslation('asset');
  const isViewModalOpen = useAssetStore((s) => s.isViewModalOpen);
  const isQrModalOpen = useAssetStore((s) => s.isQrModalOpen);
  const selectedAsset = useAssetStore((s) => s.selectedAsset);
  const closeModals = useAssetStore((s) => s.closeModals);
  const openEditModal = useAssetStore((s) => s.openEditModal);
  const openQrModal = useAssetStore((s) => s.openQrModal);
  const closeQrModal = useAssetStore((s) => s.closeQrModal);

  if (!selectedAsset) return null;

  return (
    <Dialog open={isViewModalOpen} onOpenChange={closeModals}>
      <div className="relative z-50 flex flex-col lg:flex-row items-center justify-center gap-4 max-w-5xl w-full">
        <DialogContent onClose={closeModals} className="max-w-lg w-full">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <AssetDeviceIcon
                category={selectedAsset.category}
                name={selectedAsset.name}
                className="size-11"
              />
              <div>
                <DialogTitle className="text-base sm:text-lg">{selectedAsset.name}</DialogTitle>
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
                <span className="text-slate-500">
                  {translateAssets('columns.status', {
                    defaultValue: ASSET_DETAILS_LABELS.CURRENT_STATUS,
                  })}
                </span>
                <AssetStatusBadge status={selectedAsset.status} />
              </div>
              {selectedAsset.assignedTo ? (
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 font-medium">
                  <UserCheck className="size-4 text-emerald-500" />
                  <span>{selectedAsset.assignedTo.name}</span>
                </div>
              ) : (
                <span className="text-slate-400 font-normal">
                  {translateAssets('filters.unassigned', {
                    defaultValue: ASSET_DETAILS_LABELS.UNASSIGNED,
                  })}
                </span>
              )}
            </div>

            {/* Key Properties Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                  <Tag className="size-3.5" />
                  <span>
                    {translateAssets('detailsPage.specifications.category', {
                      defaultValue: ASSET_MODAL_LABELS.CATEGORY,
                    })}
                  </span>
                </div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {translateAssets(`categories.${selectedAsset.category}`, {
                    defaultValue: selectedAsset.category,
                  })}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                  <MapPin className="size-3.5" />
                  <span>
                    {translateAssets('detailsPage.specifications.location', {
                      defaultValue: ASSET_MODAL_LABELS.LOCATION,
                    })}
                  </span>
                </div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {translateAssets(`locations.${selectedAsset.location}`, {
                    defaultValue: selectedAsset.location,
                  })}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                  <Hash className="size-3.5" />
                  <span>
                    {translateAssets('detailsPage.metadata.serialNumber', {
                      defaultValue: ASSET_MODAL_LABELS.SERIAL_NUMBER,
                    })}
                  </span>
                </div>
                <p className="font-mono font-medium text-slate-800 dark:text-slate-200 text-xs">
                  {selectedAsset.serialNumber}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                  <Calendar className="size-3.5" />
                  <span>
                    {translateAssets('detailsPage.metadata.purchaseDate', {
                      defaultValue: ASSET_MODAL_LABELS.PURCHASE_DATE,
                    })}
                  </span>
                </div>
                <p className="font-medium text-slate-800 dark:text-slate-200">
                  {formatDate(selectedAsset.purchaseDate)}
                </p>
              </div>
            </div>

            {/* Specs & Hardware Attributes */}
            <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 text-xs">
                  <Shield className="size-3.5 text-primary" />
                  <span>
                    {translateAssets('addModal.technicalSpecs', {
                      defaultValue: ASSET_DETAILS_LABELS.TECHNICAL_SPECIFICATIONS,
                    })}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    closeModals();
                    openEditModal(selectedAsset);
                  }}
                  className="text-[11px] text-primary hover:underline font-medium cursor-pointer"
                >
                  {selectedAsset.specifications &&
                  Object.keys(selectedAsset.specifications).length > 0
                    ? translateAssets('detailsPage.specifications.editSpecsButton', {
                        defaultValue: ASSET_DETAILS_LABELS.EDIT_SPECS,
                      })
                    : translateAssets('addModal.addSpecField', {
                        defaultValue: ASSET_DETAILS_LABELS.ADD_SPECS,
                      })}
                </button>
              </div>

              {selectedAsset.specifications &&
              Object.keys(selectedAsset.specifications).length > 0 ? (
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  {Object.entries(selectedAsset.specifications).map(([k, v]) => (
                    <div
                      key={k}
                      className="flex flex-col bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200/60 dark:border-slate-800"
                    >
                      <span className="text-slate-400 text-[10.5px] font-medium">{k}</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {v}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-1 italic">
                  {translateAssets('addModal.noSpecsAdded', {
                    defaultValue: ASSET_DETAILS_LABELS.NO_SPECS_RECORDED,
                  })}
                </p>
              )}
            </div>

            {/* Notes if any */}
            {selectedAsset.notes && (
              <div className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/30 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                <strong className="text-slate-700 dark:text-slate-300">
                  {translateAssets('detailsPage.specifications.notesTitle', {
                    defaultValue: ASSET_DETAILS_LABELS.NOTES_LABEL,
                  })}{' '}
                </strong>
                {selectedAsset.notes}
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between w-full gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => openQrModal(selectedAsset)}
              className="h-9 text-xs text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <QrCode className="size-3.5 text-primary" />
              <span>
                {translateAssets('detailsPage.qrCodeButton', {
                  defaultValue: ASSET_DETAILS_BUTTONS.QR_CODE,
                })}
              </span>
            </Button>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Button
                type="button"
                variant="outline"
                onClick={closeModals}
                className="h-9 text-xs cursor-pointer"
              >
                {translateAssets('deleteModal.cancelButton', {
                  defaultValue: ASSET_DETAILS_BUTTONS.CLOSE,
                })}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  closeModals();
                  openEditModal(selectedAsset);
                }}
                className="h-9 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium cursor-pointer"
              >
                {translateAssets('detailsPage.editAssetButton', {
                  defaultValue: ASSET_DETAILS_BUTTONS.EDIT_ASSET,
                })}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>

        {isQrModalOpen && <AssetQrModalCard asset={selectedAsset} onClose={closeQrModal} />}
      </div>
    </Dialog>
  );
};

export default AssetDetailsModal;
