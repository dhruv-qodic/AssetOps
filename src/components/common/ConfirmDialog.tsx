import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  icon?: React.ElementType;
  iconBg?: string;
  iconColor?: string;
  topStripColor?: string;
  children?: React.ReactNode;
  warningText?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  confirmVariant?: 'destructive' | 'primary';
  confirmIcon?: React.ElementType;
  isConfirming?: boolean;
  'data-testid'?: string;
  cancelTestId?: string;
  confirmTestId?: string;
  className?: string;
}

/**
 * Standardized confirmation and destructive action modal dialog.
 * Encapsulates the visual pattern: top strip, leading icon, title/description,
 * highlighted record detail card, warning notice, and cancel/action button footer.
 */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  icon: Icon = AlertTriangle,
  iconBg = 'bg-rose-50 dark:bg-rose-950/40',
  iconColor = 'text-rose-600',
  topStripColor,
  children,
  warningText,
  cancelLabel,
  confirmLabel,
  confirmVariant = 'destructive',
  confirmIcon: ConfirmIcon,
  isConfirming = false,
  'data-testid': testId,
  cancelTestId,
  confirmTestId,
  className,
}) => {
  const { t: translateDialog } = useTranslation('setting');
  const effectiveCancel = cancelLabel || translateDialog('common.cancel');
  const effectiveConfirm = confirmLabel || translateDialog('common.confirm');

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        data-testid={testId}
        onClose={onClose}
        className={cn(
          'max-w-md p-0 overflow-hidden rounded-2xl border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl',
          className,
        )}
      >
        {topStripColor && <div className={cn('h-1.5 w-full', topStripColor)} />}

        <div className="p-5 sm:p-6 space-y-4 text-left">
          {/* Header */}
          <div className="flex items-start gap-3.5">
            <div
              className={cn(
                'flex size-11 shrink-0 items-center justify-center rounded-2xl',
                iconBg,
                iconColor,
              )}
            >
              <Icon className="size-5.5" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                {title}
              </DialogTitle>
              {description && (
                <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                  {description}
                </DialogDescription>
              )}
            </div>
          </div>

          {/* Highlight / Details card children */}
          {children}

          {/* Warning text */}
          {warningText && (
            <p className="text-xs text-slate-500 dark:text-slate-400">{warningText}</p>
          )}

          {/* Action Footer */}
          <DialogFooter className="mt-5 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              data-testid={cancelTestId}
              onClick={onClose}
              className="h-9 text-xs px-4 rounded-xl cursor-pointer"
            >
              {effectiveCancel}
            </Button>
            <Button
              type="button"
              data-testid={confirmTestId}
              onClick={onConfirm}
              disabled={isConfirming}
              className={cn(
                'h-9 text-xs font-semibold px-4 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer',
                confirmVariant === 'destructive'
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-primary hover:bg-primary/90 text-primary-foreground',
              )}
            >
              {ConfirmIcon && <ConfirmIcon className="size-3.5" />}
              <span>{effectiveConfirm}</span>
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
