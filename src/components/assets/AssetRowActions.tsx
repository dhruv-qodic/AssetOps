import React, { useState, useRef, useEffect } from 'react';
import {
  MoreHorizontal,
  Eye,
  Edit2,
  Trash2,
  UserPlus,
  UserMinus,
  Wrench,
} from 'lucide-react';
import type { Asset } from '@/types/asset';
import { useAssetStore } from '@/store/useAssetStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { usePermission } from '@/hooks/usePermission';
import { cn } from '@/lib/utils';

interface AssetRowActionsProps {
  asset: Asset;
  onOpenChange?: (isOpen: boolean) => void;
}

export const AssetRowActions: React.FC<AssetRowActionsProps> = ({ asset, onOpenChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    openViewModal,
    openEditModal,
    openDeleteModal,
    openAllocateModal,
    deallocateAsset,
    updateAsset,
  } = useAssetStore();

  const { unassignAssetFromEmployee } = useEmployeeStore();

  const { hasPermission } = usePermission();
  const canEdit = hasPermission('EDIT_ASSET');
  const canDelete = hasPermission('DELETE_ASSET');
  const canAllocate = hasPermission('ALLOCATE_ASSET');

  const closeDropdown = () => {
    setIsOpen(false);
    onOpenChange?.(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        closeDropdown();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !isOpen;
    if (!isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      if (spaceBelow < 230 && rect.top > 230) {
        setOpenUpward(true);
      } else {
        setOpenUpward(false);
      }
    }
    setIsOpen(nextState);
    onOpenChange?.(nextState);
  };

  const handleToggleMaintenance = (e: React.MouseEvent) => {
    e.stopPropagation();
    closeDropdown();
    const newStatus = asset.status === 'Maintenance' ? 'Available' : 'Maintenance';
    updateAsset(asset.id, { status: newStatus });
  };

  const handleDeallocate = (e: React.MouseEvent) => {
    e.stopPropagation();
    closeDropdown();
    if (asset.assignedTo?.id) {
      unassignAssetFromEmployee(asset.assignedTo.id, asset.id);
    }
    deallocateAsset(asset.id);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          'flex size-8 items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer',
          isOpen && 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
        )}
        title="Asset actions"
      >
        <MoreHorizontal className="size-4.5" />
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute right-0 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150 select-none',
            openUpward ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* View Details */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              closeDropdown();
              openViewModal(asset);
            }}
            className="w-full px-3 py-2 text-xs flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left font-medium"
          >
            <Eye className="size-3.5 text-slate-400 shrink-0" />
            <span>View Details</span>
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
              <span>Edit Asset</span>
            </button>
          )}

          {/* Quick Allocate / Deallocate */}
          {canAllocate && (
            asset.assignedTo ? (
              <button
                type="button"
                onClick={handleDeallocate}
                className="w-full px-3 py-2 text-xs flex items-center gap-2 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors cursor-pointer text-left font-medium"
              >
                <UserMinus className="size-3.5 shrink-0" />
                <span>Deallocate Asset</span>
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
                <span>Allocate to Employee</span>
              </button>
            )
          )}

          {/* Toggle Maintenance */}
          <button
            type="button"
            onClick={handleToggleMaintenance}
            className="w-full px-3 py-2 text-xs flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left font-medium"
          >
            <Wrench className="size-3.5 text-amber-500 shrink-0" />
            <span>
              {asset.status === 'Maintenance'
                ? 'Mark Available'
                : 'Mark Maintenance'}
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
                <span>Delete Asset</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AssetRowActions;
