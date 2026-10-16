import React, { useState, useRef } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent } from '@/components/ui/popover';
import { PasswordRequirementsContent } from './PasswordRequirementsPopover';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface PasswordInputProps {
  label: string;
  placeholder: string;
  registration: UseFormRegisterReturn;
  error?: string;
  showPasswordAria?: string;
  hidePasswordAria?: string;
  showRequirementsPopover?: boolean;
  value?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  placeholder,
  registration,
  error,
  showPasswordAria = 'Show password',
  hidePasswordAria = 'Hide password',
  showRequirementsPopover = false,
  value = '',
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverContentRef = useRef<HTMLDivElement>(null);

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <div ref={containerRef} className="space-y-1 text-left">
        <label className="text-xs font-semibold text-gray-700 block">{label}</label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Lock className="size-4" />
          </div>
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder={placeholder}
            {...registration}
            aria-expanded={showRequirementsPopover ? popoverOpen : undefined}
            aria-controls={showRequirementsPopover ? 'password-requirements-popover' : undefined}
            onFocus={() => {
              if (showRequirementsPopover) {
                setPopoverOpen(true);
              }
            }}
            onClick={() => {
              if (showRequirementsPopover) {
                setPopoverOpen(true);
              }
            }}
            onChange={(e) => {
              void registration.onChange(e);
              if (showRequirementsPopover) {
                setPopoverOpen(true);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape' && popoverOpen) {
                setPopoverOpen(false);
              }
            }}
            className={`h-9.5 pl-9.5 pr-10 text-xs sm:text-sm bg-white text-gray-900 placeholder:text-gray-400 rounded-lg focus-visible:ring-2 ${
              error
                ? 'border-red-400 focus-visible:ring-red-400/20 focus-visible:border-red-500'
                : 'border-gray-200 focus-visible:ring-primary/20 focus-visible:border-primary'
            }`}
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowPassword((prev) => !prev);
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
            aria-label={showPassword ? hidePasswordAria : showPasswordAria}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {error && <p className="text-[11px] text-red-600 font-medium">{error}</p>}
      </div>
      {showRequirementsPopover && (
        <PopoverContent
          ref={popoverContentRef}
          anchor={containerRef}
          side="bottom"
          align="start"
          sideOffset={6}
          className="w-[calc(100vw-3rem)] max-w-[340px] sm:w-[340px] p-3 sm:p-3.5 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl shadow-slate-900/10"
        >
          <PasswordRequirementsContent password={value} />
        </PopoverContent>
      )}
    </Popover>
  );
};
