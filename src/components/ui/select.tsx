import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  options: { label: string; value: string; icon?: React.ReactNode }[];
  className?: string;
  disabled?: boolean;
}

export const Select: React.FC<SelectProps> = ({
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
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          'flex h-9 w-full items-center justify-between rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 shadow-2xs transition-all focus:outline-none focus:ring-2 focus:ring-[#4C40F7]/20 focus:border-[#4C40F7] disabled:cursor-not-allowed disabled:opacity-50 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer',
          isOpen && 'border-[#4C40F7] ring-2 ring-[#4C40F7]/20',
          className
        )}
      >
        <span className="truncate flex items-center gap-2">
          {selectedOption ? (
            <>
              {selectedOption.icon}
              <span>{selectedOption.label}</span>
            </>
          ) : (
            <span className="text-slate-400">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          className={cn(
            'size-4 text-slate-400 shrink-0 ml-1.5 transition-transform duration-200',
            isOpen && 'rotate-180 text-[#4C40F7]'
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-60 overflow-y-auto">
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
                  'w-full px-3 py-2 text-xs sm:text-sm flex items-center justify-between text-left transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800',
                  isSelected
                    ? 'font-semibold text-[#4C40F7] bg-indigo-50/60 dark:bg-indigo-950/40'
                    : 'text-slate-700 dark:text-slate-300'
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  {opt.icon}
                  <span className="truncate">{opt.label}</span>
                </div>
                {isSelected && <Check className="size-3.5 text-[#4C40F7] shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Select;
