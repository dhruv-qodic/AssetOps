import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Sun, Moon, Laptop, Check } from 'lucide-react';
import { useThemeStore, type Theme } from '@/store/useThemeStore';
import { cn } from '@/lib/utils';

interface ThemeOption {
  value: Theme;
  labelKey: 'theme.light' | 'theme.dark' | 'theme.system';
  icon: React.ElementType;
}

const THEME_OPTIONS: ThemeOption[] = [
  { value: 'light', labelKey: 'theme.light', icon: Sun },
  { value: 'dark', labelKey: 'theme.dark', icon: Moon },
  { value: 'system', labelKey: 'theme.system', icon: Laptop },
];

/**
 * @description: Accessible Theme Selector Dropdown providing Light, Dark, and System Default modes with click & hover interactions
 * @returns {JSX.Element}: Theme selector trigger button with options menu
 */
export function ThemeDropdown() {
  const { t: translateSettings } = useTranslation('setting');
  const theme = useThemeStore((state) => state.theme);
  const resolvedTheme = useThemeStore((state) => state.resolvedTheme);
  const setTheme = useThemeStore((state) => state.setTheme);

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close dropdown on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
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

  // Clean up any hover timer on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 180);
  };

  const handleSelect = (mode: Theme) => {
    setTheme(mode);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleMenuKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const nextIndex = (index + 1) % THEME_OPTIONS.length;
      itemRefs.current[nextIndex]?.focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const prevIndex = (index - 1 + THEME_OPTIONS.length) % THEME_OPTIONS.length;
      itemRefs.current[prevIndex]?.focus();
    } else if (event.key === 'Tab') {
      setIsOpen(false);
    }
  };

  // Determine which icon to display on the trigger button
  const ActiveIcon = theme === 'system' ? Laptop : resolvedTheme === 'dark' ? Moon : Sun;

  return (
    <div
      ref={containerRef}
      className="relative inline-block text-left"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(true);
            setTimeout(() => {
              itemRefs.current[0]?.focus();
            }, 50);
          }
        }}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={`Theme selector (current: ${theme})`}
        title={`Theme: ${theme === 'system' ? 'System Default' : theme === 'dark' ? 'Dark' : 'Light'}`}
        className="inline-flex size-10 items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ActiveIcon className="size-5 transition-transform duration-200" aria-hidden="true" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 top-full mt-1.5 w-44 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150 select-none text-left"
        >
          {THEME_OPTIONS.map((option, idx) => {
            const isSelected = theme === option.value;
            const OptionIcon = option.icon;

            return (
              <button
                key={option.value}
                ref={(el) => {
                  itemRefs.current[idx] = el;
                }}
                type="button"
                role="menuitem"
                tabIndex={0}
                onClick={() => handleSelect(option.value)}
                onKeyDown={(event) => handleMenuKeyDown(event, idx)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left',
                  isSelected
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white',
                )}
              >
                <div className="flex items-center gap-2.5">
                  <OptionIcon className="size-4 shrink-0" aria-hidden="true" />
                  <span>{translateSettings(option.labelKey)}</span>
                </div>

                {isSelected && <Check className="size-4 text-primary stroke-[2.5] shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ThemeDropdown;
