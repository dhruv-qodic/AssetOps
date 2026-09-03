import React from 'react';
import { Users, UserCheck, UserX, Briefcase } from 'lucide-react';
import { useEmployeeStore } from '@/store/useEmployeeStore';

export const EmployeeCards: React.FC = () => {
  const { employees, getStats } = useEmployeeStore();
  const stats = getStats();

  const totalEmployees = stats.totalEmployees || 0;
  const activeCount = stats.active || 0;
  const inactiveCount = stats.inactive || 0;
  const terminatedCount = stats.terminated || 0;
  const inactiveTotal = inactiveCount + terminatedCount;
  
  const fullTimeCount = employees.filter((e) => e.type === 'full-time').length;
  const activePercentage = totalEmployees > 0 ? Math.round((activeCount / totalEmployees) * 100) : 0;

  const cardData = [
    {
      title: 'Total Employees',
      value: totalEmployees,
      subtext: 'Registered workforce',
      icon: Users,
      iconBg: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
      badge: `${totalEmployees} Total`,
      badgeStyle: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
    },
    {
      title: 'Active Employees',
      value: activeCount,
      subtext: `${activePercentage}% active rate`,
      icon: UserCheck,
      iconBg: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
      badge: 'Active',
      badgeStyle: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
    },
    {
      title: 'Inactive & Terminated',
      value: inactiveTotal,
      subtext: `${inactiveCount} Inactive • ${terminatedCount} Terminated`,
      icon: UserX,
      iconBg: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
      badge: 'Offboarding',
      badgeStyle: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
    },
    {
      title: 'Full-Time Staff',
      value: fullTimeCount,
      subtext: 'Permanent employment',
      icon: Briefcase,
      iconBg: 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400',
      badge: `${totalEmployees > 0 ? Math.round((fullTimeCount / totalEmployees) * 100) : 0}% of Total`,
      badgeStyle: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cardData.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div
            key={index}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-xs transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2 rounded-lg ${card.iconBg}`}>
                <IconComponent className="size-5 stroke-[2.2]" />
              </div>
            </div>

            <div className="flex items-baseline justify-between gap-2">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {card.value}
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${card.badgeStyle}`}>
                {card.badge}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 truncate">
              {card.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default EmployeeCards;
