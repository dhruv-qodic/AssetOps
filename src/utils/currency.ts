/**
 * @description Centralized currency formatting, conversion, and preference utilities for AssetOps
 *
 * NOTE: In AssetOps, all stored asset cost and valuation data (purchaseCost) is stored in USD as the source base currency.
 * When a user selects a different currency preference (e.g. INR, EUR, GBP), monetary values are converted from USD
 * using the configured exchange rates. Stored asset values are NEVER modified when changing display preferences.
 */
import { useThemeStore, type SupportedCurrency } from '@/store/useThemeStore';

export type { SupportedCurrency };

/** Source base currency for all stored monetary values in the database/store */
export const BASE_CURRENCY: SupportedCurrency = 'USD';

export interface CurrencyConfig {
  code: SupportedCurrency;
  symbol: string;
  name: string;
  locale: string;
  labelKey: string;
  flag: string;
}

export const SUPPORTED_CURRENCIES: Record<SupportedCurrency, CurrencyConfig> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    locale: 'en-US',
    labelKey: 'organization.currencyUsd',
    flag: '🇺🇸',
  },
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    locale: 'en-IN',
    labelKey: 'organization.currencyInr',
    flag: '🇮🇳',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    locale: 'de-DE',
    labelKey: 'organization.currencyEur',
    flag: '🇪🇺',
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    locale: 'en-GB',
    labelKey: 'organization.currencyGbp',
    flag: '🇬🇧',
  },
};

/**
 * Configurable exchange rates relative to USD (1 USD = X target currency).
 * Standard market reference rates with high stability.
 */
export const DEFAULT_EXCHANGE_RATES: Record<SupportedCurrency, number> = {
  USD: 1.0,
  INR: 83.5,
  EUR: 0.92,
  GBP: 0.79,
};

// Mutable runtime exchange rates (allows custom rate strategies or mock overrides)
let currentExchangeRates: Record<SupportedCurrency, number> = { ...DEFAULT_EXCHANGE_RATES };

/**
 * Returns current exchange rates in effect.
 */
export function getExchangeRates(): Record<SupportedCurrency, number> {
  return { ...currentExchangeRates };
}

/**
 * Updates a specific currency's exchange rate relative to USD.
 */
export function setExchangeRate(currency: SupportedCurrency, rate: number): void {
  if (rate > 0) {
    currentExchangeRates[currency] = rate;
  }
}

/**
 * Updates multiple currency exchange rates relative to USD.
 */
export function setExchangeRates(rates: Partial<Record<SupportedCurrency, number>>): void {
  currentExchangeRates = { ...currentExchangeRates, ...rates };
}

/**
 * Resets exchange rates to defaults.
 */
export function resetExchangeRates(): void {
  currentExchangeRates = { ...DEFAULT_EXCHANGE_RATES };
}

/**
 * Converts a monetary amount between any two supported currencies.
 *
 * @param {number | null | undefined} amount - Amount in source currency
 * @param {SupportedCurrency} from - Source currency code
 * @param {SupportedCurrency} to - Target currency code
 * @param {Record<SupportedCurrency, number>} [customRates] - Optional custom rates
 * @returns {number} Converted amount rounded to 2 decimal places
 */
export function convertCurrency(
  amount: number | null | undefined,
  from: SupportedCurrency = BASE_CURRENCY,
  to: SupportedCurrency = BASE_CURRENCY,
  customRates?: Record<SupportedCurrency, number>,
): number {
  if (amount == null || isNaN(amount)) {
    return 0;
  }
  if (amount === 0 || from === to) {
    return amount;
  }

  const rates = customRates || currentExchangeRates;
  const fromRate = rates[from];
  const toRate = rates[to];

  // Gracefully return amount if rate is missing or invalid
  if (!fromRate || !toRate || fromRate <= 0 || toRate <= 0) {
    return amount;
  }

  // Convert from source to USD base, then USD to target
  const inUSD = amount / fromRate;
  const inTarget = inUSD * toRate;

  return Math.round(inTarget * 100) / 100;
}

/**
 * Converts an amount stored in base USD currency to the target display currency.
 *
 * @param {number | null | undefined} amountInUSD - Amount in base currency USD
 * @param {SupportedCurrency} targetCurrency - Target currency code
 * @param {Record<SupportedCurrency, number>} [customRates] - Optional custom rates
 * @returns {number} Converted amount
 */
export function convertFromBase(
  amountInUSD: number | null | undefined,
  targetCurrency: SupportedCurrency,
  customRates?: Record<SupportedCurrency, number>,
): number {
  return convertCurrency(amountInUSD, BASE_CURRENCY, targetCurrency, customRates);
}

/**
 * Converts an amount from a specified source currency back into base USD currency.
 *
 * @param {number | null | undefined} amount - Amount in source currency
 * @param {SupportedCurrency} sourceCurrency - Source currency code
 * @param {Record<SupportedCurrency, number>} [customRates] - Optional custom rates
 * @returns {number} Converted amount in USD
 */
export function convertToBase(
  amount: number | null | undefined,
  sourceCurrency: SupportedCurrency,
  customRates?: Record<SupportedCurrency, number>,
): number {
  return convertCurrency(amount, sourceCurrency, BASE_CURRENCY, customRates);
}

const currencyFormatters = new Map<string, Intl.NumberFormat>();

