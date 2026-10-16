import React from 'react';
import { useTranslation } from 'react-i18next';
import { Building, Sparkles } from 'lucide-react';
import { useThemeStore } from '@/store/useThemeStore';
import { SUPPORTED_CURRENCIES } from '@/utils/currency';
import { SUPPORTED_DATE_FORMATS } from '@/utils/date';
import SettingsSectionHeader from './SettingsSectionHeader';

/**
 * @description Tab panel displaying organization-wide defaults, standards, and workspace metadata
 */
export const OrganizationTabPanel: React.FC = () => {
  const { t: translateSettings } = useTranslation('setting');
  const currency = useThemeStore((state) => state.currency);
  const dateFormat = useThemeStore((state) => state.dateFormat);

  return (
    <div
      id="panel-organization"
      role="tabpanel"
      aria-labelledby="tab-organization"
      className="animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      <div
        data-testid="org-settings-section"
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-6 max-w-4xl"
      >
        <SettingsSectionHeader
          icon={Building}
          title={translateSettings('organization.title')}
          description={translateSettings('organization.description')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-1">
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {translateSettings('organization.currencyLabel')}
            </span>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {translateSettings(
                `organization.currency${currency.charAt(0).toUpperCase()}${currency.slice(1).toLowerCase()}`,
                {
                  defaultValue: `${currency} (${SUPPORTED_CURRENCIES[currency].symbol})`,
                },
              )}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-1">
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {translateSettings('organization.dateFormatLabel')}
            </span>
            <p
              data-testid="org-date-format-value"
              className="text-sm font-bold text-slate-800 dark:text-slate-200"
            >
              {dateFormat} ({SUPPORTED_DATE_FORMATS[dateFormat].description})
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-1">
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {translateSettings('organization.timezoneLabel')}
            </span>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {translateSettings('organization.timezoneValue')}
            </p>
          </div>
        </div>

        {/* Organization Enterprise Badge */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="size-4 text-primary" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              AssetOps Enterprise Fleet Workspace
            </span>
          </div>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-200/50 dark:border-emerald-800/40">
            Verified
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrganizationTabPanel;
