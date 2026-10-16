import React from 'react';
import { MoreHorizontal, Eye, Edit2, Trash2, UserPlus, UserMinus, Wrench } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Asset } from '@/types/asset';
import { useAssetStore } from '@/store/useAssetStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { usePermission } from '@/hooks/usePermission';
import { useDropdownPosition } from '@/hooks/useDropdownPosition';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  ASSET_ROW_ACTIONS_TITLES,
  ASSET_ROW_ACTIONS_LABELS,
  ASSET_ROW_ACTIONS_MESSAGES,
} from './constants/AssetRowActions.constants';

interface AssetRowActionsProps {
  asset: Asset;
  onOpenChange?: (isOpen: boolean) => void;
}

/**
 * @description: Action dropdown menu for individual asset row items (view, edit, delete, allocate, maintenance)
 * @param {AssetRowActionsProps} props - Component properties containing asset item and onOpenChange callback
 * @returns {JSX.Element} Asset row actions dropdown JSX
 */
export const AssetRowActions: React.FC<AssetRowActionsProps> = ({ asset, onOpenChange }) => {
  const { t: translateAssets } = useTranslation('asset');
  const {
    ref: dropdownRef,
    isOpen,
    openUpward,
    toggleDropdown,
    closeDropdown,
  } = useDropdownPosition({
    dropdownHeight: 220,
    onOpenChange,
  });

  const openQrModal = useAssetStore((s) => s.openQrModal);
  const openEditModal = useAssetStore((s) => s.openEditModal);
  const openDeleteModal = useAssetStore((s) => s.openDeleteModal);
  const openAllocateModal = useAssetStore((s) => s.openAllocateModal);
  const deallocateAsset = useAssetStore((s) => s.deallocateAsset);
  const updateAsset = useAssetStore((s) => s.updateAsset);

  const unassignAssetFromEmployee = useEmployeeStore((s) => s.unassignAssetFromEmployee);

  const { hasPermission } = usePermission();
  const canEdit = hasPermission('EDIT_ASSET');
  const canDelete = hasPermission('DELETE_ASSET');
  const canAllocate = hasPermission('ALLOCATE_ASSET');

  /**
   * @description: Toggles maintenance status between 'Maintenance' and 'Available'
   * @param {React.MouseEvent} e - Mouse click event
   * @returns {void}
   */
  const handleToggleMaintenance = (e: React.MouseEvent) => {
    e.stopPropagation();
    closeDropdown();
    const newStatus = asset.status === 'Maintenance' ? 'Available' : 'Maintenance';
    updateAsset(asset.id, { status: newStatus });
    toast.success(
      newStatus === 'Maintenance'
        ? ASSET_ROW_ACTIONS_MESSAGES.MARKED_UNDER_MAINTENANCE(asset.name)
        : ASSET_ROW_ACTIONS_MESSAGES.MARKED_AS_AVAILABLE(asset.name),
    );
  };

  /**
   * @description: Deallocates asset from its currently assigned employee
   * @param {React.MouseEvent} e - Mouse click event
   * @returns {void}
   */
  const handleDeallocate = (e: React.MouseEvent) => {
    e.stopPropagation();
    closeDropdown();
    if (asset.assignedTo?.id) {
      unassignAssetFromEmployee(asset.assignedTo.id, asset.id);
    }
    deallocateAsset(asset.id);
    toast.success(ASSET_ROW_ACTIONS_MESSAGES.DEALLOCATED_SUCCESS(asset.name));
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={toggleDropdown}
        className={cn(
          'flex size-8 items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer',
          isOpen && 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200',
        )}
        title={ASSET_ROW_ACTIONS_TITLES.ASSET_ACTIONS}
      >
        <MoreHorizontal className="size-4.5" />
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute right-0 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150 select-none',
            openUpward ? 'bottom-full mb-1.5' : 'top-full mt-1.5',
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Asset Details / QR Modal */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              closeDropdown();
              openQrModal(asset);
            }}
            className="w-full px-3 py-2 text-xs flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left font-medium"
          >
            <Eye className="size-3.5 text-slate-400 shrink-0" />
            <span>
              {translateAssets('actions.viewDetails', {
                defaultValue: ASSET_ROW_ACTIONS_LABELS.ASSET_DETAILS,
              })}
            </span>
          </button>

          {/* Edit Asset */}
          {canEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                closeDropdown();
                openEditModal(asset);
              }}
              className="w-full px-3 py-2 text-xs flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left font-medium"
            >
              <Edit2 className="size-3.5 text-blue-500 shrink-0" />
              <span>
                {translateAssets('actions.edit', {
                  defaultValue: ASSET_ROW_ACTIONS_LABELS.EDIT_ASSET,
                })}
              </span>
            </button>
          )}

          {/* Quick Allocate / Deallocate */}
          {canAllocate &&
            (asset.assignedTo ? (
              <button
                type="button"
                onClick={handleDeallocate}
                className="w-full px-3 py-2 text-xs flex items-center gap-2 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors cursor-pointer text-left font-medium"
              >
                <UserMinus className="size-3.5 shrink-0" />
                <span>
                  {translateAssets('actions.deallocate', {
                    defaultValue: ASSET_ROW_ACTIONS_LABELS.DEALLOCATE_ASSET,
                  })}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  closeDropdown();
                  openAllocateModal(asset);
                }}
                className="w-full px-3 py-2 text-xs flex items-center gap-2 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer text-left font-medium"
              >
                <UserPlus className="size-3.5 shrink-0" />
                <span>
                  {translateAssets('actions.allocate', {
                    defaultValue: ASSET_ROW_ACTIONS_LABELS.ALLOCATE_TO_EMPLOYEE,
                  })}
                </span>
              </button>
            ))}

          {/* Toggle Maintenance */}
          <button
            type="button"
            onClick={handleToggleMaintenance}
            className="w-full px-3 py-2 text-xs flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left font-medium"
          >
            <Wrench className="size-3.5 text-amber-500 shrink-0" />
            <span>
              {asset.status === 'Maintenance'
                ? translateAssets('actions.markAvailable', {
                    defaultValue: ASSET_ROW_ACTIONS_LABELS.MARK_AVAILABLE,
                  })
                : translateAssets('actions.markMaintenance', {
                    defaultValue: ASSET_ROW_ACTIONS_LABELS.MARK_MAINTENANCE,
                  })}
            </span>
          </button>

          {/* Delete Asset */}
          {canDelete && (
            <>
              <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  closeDropdown();
                  openDeleteModal(asset);
                }}
                className="w-full px-3 py-2 text-xs flex items-center gap-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer text-left font-medium"
              >
                <Trash2 className="size-3.5 shrink-0" />
                <span>
                  {translateAssets('actions.delete', {
                    defaultValue: ASSET_ROW_ACTIONS_LABELS.DELETE_ASSET,
                  })}
                </span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AssetRowActions;
