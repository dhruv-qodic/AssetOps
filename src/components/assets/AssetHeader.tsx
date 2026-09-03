import React from 'react';
import { Plus, ArrowUpToLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAssetStore } from '@/store/useAssetStore';
import { usePermission } from '@/hooks/usePermission';

export const AssetHeader: React.FC = () => {
  const { openAddModal, openImportModal } = useAssetStore();
  const { hasPermission } = usePermission();
  const canCreate = hasPermission('CREATE_ASSET');

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900 dark:text-white">
          Assets Management
        </h1>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 self-start sm:self-auto">
        {canCreate && (
          <Button
            type="button"
            onClick={openAddModal}
            className="h-9.5 px-4 bg-[#4C40F7] hover:bg-[#3D31E5] text-white text-xs sm:text-sm font-medium rounded-md shadow-xs shadow-[#4C40F7]/25 transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
          >
            <Plus className="size-4 stroke-[2.5]" />
            <span>Add Asset</span>
          </Button>
        )}

        {canCreate && (
          <Button
            type="button"
            variant="outline"
            onClick={openImportModal}
            className="h-9.5 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs sm:text-sm font-medium rounded-md shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
          >
            <ArrowUpToLine className="size-4 text-slate-500" />
            <span>Import</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default AssetHeader;
