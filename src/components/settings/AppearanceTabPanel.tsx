import React from 'react';
import { useTranslation } from 'react-i18next';
import { Palette, Check } from 'lucide-react';
import { useThemeStore } from '@/store/useThemeStore';
import { THEME_COLORS } from '@/constant/theme';
import { THEME_MODES } from './constants/settings.constants';
import SettingsSectionHeader from './SettingsSectionHeader';
import { cn } from '@/lib/utils';

/**
 * @description Tab panel for configuring theme mode (light, dark, system) and accent colors
 */
export const AppearanceTabPanel: React.FC = () => {
  const { t: translateSettings } = useTranslation('setting');
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const themeColor = useThemeStore((state) => state.themeColor);
  const setThemeColor = useThemeStore((state) => state.setThemeColor);

  return (
    <div
      id="panel-appearance"
      role="tabpanel"
      aria-labelledby="tab-appearance"
      className="animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      <div
        data-testid="theme-settings-section"
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-6 max-w-4xl"
      >
        <SettingsSectionHeader
          icon={Palette}
          title={translateSettings('theme.title')}
          description={translateSettings('theme.description')}
        />

        {/* Color Mode Selection */}
        <div className="space-y-3">
          <label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
            {translateSettings('theme.mode')}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {THEME_MODES.map((mode) => {
              const Icon = mode.icon;
              const isSelected = theme === mode.value;
              return (
                <button
                  key={mode.value}
                  type="button"
                  onClick={() => setTheme(mode.value)}
                  className={cn(
                    'flex items-center justify-center gap-2.5 p-3.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer',
                    isSelected
                      ? 'border-primary bg-primary/10 text-primary font-bold shadow-2xs ring-1 ring-primary'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60',
                  )}
                >
                  <Icon className="size-4.5" />
                  <span>
                    {translateSettings(mode.labelKey, { defaultValue: mode.defaultLabel })}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Accent Color Palette */}
        <div className="space-y-3 pt-2">
          <label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
            {translateSettings('theme.accentColor')}
          </label>
          <div className="flex flex-wrap items-center gap-3">
            {THEME_COLORS.map((color) => {
              const isSelected = themeColor === color.value;
              return (
                <button
                  key={color.value}
                  type="button"
                  title={color.label}
                  onClick={() => setThemeColor(color.value)}
                  className={cn(
                    'size-9 rounded-full flex items-center justify-center transition-all cursor-pointer ring-offset-2 dark:ring-offset-slate-900',
                    isSelected
                      ? 'ring-2 ring-primary scale-110 shadow-sm'
                      : 'hover:scale-105 opacity-85 hover:opacity-100',
                  )}
                  style={{ backgroundColor: color.color }}
                >
                  {isSelected && <Check className="size-4 text-white stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppearanceTabPanel;
