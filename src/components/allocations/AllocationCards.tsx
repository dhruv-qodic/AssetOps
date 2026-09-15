import React from 'react';
import { Layers, Box, Users, Laptop, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useAssetStore } from '@/store/useAssetStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';

export const AllocationCards: React.FC = () => {
  const { assets } = useAssetStore();
  const { employees } = useEmployeeStore();

  const totalAssets = assets.length || 0;
  const allocatedAssets = assets.filter(
    (a) => a.status === 'Allocated' && a.assignedTo !== null
  );
  const allocatedCount = allocatedAssets.length;
  const availableCount = assets.filter((a) => a.status === 'Available').length;
  const totalEmployees = employees.length || 0;

  const allocationPercent = totalAssets ? Math.round((allocatedCount / totalAssets) * 100) : 0;
  const availablePercent = totalAssets ? Math.round((availableCount / totalAssets) * 100) : 0;

  const cardItems = [
    {
      title: 'Total Allocations',
      value: allocatedCount,
      badge: `${allocationPercent}% allocated`,
      badgeBg: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300',
      icon: Layers,
      iconBg: 'bg-indigo-50/80 dark:bg-indigo-950/80 group-hover:bg-indigo-600 group-hover:text-white',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      accentGlow: 'hover:border-indigo-300 dark:hover:border-indigo-800 hover:shadow-indigo-500/10',
      barColor: 'from-indigo-500 to-blue-500',
      description: 'Currently assigned hardware',
    },
    {
      title: 'Available Assets',
      value: availableCount,
      badge: `${availablePercent}% ready`,
      badgeBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
      icon: Box,
      iconBg: 'bg-emerald-50/80 dark:bg-emerald-950/80 group-hover:bg-emerald-600 group-hover:text-white',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      accentGlow: 'hover:border-emerald-300 dark:hover:border-emerald-800 hover:shadow-emerald-500/10',
      barColor: 'from-emerald-500 to-teal-500',
      description: 'Ready for assignment',
    },
    {
      title: 'Total Employees',
      value: totalEmployees,
      badge: 'All staff',
      badgeBg: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300',
      icon: Users,
      iconBg: 'bg-purple-50/80 dark:bg-purple-950/80 group-hover:bg-purple-600 group-hover:text-white',
      iconColor: 'text-purple-600 dark:text-purple-400',
      accentGlow: 'hover:border-purple-300 dark:hover:border-purple-800 hover:shadow-purple-500/10',
      barColor: 'from-purple-500 to-pink-500',
      description: 'Staff directory members',
    },
    {
      title: 'Deployment Rate',
      value: `${allocationPercent}%`,
      badge: `${allocatedCount}/${totalAssets} active`,
      badgeBg: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
      icon: Laptop,
      iconBg: 'bg-blue-50/80 dark:bg-blue-950/80 group-hover:bg-blue-600 group-hover:text-white',
      iconColor: 'text-blue-600 dark:text-blue-400',
      accentGlow: 'hover:border-blue-300 dark:hover:border-blue-800 hover:shadow-blue-500/10',
      barColor: 'from-blue-500 to-cyan-500',
      description: 'Asset utilization efficiency',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cardItems.map((item) => {
        const Icon = item.icon;
        return (
          <Card
            key={item.title}
            className={`group relative overflow-hidden border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 shadow-xs hover:shadow-lg transition-all duration-300 ease-out hover:-translate-y-1 cursor-pointer ${item.accentGlow}`}
          >
            {/* Top Accent Gradient Bar on Hover */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.barColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            />

            <CardContent className="p-5 flex flex-col justify-between h-full space-y-3">
              <div className="flex items-start justify-between">
                <span className="text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400 uppercase">
                  {item.title}
                </span>
                <div
                  className={`p-2.5 rounded-xl ${item.iconBg} ${item.iconColor} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-xs`}
                >
                  <Icon className="size-5 transition-colors duration-300" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-baseline justify-between">
                  <div className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                    {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${item.badgeBg}`}
                  >
                    <TrendingUp className="size-3" />
                    {item.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                  {item.description}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AllocationCards;
