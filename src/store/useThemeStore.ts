import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_THEME_COLOR, type ThemeColor, THEME_COLORS } from '@/constant/theme';
import i18n, { getSavedLanguage, type SupportedLanguage } from '@/i18n';

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';
export type SupportedCurrency = 'USD' | 'INR' | 'EUR' | 'GBP';
export type SupportedDateFormat =
  | 'YYYY-MM-DD'
  | 'DD/MM/YYYY'
  | 'MM/DD/YYYY'
  | 'DD-MM-YYYY'
  | 'MMM d, yyyy'
  | 'd MMM yyyy'
  | 'MMMM d, yyyy';
export type { SupportedLanguage };

export const VALID_DATE_FORMATS: readonly SupportedDateFormat[] = [
  'YYYY-MM-DD',
  'DD/MM/YYYY',
  'MM/DD/YYYY',
  'DD-MM-YYYY',
  'MMM d, yyyy',
  'd MMM yyyy',
  'MMMM d, yyyy',
] as const;

/**
 * Retrieves the persisted currency preference from localStorage.
 * Defaults to 'USD' if not set or invalid.
 */
export function getSavedCurrency(): SupportedCurrency {
  if (typeof window === 'undefined') return 'USD';
  try {
    const rawDirect = localStorage.getItem('assetops_currency');
    if (rawDirect === 'USD' || rawDirect === 'INR' || rawDirect === 'EUR' || rawDirect === 'GBP') {
      return rawDirect;
    }
    const rawStore = localStorage.getItem('assetops_theme_store');
    if (rawStore) {
      const parsed = JSON.parse(rawStore) as { state?: { currency?: unknown } } | null;
      const curr = parsed?.state?.currency;
      if (curr === 'USD' || curr === 'INR' || curr === 'EUR' || curr === 'GBP') {
        return curr;
      }
    }
  } catch {
    // Ignore storage parse errors
  }
  return 'USD';
}

/**
 * Retrieves the persisted date format preference from localStorage.
 * Defaults to 'YYYY-MM-DD' if not set or invalid.
 */
export function getSavedDateFormat(): SupportedDateFormat {
  if (typeof window === 'undefined') return 'YYYY-MM-DD';
  try {
    const rawDirect = localStorage.getItem('assetops_date_format');
    if (rawDirect && (VALID_DATE_FORMATS as readonly string[]).includes(rawDirect)) {
      return rawDirect as SupportedDateFormat;
    }
    const rawStore = localStorage.getItem('assetops_theme_store');
    if (rawStore) {
      const parsed = JSON.parse(rawStore) as { state?: { dateFormat?: unknown } } | null;
      const df = parsed?.state?.dateFormat;
      if (typeof df === 'string' && (VALID_DATE_FORMATS as readonly string[]).includes(df)) {
        return df as SupportedDateFormat;
      }
    }
  } catch {
    // Ignore storage parse errors
  }
  return 'YYYY-MM-DD';
}

interface ThemeState {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  initializeTheme: () => void;
  themeColor: ThemeColor;
  setThemeColor: (themeColor: ThemeColor) => void;
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  currency: SupportedCurrency;
  setCurrency: (currency: SupportedCurrency) => void;
  dateFormat: SupportedDateFormat;
  setDateFormat: (dateFormat: SupportedDateFormat) => void;
}

/**
 * Applies the selected accent palette to the document root.
 * @param {ThemeColor}themeColor - The selected application theme color.
 */
function applyThemeColor(themeColor: ThemeColor): void {
  if (typeof document === 'undefined') return;

  const selectedColor = THEME_COLORS.find((option) => option.value === themeColor);

  if (!selectedColor) return;

  const root = document.documentElement;

  root.setAttribute('data-theme-color', selectedColor.value);
}

/**
 * Detects current system color scheme preference.
 * @returns {ResolvedTheme} - The resolved theme.
 */
function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Resolves effective theme based on user selection and system preference.
 * @param {Theme} theme - The theme to resolve.
 * @returns {ResolvedTheme} - The resolved theme.
 */
function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === 'system' ? getSystemTheme() : theme;
}

/**
 * Applies the selected theme to the document root and color scheme.
 * @param {Theme} theme - The theme to apply.
 * @returns {ResolvedTheme} - The resolved theme.
 */
function applyTheme(theme: Theme): ResolvedTheme {
  if (typeof document === 'undefined') return 'light';

  const resolved = resolveTheme(theme);
  const root = document.documentElement;

  root.classList.toggle('dark', resolved === 'dark');
  root.style.colorScheme = resolved;

  return resolved;
}

let mediaQueryList: MediaQueryList | null = null;
let mediaListener: ((e: MediaQueryListEvent) => void) | null = null;

function setupSystemListener(onSystemChange: () => void) {
  if (typeof window === 'undefined') return;

  if (!mediaQueryList) {
    mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
  }

  if (mediaListener) {
    mediaQueryList.removeEventListener('change', mediaListener);
  }

  mediaListener = () => {
    onSystemChange();
  };

  mediaQueryList.addEventListener('change', mediaListener);
}

/**
 * Manages and persists the AssetOps application theme (light, dark, or system default).
 * @returns {ThemeState} - The theme store.
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolvedTheme: typeof window !== 'undefined' ? getSystemTheme() : 'light',

      setTheme: (theme) => {
        const resolved = applyTheme(theme);
        set({ theme, resolvedTheme: resolved });
      },

      toggleTheme: () => {
        const current = get().theme;
        const nextTheme: Theme =
          current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light';

        const resolved = applyTheme(nextTheme);
        set({ theme: nextTheme, resolvedTheme: resolved });
      },

      initializeTheme: () => {
        applyThemeColor(get().themeColor);
        const currentTheme = get().theme;
        const resolved = applyTheme(currentTheme);
        set({ theme: currentTheme, resolvedTheme: resolved });

        const currentLang = get().language;
        if (i18n.language !== currentLang) {
          void i18n.changeLanguage(currentLang);
        }

        setupSystemListener(() => {
          if (get().theme === 'system') {
            const updated = applyTheme('system');
            set({ resolvedTheme: updated });
          }
        });
      },

      themeColor: DEFAULT_THEME_COLOR,

      setThemeColor: (themeColor) => {
        applyThemeColor(themeColor);
        set({ themeColor });
      },

      language: getSavedLanguage(),

      setLanguage: (language: SupportedLanguage) => {
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('assetops_language', language);
          } catch {
            // Ignore storage quota
          }
        }
        void i18n.changeLanguage(language);
        set({ language });
      },

      currency: getSavedCurrency(),

      setCurrency: (currency: SupportedCurrency) => {
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('assetops_currency', currency);
          } catch {
            // Ignore storage quota
          }
        }
        set({ currency });
      },

      dateFormat: getSavedDateFormat(),

      setDateFormat: (dateFormat: SupportedDateFormat) => {
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('assetops_date_format', dateFormat);
          } catch {
            // Ignore storage quota
          }
        }
        set({ dateFormat });
      },
    }),
    {
      name: 'assetops_theme_store',
      partialize: (state) => ({
        theme: state.theme,
        themeColor: state.themeColor,
        language: state.language,
        currency: state.currency,
        dateFormat: state.dateFormat,
      }),
    },
  ),
);
