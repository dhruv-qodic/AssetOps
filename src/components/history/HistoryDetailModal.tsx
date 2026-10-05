import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Clock, Building2, MapPin, Tag, Activity, Calendar } from 'lucide-react';
import type { HistoryRecord } from '@/types/activity';
import { formatRelativeTime } from '@/store/useActivityStore';
import { Button } from '@/components/ui/button';

interface HistoryDetailModalProps {
  record: HistoryRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const HistoryDetailModal: React.FC<HistoryDetailModalProps> = ({
  record,
  isOpen,
  onClose,
}) => {
  if (!record) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md sm:max-w-lg p-0 overflow-hidden rounded-2xl border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl">
        {/* Top Accent Strip */}
        <div className="h-1.5 w-full bg-[#155DFC]" />

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
                <span>Entity & Target</span>
              </span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                {record.entityName}
              </p>
              <span className="text-[10px] font-mono text-slate-400">{record.entityId}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <Activity className="size-3 text-slate-400" />
                <span>Category</span>
              </span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                {record.category} Action
              </p>
              <span className="text-[10px] text-slate-400">{record.action}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <Building2 className="size-3 text-slate-400" />
                <span>Department</span>
              </span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {record.department || 'N/A'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <MapPin className="size-3 text-slate-400" />
                <span>Location</span>
              </span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {record.location || 'Headquarters'}
              </p>
            </div>
          </div>

          {/* Performed By Section */}
          {(() => {
            const actorName = record.actor.name;
            const actorRole = record.actor.role;
            const actorEmail = record.actor.email;
            const actorInitials = record.actor.avatarInitials;

            return (
              <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Executed By (Actor)
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
                      {actorRole} • {actorEmail}
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
                Action Attributes & Payload
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
              <span>{new Date(record.timestamp).toLocaleString()}</span>
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                ({formatRelativeTime(record.timestamp)})
              </span>
            </span>
            <Button
              type="button"
              onClick={onClose}
              className="h-8.5 px-4 bg-[#155DFC] hover:bg-[#0D4ECC] text-white text-xs font-semibold rounded-lg"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HistoryDetailModal;
