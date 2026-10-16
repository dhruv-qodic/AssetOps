import React from 'react';
import { Layers, Box, Users, Laptop } from 'lucide-react';
import { useAssetStore } from '@/store/useAssetStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { StatCard } from '@/components/common/StatCard';
import { useTranslation } from 'react-i18next';
import { ALLOCATION_CARDS_TEXT } from './constants/AllocationCards.constants';

/**
 * @description: Displays overview KPI metric cards for total allocations, available inventory, staff, and deployment rate
 * @return {JSX.Element}: Allocation overview metric cards grid JSX
 */
export const AllocationCards: React.FC = () => {
  const { t: translateAllocations } = useTranslation('allocation');
  const { t: translateAssets } = useTranslation('asset');
  const { t: translateEmployees } = useTranslation('employee');
  const assets = useAssetStore((s) => s.assets);
  const employees = useEmployeeStore((s) => s.employees);

  const totalAssets = assets.length || 0;
  const allocatedAssets = assets.filter((a) => a.status === 'Allocated' && a.assignedTo !== null);
  const allocatedCount = allocatedAssets.length;
  const availableCount = assets.filter((a) => a.status === 'Available').length;
  const totalEmployees = employees.length || 0;

  const allocationPercent = totalAssets ? Math.round((allocatedCount / totalAssets) * 100) : 0;
  const availablePercent = totalAssets ? Math.round((availableCount / totalAssets) * 100) : 0;

  const cardItems = [
    {
      title: translateAllocations('kpi.totalAllocations', {
        defaultValue: ALLOCATION_CARDS_TEXT.TOTAL_ALLOCATIONS_TITLE,
      }),
      value: allocatedCount,
      badge: `${allocationPercent}% ${translateAllocations('kpi.activeSuffix', { defaultValue: ALLOCATION_CARDS_TEXT.ALLOCATED_BADGE_SUFFIX })}`,
      badgeBg: 'bg-primary/10 text-primary',
      icon: Layers,
      iconBg: 'bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground',
      iconColor: 'text-primary',
      accentGlow: 'hover:border-primary/40 hover:shadow-primary/10',
      barColor: 'from-primary to-primary/70',
      description: ALLOCATION_CARDS_TEXT.TOTAL_ALLOCATIONS_DESC,
    },
    {
      title: translateAssets('overview.availableAssets', {
        defaultValue: ALLOCATION_CARDS_TEXT.AVAILABLE_ASSETS_TITLE,
      }),
      value: availableCount,
      badge: `${availablePercent}% ${translateAssets('allocateModal.availableSuffix', { defaultValue: ALLOCATION_CARDS_TEXT.AVAILABLE_BADGE_SUFFIX })}`,
      badgeBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
      icon: Box,
      iconBg:
        'bg-emerald-50/80 dark:bg-emerald-950/80 group-hover:bg-emerald-600 group-hover:text-white',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      accentGlow:
        'hover:border-emerald-300 dark:hover:border-emerald-800 hover:shadow-emerald-500/10',
      barColor: 'from-emerald-500 to-teal-500',
      description: ALLOCATION_CARDS_TEXT.AVAILABLE_ASSETS_DESC,
    },
    {
      title: translateEmployees('kpi.totalEmployees', {
        defaultValue: ALLOCATION_CARDS_TEXT.TOTAL_EMPLOYEES_TITLE,
      }),
      value: totalEmployees,
      badge: ALLOCATION_CARDS_TEXT.TOTAL_EMPLOYEES_BADGE,
      badgeBg: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300',
      icon: Users,
      iconBg:
        'bg-purple-50/80 dark:bg-purple-950/80 group-hover:bg-purple-600 group-hover:text-white',
      iconColor: 'text-purple-600 dark:text-purple-400',
      accentGlow: 'hover:border-purple-300 dark:hover:border-purple-800 hover:shadow-purple-500/10',
      barColor: 'from-purple-500 to-pink-500',
      description: ALLOCATION_CARDS_TEXT.TOTAL_EMPLOYEES_DESC,
    },
    {
      title: translateAllocations('kpi.allocationRate', {
        defaultValue: ALLOCATION_CARDS_TEXT.DEPLOYMENT_RATE_TITLE,
      }),
      value: `${allocationPercent}%`,
      badge: `${allocatedCount}/${totalAssets} ${translateAllocations('kpi.activeSuffix', { defaultValue: ALLOCATION_CARDS_TEXT.ACTIVE_BADGE_SUFFIX })}`,
      badgeBg: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
      icon: Laptop,
      iconBg: 'bg-blue-50/80 dark:bg-blue-950/80 group-hover:bg-blue-600 group-hover:text-white',
      iconColor: 'text-blue-600 dark:text-blue-400',
      accentGlow: 'hover:border-blue-300 dark:hover:border-blue-800 hover:shadow-blue-500/10',
      barColor: 'from-blue-500 to-cyan-500',
      description: ALLOCATION_CARDS_TEXT.DEPLOYMENT_RATE_DESC,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cardItems.map((item) => (
        <StatCard
          key={item.title}
          title={item.title}
          value={item.value}
          badge={item.badge}
          badgeBg={item.badgeBg}
          icon={item.icon}
          iconBg={item.iconBg}
          iconColor={item.iconColor}
          accentGlow={item.accentGlow}
          barColor={item.barColor}
          description={item.description}
        />
      ))}
    </div>
  );
};

export default AllocationCards;