export interface FormatCurrencyOptions {
  /** Target currency to format in (defaults to global store preference) */
  currency?: SupportedCurrency;
  /** Explicit number of decimal places (default: 0 if integer, 2 if fractional) */
  fractionDigits?: number;
  /** Locale override for formatting (default: locale matched to currency) */
  locale?: string;
  /**
   * If true, treats input amount as base currency (USD) and converts to target currency first.
   * Defaults to true when currency is not manually supplied as a positional string.
   */
  convertFromBase?: boolean;
}

/**
 * Formats a numeric value into a localized currency string using cached Intl.NumberFormat instances.
 *
 * Automatically uses the active global currency preference from the settings store if not explicitly passed.
 * When called with base asset values (stored in USD), it automatically converts to the active display currency.
 *
 * @example
 * formatCurrency(1200) // In USD -> "$1,200"; in INR -> "₹1,00,200"
 * formatCurrency(100000, 'INR', 2) // "₹1,00,000.00"
 * formatCurrency(1200, { currency: 'USD', fractionDigits: 2 }) // "$1,200.00"
 */
export function formatCurrency(
  amount: number | null | undefined,
  optionsOrCurrency?: SupportedCurrency | FormatCurrencyOptions,
  fractionDigitsParam?: number,
  localeParam?: string,
): string {
  // Resolve options
  let targetCurrency: SupportedCurrency;
  let fractionDigits: number | undefined;
  let locale: string | undefined;
  let shouldConvertFromBase: boolean;

  if (typeof optionsOrCurrency === 'string') {
    targetCurrency = optionsOrCurrency;
    fractionDigits = fractionDigitsParam;
    locale = localeParam;
    shouldConvertFromBase = false;
  } else if (optionsOrCurrency && typeof optionsOrCurrency === 'object') {
    targetCurrency = optionsOrCurrency.currency ?? useThemeStore.getState().currency;
    fractionDigits = optionsOrCurrency.fractionDigits;
    locale = optionsOrCurrency.locale;
    shouldConvertFromBase = optionsOrCurrency.convertFromBase ?? optionsOrCurrency.currency == null;
  } else {
    targetCurrency = useThemeStore.getState().currency;
    fractionDigits = fractionDigitsParam;
    locale = localeParam;
    shouldConvertFromBase = true;
  }

  const currencyConfig = SUPPORTED_CURRENCIES[targetCurrency];
  const effectiveCurrency = currencyConfig.code;
  const effectiveLocale = locale || currencyConfig.locale;

  // Handle null / undefined / NaN
  if (amount == null || isNaN(amount)) {
    const key = `${effectiveLocale}-${effectiveCurrency}-0-0`;
    let zeroFormatter = currencyFormatters.get(key);
    if (!zeroFormatter) {
      zeroFormatter = new Intl.NumberFormat(effectiveLocale, {
        style: 'currency',
        currency: effectiveCurrency,
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      });
      currencyFormatters.set(key, zeroFormatter);
    }
    return zeroFormatter.format(0);
  }

  // Convert from USD base if requested
  const finalAmount = shouldConvertFromBase ? convertFromBase(amount, effectiveCurrency) : amount;

  // Extract and sanitize fraction digits safely
  let safeFractionDigits: number | undefined;
  if (typeof fractionDigits === 'number' && !isNaN(fractionDigits)) {
    safeFractionDigits = Math.max(0, Math.min(20, Math.floor(fractionDigits)));
  } else if (
    fractionDigits &&
    typeof fractionDigits === 'object' &&
    'fractionDigits' in (fractionDigits as Record<string, unknown>)
  ) {
    const nested = (fractionDigits as { fractionDigits?: unknown }).fractionDigits;
    if (typeof nested === 'number' && !isNaN(nested)) {
      safeFractionDigits = Math.max(0, Math.min(20, Math.floor(nested)));
    }
  }

  // Determine decimal fraction digits safely
  const isFractional = finalAmount % 1 !== 0;
  const minDigits = safeFractionDigits !== undefined ? safeFractionDigits : isFractional ? 2 : 0;
  let maxDigits = safeFractionDigits !== undefined ? safeFractionDigits : isFractional ? 2 : 0;

  if (minDigits > maxDigits) {
    maxDigits = minDigits;
  }

  const key = `${effectiveLocale}-${effectiveCurrency}-${minDigits}-${maxDigits}`;
  let formatter = currencyFormatters.get(key);
  if (!formatter) {
    try {
      formatter = new Intl.NumberFormat(effectiveLocale, {
        style: 'currency',
        currency: effectiveCurrency,
        maximumFractionDigits: maxDigits,
        minimumFractionDigits: minDigits,
      });
      currencyFormatters.set(key, formatter);
    } catch {
      // Safe fallback if Intl throws for any reason
      const sym = currencyConfig.symbol;
      return `${sym}${finalAmount.toLocaleString(effectiveLocale, {
        maximumFractionDigits: maxDigits,
        minimumFractionDigits: minDigits,
      })}`;
    }
  }

  try {
    return formatter.format(finalAmount);
  } catch {
    const sym = currencyConfig.symbol;
    return `${sym}${finalAmount.toLocaleString()}`;
  }
}

/**
 * Returns currency symbol for a given currency or the active currency.
 * @param {SupportedCurrency} currency - Optional currency code (defaults to global store preference)
 * @returns {string} Currency symbol string
 */
export function getCurrencySymbol(currency?: SupportedCurrency): string {
  const code = currency ?? useThemeStore.getState().currency;
  return SUPPORTED_CURRENCIES[code].symbol;
}
