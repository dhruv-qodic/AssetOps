import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages, Check } from 'lucide-react';
import { useThemeStore, type SupportedLanguage } from '@/store/useThemeStore';
import { LANGUAGE_OPTIONS } from './constants/settings.constants';
import SettingsSectionHeader from './SettingsSectionHeader';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

/**
 * @description Tab panel for configuring application display language
 */
export const LanguageTabPanel: React.FC = () => {
  const { t: translateSettings } = useTranslation('setting');
  const language = useThemeStore((state) => state.language);
  const setLanguage = useThemeStore((state) => state.setLanguage);

  const handleLanguageChange = (newLanguage: SupportedLanguage) => {
    if (newLanguage === language) return;
    setLanguage(newLanguage);
    toast.success(translateSettings('language.changedToast'));
  };

  return (
    <div
      id="panel-language"
      role="tabpanel"
      aria-labelledby="tab-language"
      className="animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      <div
        data-testid="language-settings-section"
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-6 max-w-4xl"
      >
        <SettingsSectionHeader
          icon={Languages}
          title={translateSettings('language.title')}
          description={translateSettings('language.description')}
        />

        {/* Language Selection Buttons */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-3.5"
          role="radiogroup"
          aria-label={translateSettings('language.title')}
        >
          {LANGUAGE_OPTIONS.map((option) => {
            const isSelected = language === option.code;
            return (
              <button
                key={option.code}
                type="button"
                role="radio"
                aria-checked={isSelected}
                data-testid={`language-option-${option.code}`}
                onClick={() => handleLanguageChange(option.code)}
                className={cn(
                  'flex flex-col items-start justify-between p-4.5 rounded-xl border text-left transition-all cursor-pointer relative min-h-[100px]',
                  isSelected
                    ? 'border-primary bg-primary/5 dark:bg-primary/10 text-primary ring-1 ring-primary'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-200',
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm font-bold tracking-tight">
                    {translateSettings(option.labelKey, {
                      defaultValue: option.defaultLabel,
                    })}
                  </span>
                  {isSelected && (
                    <div className="size-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between w-full mt-auto pt-2">
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono uppercase font-semibold">
                    {option.code}
                  </span>
                  {isSelected && (
                    <span className="text-[11px] font-medium text-primary">
                      {translateSettings('language.activeLanguage', {
                        defaultValue: 'Active Language',
                      })}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LanguageTabPanel;
