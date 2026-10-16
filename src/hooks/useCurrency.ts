/**
 * @description React hook providing reactive access to the global currency preference, formatting, and conversion
 */
import { useMemo } from 'react';
import { useThemeStore } from '@/store/useThemeStore';
import {
  SUPPORTED_CURRENCIES,
  BASE_CURRENCY,
  formatCurrency,
  convertFromBase,
  convertToBase,
  convertCurrency,
  getCurrencySymbol,
  getExchangeRates,
  type CurrencyConfig,
  type FormatCurrencyOptions,
} from '@/utils/currency';

export function useCurrency() {
  const currency = useThemeStore((s) => s.currency);
  const setCurrency = useThemeStore((s) => s.setCurrency);

  const config: CurrencyConfig = useMemo(() => {
    return SUPPORTED_CURRENCIES[currency];
  }, [currency]);

  const symbol = config.symbol;

  /**
   * Formats a monetary amount that is in the USD base currency into the selected display currency.
   * Automatically handles conversion and locale-specific grouping.
   * Accepts either fractionDigits (number) or an options object.
   */
  const format = useMemo(() => {
    return (
      costInBaseUSD: number | null | undefined,
      optionsOrFractionDigits?: number | FormatCurrencyOptions,
    ) => {
      if (typeof optionsOrFractionDigits === 'number') {
        return formatCurrency(costInBaseUSD, {
          currency,
          fractionDigits: optionsOrFractionDigits,
          convertFromBase: true,
        });
      }
      return formatCurrency(costInBaseUSD, {
        currency,
        convertFromBase: true,
        ...optionsOrFractionDigits,
      });
    };
  }, [currency]);

  /**
   * Formats an amount that has ALREADY been converted to the current display currency.
   * Useful when chart/KPI math is already in the target currency.
   * Accepts either fractionDigits (number) or an options object.
   */
  const formatConverted = useMemo(() => {
    return (
      amountInCurrentCurrency: number | null | undefined,
      optionsOrFractionDigits?: number | FormatCurrencyOptions,
    ) => {
      if (typeof optionsOrFractionDigits === 'number') {
        return formatCurrency(amountInCurrentCurrency, {
          currency,
          fractionDigits: optionsOrFractionDigits,
          convertFromBase: false,
        });
      }
      return formatCurrency(amountInCurrentCurrency, {
        currency,
        convertFromBase: false,
        ...optionsOrFractionDigits,
      });
    };
  }, [currency]);

  /**
   * Converts a base USD amount into the active currency as a raw numeric value.
   */
  const convert = useMemo(() => {
    return (costInBaseUSD: number | null | undefined) => {
      return convertFromBase(costInBaseUSD, currency);
    };
  }, [currency]);

  return {
    currency,
    setCurrency,
    symbol,
    config,
    baseCurrency: BASE_CURRENCY,
    format,
    formatConverted,
    convert,
    convertToBase: (amount: number | null | undefined) => convertToBase(amount, currency),
    convertCurrency,
    formatCurrency,
    getCurrencySymbol,
    rates: getExchangeRates(),
  };
}

export default useCurrency;
