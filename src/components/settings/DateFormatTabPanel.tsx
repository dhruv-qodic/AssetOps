import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, CalendarDays, Check } from 'lucide-react';
import { useThemeStore } from '@/store/useThemeStore';
import { SUPPORTED_DATE_FORMATS, formatDate, type SupportedDateFormat } from '@/utils/date';
import SettingsSectionHeader from './SettingsSectionHeader';
import SettingsInfoCallout from './SettingsInfoCallout';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

/**
 * @description Tab panel for configuring application-wide date display format preferences
 */
export const DateFormatTabPanel: React.FC = () => {
  const { t: translateSettings } = useTranslation('setting');
  const dateFormat = useThemeStore((state) => state.dateFormat);
  const setDateFormat = useThemeStore((state) => state.setDateFormat);

  const handleDateFormatChange = (newFormat: SupportedDateFormat) => {
    if (newFormat === dateFormat) return;
    setDateFormat(newFormat);
    toast.success(
      translateSettings('dateFormat.changedToast', {
        defaultValue: 'Date format updated successfully',
      }),
    );
  };

  const sampleDate = new Date();

  return (
    <div
      id="panel-dateFormat"
      role="tabpanel"
      aria-labelledby="tab-dateFormat"
      className="animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      <div
        data-testid="date-format-settings-section"
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-6 max-w-4xl"
      >
        <SettingsSectionHeader
          icon={Calendar}
          title={translateSettings('dateFormat.title', {
            defaultValue: 'Date Format Preference',
          })}
          description={translateSettings('dateFormat.description', {
            defaultValue:
              'Select your preferred date format. All dates across tables, details, allocations, and reports update immediately.',
          })}
        />

        {/* Real-time live format preview */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-primary/5 via-primary/10 to-transparent border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
              <CalendarDays className="size-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                {translateSettings('dateFormat.previewTitle', {
                  defaultValue: 'Live Format Preview',
                })}
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {translateSettings('dateFormat.previewDesc', {
                  defaultValue:
                    'Here is how dates currently look across the system with your selected preference:',
                })}
              </p>
            </div>
          </div>
          <div className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs self-start sm:self-auto">
            <span
              data-testid="date-format-live-preview"
              className="font-mono text-sm sm:text-base font-extrabold text-primary"
            >
              {formatDate(sampleDate, '-', dateFormat)}
            </span>
          </div>
        </div>

        {/* Date Format Options Grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5"
          role="radiogroup"
          aria-label={translateSettings('dateFormat.title', {
            defaultValue: 'Date Format Preference',
          })}
        >
          {Object.values(SUPPORTED_DATE_FORMATS).map((option) => {
            const isSelected = dateFormat === option.key;
            const sampleFormatted = formatDate(sampleDate, '-', option.key);

            return (
              <button
                key={option.key}
                type="button"
                role="radio"
                aria-checked={isSelected}
                data-testid={`date-format-option-${option.key}`}
                onClick={() => handleDateFormatChange(option.key)}
                className={cn(
                  'flex flex-col items-start justify-between p-4 rounded-xl border text-left transition-all cursor-pointer relative min-h-[115px]',
                  isSelected
                    ? 'border-primary bg-primary/5 dark:bg-primary/10 text-primary ring-1 ring-primary shadow-2xs'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-200',
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="space-y-0.5">
                    <span className="font-mono text-sm font-bold tracking-tight block">
                      {option.label}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                      {option.description}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="size-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/50 w-full flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    {sampleFormatted}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] font-bold text-primary uppercase">
                      {translateSettings('dateFormat.activeFormat', {
                        defaultValue: 'Active',
                      })}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Informational Note */}
        <SettingsInfoCallout icon={Calendar} title="Application-Wide Synchronization">
          <p>
            All asset purchase dates, allocation timelines, warranty expirations, audit timestamps,
            and export reports adapt immediately to your preferred date format across every screen.
          </p>
        </SettingsInfoCallout>
      </div>
    </div>
  );
};

export default DateFormatTabPanel;
