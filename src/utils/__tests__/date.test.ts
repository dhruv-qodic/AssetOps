import { describe, it, expect, beforeEach } from 'vitest';
import {
  DEFAULT_DATE_FORMAT,
  SUPPORTED_DATE_FORMATS,
  toValidDate,
  formatDate,
  formatDateTime,
  getDateFormatPattern,
  getDateFormatLabel,
  formatRelativeTime,
  type SupportedDateFormat,
} from '../date';
import { useThemeStore } from '@/store/useThemeStore';

describe('Global Date Formatting & Preference System (date-fns)', () => {
  beforeEach(() => {
    localStorage.clear();
    useThemeStore.setState({ dateFormat: 'YYYY-MM-DD' });
  });

  describe('1. Default Date Format and Configurations', () => {
    it('should have YYYY-MM-DD as the default fallback format', () => {
      expect(DEFAULT_DATE_FORMAT).toBe('YYYY-MM-DD');
    });

    it('should provide complete configuration for all supported date formats', () => {
      const keys: SupportedDateFormat[] = [
        'YYYY-MM-DD',
        'DD/MM/YYYY',
        'MM/DD/YYYY',
        'DD-MM-YYYY',
        'MMM d, yyyy',
        'd MMM yyyy',
        'MMMM d, yyyy',
      ];

      keys.forEach((key) => {
        const config = SUPPORTED_DATE_FORMATS[key];
        expect(config).toBeDefined();
        expect(config.key).toBe(key);
        expect(config.pattern).toBeTypeOf('string');
        expect(config.dateTimePattern).toBeTypeOf('string');
        expect(config.label).toBeTypeOf('string');
        expect(config.description).toBeTypeOf('string');
        expect(config.example).toBeTypeOf('string');
      });
    });

    it('should return correct pattern and label helpers', () => {
      expect(getDateFormatPattern('DD/MM/YYYY')).toBe('dd/MM/yyyy');
      expect(getDateFormatLabel('DD/MM/YYYY')).toBe('DD/MM/YYYY');
      expect(getDateFormatPattern()).toBe('yyyy-MM-dd'); // Default
      expect(getDateFormatLabel()).toBe('YYYY-MM-DD');
    });
  });

  describe('2. Date Parsing (toValidDate)', () => {
    it('should parse YYYY-MM-DD date-only strings accurately without timezone shift', () => {
      const parsed = toValidDate('2026-10-16');
      expect(parsed).not.toBeNull();
      expect(parsed?.getFullYear()).toBe(2026);
      expect(parsed?.getMonth()).toBe(9); // 0-indexed: 9 is October
      expect(parsed?.getDate()).toBe(16);
    });

    it('should parse numeric epoch timestamps', () => {
      const timestamp = new Date(2026, 9, 16, 12, 0, 0).getTime();
      const parsed = toValidDate(timestamp);
      expect(parsed).not.toBeNull();
      expect(parsed?.getFullYear()).toBe(2026);
      expect(parsed?.getDate()).toBe(16);
    });

    it('should accept existing Date objects', () => {
      const original = new Date(2026, 5, 20);
      const parsed = toValidDate(original);
      expect(parsed).toBe(original);
    });

    it('should return null for null, undefined, empty string, or invalid date values', () => {
      expect(toValidDate(null)).toBeNull();
      expect(toValidDate(undefined)).toBeNull();
      expect(toValidDate('')).toBeNull();
      expect(toValidDate('   ')).toBeNull();
      expect(toValidDate('not-a-valid-date')).toBeNull();
    });
  });

  describe('3. Date Formatting (formatDate)', () => {
    const testDate = '2026-10-16';

    it('should format date with default format (YYYY-MM-DD)', () => {
      expect(formatDate(testDate)).toBe('2026-10-16');
    });

    it('should format date according to user preference in global store', () => {
      useThemeStore.setState({ dateFormat: 'DD/MM/YYYY' });
      expect(formatDate(testDate)).toBe('16/10/2026');

      useThemeStore.setState({ dateFormat: 'MM/DD/YYYY' });
      expect(formatDate(testDate)).toBe('10/16/2026');

      useThemeStore.setState({ dateFormat: 'DD-MM-YYYY' });
      expect(formatDate(testDate)).toBe('16-10-2026');

      useThemeStore.setState({ dateFormat: 'MMM d, yyyy' });
      expect(formatDate(testDate)).toBe('Oct 16, 2026');

      useThemeStore.setState({ dateFormat: 'd MMM yyyy' });
      expect(formatDate(testDate)).toBe('16 Oct 2026');

      useThemeStore.setState({ dateFormat: 'MMMM d, yyyy' });
      expect(formatDate(testDate)).toBe('October 16, 2026');
    });

    it('should support explicit format override argument as string', () => {
      useThemeStore.setState({ dateFormat: 'YYYY-MM-DD' });
      expect(formatDate(testDate, '-', 'DD/MM/YYYY')).toBe('16/10/2026');
      expect(formatDate(testDate, '-', 'MMM d, yyyy')).toBe('Oct 16, 2026');
    });

    it('should support explicit format override in options object', () => {
      expect(formatDate(testDate, '-', { format: 'd MMM yyyy' })).toBe('16 Oct 2026');
    });

    it('should return fallback string when date is null, undefined, or empty', () => {
      expect(formatDate(null)).toBe('-');
      expect(formatDate(undefined, 'N/A')).toBe('N/A');
      expect(formatDate('', 'No Date')).toBe('No Date');
    });

    it('should gracefully preserve unparseable descriptive strings like warranty text', () => {
      const warranty = 'Valid (Until Apr 2027)';
      expect(formatDate(warranty)).toBe('Valid (Until Apr 2027)');
    });
  });

  describe('4. Date & Time Formatting (formatDateTime)', () => {
    it('should format date and time according to active format pattern', () => {
      const date = new Date(2026, 9, 16, 14, 30, 0);

      useThemeStore.setState({ dateFormat: 'YYYY-MM-DD' });
      expect(formatDateTime(date)).toBe('2026-10-16 14:30');

      useThemeStore.setState({ dateFormat: 'DD/MM/YYYY' });
      expect(formatDateTime(date)).toBe('16/10/2026 14:30');

      useThemeStore.setState({ dateFormat: 'MMM d, yyyy' });
      expect(formatDateTime(date)).toBe('Oct 16, 2026, 2:30 PM');
    });

    it('should handle null, undefined, or invalid inputs gracefully', () => {
      expect(formatDateTime(null)).toBe('-');
      expect(formatDateTime(undefined, 'N/A')).toBe('N/A');
      expect(formatDateTime('invalid')).toBe('invalid');
    });
  });

  describe('5. Relative Time Formatting (formatRelativeTime)', () => {
    it('should return already relative strings unchanged', () => {
      expect(formatRelativeTime('5m ago')).toBe('5m ago');
      expect(formatRelativeTime('Just now')).toBe('Just now');
    });

    it('should return "Just now" for dates within 45 seconds', () => {
      const now = new Date(Date.now() - 10000).toISOString();
      expect(formatRelativeTime(now)).toBe('Just now');
    });

    it('should format minutes ago accurately', () => {
      const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
      expect(formatRelativeTime(tenMinsAgo)).toBe('10m ago');
    });

    it('should format hours ago accurately', () => {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
      expect(formatRelativeTime(twoHoursAgo)).toBe('2h ago');
    });

    it('should format yesterday accurately', () => {
      const yesterday = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString();
      expect(formatRelativeTime(yesterday)).toBe('Yesterday');
    });

    it('should format days ago within 30 days', () => {
      const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();
      expect(formatRelativeTime(fiveDaysAgo)).toBe('5d ago');
    });

    it('should format dates older than 30 days using active date format preference', () => {
      useThemeStore.setState({ dateFormat: 'DD/MM/YYYY' });
      const oldDate = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
      const expected = formatDate(oldDate, '-', 'DD/MM/YYYY');
      expect(formatRelativeTime(oldDate)).toBe(expected);
    });
  });
});
