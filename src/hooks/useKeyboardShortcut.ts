import { useEffect } from 'react';

export interface KeyboardShortcutOptions {
  key: string;
  ctrlOrMeta?: boolean;
  shift?: boolean;
  alt?: boolean;
  preventDefault?: boolean;
  disabled?: boolean;
}

/**
 * Constants for HTML input and textarea element tag names.
 */
export const INPUT_TAG_NAMES = {
  INPUT: 'INPUT',
  TEXTAREA: 'TEXTAREA',
} as const;

/**
 * List of HTML tag names where global keyboard shortcuts should be ignored.
 */
export const IGNORED_INPUT_TAGS: readonly string[] = [
  INPUT_TAG_NAMES.INPUT,
  INPUT_TAG_NAMES.TEXTAREA,
];

/**
 * Keys used for standard undo/redo shortcuts.
 */
export const SHORTCUT_KEYS = {
  UNDO: 'z',
  REDO_SECONDARY: 'y',
} as const;

/**
 * Checks whether the given event target is an interactive input, textarea, or content-editable element.
 */
export function isEditableElement(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false;
  const isContentEditable =
    target.isContentEditable ||
    target.getAttribute('contenteditable') === 'true' ||
    target.getAttribute('contenteditable') === '';
  return IGNORED_INPUT_TAGS.includes(target.tagName) || isContentEditable;
}

/**
 * Hook to listen for specific keyboard shortcuts and cleanly unmount event listeners.
 */
export function useKeyboardShortcut(
  options: KeyboardShortcutOptions,
  callback: (e: KeyboardEvent) => void,
): void {
  useEffect(() => {
    if (options.disabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not trigger shortcut when focused inside input/textarea/contentEditable unless specified
      if (isEditableElement(e.target)) return;

      const isKeyMatch = e.key.toLowerCase() === options.key.toLowerCase();
      const isCtrlOrMetaMatch = options.ctrlOrMeta
        ? e.ctrlKey || e.metaKey
        : !e.ctrlKey && !e.metaKey;
      const isShiftMatch = options.shift ? e.shiftKey : !e.shiftKey;
      const isAltMatch = options.alt ? e.altKey : !e.altKey;

      if (isKeyMatch && isCtrlOrMetaMatch && isShiftMatch && isAltMatch) {
        if (options.preventDefault !== false) {
          e.preventDefault();
        }
        callback(e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [options, callback]);
}

export interface UseUndoRedoShortcutsProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  disabled?: boolean;
}

/**
 * Composite hook that registers both Undo (Ctrl+Z / Cmd+Z) and Redo (Ctrl+Shift+Z / Cmd+Shift+Z / Ctrl+Y)
 */
export function useUndoRedoShortcuts({
  onUndo,
  onRedo,
  canUndo = true,
  canRedo = true,
  disabled = false,
}: UseUndoRedoShortcutsProps): void {
  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditableElement(e.target)) return;

      const isCtrlOrMeta = e.ctrlKey || e.metaKey;
      if (!isCtrlOrMeta) return;

      const key = e.key.toLowerCase();

      // Undo: Ctrl+Z / Cmd+Z (without Shift)
      if (key === SHORTCUT_KEYS.UNDO && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) {
          onUndo();
        }
        return;
      }

      // Redo: Ctrl+Shift+Z / Cmd+Shift+Z OR Ctrl+Y / Cmd+Y
      if (
        (key === SHORTCUT_KEYS.UNDO && e.shiftKey) ||
        (key === SHORTCUT_KEYS.REDO_SECONDARY && !e.shiftKey)
      ) {
        e.preventDefault();
        if (canRedo) {
          onRedo();
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onUndo, onRedo, canUndo, canRedo, disabled]);
}

export default useKeyboardShortcut;
