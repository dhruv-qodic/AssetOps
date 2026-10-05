import React from 'react';
import { CheckCircle2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAssetStore } from '@/store/useAssetStore';
import { usePermission } from '@/hooks/usePermission';

export const ActiveAllocationsHeader: React.FC = () => {
  const openAllocateModal = useAssetStore((s) => s.openAllocateModal);
  const { hasPermission } = usePermission();
  const canAllocate = hasPermission('ALLOCATE_ASSET');

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
      {/* Title & Icon */}
      <div className="flex items-start sm:items-center gap-3 shrink-0">
        <div className="p-2.5 rounded-xl bg-[#155DFC]/10 dark:bg-[#155DFC]/20 text-[#155DFC] shadow-xs shrink-0 mt-0.5 sm:mt-0">
          <CheckCircle2 className="size-6 sm:size-7" />
        </div>
        <div className="space-y-0.5 text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Active Allocations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            View, track, and manage all currently active hardware allocations across employees
          </p>
        </div>
      </div>

      {/* Action Button */}
      {canAllocate && (
        <Button
          type="button"
          onClick={() => openAllocateModal()}
          className="h-10 px-5 bg-[#155DFC] hover:bg-[#0D4ECC] text-white text-xs sm:text-sm font-medium rounded-lg shadow-sm shadow-blue-600/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98] self-start sm:self-auto"
        >
          <Plus className="size-4 stroke-[2.5]" />
          <span>New Allocation</span>
        </Button>
      )}
    </div>
  );
};

export default ActiveAllocationsHeader;
