import React from 'react';
import { CheckCircle2, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useAssetStore } from '@/store/useAssetStore';
import { usePermission } from '@/hooks/usePermission';
import { ACTIVE_ALLOCATIONS_HEADER_TEXT } from './constants/ActiveAllocationsHeader.constants';
import { PageHeader } from '@/components/common/PageHeader';

/**
 * @description: Header section for the Active Allocations page with title and button to allocate an asset
 * @return: Active allocations header component JSX
 */
export const ActiveAllocationsHeader: React.FC = () => {
  const { t: translateAllocations } = useTranslation('allocation');
  const openAllocateModal = useAssetStore((s) => s.openAllocateModal);
  const { hasPermission } = usePermission();
  const canAllocate = hasPermission('ALLOCATE_ASSET');

  return (
    <PageHeader
      title={translateAllocations('activeTitle', {
        defaultValue: ACTIVE_ALLOCATIONS_HEADER_TEXT.TITLE,
      })}
      subtitle={translateAllocations('activeSubtitle', {
        defaultValue: ACTIVE_ALLOCATIONS_HEADER_TEXT.SUBTITLE,
      })}
      icon={CheckCircle2}
    >
      {canAllocate && (
        <Button
          type="button"
          onClick={() => openAllocateModal()}
          className="h-10 px-5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm font-medium rounded-lg shadow-sm shadow-primary/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98] self-start sm:self-auto"
        >
          <Plus className="size-4 stroke-[2.5]" />
          <span>
            {translateAllocations('newAllocationButton', {
              defaultValue: ACTIVE_ALLOCATIONS_HEADER_TEXT.BUTTON_NEW_ALLOCATION,
            })}
          </span>
        </Button>
      )}
    </PageHeader>
  );
};

export default ActiveAllocationsHeader;
