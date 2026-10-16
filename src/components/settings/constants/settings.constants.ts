import { Palette, Languages, Coins, Calendar, Building, Sun, Moon, Laptop } from 'lucide-react';
import type {
  SettingsTabDefinition,
  LanguageOption,
  CurrencyOptionItem,
  ThemeModeOption,
} from '@/types/settings';

export const SETTINGS_TABS: readonly SettingsTabDefinition[] = [
  {
    id: 'appearance',
    labelKey: 'tabs.appearance',
    defaultLabel: 'Appearance',
    icon: Palette,
    description: 'Customize theme mode and accent color',
  },
  {
    id: 'language',
    labelKey: 'tabs.language',
    defaultLabel: 'Language',
    icon: Languages,
    description: 'Manage interface display language',
  },
  {
    id: 'currency',
    labelKey: 'tabs.currency',
    defaultLabel: 'Currency',
    icon: Coins,
    description: 'Configure global currency and valuation',
  },
  {
    id: 'dateFormat',
    labelKey: 'tabs.dateFormat',
    defaultLabel: 'Date Format',
    icon: Calendar,
    description: 'Configure global date display preference',
  },
  {
    id: 'organization',
    labelKey: 'tabs.organization',
    defaultLabel: 'Organization',
    icon: Building,
    description: 'View organization defaults and standards',
  },
] as const;

export const LANGUAGE_OPTIONS: readonly LanguageOption[] = [
  { code: 'en', labelKey: 'language.english', defaultLabel: 'English' },
  { code: 'gu', labelKey: 'language.gujarati', defaultLabel: 'ગુજરાતી (Gujarati)' },
  { code: 'hi', labelKey: 'language.hindi', defaultLabel: 'हिन्दी (Hindi)' },
] as const;

export const CURRENCY_OPTIONS: readonly CurrencyOptionItem[] = [
  {
    code: 'USD',
    symbol: '$',
    labelKey: 'organization.currencyUsd',
    defaultLabel: 'USD ($) - US Dollar',
  },
  {
    code: 'INR',
    symbol: '₹',
    labelKey: 'organization.currencyInr',
    defaultLabel: 'INR (₹) - Indian Rupee',
  },
  {
    code: 'EUR',
    symbol: '€',
    labelKey: 'organization.currencyEur',
    defaultLabel: 'EUR (€) - Euro',
  },
  {
    code: 'GBP',
    symbol: '£',
    labelKey: 'organization.currencyGbp',
    defaultLabel: 'GBP (£) - British Pound',
  },
] as const;

export const THEME_MODES: readonly ThemeModeOption[] = [
  { value: 'light', labelKey: 'theme.light', defaultLabel: 'Light', icon: Sun },
  { value: 'dark', labelKey: 'theme.dark', defaultLabel: 'Dark', icon: Moon },
  { value: 'system', labelKey: 'theme.system', defaultLabel: 'System Default', icon: Laptop },
] as const;
