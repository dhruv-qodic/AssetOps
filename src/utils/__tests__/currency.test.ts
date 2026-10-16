import { describe, it, expect, beforeEach } from 'vitest';
import {
  BASE_CURRENCY,
  SUPPORTED_CURRENCIES,
  DEFAULT_EXCHANGE_RATES,
  convertCurrency,
  convertFromBase,
  convertToBase,
  formatCurrency,
  getCurrencySymbol,
  setExchangeRates,
  resetExchangeRates,
  type SupportedCurrency,
} from '../currency';
import { useThemeStore } from '@/store/useThemeStore';

describe('Global Currency Utility & Conversion System', () => {
  beforeEach(() => {
    resetExchangeRates();
    useThemeStore.setState({ currency: 'USD' });
    localStorage.clear();
  });

  describe('1. Default Currency and Metadata', () => {
    it('should have USD as the base source currency and valid default exchange rates', () => {
      expect(BASE_CURRENCY).toBe('USD');
      expect(DEFAULT_EXCHANGE_RATES.USD).toBe(1.0);
      expect(DEFAULT_EXCHANGE_RATES.INR).toBe(83.5);
      expect(DEFAULT_EXCHANGE_RATES.EUR).toBe(0.92);
      expect(DEFAULT_EXCHANGE_RATES.GBP).toBe(0.79);
    });

    it('should provide complete configuration for supported currencies', () => {
      expect(SUPPORTED_CURRENCIES.USD).toBeDefined();
      expect(SUPPORTED_CURRENCIES.USD.symbol).toBe('$');
      expect(SUPPORTED_CURRENCIES.USD.locale).toBe('en-US');

      expect(SUPPORTED_CURRENCIES.INR).toBeDefined();
      expect(SUPPORTED_CURRENCIES.INR.symbol).toBe('₹');
      expect(SUPPORTED_CURRENCIES.INR.locale).toBe('en-IN');

      expect(SUPPORTED_CURRENCIES.EUR).toBeDefined();
      expect(SUPPORTED_CURRENCIES.EUR.symbol).toBe('€');

      expect(SUPPORTED_CURRENCIES.GBP).toBeDefined();
      expect(SUPPORTED_CURRENCIES.GBP.symbol).toBe('£');
    });

    it('should retrieve the correct currency symbol', () => {
      expect(getCurrencySymbol('USD')).toBe('$');
      expect(getCurrencySymbol('INR')).toBe('₹');
      expect(getCurrencySymbol('EUR')).toBe('€');
      expect(getCurrencySymbol('GBP')).toBe('£');
      expect(getCurrencySymbol()).toBe('$'); // Active USD
    });
  });

  describe('2. Currency Conversion Logic', () => {
    it('should convert USD to INR using default exchange rate (83.50)', () => {
      const inr = convertCurrency(100, 'USD', 'INR');
      expect(inr).toBe(8350);
    });

    it('should convert USD to EUR using default exchange rate (0.92)', () => {
      const eur = convertCurrency(100, 'USD', 'EUR');
      expect(eur).toBe(92);
    });

    it('should convert USD to GBP using default exchange rate (0.79)', () => {
      const gbp = convertCurrency(100, 'USD', 'GBP');
      expect(gbp).toBe(79);
    });

    it('should convert back from target currency to base USD', () => {
      const usdFromInr = convertToBase(8350, 'INR');
      expect(usdFromInr).toBe(100);

      const usdFromEur = convertToBase(92, 'EUR');
      expect(usdFromEur).toBe(100);
    });

    it('should return identical value when converting same currency', () => {
      expect(convertCurrency(500, 'USD', 'USD')).toBe(500);
      expect(convertCurrency(500, 'INR', 'INR')).toBe(500);
    });

    it('should handle zero, null, undefined, and NaN gracefully', () => {
      expect(convertCurrency(0, 'USD', 'INR')).toBe(0);
      expect(convertCurrency(null, 'USD', 'INR')).toBe(0);
      expect(convertCurrency(undefined, 'USD', 'INR')).toBe(0);
      expect(convertCurrency(NaN, 'USD', 'INR')).toBe(0);
    });

    it('should handle invalid or failing exchange rates gracefully without crashing', () => {
      const invalidRates = {
        USD: 1.0,
        INR: 0, // Invalid 0 rate
        EUR: -5, // Invalid negative rate
        GBP: 0.79,
      } as Record<SupportedCurrency, number>;

      // Should return the original amount safely
      expect(convertCurrency(100, 'USD', 'INR', invalidRates)).toBe(100);
      expect(convertCurrency(100, 'USD', 'EUR', invalidRates)).toBe(100);
    });

    it('should allow custom exchange rates configuration', () => {
      setExchangeRates({ INR: 85.0 });
      expect(convertFromBase(100, 'INR')).toBe(8500);
      resetExchangeRates();
      expect(convertFromBase(100, 'INR')).toBe(8350);
    });
  });

  describe('3. Currency Formatting with Intl.NumberFormat', () => {
    it('should format USD with proper grouping and symbol', () => {
      const formatted = formatCurrency(1200, {
        currency: 'USD',
        fractionDigits: 2,
        convertFromBase: false,
      });
      expect(formatted).toBe('$1,200.00');
    });

    it('should format INR with Indian numbering system (Lakh grouping)', () => {
      const formatted = formatCurrency(100000, {
        currency: 'INR',
        fractionDigits: 2,
        convertFromBase: false,
      });
      expect(formatted).toContain('₹');
      expect(formatted).toContain('1,00,000.00');
    });

    it('should format EUR with Euro symbol', () => {
      const formatted = formatCurrency(1200, {
        currency: 'EUR',
        fractionDigits: 2,
        convertFromBase: false,
      });
      expect(formatted).toContain('€');
      expect(formatted).toContain('1.200,00');
    });

    it('should format GBP with British Pound symbol', () => {
      const formatted = formatCurrency(1200, {
        currency: 'GBP',
        fractionDigits: 2,
        convertFromBase: false,
      });
      expect(formatted).toContain('£');
      expect(formatted).toContain('1,200.00');
    });

    it('should format integer amounts cleanly when fractionDigits is not specified', () => {
      expect(formatCurrency(1450, { currency: 'USD', convertFromBase: false })).toBe('$1,450');
    });

    it('should format fractional amounts with 2 decimals when fractionDigits is not specified', () => {
      expect(formatCurrency(1450.5, { currency: 'USD', convertFromBase: false })).toBe('$1,450.50');
    });

    it('should prevent repeated conversion when convertFromBase is false', () => {
      // Amount is already converted to 83,500 INR
      const alreadyConverted = 83500;
      const formatted = formatCurrency(alreadyConverted, {
        currency: 'INR',
        fractionDigits: 0,
        convertFromBase: false,
      });
      expect(formatted).toContain('₹');
      expect(formatted).toContain('83,500');
      // Should NOT have converted 83,500 by another 83.5x!
      expect(formatted).not.toContain('69,72,250');
    });

    it('should safely handle malformed or out-of-range fractionDigits without crashing', () => {
      // Out of range (Intl.NumberFormat allows 0-20)
      expect(() => formatCurrency(1200, { fractionDigits: 50 })).not.toThrow();
      expect(() => formatCurrency(1200, { fractionDigits: -5 })).not.toThrow();

      // Accidentally passed nested object as fractionDigits
      expect(() =>
        formatCurrency(1200, {
          fractionDigits: { fractionDigits: 0 } as unknown as number,
        }),
      ).not.toThrow();
    });
  });

  describe('4. Store Integration & Persistence', () => {
    it('should default to USD in useThemeStore', () => {
      expect(useThemeStore.getState().currency).toBe('USD');
    });

    it('should update currency and persist to localStorage', () => {
      useThemeStore.getState().setCurrency('INR');

      expect(useThemeStore.getState().currency).toBe('INR');
      expect(localStorage.getItem('assetops_currency')).toBe('INR');
      expect(getCurrencySymbol()).toBe('₹');

      // Now single-argument formatCurrency(val) automatically converts and formats in INR
      const formatted = formatCurrency(100);
      expect(formatted).toContain('₹');
      expect(formatted).toContain('8,350');
    });

    it('should update back to USD cleanly', () => {
      useThemeStore.getState().setCurrency('INR');
      expect(useThemeStore.getState().currency).toBe('INR');

      useThemeStore.getState().setCurrency('USD');
      expect(useThemeStore.getState().currency).toBe('USD');
      expect(localStorage.getItem('assetops_currency')).toBe('USD');
      expect(getCurrencySymbol()).toBe('$');

      expect(formatCurrency(100)).toBe('$100');
    });

    it('should leave stored asset values in USD unaffected', () => {
      const mockAsset = {
        id: 'AST-001',
        name: 'MacBook Pro 16',
        purchaseCost: 2499,
      };

      // Change currency to INR
      useThemeStore.getState().setCurrency('INR');

      // Display formatting converts for UI
      const displayVal = formatCurrency(mockAsset.purchaseCost);
      expect(displayVal).toContain('₹');

      // Original asset record remains unchanged in USD
      expect(mockAsset.purchaseCost).toBe(2499);
    });
  });
});
