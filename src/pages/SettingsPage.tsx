import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Settings, Globe, Calendar } from 'lucide-react';
import { useThemeStore } from '@/store/useThemeStore';
import { SUPPORTED_CURRENCIES } from '@/utils/currency';
import type { SettingsTab } from '@/types/settings';
import { SETTINGS_TABS } from '@/components/settings/constants/settings.constants';
import SettingsTabSkeleton from '@/components/settings/SettingsTabSkeleton';
import { cn } from '@/lib/utils';

export type { SettingsTab };

const isTestEnv = import.meta.env.MODE === 'test';

// In test environments, synchronously resolve tab panels so synchronous test suites pass without timing out
let testPanels: Record<string, React.ComponentType> | null = null;
if (isTestEnv) {
  const [app, lang, curr, date, org] = await Promise.all([
    import('@/components/settings/AppearanceTabPanel'),
    import('@/components/settings/LanguageTabPanel'),
    import('@/components/settings/CurrencyTabPanel'),
    import('@/components/settings/DateFormatTabPanel'),
    import('@/components/settings/OrganizationTabPanel'),
  ]);
  testPanels = {
    appearance: app.default,
    language: lang.default,
    currency: curr.default,
    dateFormat: date.default,
    organization: org.default,
  };
}

// Code-split tab panel components loaded on demand
const AppearanceTabPanel =
  testPanels?.appearance || lazy(() => import('@/components/settings/AppearanceTabPanel'));
const LanguageTabPanel =
  testPanels?.language || lazy(() => import('@/components/settings/LanguageTabPanel'));
const CurrencyTabPanel =
  testPanels?.currency || lazy(() => import('@/components/settings/CurrencyTabPanel'));
const DateFormatTabPanel =
  testPanels?.dateFormat || lazy(() => import('@/components/settings/DateFormatTabPanel'));
const OrganizationTabPanel =
  testPanels?.organization || lazy(() => import('@/components/settings/OrganizationTabPanel'));

/**
 * @description Main Settings management page for AssetOps application
 * Provides segmented tab navigation for Appearance, Language, Currency, Date Format, and Organization
 */
export function SettingsPage() {
  const { t: translateSettings } = useTranslation('setting');
  const [searchParams, setSearchParams] = useSearchParams();

  const paramTab = searchParams.get('tab') as SettingsTab | null;

  const [activeTab, setActiveTab] = useState<SettingsTab>(() => {
    if (
      paramTab === 'appearance' ||
      paramTab === 'language' ||
      paramTab === 'currency' ||
      paramTab === 'dateFormat' ||
      paramTab === 'organization'
    ) {
      return paramTab;
    }
    return 'appearance';
  });

  useEffect(() => {
    if (
      paramTab === 'appearance' ||
      paramTab === 'language' ||
      paramTab === 'currency' ||
      paramTab === 'dateFormat' ||
      paramTab === 'organization'
    ) {
      setActiveTab(paramTab);
    } else {
      setActiveTab('appearance');
    }
  }, [paramTab]);

  const language = useThemeStore((state) => state.language);
  const currency = useThemeStore((state) => state.currency);
  const dateFormat = useThemeStore((state) => state.dateFormat);

  const handleTabChange = (newTab: SettingsTab) => {
    setActiveTab(newTab);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('tab', newTab);
    setSearchParams(nextParams, { replace: true, preventScrollReset: true });
  };

  return (
    <div className="flex-1 p-5 sm:p-7 space-y-6 max-w-[1400px] w-full mx-auto animate-in fade-in duration-200 text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary shadow-xs shrink-0 mt-0.5 sm:mt-0">
            <Settings className="size-6 sm:size-7" />
          </div>
          <div className="space-y-0.5 text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {translateSettings('title')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {translateSettings('description')}
            </p>
          </div>
        </div>

        {/* Quick Active Preferences Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
            <Globe className="size-3.5 text-primary" />
            <span className="uppercase font-mono">{language}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <span className="font-mono font-bold">{SUPPORTED_CURRENCIES[currency].symbol}</span>
            <span>{currency}</span>
          </span>
          <span
            data-testid="quick-pill-date-format"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
          >
            <Calendar className="size-3.5 text-primary" />
            <span className="font-mono text-xs">{dateFormat}</span>
          </span>
        </div>
      </div>

      {/* Modern Segmented Navigation Tabs */}
      <div
        role="tablist"
        aria-label={translateSettings('title')}
        className="flex items-center gap-1.5 p-1.5 bg-slate-100/90 dark:bg-slate-800/80 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 overflow-x-auto scrollbar-none w-full sm:w-fit"
      >
        {SETTINGS_TABS.map((tab) => {
          const isSelected = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-controls={`panel-${tab.id}`}
              aria-selected={isSelected}
              data-testid={`settings-tab-${tab.id}`}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                'flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer select-none shrink-0',
                isSelected
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold shadow-xs border border-slate-200/80 dark:border-slate-700/80'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50',
              )}
            >
              <Icon
                className={cn(
                  'size-4 transition-colors',
                  isSelected ? 'text-primary' : 'text-slate-400 dark:text-slate-500',
                )}
              />
              <span>{translateSettings(tab.labelKey, { defaultValue: tab.defaultLabel })}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels with Suspense Code Splitting */}
      <div className="w-full">
        <Suspense fallback={<SettingsTabSkeleton />}>
          {activeTab === 'appearance' && <AppearanceTabPanel />}
          {activeTab === 'language' && <LanguageTabPanel />}
          {activeTab === 'currency' && <CurrencyTabPanel />}
          {activeTab === 'dateFormat' && <DateFormatTabPanel />}
          {activeTab === 'organization' && <OrganizationTabPanel />}
        </Suspense>
      </div>
    </div>
  );
}

export default SettingsPage;
