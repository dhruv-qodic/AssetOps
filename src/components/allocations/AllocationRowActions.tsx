import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Eye, UserMinus, RefreshCw } from 'lucide-react';
import type { Asset } from '@/types/asset';
import { useAssetStore } from '@/store/useAssetStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { cn } from '@/lib/utils';

interface AllocationRowActionsProps {
  asset: Asset;
}

export const AllocationRowActions: React.FC<AllocationRowActionsProps> = ({ asset }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { openViewModal, openAllocateModal, deallocateAsset } = useAssetStore();
  const { unassignAssetFromEmployee } = useEmployeeStore();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleToggle = () => {
    if (!isOpen && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      if (spaceBelow < 180 && rect.top > 180) {
        setOpenUpward(true);
      } else {
        setOpenUpward(false);
      }
    }
    setIsOpen((prev) => !prev);
  };

  const handleDeallocate = () => {
    setIsOpen(false);
    if (asset.assignedTo?.id) {
      unassignAssetFromEmployee(asset.assignedTo.id, asset.id);
    }
    deallocateAsset(asset.id);
  };

  const handleView = () => {
    setIsOpen(false);
    openViewModal(asset);
  };

  const handleReallocate = () => {
    setIsOpen(false);
    openAllocateModal(asset);
  };

  return (
    <div className="relative inline-block text-right" ref={menuRef}>
      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          "p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer",
          isOpen && "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
        )}
        aria-label="Allocation actions"
      >
        <MoreHorizontal className="size-4" />
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute right-0 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150 text-left",
            openUpward ? "bottom-full mb-1.5" : "top-full mt-1.5"
          )}
        >
          <button
            type="button"
            onClick={handleView}
            className="w-full px-3 py-2 text-xs flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Eye className="size-3.5 text-slate-400" />
            <span>View Details</span>
          </button>

          {asset.status === 'Allocated' && (
            <button
              type="button"
              onClick={handleDeallocate}
              className="w-full px-3 py-2 text-xs flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors cursor-pointer"
            >
              <UserMinus className="size-3.5" />
              <span>Deallocate / Return</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleReallocate}
            className="w-full px-3 py-2 text-xs flex items-center gap-2 text-[#4C40F7] hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors cursor-pointer"
          >
            <RefreshCw className="size-3.5" />
            <span>Reallocate Asset</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default AllocationRowActions;
