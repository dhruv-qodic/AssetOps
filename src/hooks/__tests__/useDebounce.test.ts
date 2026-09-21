import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('useDebounce Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 300));
    expect(result.current).toBe('hello');
  });

  it('should debounce value change until timer expires', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 300 },
    });

    expect(result.current).toBe('initial');

    // Update prop
    rerender({ value: 'updated', delay: 300 });

    // Should not update immediately
    expect(result.current).toBe('initial');

    // Fast-forward time halfway
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current).toBe('initial');

    // Fast-forward past the delay
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current).toBe('updated');
  });

  it('should cancel previous timer on rapid value changes', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'a', delay: 300 },
    });

    rerender({ value: 'ab', delay: 300 });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('a');

    rerender({ value: 'abc', delay: 300 });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('a');

    rerender({ value: 'abcd', delay: 300 });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe('abcd');
  });
});
