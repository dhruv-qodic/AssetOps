/**
 * @description Centralized date formatting, parsing, and preference utilities for AssetOps powered by date-fns
 */
import { format as dateFnsFormat, isValid, parseISO } from 'date-fns';
import i18n from '@/i18n';
import { useThemeStore, type SupportedDateFormat } from '@/store/useThemeStore';

export type { SupportedDateFormat };

export interface DateFormatOption {
  key: SupportedDateFormat;
  /** Format pattern for date-fns format() */
  pattern: string;
  /** Format pattern for date-fns format() including time */
  dateTimePattern: string;
  /** Human readable format label */
  label: string;
  /** Geographical / standard context */
  description: string;
  /** Representative static example */
  example: string;
}

/** Default system fallback date format: ISO 8601 */
export const DEFAULT_DATE_FORMAT: SupportedDateFormat = 'YYYY-MM-DD';

/**
 * Supported date formats across AssetOps application with date-fns format patterns.
 */
export const SUPPORTED_DATE_FORMATS: Record<SupportedDateFormat, DateFormatOption> = {
  'YYYY-MM-DD': {
    key: 'YYYY-MM-DD',
    pattern: 'yyyy-MM-dd',
    dateTimePattern: 'yyyy-MM-dd HH:mm',
    label: 'YYYY-MM-DD',
    description: 'ISO 8601 (e.g. 2026-10-16)',
    example: '2026-10-16',
  },
  'DD/MM/YYYY': {
    key: 'DD/MM/YYYY',
    pattern: 'dd/MM/yyyy',
    dateTimePattern: 'dd/MM/yyyy HH:mm',
    label: 'DD/MM/YYYY',
    description: 'European & Indian Standard (e.g. 16/10/2026)',
    example: '16/10/2026',
  },
  'MM/DD/YYYY': {
    key: 'MM/DD/YYYY',
    pattern: 'MM/dd/yyyy',
    dateTimePattern: 'MM/dd/yyyy hh:mm a',
    label: 'MM/DD/YYYY',
    description: 'US Standard (e.g. 10/16/2026)',
    example: '10/16/2026',
  },
  'DD-MM-YYYY': {
    key: 'DD-MM-YYYY',
    pattern: 'dd-MM-yyyy',
    dateTimePattern: 'dd-MM-yyyy HH:mm',
    label: 'DD-MM-YYYY',
    description: 'Hyphenated Standard (e.g. 16-10-2026)',
    example: '16-10-2026',
  },
  'MMM d, yyyy': {
    key: 'MMM d, yyyy',
    pattern: 'MMM d, yyyy',
    dateTimePattern: 'MMM d, yyyy, h:mm a',
    label: 'MMM D, YYYY',
    description: 'Abbreviated Month (e.g. Oct 16, 2026)',
    example: 'Oct 16, 2026',
  },
  'd MMM yyyy': {
    key: 'd MMM yyyy',
    pattern: 'd MMM yyyy',
    dateTimePattern: 'd MMM yyyy, HH:mm',
    label: 'D MMM YYYY',
    description: 'Day-First Abbreviated (e.g. 16 Oct 2026)',
    example: '16 Oct 2026',
  },
  'MMMM d, yyyy': {
    key: 'MMMM d, yyyy',
    pattern: 'MMMM d, yyyy',
    dateTimePattern: 'MMMM d, yyyy, h:mm a',
    label: 'MMMM D, YYYY',
    description: 'Full Month Name (e.g. October 16, 2026)',
    example: 'October 16, 2026',
  },
};

/**
 * Safely parses any date string, timestamp, or Date object into a valid Date instance.
 * Returns null if the value is invalid or cannot be parsed.
 */
export function toValidDate(input: Date | string | number | null | undefined): Date | null {
  if (input == null || input === '') return null;

  if (input instanceof Date) {
    return isValid(input) ? input : null;
  }

  if (typeof input === 'number') {
    const d = new Date(input);
    return isValid(d) ? d : null;
  }

  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (!trimmed) return null;

    // Fast path: date-only strings 'YYYY-MM-DD'
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      const parsedIso = parseISO(trimmed);
      if (isValid(parsedIso)) return parsedIso;
    }

    // Try ISO string parser
    const parsedIso = parseISO(trimmed);
    if (isValid(parsedIso)) return parsedIso;

    // Fallback to standard Date constructor
    const d = new Date(trimmed);
    if (isValid(d)) return d;
  }

  return null;
}

export interface FormatDateOptions {
  format?: SupportedDateFormat;
  fallback?: string;
}

/**
 * Formats a date value into the user's preferred format using date-fns.
 * Automatically synchronizes with the globally configured date format in useThemeStore.
 *
 * @param {Date | string | number | null} date - Date object, timestamp, or date string
 * @param {string} fallback - Fallback string if date is null/undefined or invalid (default: '-')
 * @param {SupportedDateFormat | FormatDateOptions | Intl.DateTimeFormatOptions} [optionsOrFormat] - Explicit format key or options override
 * @returns {string} Formatted date string
 *
 * @example
 * formatDate('2026-10-16') // '2026-10-16' (if YYYY-MM-DD selected)
 * formatDate('2026-10-16', '-', 'DD/MM/YYYY') // '16/10/2026'
 */
