import React from 'react';
import { Plus, ArrowUpToLine, Layers2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAssetStore } from '@/store/useAssetStore';
import { usePermission } from '@/hooks/usePermission';

export const AssetHeader: React.FC = () => {
  const openAddModal = useAssetStore((s) => s.openAddModal);
  const openImportModal = useAssetStore((s) => s.openImportModal);
  const { hasPermission } = usePermission();
  const canCreate = hasPermission('CREATE_ASSET');

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
      {/* Title */}
      <div className="flex items-start sm:items-center gap-3">
        <div className="p-2.5 rounded-xl bg-[#155DFC]/10 dark:bg-[#155DFC]/20 text-[#155DFC] shadow-xs shrink-0 mt-0.5 sm:mt-0">
          <Layers2 className="size-6 sm:size-7" />
        </div>
        <div className="space-y-0.5 text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Assets Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Manage your company's assets with ease
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 self-start sm:self-auto">
        {canCreate && (
          <Button
            type="button"
            onClick={openAddModal}
            className="h-9.5 px-4 bg-[#155DFC] hover:bg-[#0D4ECC] text-white text-xs sm:text-sm font-medium rounded-md shadow-xs shadow-[#155DFC]/25 transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
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
