import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useDebounce } from '../useDebounce';

describe('useDebounce hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 300));
    expect(result.current).toBe('initial');
  });

  it('should update debounced value after specified delay', () => {
    const { result, rerender } = renderHook(({ val, delay }) => useDebounce(val, delay), {
      initialProps: { val: 'first', delay: 300 },
    });

    expect(result.current).toBe('first');

    // Change value
    rerender({ val: 'second', delay: 300 });
    expect(result.current).toBe('first'); // Still old value

    // Fast-forward time by 200ms (not reached 300ms yet)
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('first');

    // Fast-forward remaining 100ms
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('second');
  });

  it('should reset timer on rapid consecutive changes', () => {
    const { result, rerender } = renderHook(({ val }) => useDebounce(val, 300), {
      initialProps: { val: 'a' },
    });

    rerender({ val: 'ab' });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('a');

    rerender({ val: 'abc' });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('a');

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('abc');
  });
});