export function formatDate(
  date?: string | number | Date | null,
  fallback = '-',
  optionsOrFormat?: SupportedDateFormat | FormatDateOptions | Intl.DateTimeFormatOptions,
  _legacyLocale?: string,
): string {
  if (date == null || date === '') {
    return fallback;
  }

  const validDate = toValidDate(date);
  if (!validDate) {
    // If it's a non-empty string that's not parseable as a date (e.g. 'Valid (Until Apr 2027)'), preserve it
    return typeof date === 'string' && date.trim() !== '' ? date : fallback;
  }

  // Resolve target date format key
  let formatKey: SupportedDateFormat;

  if (typeof optionsOrFormat === 'string') {
    formatKey = optionsOrFormat;
  } else if (
    optionsOrFormat &&
    typeof optionsOrFormat === 'object' &&
    'format' in optionsOrFormat &&
    typeof optionsOrFormat.format === 'string'
  ) {
    formatKey = optionsOrFormat.format;
  } else {
    try {
      formatKey = useThemeStore.getState().dateFormat;
    } catch {
      formatKey = DEFAULT_DATE_FORMAT;
    }
  }

  const config = SUPPORTED_DATE_FORMATS[formatKey];

  try {
    return dateFnsFormat(validDate, config.pattern);
  } catch {
    return typeof date === 'string' ? date : fallback;
  }
}

/**
 * Formats a date value including timestamp (date + time) using the user's preferred format.
 *
 * @param {Date | string | number | null} date - Date object, timestamp, or ISO string
 * @param {string} fallback - Fallback string if date is null/undefined or invalid
 * @param {SupportedDateFormat} [formatOption] - Optional format key override
 * @returns {string} Formatted date and time string
 */
export function formatDateTime(
  date?: string | number | Date | null,
  fallback = '-',
  formatOption?: SupportedDateFormat,
): string {
  if (date == null || date === '') {
    return fallback;
  }

  const validDate = toValidDate(date);
  if (!validDate) {
    return typeof date === 'string' && date.trim() !== '' ? date : fallback;
  }

  let formatKey: SupportedDateFormat;
  if (formatOption) {
    formatKey = formatOption;
  } else {
    try {
      formatKey = useThemeStore.getState().dateFormat;
    } catch {
      formatKey = DEFAULT_DATE_FORMAT;
    }
  }

  const config = SUPPORTED_DATE_FORMATS[formatKey];

  try {
    return dateFnsFormat(validDate, config.dateTimePattern);
  } catch {
    return typeof date === 'string' ? date : fallback;
  }
}

/**
 * Returns the date-fns format pattern for a given SupportedDateFormat or active format.
 */
export function getDateFormatPattern(formatKey?: SupportedDateFormat): string {
  const key = formatKey ?? useThemeStore.getState().dateFormat;
  return SUPPORTED_DATE_FORMATS[key].pattern;
}

/**
 * Returns the human-readable label for a given format key or active format.
 */
export function getDateFormatLabel(formatKey?: SupportedDateFormat): string {
  const key = formatKey ?? useThemeStore.getState().dateFormat;
  return SUPPORTED_DATE_FORMATS[key].label;
}

/**
 * Formats an ISO date string or timestamp into a relative human-readable time interval
 * (e.g., 'Just now', '12m ago', '3h ago', '5d ago', or formatted date using active format)
 *
 * @param {string | number | Date | null} dateString - ISO date string, timestamp, or Date
 * @param {string} fallback - Fallback string if date is falsy
 * @returns {string} Relative time string
 */
export function formatRelativeTime(
  dateString?: string | number | Date | null,
  fallback = 'recently',
): string {
  if (!dateString) return fallback;

  const str = String(dateString);
  // If already relative formatted (e.g. '12m ago' or 'Just now')
  if (str.includes('ago') || str === 'Just now') {
    return str;
  }

  const validDate = toValidDate(dateString);
  if (!validDate) return str;

  const parsed = validDate.getTime();
  const diffMs = Date.now() - parsed;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  const t = (key: string, opts?: Record<string, unknown>) => {
    try {
      if (i18n.isInitialized) {
        return i18n.t(key, opts);
      }
    } catch {
      // ignore
    }
    return (opts?.defaultValue as string) || key;
  };

  if (diffSec < 45) {
    return t('history:relativeTime.justNow', { defaultValue: 'Just now' });
  }
  if (diffMin < 60) {
    const count = Math.max(1, diffMin);
    return t('history:relativeTime.minutesAgo', {
      count,
      defaultValue: `${count}m ago`,
    });
  }
  if (diffHour < 24) {
    return t('history:relativeTime.hoursAgo', {
      count: diffHour,
      defaultValue: `${diffHour}h ago`,
    });
  }
  if (diffDay === 1) {
    return t('history:relativeTime.yesterday', { defaultValue: 'Yesterday' });
  }
  if (diffDay < 30) {
    return t('history:relativeTime.daysAgo', {
      count: diffDay,
      defaultValue: `${diffDay}d ago`,
    });
  }

  // For dates older than 30 days, format consistently according to user preference!
  return formatDate(validDate);
}
