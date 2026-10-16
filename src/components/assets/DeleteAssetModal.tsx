import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAssetStore } from '@/store/useAssetStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import {
  DELETE_ASSET_TITLES,
  DELETE_ASSET_LABELS,
  DELETE_ASSET_BUTTONS,
  DELETE_ASSET_MESSAGES,
} from './constants/DeleteAssetModel.constants';

/**
 * @description: Confirmation dialog modal for permanently deleting an asset and cleaning up employee allocations
 * @returns {JSX.Element | null} Delete asset dialog component JSX
 */
export const DeleteAssetModal: React.FC = () => {
  const { t: translateAssets } = useTranslation('asset');
  const isDeleteModalOpen = useAssetStore((s) => s.isDeleteModalOpen);
  const selectedAsset = useAssetStore((s) => s.selectedAsset);
  const closeModals = useAssetStore((s) => s.closeModals);
  const deleteAsset = useAssetStore((s) => s.deleteAsset);
  const unassignAssetFromEmployee = useEmployeeStore((s) => s.unassignAssetFromEmployee);

  if (!selectedAsset) return null;

  /**
   * @description: Handles deleting the selected asset and unassigning it if allocated
   * @returns {void}
   */
  const handleDelete = () => {
    if (selectedAsset.assignedTo?.id) {
      unassignAssetFromEmployee(selectedAsset.assignedTo.id, selectedAsset.id);
    }
    deleteAsset(selectedAsset.id);
    toast.success(
      translateAssets('toasts.deleted', {
        name: selectedAsset.name,
        defaultValue: DELETE_ASSET_MESSAGES.DELETE_SUCCESS(selectedAsset.name),
      }),
    );
    closeModals();
  };

  return (
    <ConfirmDialog
      isOpen={isDeleteModalOpen}
      onClose={closeModals}
      onConfirm={handleDelete}
      title={translateAssets('deleteModal.title', {
        defaultValue: DELETE_ASSET_TITLES.MODAL_TITLE,
      })}
      description={translateAssets('deleteModal.subtitle', {
        defaultValue: DELETE_ASSET_TITLES.MODAL_DESCRIPTION,
      })}
      warningText={translateAssets('deleteModal.warning', {
        defaultValue: DELETE_ASSET_TITLES.WARNING_TEXT,
      })}
      cancelLabel={translateAssets('deleteModal.cancelButton', {
        defaultValue: DELETE_ASSET_BUTTONS.CANCEL,
      })}
      confirmLabel={translateAssets('deleteModal.confirmButton', {
        defaultValue: DELETE_ASSET_BUTTONS.DELETE,
      })}
      confirmVariant="destructive"
    >
      <div className="p-3.5 my-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs text-left space-y-1">
        <p className="font-semibold text-slate-800 dark:text-slate-200">
          {selectedAsset.name} ({selectedAsset.assetId})
        </p>
        <p className="text-slate-500">
          {translateAssets('deleteModal.categoryLabel', {
            defaultValue: DELETE_ASSET_LABELS.CATEGORY,
          })}
          : {selectedAsset.category} •{' '}
          {translateAssets('deleteModal.serialLabel', {
            defaultValue: DELETE_ASSET_LABELS.SERIAL,
          })}
          : {selectedAsset.serialNumber}
        </p>
      </div>
    </ConfirmDialog>
  );
};

export default DeleteAssetModal;
