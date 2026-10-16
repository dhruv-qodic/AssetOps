import React from 'react';
import { Layers, Building2 } from 'lucide-react';
import { AllocationOverviewKpiCard } from './AllocationOverviewKpiCard';
import { ASSET_ALLOCATION_KPI_TEXT } from './constants/AssetAllocationKpiCards.constants';

import { useTranslation } from 'react-i18next';

export interface AssetAllocationKpiCardsProps {
  className?: string;
}

/**
 * @description: Renders summary KPI metric cards for asset allocations detailing deployment rate, allocated valuation, and recipient employees
 * @param {string} className: Optional styling class string
 * @return {JSX.Element}: Asset allocation KPI metrics grid JSX
 */
export const AssetAllocationKpiCards: React.FC<AssetAllocationKpiCardsProps> = ({ className }) => {
  const { t: translateAllocations } = useTranslation('allocation');

  return (
    <AllocationOverviewKpiCard
      className={className}
      testId="asset-allocation-kpi-card"
      title={translateAllocations('kpi.allocatedAssets', {
        defaultValue: ASSET_ALLOCATION_KPI_TEXT.TITLE,
      })}
      overline={translateAllocations('kpi.activeDeployments', {
        defaultValue: ASSET_ALLOCATION_KPI_TEXT.OVERLINE,
      })}
      icon={Layers}
      deptIcon={Building2}
      statusText={translateAllocations('kpi.operationalStatus', {
        defaultValue: ASSET_ALLOCATION_KPI_TEXT.OPERATIONAL_STATUS,
      })}
      syncText={translateAllocations('kpi.realtimeSync', {
        defaultValue: ASSET_ALLOCATION_KPI_TEXT.REALTIME_SYNC,
      })}
      backgroundColor="#101726"
    />
  );
};

export default AssetAllocationKpiCards;
