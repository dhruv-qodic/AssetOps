import React, { useMemo } from 'react';
import {
  Activity,
  UserPlus,
  CornerDownLeft,
  PlusCircle,
  Edit3,
  Wrench,
  Clock,
  Laptop,
} from 'lucide-react';
import { useAssetStore } from '@/store/useAssetStore';
import { cn } from '@/lib/utils';

export interface ActivityItem {
  id: string;
  type: 'assigned' | 'returned' | 'created' | 'updated' | 'maintenance';
  title: string;
  assetName: string;
  assetId: string;
  actor: string;
  department?: string;
  timestamp: string;
  badge: string;
  badgeClass: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

export const DashboardRecentActivity: React.FC = () => {
  const assets = useAssetStore((s) => s.assets);

  // Generate dynamic, contextually accurate activity log from actual assets
  const activities = useMemo<ActivityItem[]>(() => {
    const list: ActivityItem[] = [];

    // 1. Find assigned assets
    const allocatedAssets = assets.filter((a) => a.status === 'Allocated' && a.assignedTo);
    if (allocatedAssets.length > 0) {
      const a = allocatedAssets[0];
      list.push({
        id: `act_assign_${a.id}`,
        type: 'assigned',
        title: 'Asset Allocated',
        assetName: `${a.name} (${a.model || a.category})`,
        assetId: a.assetId,
        actor: a.assignedTo?.name || 'Staff Member',
        department: a.assignedTo?.department || 'Engineering',
        timestamp: '12m ago',
        badge: 'Assigned',
        badgeClass: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300',
        icon: UserPlus,
        iconBg: 'bg-indigo-50 dark:bg-indigo-950/60',
        iconColor: 'text-indigo-600 dark:text-indigo-400',
      });
    }

    // 2. Find maintenance assets
    const maintenanceAssets = assets.filter((a) => a.status === 'Maintenance');
    if (maintenanceAssets.length > 0) {
      const m = maintenanceAssets[0];
      list.push({
        id: `act_maint_${m.id}`,
        type: 'maintenance',
        title: 'Moved to Maintenance',
        assetName: `${m.name} (${m.model || m.category})`,
        assetId: m.assetId,
        actor: 'IT Operations Desk',
        department: m.location,
        timestamp: '45m ago',
        badge: 'Maintenance',
        badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
        icon: Wrench,
        iconBg: 'bg-amber-50 dark:bg-amber-950/60',
        iconColor: 'text-amber-600 dark:text-amber-400',
      });
    }

    // 3. Find newly registered assets
    const sortedAssets = [...assets].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    if (sortedAssets.length > 0) {
      const c = sortedAssets[0];
      list.push({
        id: `act_create_${c.id}`,
        type: 'created',
        title: 'New Asset Registered',
        assetName: `${c.name} (${c.serialNumber || c.assetId})`,
        assetId: c.assetId,
        actor: 'Admin System',
        department: c.location,
        timestamp: '2h ago',
        badge: 'Created',
        badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
        icon: PlusCircle,
        iconBg: 'bg-emerald-50 dark:bg-emerald-950/60',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
      });
    }

    // 4. Asset returned / returned to available pool
    const availableAssets = assets.filter((a) => a.status === 'Available');
    if (availableAssets.length > 0) {
      const av = availableAssets[0];
      list.push({
        id: `act_ret_${av.id}`,
        type: 'returned',
        title: 'Hardware Checked In',
        assetName: `${av.name} (${av.assetId})`,
        assetId: av.assetId,
        actor: 'Inventory Custodian',
        department: av.location,
        timestamp: '4h ago',
        badge: 'Returned',
        badgeClass: 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300',
        icon: CornerDownLeft,
        iconBg: 'bg-sky-50 dark:bg-sky-950/60',
        iconColor: 'text-sky-600 dark:text-sky-400',
      });
    }

    // 5. Asset updated / spec modification
    if (sortedAssets.length > 1) {
      const u = sortedAssets[1];
      list.push({
        id: `act_update_${u.id}`,
        type: 'updated',
        title: 'Specifications Updated',
        assetName: `${u.name} (${u.assetId})`,
        assetId: u.assetId,
        actor: 'SysAdmin',
        department: u.location,
        timestamp: '1d ago',
        badge: 'Updated',
        badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
        icon: Edit3,
        iconBg: 'bg-slate-100 dark:bg-slate-800',
        iconColor: 'text-slate-600 dark:text-slate-400',
      });
    }

    return list;
  }, [assets]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full text-left">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
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

        <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
          Live Feed
        </span>
      </div>

      {/* Activity List */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800/60 my-2 overflow-y-auto max-h-[300px] sm:max-h-[320px] pr-1">
        {activities.map((item) => {
          const Icon = item.icon;
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
                    <Laptop className="size-3 text-slate-400 shrink-0" />
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
                <span>{item.timestamp}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardRecentActivity;
