import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  UserPlus,
  CornerDownLeft,
  PlusCircle,
  Edit3,
  Wrench,
  Clock,
  Laptop,
  Trash2,
  UserMinus,
  User,
  ArrowRight,
} from 'lucide-react';
import { useActivityStore } from '@/store/useActivityStore';
import type { ActivityRecord, ActivityType } from '@/types/activity';
import { cn } from '@/lib/utils';

export interface ActivityItem extends ActivityRecord {
  assetName: string;
  badge: string;
  badgeClass: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  entityIcon: React.ElementType;
  formattedTimestamp: string;
}

function formatRelativeTime(dateString: string): string {
  if (!dateString) return 'Recently';

  // If already relative formatted (e.g. '12m ago')
  if (dateString.includes('ago') || dateString === 'Just now') {
    return dateString;
  }

  const parsed = new Date(dateString).getTime();
  if (isNaN(parsed)) return dateString;

  const diffMs = Date.now() - parsed;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 45) return 'Just now';
  if (diffMin < 60) return `${Math.max(1, diffMin)}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 30) return `${diffDay}d ago`;

  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function getActivityConfig(type: ActivityType) {
  switch (type) {
    case 'asset_allocated':
    case 'assigned':
      return {
        defaultBadge: 'Allocated',
        badgeClass: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300',
        icon: UserPlus,
        iconBg: 'bg-indigo-50 dark:bg-indigo-950/60',
        iconColor: 'text-indigo-600 dark:text-indigo-400',
        entityIcon: Laptop,
      };
    case 'asset_deallocated':
    case 'returned':
      return {
        defaultBadge: 'Returned',
        badgeClass: 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300',
        icon: CornerDownLeft,
        iconBg: 'bg-sky-50 dark:bg-sky-950/60',
        iconColor: 'text-sky-600 dark:text-sky-400',
        entityIcon: Laptop,
      };
    case 'asset_created':
    case 'created':
      return {
        defaultBadge: 'Created',
        badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
        icon: PlusCircle,
        iconBg: 'bg-emerald-50 dark:bg-emerald-950/60',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        entityIcon: Laptop,
      };
    case 'asset_updated':
    case 'updated':
      return {
        defaultBadge: 'Updated',
        badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
        icon: Edit3,
        iconBg: 'bg-slate-100 dark:bg-slate-800',
        iconColor: 'text-slate-600 dark:text-slate-400',
        entityIcon: Laptop,
      };
    case 'asset_deleted':
    case 'deleted':
      return {
        defaultBadge: 'Deleted',
        badgeClass: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
        icon: Trash2,
        iconBg: 'bg-rose-50 dark:bg-rose-950/60',
        iconColor: 'text-rose-600 dark:text-rose-400',
        entityIcon: Laptop,
      };
    case 'asset_maintenance':
    case 'maintenance':
      return {
        defaultBadge: 'Maintenance',
        badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
        icon: Wrench,
        iconBg: 'bg-amber-50 dark:bg-amber-950/60',
        iconColor: 'text-amber-600 dark:text-amber-400',
        entityIcon: Laptop,
      };
    case 'employee_created':
      return {
        defaultBadge: 'Onboarded',
        badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
        icon: UserPlus,
        iconBg: 'bg-emerald-50 dark:bg-emerald-950/60',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        entityIcon: User,
      };
    case 'employee_updated':
      return {
        defaultBadge: 'Updated',
        badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
        icon: Edit3,
        iconBg: 'bg-slate-100 dark:bg-slate-800',
        iconColor: 'text-slate-600 dark:text-slate-400',
        entityIcon: User,
      };
    case 'employee_deleted':
      return {
        defaultBadge: 'Removed',
        badgeClass: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
        icon: UserMinus,
        iconBg: 'bg-rose-50 dark:bg-rose-950/60',
        iconColor: 'text-rose-600 dark:text-rose-400',
        entityIcon: User,
      };
    default:
      return {
        defaultBadge: 'Activity',
        badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
        icon: Activity,
        iconBg: 'bg-slate-100 dark:bg-slate-800',
        iconColor: 'text-slate-600 dark:text-slate-400',
        entityIcon: Laptop,
      };
  }
}

export const DashboardRecentActivity: React.FC = () => {
  const navigate = useNavigate();
  const rawActivities = useActivityStore((s) => s.activities);

  // Take top 5 dynamic recent activities
  const recentActivities = useMemo<ActivityItem[]>(() => {
    return rawActivities.slice(0, 5).map((act) => {
      const config = getActivityConfig(act.type);
      return {
        ...act,
        assetName: act.entityName,
        badge: act.badge || config.defaultBadge,
        badgeClass: act.badgeClass || config.badgeClass,
        icon: config.icon,
        iconBg: config.iconBg,
        iconColor: config.iconColor,
        entityIcon: config.entityIcon,
        formattedTimestamp: formatRelativeTime(act.timestamp),
      };
    });
  }, [rawActivities]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full text-left">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-1.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
            <Activity className="size-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Recent Activity
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Real-time audit log of hardware lifecycle events
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full hidden sm:inline-block">
            Live Feed
          </span>
          <button
            type="button"
            onClick={() => navigate('/history')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Activity List or Empty State */}
      {recentActivities.length === 0 ? (
        <div className="py-12 text-center flex flex-col border border-base rounded-md border-dashed items-center justify-center text-slate-400 dark:text-slate-500 my-auto">
          <div className="p-2 mb-2 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
            <Activity className="size-6" />
          </div>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
            No recent activity recorded
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Actions performed across assets and employees will appear here in real time.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800/60 my-2 overflow-y-auto max-h-[300px] sm:max-h-[320px] pr-1">
          {recentActivities.map((item) => {
            const Icon = item.icon;
            const EntityIcon = item.entityIcon;
            return (
              <div
                key={item.id}
                className="py-3 sm:py-3.5 flex items-start justify-between gap-3 group hover:bg-slate-50/60 dark:hover:bg-slate-800/30 -mx-2 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={cn(
                      'p-2 rounded-xl shrink-0 mt-0.5 transition-transform group-hover:scale-105',
                      item.iconBg,
                      item.iconColor,
                    )}
                  >
                    <Icon className="size-4" />
                  </div>

                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {item.title}
                      </span>
                      <span
                        className={cn(
                          'text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0',
                          item.badgeClass,
                        )}
                      >
                        {item.badge}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium truncate flex items-center gap-1.5">
                      <EntityIcon className="size-3 text-slate-400 shrink-0" />
                      <span>{item.assetName}</span>
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>by {item.actor}</span>
                      {item.department && (
                        <>
                          <span>•</span>
                          <span>{item.department}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="flex items-center gap-1 text-[11px] text-slate-400 shrink-0 mt-0.5">
                  <Clock className="size-3" />
                  <span>{item.formattedTimestamp}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DashboardRecentActivity;
