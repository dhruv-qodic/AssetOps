import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English translations
import enAuth from '@/locales/en/auth';
import enAsset from '@/locales/en/asset';
import enEmployee from '@/locales/en/employee';
import enAllocation from '@/locales/en/allocation';
import enReport from '@/locales/en/report';
import enHistory from '@/locales/en/history';
import enDashboard from '@/locales/en/dashboard';
import enSetting from '@/locales/en/setting';

// Gujarati translations
import guAuth from '@/locales/gu/auth';
import guAsset from '@/locales/gu/asset';
import guEmployee from '@/locales/gu/employee';
import guAllocation from '@/locales/gu/allocation';
import guReport from '@/locales/gu/report';
import guHistory from '@/locales/gu/history';
import guDashboard from '@/locales/gu/dashboard';
import guSetting from '@/locales/gu/setting';

// Hindi translations
import hiAuth from '@/locales/hi/auth';
import hiAsset from '@/locales/hi/asset';
import hiEmployee from '@/locales/hi/employee';
import hiAllocation from '@/locales/hi/allocation';
import hiReport from '@/locales/hi/report';
import hiHistory from '@/locales/hi/history';
import hiDashboard from '@/locales/hi/dashboard';
import hiSetting from '@/locales/hi/setting';

export const SUPPORTED_LANGUAGES = ['en', 'gu', 'hi'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export const supportedLanguages = SUPPORTED_LANGUAGES;
export const fallbackLng = 'en';
export const defaultNS = 'setting';

export const NAMESPACES = [
  'auth',
  'asset',
  'employee',
  'allocation',
  'report',
  'history',
  'dashboard',
  'setting',
] as const;
export type Namespace = (typeof NAMESPACES)[number];

export const resources = {
  en: {
    auth: enAuth,
    asset: enAsset,
    employee: enEmployee,
    allocation: enAllocation,
    report: enReport,
    history: enHistory,
    dashboard: enDashboard,
    setting: enSetting,
  },
  gu: {
    auth: guAuth,
    asset: guAsset,
    employee: guEmployee,
    allocation: guAllocation,
    report: guReport,
    history: guHistory,
    dashboard: guDashboard,
    setting: guSetting,
  },
  hi: {
    auth: hiAuth,
    asset: hiAsset,
    employee: hiEmployee,
    allocation: hiAllocation,
    report: hiReport,
    history: hiHistory,
    dashboard: hiDashboard,
    setting: hiSetting,
  },
} as const;

/**
 * Resolves saved language preference from localStorage with fallback to English.
 * @returns {SupportedLanguage} The saved language preference.
 */
export function getSavedLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return 'en';

  try {
    const rawDirect = localStorage.getItem('assetops_language');
    if (rawDirect && SUPPORTED_LANGUAGES.includes(rawDirect as SupportedLanguage)) {
      return rawDirect as SupportedLanguage;
    }

    const rawStore = localStorage.getItem('assetops_theme_store');
    if (rawStore) {
      const parsed = JSON.parse(rawStore) as { state?: { language?: unknown } } | null;
      const storeLang = parsed?.state?.language;
      if (
        typeof storeLang === 'string' &&
        SUPPORTED_LANGUAGES.includes(storeLang as SupportedLanguage)
      ) {
        return storeLang as SupportedLanguage;
      }
    }
  } catch {
    // Ignore storage parse issues and fallback to English
  }

  return 'en';
}

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources,
    lng: getSavedLanguage(),
    fallbackLng: 'en',
    ns: NAMESPACES,
    defaultNS: 'asset',
    interpolation: {
      escapeValue: false, // React already escapes values safely
    },
    react: {
      useSuspense: false,
    },
  });
}

export default i18n;
