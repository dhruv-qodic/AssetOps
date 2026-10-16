import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Clock, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useActivityStore } from '@/store/useActivityStore';
import type { ActivityRecord } from '@/types/activity';
import { cn } from '@/lib/utils';
import { DASHBOARD_RECENT_ACTIVITY_TEXT } from './constants/DashboardRecentActivity.constants';
import { formatRelativeTime, formatDateTime } from '@/utils/date';
import { getActivityStyle } from '@/utils/activityStyles';

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

/**
 * @description: Displays a real-time activity feed component showing recent lifecycle events across assets and employees
 * @return {JSX.Element}: React dashboard recent activity feed component
 */
export const DashboardRecentActivity: React.FC = () => {
  const { t: translateDashboard } = useTranslation('dashboard');
  const navigate = useNavigate();
  const rawActivities = useActivityStore((s) => s.activities);

  // Take top 5 dynamic recent activities
  /**
   * @description: Transforms and enriches the latest 5 raw activity logs with icons, badges, and relative times
   * @return {Array<ActivityItem>}: Array of formatted ActivityItem records
   */
  const recentActivities = useMemo<ActivityItem[]>(() => {
    return rawActivities.slice(0, 5).map((act) => {
      const actionType = act.actionType;
      const config = getActivityStyle(actionType);
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

  /**
   * @description: Navigates the user to the comprehensive history and audit log page
   * @return {void}: void
   */
  const handleViewAll = () => {
    void navigate(DASHBOARD_RECENT_ACTIVITY_TEXT.HISTORY_ROUTE);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full text-left">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-1.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Activity className="size-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {translateDashboard('widgets.recentActivity', {
                defaultValue: DASHBOARD_RECENT_ACTIVITY_TEXT.TITLE,
              })}
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              {translateDashboard('widgets.recentActivityDesc', {
                defaultValue: DASHBOARD_RECENT_ACTIVITY_TEXT.SUBTITLE,
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full hidden sm:inline-block">
            {DASHBOARD_RECENT_ACTIVITY_TEXT.LIVE_FEED_BADGE}
          </span>
          <button
            type="button"
            onClick={handleViewAll}
            className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>
              {translateDashboard('recentActivityFeed.viewAllButton', {
                defaultValue: DASHBOARD_RECENT_ACTIVITY_TEXT.VIEW_ALL_BUTTON,
              })}
            </span>
            <ArrowRight className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Activity List or Empty State */}
      {recentActivities.length === 0 ? (
        <div className="py-12 text-center flex flex-col border border-base rounded-md border-dashed items-center justify-center text-slate-400 dark:text-slate-500 my-auto">
          <div className="p-2 mb-2 rounded-full bg-primary/10 text-primary">
            <Activity className="size-6" />
          </div>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
            {translateDashboard('recentActivityFeed.noActivity', {
              defaultValue: DASHBOARD_RECENT_ACTIVITY_TEXT.EMPTY_TITLE,
            })}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {DASHBOARD_RECENT_ACTIVITY_TEXT.EMPTY_SUBTITLE}
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
                      <span>
                        {translateDashboard('recentActivityFeed.loggedBy', {
                          name: item.actor.name,
                          defaultValue: `by ${item.actor.name}`,
                        })}
                      </span>
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
                <div
                  className="flex items-center gap-1 text-[11px] text-slate-400 shrink-0 mt-0.5"
                  title={formatDateTime(item.timestamp)}
                >
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
