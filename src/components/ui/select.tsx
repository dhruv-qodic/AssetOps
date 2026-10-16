import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectProps {
  id?: string;
  'aria-label'?: string;
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  options: { label: string; value: string; icon?: React.ReactNode }[];
  className?: string;
  disabled?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  id,
  'aria-label': ariaLabel,
  value,
  onValueChange,
  placeholder = 'Select an option',
  options,
  className,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
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

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative w-full text-left" ref={selectRef}>
      <button
        id={id}
        aria-label={ariaLabel}
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          'flex h-9.5 w-full items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 shadow-2xs transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer select-none',
          isOpen && 'border-primary ring-2 ring-primary/20',
          className,
        )}
      >
        <span className="truncate flex items-center gap-2">
          {selectedOption ? (
            <>
              {selectedOption.icon}
              <span className="truncate">{selectedOption.label}</span>
            </>
          ) : (
            <span className="text-slate-400 truncate">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          className={cn(
            'size-4 text-slate-400 shrink-0 ml-1.5 transition-transform duration-200',
            isOpen && 'rotate-180 text-primary',
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 sm:left-0 top-full mt-1.5 w-full min-w-[175px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-60 overflow-y-auto space-y-0.5 select-none">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onValueChange(opt.value);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full px-3 py-2 rounded-xl text-xs sm:text-sm flex items-center justify-between text-left transition-colors cursor-pointer',
                  isSelected
                    ? 'font-semibold text-primary bg-primary/10 dark:bg-primary/20'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60',
                )}
              >
                <div className="flex items-center gap-2.5 truncate">
                  {opt.icon}
                  <span className="truncate">{opt.label}</span>
                </div>
                {isSelected && (
                  <Check className="size-3.5 text-primary stroke-[2.5] shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Select;
