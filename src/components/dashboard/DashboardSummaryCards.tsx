import React, { useMemo } from 'react';
import {
  Boxes,
  PackageCheck,
  UserCheck,
  Wrench,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useAssetStore } from '@/store/useAssetStore';
import { useDashboardStore } from '@/store/useDashboardStore';

export const DashboardSummaryCards: React.FC = () => {
  const assets = useAssetStore((s) => s.assets);
  const { visibleCardIds, selectedLocation } = useDashboardStore();

  // Filter assets dynamically by location if selected
  const activeAssets = useMemo(() => {
    if (selectedLocation === 'All') return assets;
    return assets.filter((a) => a.location.toLowerCase() === selectedLocation.toLowerCase());
  }, [assets, selectedLocation]);

  const totalAssetsCount = activeAssets.length;
  const availableCount = activeAssets.filter((a) => a.status === 'Available').length;
  const allocatedCount = activeAssets.filter((a) => a.status === 'Allocated').length;
  const maintenanceCount = activeAssets.filter((a) => a.status === 'Maintenance').length;

  // Calculate total asset value sum
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
  const formattedValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(totalAssetValue);

  const cardDefinitions = [
    {
      id: 'total_assets',
      title: 'Total Assets',
      value: totalAssetsCount.toLocaleString(),
      badge: 'Active Fleet',
      badgeIcon: Sparkles,
      badgeStyle: 'bg-indigo-50 text-[#4C40F7] dark:bg-indigo-950/60 dark:text-indigo-300',
      icon: Boxes,
      iconBg:
        'bg-indigo-50 text-[#4C40F7] dark:bg-indigo-950/80 dark:text-indigo-400 group-hover:bg-[#4C40F7] group-hover:text-white',
      accentGlow: 'hover:border-indigo-300 dark:hover:border-indigo-800 hover:shadow-indigo-500/10',
      barColor: 'from-[#4C40F7] to-blue-500',
      description:
        selectedLocation === 'All'
          ? 'Across all branches & offices'
          : `Located in ${selectedLocation}`,
    },
    {
      id: 'available_assets',
      title: 'Available Assets',
      value: availableCount.toLocaleString(),
      badge: `${availablePercent}% available`,
      badgeIcon: TrendingUp,
      badgeStyle: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
      icon: PackageCheck,
      iconBg:
        'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white',
      accentGlow:
        'hover:border-emerald-300 dark:hover:border-emerald-800 hover:shadow-emerald-500/10',
      barColor: 'from-emerald-500 to-teal-500',
      description: 'Ready for employee assignment',
    },
    {
      id: 'assigned_assets',
      title: 'Assigned Assets',
      value: allocatedCount.toLocaleString(),
      badge: `${allocatedPercent}% deployed`,
      badgeIcon: TrendingUp,
      badgeStyle: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
      icon: UserCheck,
      iconBg:
        'bg-blue-50 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white',
      accentGlow: 'hover:border-blue-300 dark:hover:border-blue-800 hover:shadow-blue-500/10',
      barColor: 'from-blue-500 to-cyan-500',
      description: 'Actively in use across departments',
    },
    {
      id: 'maintenance_assets',
      title: 'In Maintenance',
      value: maintenanceCount.toLocaleString(),
      badge: `${maintenancePercent}% servicing`,
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
      description: 'Under repair or routine diagnostics',
    },
    {
      id: 'total_asset_value',
      title: 'Total Asset Value',
      value: formattedValue,
      badge: 'Acquisition Value',
      badgeIcon: Sparkles,
      badgeStyle: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300',
      icon: DollarSign,
      iconBg:
        'bg-purple-50 text-purple-600 dark:bg-purple-950/80 dark:text-purple-400 group-hover:bg-purple-600 group-hover:text-white',
      accentGlow: 'hover:border-purple-300 dark:hover:border-purple-800 hover:shadow-purple-500/10',
      barColor: 'from-purple-500 to-pink-500',
      description: 'Cumulative hardware book cost',
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
      {visibleCards.map((card) => {
        const Icon = card.icon;
        const BadgeIcon = card.badgeIcon;
        return (
          <Card
            key={card.id}
            className={`group relative overflow-hidden border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 shadow-xs hover:shadow-lg transition-all duration-300 ease-out hover:-translate-y-0.5 text-left ${card.accentGlow}`}
          >
            {/* Top Accent Gradient Line */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.barColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            />

            <CardContent className="p-5 flex flex-col justify-between h-full space-y-3.5">
              <div className="flex items-start justify-between">
                <span className="text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400 uppercase">
                  {card.title}
                </span>
                <div
                  className={`p-2 rounded-xl ${card.iconBg} transition-all duration-300 group-hover:scale-110 shadow-xs`}
                >
                  <Icon className="size-4.5 transition-colors duration-300" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-[#4C40F7] dark:group-hover:text-[#4C40F7] transition-colors duration-300">
                    {card.value}
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${card.badgeStyle}`}
                  >
                    <BadgeIcon className="size-3" />
                    {card.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium truncate">
                  {card.description}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardSummaryCards;
