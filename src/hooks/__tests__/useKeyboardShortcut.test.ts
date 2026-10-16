import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useKeyboardShortcut, useUndoRedoShortcuts } from '@/hooks/useKeyboardShortcut';

describe('useKeyboardShortcut Hook', () => {
  it('should trigger callback when matching shortcut key is pressed with modifier', () => {
    const callback = vi.fn();
    renderHook(() =>
      useKeyboardShortcut(
        {
          key: 'z',
          ctrlOrMeta: true,
        },
        callback,
      ),
    );

    const event = new KeyboardEvent('keydown', {
      key: 'z',
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    });
    window.dispatchEvent(event);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should not trigger callback if disabled or modifier is not matched', () => {
    const callback = vi.fn();
    renderHook(() =>
      useKeyboardShortcut(
        {
          key: 'z',
          ctrlOrMeta: true,
          disabled: true,
        },
        callback,
      ),
    );

    const event = new KeyboardEvent('keydown', {
      key: 'z',
      ctrlKey: true,
      bubbles: true,
    });
    window.dispatchEvent(event);

    expect(callback).not.toHaveBeenCalled();
  });

  it('should remove event listeners on unmount', () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() =>
      useKeyboardShortcut(
        {
          key: 'z',
          ctrlOrMeta: true,
        },
        callback,
      ),
    );

    unmount();

    const event = new KeyboardEvent('keydown', {
      key: 'z',
      ctrlKey: true,
      bubbles: true,
    });
    window.dispatchEvent(event);

    expect(callback).not.toHaveBeenCalled();
  });
});

describe('useUndoRedoShortcuts Composite Hook', () => {
  it('should trigger onUndo for Ctrl+Z and onRedo for Ctrl+Shift+Z', () => {
    const onUndo = vi.fn();
    const onRedo = vi.fn();

    renderHook(() =>
      useUndoRedoShortcuts({
        onUndo,
        onRedo,
        canUndo: true,
        canRedo: true,
      }),
    );

    // 1. Ctrl+Z -> Undo
    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'z',
        ctrlKey: true,
        shiftKey: false,
        bubbles: true,
        cancelable: true,
      }),
    );
    expect(onUndo).toHaveBeenCalledTimes(1);
    expect(onRedo).not.toHaveBeenCalled();

    // 2. Ctrl+Shift+Z -> Redo
    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'z',
        ctrlKey: true,
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      }),
    );
    expect(onRedo).toHaveBeenCalledTimes(1);

    // 3. Ctrl+Y -> Redo
    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'y',
        ctrlKey: true,
        shiftKey: false,
        bubbles: true,
        cancelable: true,
      }),
    );
    expect(onRedo).toHaveBeenCalledTimes(2);
  });
});
