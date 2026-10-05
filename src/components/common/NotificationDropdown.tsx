import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  ArrowRight,
  UserPlus,
  CornerDownLeft,
  PlusCircle,
  Edit3,
  Wrench,
  Trash2,
  UserCheck,
  Clock,
  Laptop,
  User,
  GitCommit,
  ShieldAlert,
} from 'lucide-react';
import { useActivityStore, formatRelativeTime } from '@/store/useActivityStore';
import type { HistoryRecord, HistoryActionType } from '@/types/activity';
import { cn } from '@/lib/utils';

const getNotificationIcon = (actionType: HistoryActionType) => {
  switch (actionType) {
    case 'allocation_assigned':
    case 'assigned':
      return {
        icon: UserPlus,
        bg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400',
        entityIcon: Laptop,
      };
    case 'allocation_returned':
    case 'returned':
      return {
        icon: CornerDownLeft,
        bg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
        entityIcon: Laptop,
      };
    case 'asset_created':
    case 'created':
      return {
        icon: PlusCircle,
        bg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
        entityIcon: Laptop,
      };
    case 'asset_updated':
    case 'updated':
      return {
        icon: Edit3,
        bg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
        entityIcon: Laptop,
      };
    case 'asset_maintenance':
    case 'maintenance':
      return {
        icon: Wrench,
        bg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
        entityIcon: Laptop,
      };
    case 'asset_retired':
    case 'asset_deleted':
    case 'deleted':
      return {
        icon: Trash2,
        bg: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400',
        entityIcon: Laptop,
      };
    case 'employee_onboarded':
    case 'employee_created':
      return {
        icon: UserPlus,
        bg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
        entityIcon: User,
      };
    case 'employee_updated':
    case 'employee_transferred':
      return {
        icon: UserCheck,
        bg: 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400',
        entityIcon: User,
      };
    case 'employee_offboarded':
    case 'employee_deleted':
      return {
        icon: ShieldAlert,
        bg: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400',
        entityIcon: User,
      };
    default:
      return {
        icon: GitCommit,
        bg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
        entityIcon: Laptop,
      };
  }
};

export const NotificationDropdown: React.FC = () => {
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

  const handleMarkAllRead = () => {
    markAllAsRead();
  };

  const handleNotificationClick = (record: HistoryRecord) => {
    if (record.isUnread) {
      markAsRead(record.id);
    }
    setIsOpen(false);
    void navigate('/history');
  };

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
            className="absolute -top-0.5 -right-0.5 min-w-4.5 h-4.5 px-1 bg-[#155DFC] text-white text-[10px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-background shadow-xs select-none"
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
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h3>
              {unreadCount > 0 ? (
                <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-[#155DFC] dark:bg-blue-950/80 dark:text-blue-300 rounded-full">
                  {unreadCount} new
                </span>
              ) : (
                <span className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 rounded-full">
                  All caught up
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-1 cursor-pointer"
                title="Mark all notifications as read"
                data-testid="mark-all-read-btn"
              >
                <CheckCheck className="size-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-84 overflow-y-auto">
            {recentActivities.length === 0 ? (
              <div className="py-10 text-center flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                <Bell className="size-8 text-slate-300 dark:text-slate-600 mb-2" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  No notifications yet
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 max-w-[200px]">
                  Recent actions and updates will appear here in real time.
                </p>
              </div>
            ) : (
              recentActivities.map((item) => {
                const config = getNotificationIcon(item.actionType);
                const ActionIcon = config.icon;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleNotificationClick(item)}
                    className={cn(
                      'p-3 sm:p-3.5 flex items-start gap-3 cursor-pointer transition-colors group',
                      item.isUnread
                        ? 'bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50/70 dark:hover:bg-blue-950/40'
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
                          <span className="size-2 rounded-full bg-blue-500 shrink-0" />
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
              className="w-full py-2 px-3 text-xs font-semibold text-[#155DFC] hover:text-[#0D4ECC] dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50/60 dark:hover:bg-blue-950/40 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>View all activity history</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
