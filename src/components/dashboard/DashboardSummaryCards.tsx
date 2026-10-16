import React, { useMemo } from 'react';
import {
  Boxes,
  PackageCheck,
  UserCheck,
  Wrench,
  TrendingUp,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAssetStore } from '@/store/useAssetStore';
import { useDashboardStore } from '@/store/useDashboardStore';
import {
  DASHBOARD_SUMMARY_CARD_IDS,
  DASHBOARD_SUMMARY_CARDS_TEXT,
} from './constants/DashboardSummaryCards.constants';
import { useCurrency } from '@/hooks/useCurrency';
import { StatCard } from '@/components/common/StatCard';
import { cn } from '@/lib/utils';

/**
 * @description: Renders the top overview KPI metrics cards (total, available, assigned, maintenance, valuation)
 * @return {JSX.Element | null}: React grid of dashboard KPI metric cards or null if all cards are hidden
 */
export const DashboardSummaryCards: React.FC = () => {
  const { t: translateDashboard } = useTranslation('dashboard');
  const assets = useAssetStore((s) => s.assets);
  const { visibleCardIds, selectedLocation } = useDashboardStore();
  const { format, symbol } = useCurrency();

  /**
   * @description: Filters asset records according to the location selected in the dashboard header
   * @return {Asset[]}: Filtered asset list
   */
  const activeAssets = useMemo(() => {
    if (selectedLocation === 'All') return assets;
    return assets.filter((a) => a.location.toLowerCase() === selectedLocation.toLowerCase());
  }, [assets, selectedLocation]);

  const totalAssetsCount = activeAssets.length;
  const availableCount = activeAssets.filter((a) => a.status === 'Available').length;
  const allocatedCount = activeAssets.filter((a) => a.status === 'Allocated').length;
  const maintenanceCount = activeAssets.filter((a) => a.status === 'Maintenance').length;

  /**
   * @description: Calculates the cumulative monetary valuation of all active hardware assets
   * @return {number}: Total purchase cost sum
   */
  const totalAssetValue = useMemo(() => {
    return activeAssets.reduce((sum, asset) => {
      return sum + (asset.purchaseCost || 0);
    }, 0);
  }, [activeAssets]);

  // Derived percentages
  const availablePercent = totalAssetsCount
    ? Math.round((availableCount / totalAssetsCount) * 100)
    : 0;
  const allocatedPercent = totalAssetsCount
    ? Math.round((allocatedCount / totalAssetsCount) * 100)
    : 0;
  const maintenancePercent = totalAssetsCount
    ? Math.round((maintenanceCount / totalAssetsCount) * 100)
    : 0;

  // Format currency
  const formattedValue = format(totalAssetValue);

  const CurrencyIcon = React.useCallback(
    ({ className }: { className?: string }) => (
      <span
        className={cn(
          'text-base font-bold font-mono flex items-center justify-center leading-none',
          className,
        )}
      >
        {symbol}
      </span>
    ),
    [symbol],
  );

  const cardDefinitions = [
    {
      id: DASHBOARD_SUMMARY_CARD_IDS.TOTAL_ASSETS,
      title: translateDashboard('kpi.totalAssets', {
        defaultValue: DASHBOARD_SUMMARY_CARDS_TEXT.TOTAL_ASSETS_TITLE,
      }),
      value: totalAssetsCount.toLocaleString(),
      badge: DASHBOARD_SUMMARY_CARDS_TEXT.TOTAL_ASSETS_BADGE,
      badgeIcon: Sparkles,
      badgeStyle: 'bg-primary/10 text-primary',
      icon: Boxes,
      iconBg:
        'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground',
      accentGlow: 'hover:border-primary/40 hover:shadow-primary/10',
      barColor: 'from-primary to-primary/70',
      description:
        selectedLocation === 'All'
          ? translateDashboard('kpi.cards.totalAssets', {
              defaultValue: DASHBOARD_SUMMARY_CARDS_TEXT.TOTAL_ASSETS_ALL_LOCATIONS_DESC,
            })
          : DASHBOARD_SUMMARY_CARDS_TEXT.getLocationDesc(selectedLocation),
    },
    {
      id: DASHBOARD_SUMMARY_CARD_IDS.AVAILABLE_ASSETS,
      title: translateDashboard('kpi.availableAssets', {
        defaultValue: DASHBOARD_SUMMARY_CARDS_TEXT.AVAILABLE_ASSETS_TITLE,
      }),
      value: availableCount.toLocaleString(),
      badge: `${availablePercent}% ${DASHBOARD_SUMMARY_CARDS_TEXT.AVAILABLE_BADGE_SUFFIX}`,
      badgeIcon: TrendingUp,
      badgeStyle: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
      icon: PackageCheck,
      iconBg:
        'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white',
      accentGlow:
        'hover:border-emerald-300 dark:hover:border-emerald-800 hover:shadow-emerald-500/10',
      barColor: 'from-emerald-500 to-teal-500',
      description: translateDashboard('kpi.cards.availableAssets', {
        defaultValue: DASHBOARD_SUMMARY_CARDS_TEXT.AVAILABLE_ASSETS_DESC,
      }),
    },
    {
      id: DASHBOARD_SUMMARY_CARD_IDS.ASSIGNED_ASSETS,
      title: translateDashboard('kpi.assignedAssets', {
        defaultValue: DASHBOARD_SUMMARY_CARDS_TEXT.ASSIGNED_ASSETS_TITLE,
      }),
      value: allocatedCount.toLocaleString(),
      badge: `${allocatedPercent}% ${DASHBOARD_SUMMARY_CARDS_TEXT.DEPLOYED_BADGE_SUFFIX}`,
      badgeIcon: TrendingUp,
      badgeStyle: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
      icon: UserCheck,
      iconBg:
        'bg-blue-50 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white',
      accentGlow: 'hover:border-blue-300 dark:hover:border-blue-800 hover:shadow-blue-500/10',
      barColor: 'from-blue-500 to-cyan-500',
      description: translateDashboard('kpi.cards.assignedAssets', {
        defaultValue: DASHBOARD_SUMMARY_CARDS_TEXT.ASSIGNED_ASSETS_DESC,
      }),
    },
    {
      id: DASHBOARD_SUMMARY_CARD_IDS.MAINTENANCE_ASSETS,
      title: translateDashboard('kpi.maintenanceAssets', {
        defaultValue: DASHBOARD_SUMMARY_CARDS_TEXT.MAINTENANCE_ASSETS_TITLE,
      }),
      value: maintenanceCount.toLocaleString(),
      badge: `${maintenancePercent}% ${DASHBOARD_SUMMARY_CARDS_TEXT.SERVICING_BADGE_SUFFIX}`,
      badgeIcon: AlertCircle,
      badgeStyle:
        maintenanceCount > 0
          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
          : 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
      icon: Wrench,
      iconBg:
        'bg-amber-50 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400 group-hover:bg-amber-600 group-hover:text-white',
      accentGlow: 'hover:border-amber-300 dark:hover:border-amber-800 hover:shadow-amber-500/10',
      barColor: 'from-amber-500 to-orange-500',
      description: translateDashboard('kpi.cards.maintenanceAssets', {
        defaultValue: DASHBOARD_SUMMARY_CARDS_TEXT.MAINTENANCE_ASSETS_DESC,
      }),
    },
    {
      id: DASHBOARD_SUMMARY_CARD_IDS.TOTAL_ASSET_VALUE,
      title: translateDashboard('kpi.totalAssetValue', {
        defaultValue: DASHBOARD_SUMMARY_CARDS_TEXT.TOTAL_VALUE_TITLE,
      }),
      value: formattedValue,
      badge: DASHBOARD_SUMMARY_CARDS_TEXT.TOTAL_VALUE_BADGE,
      badgeIcon: Sparkles,
      badgeStyle: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300',
      icon: CurrencyIcon,
      iconBg:
        'bg-purple-50 text-purple-600 dark:bg-purple-950/80 dark:text-purple-400 group-hover:bg-purple-600 group-hover:text-white',
      accentGlow: 'hover:border-purple-300 dark:hover:border-purple-800 hover:shadow-purple-500/10',
      barColor: 'from-purple-500 to-pink-500',
      description: translateDashboard('kpi.cards.totalAssetValue', {
        defaultValue: DASHBOARD_SUMMARY_CARDS_TEXT.TOTAL_VALUE_DESC,
      }),
    },
  ];

  const visibleCards = cardDefinitions.filter((card) => visibleCardIds.includes(card.id));

  if (visibleCards.length === 0) {
    return null;
  }

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${
        visibleCards.length >= 4 ? 'xl:grid-cols-5' : 'xl:grid-cols-4'
      } gap-4`}
    >
      {visibleCards.map((card) => (
        <StatCard
          key={card.id}
          title={card.title}
          value={card.value}
          badge={card.badge}
          badgeStyle={card.badgeStyle}
          badgeIcon={card.badgeIcon}
          icon={card.icon}
          iconBg={card.iconBg}
          accentGlow={card.accentGlow}
          barColor={card.barColor}
          description={card.description}
        />
      ))}
    </div>
  );
};

export default DashboardSummaryCards;
