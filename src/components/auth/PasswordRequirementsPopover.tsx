import React from 'react';
import { Check, Circle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { validatePassword } from '@/utils/passwordValidation';

interface PasswordRequirementsContentProps {
  password: string;
  className?: string;
}

export const PasswordRequirementsContent: React.FC<PasswordRequirementsContentProps> = ({
  password,
  className,
}) => {
  const { t: translateAuth } = useTranslation('auth');
  const { requirements, isValid, metCount, totalCount } = validatePassword(password);

  const reqTranslationKeys: Record<string, string> = {
    length: 'validation.reqLength',
    uppercase: 'validation.reqUppercase',
    lowercase: 'validation.reqLowercase',
    number: 'validation.reqNumber',
    special: 'validation.reqSpecial',
  };

  return (
    <div
      id="password-requirements-popover"
      role="region"
      aria-label="Password validation requirements"
      className={cn('space-y-2.5', className)}
    >
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800">
        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          {translateAuth('validation.passwordRequirements', {
            defaultValue: 'Password Requirements',
          })}
        </span>
        <span
          data-testid="password-requirements-count"
          className={cn(
            'text-[11px] font-medium transition-colors',
            isValid
              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'text-slate-400 dark:text-slate-500',
          )}
        >
          {translateAuth('validation.requirementsMet', {
            met: metCount,
            total: totalCount,
            defaultValue: `${metCount} of ${totalCount} met`,
          })}
        </span>
      </div>

      {/* Visual meter bar */}
      <div className="grid grid-cols-5 gap-1" aria-hidden="true">
        {requirements.map((req) => (
          <div
            key={req.id}
            data-testid={`meter-${req.id}`}
            className={cn(
              'h-1 rounded-full transition-all duration-200',
              req.met
                ? isValid
                  ? 'bg-emerald-500'
                  : 'bg-primary'
                : 'bg-slate-200 dark:bg-slate-700',
            )}
          />
        ))}
      </div>

      {/* Requirement indicators */}
      <ul className="space-y-1.5 pt-0.5" aria-label="Requirement checklist">
        {requirements.map((req) => (
          <li
            key={req.id}
            data-testid={`req-${req.id}`}
            data-met={req.met}
            className={cn(
              'flex items-center gap-2 text-xs transition-colors duration-150',
              req.met
                ? 'text-emerald-700 dark:text-emerald-400 font-medium'
                : 'text-slate-500 dark:text-slate-400',
            )}
          >
            {req.met ? (
              <Check
                className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0"
                aria-hidden="true"
                data-testid={`icon-check-${req.id}`}
              />
            ) : (
              <Circle
                className="size-3.5 text-slate-300 dark:text-slate-600 shrink-0"
                aria-hidden="true"
                data-testid={`icon-pending-${req.id}`}
              />
            )}
            <span>
              {translateAuth(reqTranslationKeys[req.id] || '', { defaultValue: req.label })}
            </span>
            <span className="sr-only">{req.met ? '(Requirement met)' : '(Requirement unmet)'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
