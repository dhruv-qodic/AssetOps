/**
 * @description React hook providing reactive access to the global date format preference and formatting functions
 */
import { useMemo } from 'react';
import { useThemeStore, type SupportedDateFormat } from '@/store/useThemeStore';
import {
  SUPPORTED_DATE_FORMATS,
  formatDate,
  formatDateTime,
  getDateFormatPattern,
  getDateFormatLabel,
  type DateFormatOption,
  type FormatDateOptions,
} from '@/utils/date';

export function useDateFormat() {
  const dateFormat = useThemeStore((s) => s.dateFormat);
  const setDateFormat = useThemeStore((s) => s.setDateFormat);

  const activeConfig: DateFormatOption = useMemo(() => {
    return SUPPORTED_DATE_FORMATS[dateFormat];
  }, [dateFormat]);

  /**
   * Formats a date using the user's currently active global date format preference.
   * @returns {string} - The formatted date string
   */
  const format = useMemo(() => {
    return (
      date?: string | number | Date | null,
      fallback = '-',
      options?: FormatDateOptions | SupportedDateFormat,
    ) => {
      if (typeof options === 'string') {
        return formatDate(date, fallback, options);
      }
      return formatDate(date, fallback, {
        format: dateFormat,
        ...options,
      });
    };
  }, [dateFormat]);

  /**
   * Formats a date with time using the user's active global date format preference.
   * @returns {string} - The formatted date string
   */
  const formatWithTime = useMemo(() => {
    return (
      date?: string | number | Date | null,
      fallback = '-',
      formatOverride?: SupportedDateFormat,
    ) => {
      return formatDateTime(date, fallback, formatOverride || dateFormat);
    };
  }, [dateFormat]);

  return {
    dateFormat,
    setDateFormat,
    activeConfig,
    formatDate: format,
    formatDateTime: formatWithTime,
    supportedFormats: Object.values(SUPPORTED_DATE_FORMATS),
    pattern: activeConfig.pattern,
    label: activeConfig.label,
    getPattern: getDateFormatPattern,
    getLabel: getDateFormatLabel,
  };
}

export default useDateFormat;
