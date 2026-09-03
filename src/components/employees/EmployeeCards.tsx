import React from 'react';
import { Users, UserCheck, UserX, Briefcase, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useEmployeeStore } from '@/store/useEmployeeStore';

export const EmployeeCards: React.FC = () => {
  const { getStats } = useEmployeeStore();
  const stats = getStats();

  const totalEmployees = stats.totalEmployees || 0;
  const activeEmployees = stats.active || 0;
  const inactiveAndTerminated = (stats.inactive || 0) + (stats.terminated || 0);
  const fullTimeStaff = stats.byType['full-time'] || 0;

  const activePercent = totalEmployees ? Math.round((activeEmployees / totalEmployees) * 100) : 0;
  const inactivePercent = totalEmployees ? Math.round((inactiveAndTerminated / totalEmployees) * 100) : 0;
  const fullTimePercent = totalEmployees ? Math.round((fullTimeStaff / totalEmployees) * 100) : 0;

  const cardItems = [
    {
      title: 'Total Employees',
      value: totalEmployees,
      badge: 'All staff',
      badgeBg: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300',
      icon: Users,
      iconBg: 'bg-indigo-50/80 dark:bg-indigo-950/80 group-hover:bg-indigo-600 group-hover:text-white',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      accentGlow: 'hover:border-indigo-300 dark:hover:border-indigo-800 hover:shadow-indigo-500/10',
      barColor: 'from-indigo-500 to-blue-500',
      description: 'Total workforce headcount',
    },
    {
      title: 'Active Employees',
      value: activeEmployees,
      badge: `${activePercent}% active`,
      badgeBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
      icon: UserCheck,
      iconBg: 'bg-emerald-50/80 dark:bg-emerald-950/80 group-hover:bg-emerald-600 group-hover:text-white',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      accentGlow: 'hover:border-emerald-300 dark:hover:border-emerald-800 hover:shadow-emerald-500/10',
      barColor: 'from-emerald-500 to-teal-500',
      description: 'Currently active workforce',
    },
    {
      title: 'Inactive & Terminated',
      value: inactiveAndTerminated,
      badge: `${inactivePercent}% of total`,
      badgeBg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
      icon: UserX,
      iconBg: 'bg-amber-50/80 dark:bg-amber-950/80 group-hover:bg-amber-600 group-hover:text-white',
      iconColor: 'text-amber-600 dark:text-amber-400',
      accentGlow: 'hover:border-amber-300 dark:hover:border-amber-800 hover:shadow-amber-500/10',
      barColor: 'from-amber-500 to-orange-500',
      description: 'On leave or departed',
    },
    {
      title: 'Full-Time Staff',
      value: fullTimeStaff,
      badge: `${fullTimePercent}% ratio`,
      badgeBg: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300',
      icon: Briefcase,
      iconBg: 'bg-purple-50/80 dark:bg-purple-950/80 group-hover:bg-purple-600 group-hover:text-white',
      iconColor: 'text-purple-600 dark:text-purple-400',
      accentGlow: 'hover:border-purple-300 dark:hover:border-purple-800 hover:shadow-purple-500/10',
      barColor: 'from-purple-500 to-pink-500',
      description: 'Permanent employment status',
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
                    {item.value.toLocaleString()}
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

export default EmployeeCards;
