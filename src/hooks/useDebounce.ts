import { useEffect, useState } from 'react';

/**
 * Custom hook to debounce a value by a specified delay.
 * Useful for delaying expensive operations (like filtering or API requests) until typing settles.
 *
 * @param value The value to debounce
 * @param delay The debounce delay in milliseconds (default: 300ms)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
