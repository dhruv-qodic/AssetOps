import React from 'react';
import { useTranslation } from 'react-i18next';
import { Coins, Check, DollarSign } from 'lucide-react';
import { SupportedCurrency, useThemeStore } from '@/store/useThemeStore';
import { CURRENCY_OPTIONS } from './constants/settings.constants';
import SettingsSectionHeader from './SettingsSectionHeader';
import SettingsInfoCallout from './SettingsInfoCallout';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

/**
 * @description Tab panel for configuring application-wide display currency and dynamic valuation
 */
export const CurrencyTabPanel: React.FC = () => {
  const { t: translateSettings } = useTranslation('setting');
  const currency = useThemeStore((state) => state.currency);
  const setCurrency = useThemeStore((state) => state.setCurrency);

  const handleCurrencyChange = (newCurrency: SupportedCurrency) => {
    if (newCurrency === currency) return;
    setCurrency(newCurrency);
    toast.success(
      translateSettings('currency.changedToast', {
        defaultValue: 'Currency updated successfully',
      }),
    );
  };

  return (
    <div
      id="panel-currency"
      role="tabpanel"
      aria-labelledby="tab-currency"
      className="animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      <div
        data-testid="currency-settings-section"
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-6 max-w-4xl"
      >
        <SettingsSectionHeader
          icon={Coins}
          title={translateSettings('currency.title', { defaultValue: 'Currency Preference' })}
          description={translateSettings('currency.description', {
            defaultValue:
              'Select your preferred display currency. All asset costs, valuations, and reports update immediately.',
          })}
        />

        {/* Currency Selection Grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5"
          role="radiogroup"
          aria-label={translateSettings('currency.title', {
            defaultValue: 'Currency Preference',
          })}
        >
          {CURRENCY_OPTIONS.map((option) => {
            const isSelected = currency === option.code;
            return (
              <button
                key={option.code}
                type="button"
                role="radio"
                aria-checked={isSelected}
                data-testid={`currency-option-${option.code}`}
                onClick={() => handleCurrencyChange(option.code)}
                className={cn(
                  'flex flex-col items-start justify-between p-4.5 rounded-xl border text-left transition-all cursor-pointer relative min-h-[105px]',
                  isSelected
                    ? 'border-primary bg-primary/5 dark:bg-primary/10 text-primary ring-1 ring-primary'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-200',
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold font-mono">{option.symbol}</span>
                    <span className="text-sm font-bold tracking-tight">
                      {translateSettings(option.labelKey, {
                        defaultValue: option.defaultLabel,
                      })}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="size-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                  )}
                </div>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono uppercase font-semibold">
                  {option.code}
                </span>
              </button>
            );
          })}
        </div>

        {/* Information Note */}
        <SettingsInfoCallout icon={DollarSign} title="Source Currency & Dynamic Valuation">
          <p>
            All asset purchase costs are safely preserved in base USD. When you select another
            currency, monetary values across tables, KPI cards, charts, and exports are accurately
            converted in real time using official rates without modifying underlying records.
          </p>
        </SettingsInfoCallout>
      </div>
    </div>
  );
};

export default CurrencyTabPanel;
