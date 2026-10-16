import React from 'react';
import { MoreHorizontal, Eye, UserMinus, RefreshCw } from 'lucide-react';
import type { Asset } from '@/types/asset';
import { useAssetStore } from '@/store/useAssetStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { useDropdownPosition } from '@/hooks/useDropdownPosition';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { ALLOCATION_ROW_ACTIONS_TEXT } from './constants/AllocationRowActions.constants';

interface AllocationRowActionsProps {
  asset: Asset;
}

/**
 * @description: Action dropdown menu for active allocation rows providing QR viewing, reallocation, and deallocation
 * @param {Asset}asset: Target allocated asset item
 * @return: Action menu component JSX
 */
export const AllocationRowActions: React.FC<AllocationRowActionsProps> = ({ asset }) => {
  const { t: translateAllocations } = useTranslation('allocation');
  const {
    ref: menuRef,
    isOpen,
    openUpward,
    toggleDropdown,
    closeDropdown,
  } = useDropdownPosition({
    dropdownHeight: 180,
  });

  const openQrModal = useAssetStore((s) => s.openQrModal);
  const openAllocateModal = useAssetStore((s) => s.openAllocateModal);
  const deallocateAsset = useAssetStore((s) => s.deallocateAsset);
  const unassignAssetFromEmployee = useEmployeeStore((s) => s.unassignAssetFromEmployee);

  /**
   * @description: Deallocates asset from its assigned employee and resets status
   * @return: void
   */
  const handleDeallocate = () => {
    closeDropdown();
    if (asset.assignedTo?.id) {
      unassignAssetFromEmployee(asset.assignedTo.id, asset.id);
    }
    deallocateAsset(asset.id);
    toast.success(
      translateAllocations('toasts.deallocatedSuccess', {
        assetName: asset.name,
        defaultValue: ALLOCATION_ROW_ACTIONS_TEXT.getToastDeallocated(asset.name),
      }),
    );
  };

  /**
   * @description: Opens the QR code viewing modal for the allocated asset
   * @return: void
   */
  const handleView = () => {
    closeDropdown();
    openQrModal(asset);
  };

  /**
   * @description: Opens the allocation modal to reallocate the asset to another employee
   * @return: void
   */
  const handleReallocate = () => {
    closeDropdown();
    openAllocateModal(asset);
  };

  return (
    <div className="relative inline-block text-right" ref={menuRef}>
      <button
        type="button"
        onClick={toggleDropdown}
        className={cn(
          'p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer',
          isOpen && 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200',
        )}
        aria-label={ALLOCATION_ROW_ACTIONS_TEXT.ARIA_LABEL}
      >
        <MoreHorizontal className="size-4" />
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute right-0 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150 text-left',
            openUpward ? 'bottom-full mb-1.5' : 'top-full mt-1.5',
          )}
        >
          <button
            type="button"
            onClick={handleView}
            className="w-full px-3 py-2 text-xs flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Eye className="size-3.5 text-slate-400" />
            <span>
              {translateAllocations('actions.assetDetails', {
                defaultValue: ALLOCATION_ROW_ACTIONS_TEXT.ASSET_DETAILS,
              })}
            </span>
          </button>

          {asset.status === ALLOCATION_ROW_ACTIONS_TEXT.STATUS_ALLOCATED && (
            <button
              type="button"
              onClick={handleDeallocate}
              className="w-full px-3 py-2 text-xs flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors cursor-pointer"
            >
              <UserMinus className="size-3.5" />
              <span>
                {translateAllocations('actions.deallocateReturn', {
                  defaultValue: ALLOCATION_ROW_ACTIONS_TEXT.DEALLOCATE_RETURN,
                })}
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={handleReallocate}
            className="w-full px-3 py-2 text-xs flex items-center gap-2 text-primary hover:bg-primary/10 transition-colors cursor-pointer"
          >
            <RefreshCw className="size-3.5" />
            <span>
              {translateAllocations('actions.reallocateAsset', {
                defaultValue: ALLOCATION_ROW_ACTIONS_TEXT.REALLOCATE_ASSET,
              })}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default AllocationRowActions;
