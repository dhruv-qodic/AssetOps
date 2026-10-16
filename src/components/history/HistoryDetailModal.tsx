import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Clock, Building2, MapPin, Tag, Activity, Calendar } from 'lucide-react';
import type { HistoryRecord } from '@/types/activity';
import { formatRelativeTime, formatDateTime } from '@/utils/date';
import { Button } from '@/components/ui/button';
import { HISTORY_DETAIL_MODAL_CONSTANTS } from './constants/HistoryDetailModal.constants';

interface HistoryDetailModalProps {
  record: HistoryRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * @description: Displays a modal dialog with full audit details of an activity history event (entity, user, category, timestamp)
 * @param {HistoryRecord | null} record: The selected history record or null
 * @param {boolean} isOpen: Modal open state boolean
 * @param {() => void} onClose: Modal close callback
 * @returns {JSX.Element} History detail modal dialog JSX
 */
export const HistoryDetailModal: React.FC<HistoryDetailModalProps> = ({
  record,
  isOpen,
  onClose,
}) => {
  const { t: translateHistory } = useTranslation('history');
  const { t: translateEmployees } = useTranslation('employee');
  const { t: translateAssets } = useTranslation('asset');

  if (!record) return null;

  // Resolve localized category and action label
  const categoryLabel = translateHistory(`categories.${record.category}Action`, {
    defaultValue: `${record.category}${HISTORY_DETAIL_MODAL_CONSTANTS.LABELS.ACTION_SUFFIX}`,
  });

  // Resolve department or location
  const departmentLabel = record.department
    ? translateEmployees(`departments.${record.department}`, {
        defaultValue: translateAssets(`locations.${record.department}`, {
          defaultValue: record.department,
        }),
      })
    : translateHistory('detailsModal.notAvailable', {
        defaultValue: HISTORY_DETAIL_MODAL_CONSTANTS.LABELS.NOT_AVAILABLE,
      });

  const locationLabel = record.location
    ? translateAssets(`locations.${record.location}`, {
        defaultValue: record.location,
      })
    : translateAssets('locations.Headquarters', {
        defaultValue: HISTORY_DETAIL_MODAL_CONSTANTS.LABELS.DEFAULT_LOCATION,
      });

  const actorRoleLabel = translateHistory(`actorRoles.${record.actor.role}`, {
    defaultValue: record.actor.role,
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md sm:max-w-lg p-0 overflow-hidden rounded-2xl border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl">
        {/* Top Accent Strip */}
        <div className="h-1.5 w-full bg-primary" />

        <div className="p-5 sm:p-6 space-y-5 text-left">
          {/* Header */}
          <DialogHeader className="space-y-1.5 text-left">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200/60 dark:border-blue-900/50">
                {record.id}
              </span>
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <Clock className="size-3 text-slate-400" />
                <span>{formatRelativeTime(record.timestamp)}</span>
              </span>
            </div>

            <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-white pt-1">
              {record.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              {record.description}
            </DialogDescription>
          </DialogHeader>

          {/* Primary Details Grid */}
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <Tag className="size-3 text-slate-400" />
                <span>
                  {translateHistory('detailsModal.entityTarget', {
                    defaultValue: HISTORY_DETAIL_MODAL_CONSTANTS.LABELS.ENTITY_TARGET,
                  })}
                </span>
              </span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                {record.entityName}
              </p>
              <span className="text-[10px] font-mono text-slate-400">{record.entityId}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <Activity className="size-3 text-slate-400" />
                <span>
                  {translateHistory('detailsModal.category', {
                    defaultValue: HISTORY_DETAIL_MODAL_CONSTANTS.LABELS.CATEGORY,
                  })}
                </span>
              </span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                {categoryLabel}
              </p>
              <span className="text-[10px] text-slate-400">{record.action}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <Building2 className="size-3 text-slate-400" />
                <span>
                  {translateHistory('detailsModal.department', {
                    defaultValue: HISTORY_DETAIL_MODAL_CONSTANTS.LABELS.DEPARTMENT,
                  })}
                </span>
              </span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">{departmentLabel}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <MapPin className="size-3 text-slate-400" />
                <span>
                  {translateHistory('detailsModal.location', {
                    defaultValue: HISTORY_DETAIL_MODAL_CONSTANTS.LABELS.LOCATION,
                  })}
                </span>
              </span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">{locationLabel}</p>
            </div>
          </div>

          {/* Performed By Section */}
          {(() => {
            const actorName = record.actor.name;
            const actorEmail = record.actor.email;
            const actorInitials = record.actor.avatarInitials;

            return (
              <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  {translateHistory('detailsModal.executedBy', {
                    defaultValue: HISTORY_DETAIL_MODAL_CONSTANTS.LABELS.EXECUTED_BY,
                  })}
                </span>
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                    {actorInitials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {actorName}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {actorRoleLabel} • {actorEmail}
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Metadata Records */}
          {record.metadata && Object.keys(record.metadata).length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                {translateHistory('detailsModal.metadataTitle', {
                  defaultValue: HISTORY_DETAIL_MODAL_CONSTANTS.LABELS.METADATA_TITLE,
                })}
              </span>
              <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800 p-3 space-y-1.5 text-xs">
                {Object.entries(record.metadata).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">{key}:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span
              className="text-[11px] text-slate-400 flex items-center gap-1.5"
              title={new Date(record.timestamp).toISOString()}
            >
              <Calendar className="size-3 text-slate-400" />
              <span>{formatDateTime(record.timestamp)}</span>
              <span className="text-primary font-medium">
                ({formatRelativeTime(record.timestamp)})
              </span>
            </span>
            <Button
              type="button"
              onClick={onClose}
              className="h-8.5 px-4 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-lg"
            >
              {translateHistory('detailsModal.closeButton', {
                defaultValue: HISTORY_DETAIL_MODAL_CONSTANTS.LABELS.CLOSE_BUTTON,
              })}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HistoryDetailModal;
