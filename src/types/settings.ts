import type React from 'react';
import type {
  Theme,
  SupportedLanguage,
  SupportedCurrency,
  SupportedDateFormat,
} from '@/store/useThemeStore';

export type SettingsTab = 'appearance' | 'language' | 'currency' | 'dateFormat' | 'organization';

export interface SettingsTabDefinition {
  id: SettingsTab;
  labelKey: string;
  defaultLabel: string;
  icon: React.ElementType;
  description: string;
}

export interface LanguageOption {
  code: SupportedLanguage;
  labelKey: string;
  defaultLabel: string;
}

export interface CurrencyOptionItem {
  code: SupportedCurrency;
  symbol: string;
  labelKey: string;
  defaultLabel: string;
}

export interface ThemeModeOption {
  value: Theme;
  labelKey: string;
  defaultLabel: string;
  icon: React.ElementType;
}

export type { Theme, SupportedLanguage, SupportedCurrency, SupportedDateFormat };
