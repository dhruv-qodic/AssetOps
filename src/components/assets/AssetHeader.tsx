import React from 'react';
import { Plus, ArrowUpToLine, Layers2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAssetStore } from '@/store/useAssetStore';
import { usePermission } from '@/hooks/usePermission';
import { PageHeader } from '@/components/common/PageHeader';

export const AssetHeader: React.FC = () => {
  const openAddModal = useAssetStore((s) => s.openAddModal);
  const openImportModal = useAssetStore((s) => s.openImportModal);
  const { hasPermission } = usePermission();
  const canCreate = hasPermission('CREATE_ASSET');

  return (
    <PageHeader
      icon={Layers2}
      title="Assets Management"
      description="Manage, track, and monitor your company's physical and digital assets."
    >
      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 self-start sm:self-auto">
        {canCreate && (
          <Button
            type="button"
            onClick={openAddModal}
            className="h-9.5 px-4 bg-[#155DFC] hover:bg-[#1047C7] text-white text-xs sm:text-sm font-medium rounded-lg shadow-xs shadow-[#155DFC]/25 transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
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
            className="h-9.5 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs sm:text-sm font-medium rounded-lg shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
          >
            <ArrowUpToLine className="size-4 text-slate-500" />
            <span>Import</span>
          </Button>
        )}
      </div>
    </PageHeader>
  );
};

export default AssetHeader;

