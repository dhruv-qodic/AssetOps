import React from 'react';
import { UserCheck, Building2 } from 'lucide-react';
import { AllocationOverviewKpiCard } from './AllocationOverviewKpiCard';
import { ACTIVE_ALLOCATIONS_KPI_TEXT } from './constants/ActiveAllocationsKpiCard.constants';

import { useTranslation } from 'react-i18next';

export interface ActiveAllocationsKpiCardProps {
  className?: string;
}

/**
 * @description: Displays metric KPI cards summarizing active allocations count, valuation, utilization rate, and recipients
 * @param {string} className: Optional styling class name
 * @return {JSX.Element}: KPI cards grid component JSX
 */
export const ActiveAllocationsKpiCard: React.FC<ActiveAllocationsKpiCardProps> = ({
  className,
}) => {
  const { t: translateAllocations } = useTranslation('allocation');

  return (
    <AllocationOverviewKpiCard
      className={className}
      testId="active-allocations-kpi-card"
      title={translateAllocations('kpi.allocatedAssets', {
        defaultValue: ACTIVE_ALLOCATIONS_KPI_TEXT.TITLE,
      })}
      overline={translateAllocations('kpi.activeDeployments', {
        defaultValue: ACTIVE_ALLOCATIONS_KPI_TEXT.OVERLINE,
      })}
      icon={UserCheck}
      deptIcon={Building2}
      statusText={translateAllocations('kpi.operationalStatus', {
        defaultValue: ACTIVE_ALLOCATIONS_KPI_TEXT.OPERATIONAL_STATUS,
      })}
      syncText={translateAllocations('kpi.realtimeSync', {
        defaultValue: ACTIVE_ALLOCATIONS_KPI_TEXT.REALTIME_SYNC,
      })}
      backgroundColor="#101726"
    />
  );
};

export default ActiveAllocationsKpiCard;
