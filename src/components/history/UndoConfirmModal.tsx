import React from 'react';
import { useTranslation } from 'react-i18next';
import { RotateCcw, Clock, Laptop, User } from 'lucide-react';
import type { HistoryRecord } from '@/types/activity';
import { formatRelativeTime } from '@/utils/date';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { UNDO_CONFIRM_MODAL_CONSTANTS } from './constants/UndoConfirmModal.constants';

interface UndoConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  actionRecord: HistoryRecord | null;
}

/**
 * @description: Confirmation dialog modal asking for confirmation before undoing a historical audit event
 * @param {boolean} isOpen: Modal open state boolean
 * @param {function(): void} onClose: Cancel/close callback
 * @param {function(): void} onConfirm: Confirm undo callback
 * @param {HistoryRecord | null} actionRecord: History record targeted for undo
 * @returns {JSX.Element | null} Undo confirmation dialog component JSX
 */
export const UndoConfirmModal: React.FC<UndoConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  actionRecord,
}) => {
  const { t: translateHistory } = useTranslation('history');

  if (!actionRecord) return null;

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      data-testid="undo-confirm-modal"
      cancelTestId="undo-confirm-cancel"
      confirmTestId="undo-confirm-submit"
      title={translateHistory('undoModal.title', {
        defaultValue: UNDO_CONFIRM_MODAL_CONSTANTS.TITLE,
      })}
      description={translateHistory('undoModal.subtitle', {
        defaultValue: UNDO_CONFIRM_MODAL_CONSTANTS.DESCRIPTION,
      })}
      icon={RotateCcw}
      iconBg="bg-blue-50 dark:bg-blue-950/40"
      iconColor="text-primary"
      topStripColor="bg-primary"
      warningText={translateHistory('undoModal.warning', {
        defaultValue: UNDO_CONFIRM_MODAL_CONSTANTS.WARNING_TEXT,
      })}
      cancelLabel={translateHistory('undoModal.cancelButton', {
        defaultValue: UNDO_CONFIRM_MODAL_CONSTANTS.CANCEL_BUTTON,
      })}
      confirmLabel={translateHistory('undoModal.confirmButton', {
        defaultValue: UNDO_CONFIRM_MODAL_CONSTANTS.CONFIRM_BUTTON,
      })}
      confirmVariant="primary"
      confirmIcon={RotateCcw}
    >
      {/* Action Details Card */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2.5 text-xs text-left">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] font-bold text-primary dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded-md border border-blue-200/60 dark:border-blue-900/50">
            {actionRecord.id}
          </span>
          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
            <Clock className="size-3" />
            {formatRelativeTime(actionRecord.timestamp)}
          </span>
        </div>

        <div>
          <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">
            {actionRecord.title}
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 line-clamp-2">
            {actionRecord.description}
          </p>
        </div>

        <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-slate-600 dark:text-slate-300 text-[11px]">
          <div className="flex items-center gap-1.5 truncate max-w-[180px]">
            {actionRecord.entityType === UNDO_CONFIRM_MODAL_CONSTANTS.ENTITY_TYPE_ASSET ? (
              <Laptop className="size-3 text-slate-400 shrink-0" />
            ) : (
              <User className="size-3 text-slate-400 shrink-0" />
            )}
            <span className="font-semibold truncate">{actionRecord.entityName}</span>
          </div>
          <span className="font-medium text-slate-500 dark:text-slate-400 shrink-0">
            {translateHistory('undoModal.byPrefix', {
              defaultValue: UNDO_CONFIRM_MODAL_CONSTANTS.BY_PREFIX,
            })}
            {actionRecord.actor.name}
          </span>
        </div>
      </div>
    </ConfirmDialog>
  );
};

export default UndoConfirmModal;
