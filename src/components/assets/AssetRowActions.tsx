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
import { usePermission } from '@/hooks/usePermission';
import { cn } from '@/lib/utils';

interface AssetRowActionsProps {
  asset: Asset;
}

export const AssetRowActions: React.FC<AssetRowActionsProps> = ({ asset }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    openViewModal,
    openEditModal,
    openDeleteModal,
    deallocateAsset,
    updateAsset,
  } = useAssetStore();

  const { hasPermission } = usePermission();
  const canEdit = hasPermission('EDIT_ASSET');
  const canDelete = hasPermission('DELETE_ASSET');
  const canAllocate = hasPermission('ALLOCATE_ASSET');

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleToggleMaintenance = () => {
    setIsOpen(false);
    const newStatus = asset.status === 'Maintenance' ? 'Available' : 'Maintenance';
    updateAsset(asset.id, { status: newStatus });
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex size-8 items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer',
          isOpen && 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
        )}
        title="Asset actions"
      >
        <MoreHorizontal className="size-4.5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* View Details */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              openViewModal(asset);
            }}
            className="w-full px-3 py-2 text-xs flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left"
          >
            <Eye className="size-3.5 text-slate-400" />
            <span>View Details</span>
          </button>

          {/* Edit Asset */}
          {canEdit && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                openEditModal(asset);
              }}
              className="w-full px-3 py-2 text-xs flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left"
            >
              <Edit2 className="size-3.5 text-blue-500" />
              <span>Edit Asset</span>
            </button>
          )}

          {/* Quick Allocate / Deallocate */}
          {canAllocate && (
            asset.assignedTo ? (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  deallocateAsset(asset.id);
                }}
                className="w-full px-3 py-2 text-xs flex items-center gap-2 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors cursor-pointer text-left"
              >
                <UserMinus className="size-3.5" />
                <span>Deallocate Asset</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  openEditModal(asset);
                }}
                className="w-full px-3 py-2 text-xs flex items-center gap-2 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer text-left"
              >
                <UserPlus className="size-3.5" />
                <span>Allocate to Employee</span>
              </button>
            )
          )}

          {/* Toggle Maintenance */}
          <button
            type="button"
            onClick={handleToggleMaintenance}
            className="w-full px-3 py-2 text-xs flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left"
          >
            <Wrench className="size-3.5 text-amber-500" />
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
                onClick={() => {
                  setIsOpen(false);
                  openDeleteModal(asset);
                }}
                className="w-full px-3 py-2 text-xs flex items-center gap-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer text-left"
              >
                <Trash2 className="size-3.5" />
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
