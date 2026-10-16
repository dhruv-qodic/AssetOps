import { useState, useRef, useEffect, useCallback } from 'react';

export interface UseDropdownPositionOptions {
  dropdownHeight?: number;
  onOpenChange?: (isOpen: boolean) => void;
}

export interface UseDropdownPositionResult<T extends HTMLElement = HTMLDivElement> {
  ref: React.RefObject<T | null>;
  isOpen: boolean;
  openUpward: boolean;
  toggleDropdown: (e?: React.MouseEvent) => void;
  closeDropdown: () => void;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Custom hook to manage dropdown open/closed state, outside-click detection,
 * and smart viewport/scroll-container collision detection to decide whether to open upward or downward.
 */
export function useDropdownPosition<T extends HTMLElement = HTMLDivElement>(
  options: UseDropdownPositionOptions = {},
): UseDropdownPositionResult<T> {
  const { dropdownHeight = 200, onOpenChange } = options;
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const ref = useRef<T>(null);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    onOpenChange?.(false);
  }, [onOpenChange]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeDropdown]);

  const toggleDropdown = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      const nextState = !isOpen;

      if (!isOpen && ref.current) {
        const buttonEl = ref.current;
        const rect = buttonEl.getBoundingClientRect();
        const viewportSpaceBelow = window.innerHeight - rect.bottom;
        const viewportSpaceAbove = rect.top;

        let containerSpaceBelow = Infinity;
        let containerSpaceAbove = Infinity;

        const scrollParent = buttonEl.closest(
          '.overflow-auto, .overflow-y-auto, .overflow-x-auto, table, tbody, [data-virtual-container]',
        );

        if (scrollParent) {
          const parentRect = scrollParent.getBoundingClientRect();
          containerSpaceBelow = parentRect.bottom - rect.bottom;
          containerSpaceAbove = rect.top - parentRect.top;
        }

        const effectiveSpaceBelow = Math.min(viewportSpaceBelow, containerSpaceBelow);
        const effectiveSpaceAbove = Math.max(viewportSpaceAbove, containerSpaceAbove);

        const shouldOpenUpward =
          effectiveSpaceBelow < dropdownHeight &&
          (effectiveSpaceAbove >= dropdownHeight || effectiveSpaceAbove > effectiveSpaceBelow);

        setOpenUpward(shouldOpenUpward);
      }

      setIsOpen(nextState);
      onOpenChange?.(nextState);
    },
    [isOpen, dropdownHeight, onOpenChange],
  );

  return {
    ref,
    isOpen,
    openUpward,
    toggleDropdown,
    closeDropdown,
    setIsOpen,
  };
}

export default useDropdownPosition;
