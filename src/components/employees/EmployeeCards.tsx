import { Users, UserCheck, UserX, Briefcase } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { StatCard } from '@/components/common/StatCard';
import {
  EMPLOYEE_CARDS_TITLES,
  EMPLOYEE_CARDS_BADGES,
  EMPLOYEE_CARDS_DESCRIPTIONS,
} from './constants/EmployeeCards.constants';

/**
 * @ description: Displays summary metric cards for employee headcount, active employees, leaves, and full-time ratio.
 * @returns {JSX.Element} Grid of employee overview cards JSX.
 */
export const EmployeeCards: React.FC = () => {
  const { t: translateEmployees } = useTranslation('employee');
  const getStats = useEmployeeStore((s) => s.getStats);
  const stats = getStats();

  const totalEmployees = stats.totalEmployees || 0;
  const activeEmployees = stats.active || 0;
  const inactiveAndTerminated = (stats.inactive || 0) + (stats.terminated || 0);
  const fullTimeStaff = stats.byType['full-time'] || 0;

  const activePercent = totalEmployees ? Math.round((activeEmployees / totalEmployees) * 100) : 0;
  const inactivePercent = totalEmployees
    ? Math.round((inactiveAndTerminated / totalEmployees) * 100)
    : 0;
  const fullTimePercent = totalEmployees ? Math.round((fullTimeStaff / totalEmployees) * 100) : 0;

  const cardItems = [
    {
      title: translateEmployees('cards.totalEmployees', {
        defaultValue: EMPLOYEE_CARDS_TITLES.TOTAL_EMPLOYEES,
      }),
      value: totalEmployees,
      badge: translateEmployees('cards.allStaff', {
        defaultValue: EMPLOYEE_CARDS_BADGES.ALL_STAFF,
      }),
      badgeBg: 'bg-primary/10 text-primary',
      icon: Users,
      iconBg: 'bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground',
      iconColor: 'text-primary',
      accentGlow: 'hover:border-primary/40 hover:shadow-primary/10',
      barColor: 'from-primary to-primary/70',
      description: translateEmployees('cards.totalWorkforce', {
        defaultValue: EMPLOYEE_CARDS_DESCRIPTIONS.TOTAL_WORKFORCE,
      }),
    },
    {
      title: translateEmployees('cards.activeEmployees', {
        defaultValue: EMPLOYEE_CARDS_TITLES.ACTIVE_EMPLOYEES,
      }),
      value: activeEmployees,
      badge: `${activePercent}${translateEmployees('cards.activeSuffix', {
        defaultValue: EMPLOYEE_CARDS_BADGES.ACTIVE_SUFFIX,
      })}`,
      badgeBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
      icon: UserCheck,
      iconBg:
        'bg-emerald-50/80 dark:bg-emerald-950/80 group-hover:bg-emerald-600 group-hover:text-white',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      accentGlow:
        'hover:border-emerald-300 dark:hover:border-emerald-800 hover:shadow-emerald-500/10',
      barColor: 'from-emerald-500 to-teal-500',
      description: translateEmployees('cards.activeWorkforce', {
        defaultValue: EMPLOYEE_CARDS_DESCRIPTIONS.ACTIVE_WORKFORCE,
      }),
    },
    {
      title: translateEmployees('cards.inactiveTerminated', {
        defaultValue: EMPLOYEE_CARDS_TITLES.INACTIVE_TERMINATED,
      }),
      value: inactiveAndTerminated,
      badge: `${inactivePercent}${translateEmployees('cards.inactiveSuffix', {
        defaultValue: EMPLOYEE_CARDS_BADGES.INACTIVE_SUFFIX,
      })}`,
      badgeBg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
      icon: UserX,
      iconBg: 'bg-amber-50/80 dark:bg-amber-950/80 group-hover:bg-amber-600 group-hover:text-white',
      iconColor: 'text-amber-600 dark:text-amber-400',
      accentGlow: 'hover:border-amber-300 dark:hover:border-amber-800 hover:shadow-amber-500/10',
      barColor: 'from-amber-500 to-orange-500',
      description: translateEmployees('cards.leaveOrDeparted', {
        defaultValue: EMPLOYEE_CARDS_DESCRIPTIONS.LEAVE_OR_DEPARTED,
      }),
    },
    {
      title: translateEmployees('cards.fullTimeStaff', {
        defaultValue: EMPLOYEE_CARDS_TITLES.FULL_TIME_STAFF,
      }),
      value: fullTimeStaff,
      badge: `${fullTimePercent}${translateEmployees('cards.ratioSuffix', {
        defaultValue: EMPLOYEE_CARDS_BADGES.RATIO_SUFFIX,
      })}`,
      badgeBg: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
      icon: Briefcase,
      iconBg: 'bg-blue-50/80 dark:bg-blue-950/80 group-hover:bg-blue-600 group-hover:text-white',
      iconColor: 'text-blue-600 dark:text-blue-400',
      accentGlow: 'hover:border-blue-300 dark:hover:border-blue-800 hover:shadow-blue-500/10',
      barColor: 'from-blue-500 to-blue-600',
      description: translateEmployees('cards.permanentStatus', {
        defaultValue: EMPLOYEE_CARDS_DESCRIPTIONS.PERMANENT_STATUS,
      }),
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

export default EmployeeCards;
