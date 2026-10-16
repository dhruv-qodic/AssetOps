import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, ArrowRight, Clock } from 'lucide-react';
import { useActivityStore } from '@/store/useActivityStore';
import { formatRelativeTime } from '@/utils/date';
import { getActivityStyle } from '@/utils/activityStyles';
import type { HistoryRecord } from '@/types/activity';
import { cn } from '@/lib/utils';

/**
 * @description: Renders the notification bell icon with badge counter and interactive flyout menu for latest activity logs
 * @return {JSX.Element}: React notification dropdown component
 */
export const NotificationDropdown: React.FC = () => {
  const { t: translateHistory } = useTranslation('history');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const activities = useActivityStore((s) => s.activities);
  const markAllAsRead = useActivityStore((s) => s.markAllAsRead);
  const markAsRead = useActivityStore((s) => s.markAsRead);
  const unreadCount = React.useMemo(
    () => activities.filter((a) => a.isUnread).length,
    [activities],
  );

  // Top 6 recent activities
  const recentActivities = activities.slice(0, 6);

  // Close dropdown on click outside or escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  /**
   * @description: Marks all unread notification records as read in the activity store
   * @return: void
   */
  const handleMarkAllRead = () => {
    markAllAsRead();
  };

  /**
   * @description: Marks a single notification item as read and navigates to the activity history page
   * @param {HistoryRecord} record: HistoryRecord representing the clicked notification
   * @return: void
   */
  const handleNotificationClick = (record: HistoryRecord) => {
    if (record.isUnread) {
      markAsRead(record.id);
    }
    setIsOpen(false);
    void navigate('/history');
  };

  /**
   * @description: Closes the notification popover and navigates to the full history audit log
   * @return: void
   */
  const handleViewAllHistory = () => {
    setIsOpen(false);
    void navigate('/history');
  };

  return (
    <div className="relative" ref={dropdownRef} data-testid="notification-dropdown">
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer select-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Notifications"
        title="Notifications"
        data-testid="notification-bell-btn"
      >
        <Bell className="size-5" />

        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <span
            data-testid="notification-unread-badge"
            className="absolute -top-0.5 -right-0.5 min-w-4.5 h-4.5 px-1 bg-primary text-primary-foreground text-[10px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-background shadow-xs select-none"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Popover Panel */}
      {isOpen && (
        <div
          data-testid="notification-panel"
          className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-left"
        >
          {/* Header */}
          <div className="p-3.5 sm:p-4 bg-slate-50/70 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {translateHistory('notifications.title')}
              </h3>
              {unreadCount > 0 ? (
                <span className="text-[10px] font-bold px-2 py-0.5 bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary rounded-full">
                  {translateHistory('notifications.newCount', { count: unreadCount })}
                </span>
              ) : (
                <span className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 rounded-full">
                  {translateHistory('notifications.allCaughtUp')}
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1 cursor-pointer"
                title={translateHistory('notifications.markAllRead')}
                data-testid="mark-all-read-btn"
              >
                <CheckCheck className="size-3.5" />
                <span>{translateHistory('notifications.markAllRead')}</span>
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-84 overflow-y-auto">
            {recentActivities.length === 0 ? (
              <div className="py-10 text-center flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                <Bell className="size-8 text-slate-300 dark:text-slate-600 mb-2" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {translateHistory('notifications.noNotifications')}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 max-w-[200px]">
                  {translateHistory('notifications.noNotificationsDesc')}
                </p>
              </div>
            ) : (
              recentActivities.map((item) => {
                const config = getActivityStyle(item.actionType);
                const ActionIcon = config.icon;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleNotificationClick(item)}
                    className={cn(
                      'p-3 sm:p-3.5 flex items-start gap-3 cursor-pointer transition-colors group',
                      item.isUnread
                        ? 'bg-primary/5 hover:bg-primary/10'
                        : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40',
                    )}
                    data-testid={`notification-item-${item.id}`}
                  >
                    {/* Action Icon */}
                    <div
                      className={cn(
                        'p-2 rounded-xl shrink-0 mt-0.5 group-hover:scale-105 transition-transform',
                        config.bg,
                      )}
                    >
                      <ActionIcon className="size-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {item.title}
                        </p>
                        {item.isUnread && (
                          <span className="size-2 rounded-full bg-primary shrink-0" />
                        )}
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {item.description}
                      </p>

                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 pt-0.5">
                        <Clock className="size-3" />
                        <span>{formatRelativeTime(item.timestamp)}</span>
                        <span>•</span>
                        <span className="truncate">{item.entityName}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer View All Link */}
          <div className="p-2.5 bg-slate-50/70 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleViewAllHistory}
              className="w-full py-2 px-3 text-xs font-semibold text-primary hover:text-primary/80 hover:bg-primary/10 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{translateHistory('notifications.viewAllHistory')}</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
