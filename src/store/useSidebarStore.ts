import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarState {
  /** Whether the desktop sidebar is collapsed into icon-only mode */
  isCollapsed: boolean;
  /** Whether the mobile drawer sheet is open */
  isMobileOpen: boolean;

  /** Toggle desktop sidebar collapsed/expanded state */
  toggleCollapse: () => void;
  /** Toggle mobile sheet drawer open/closed state */
  toggleMobile: () => void;
  /** Explicitly set mobile sheet open state */
  setMobileOpen: (open: boolean) => void;
  /** Explicitly set desktop collapsed state */
  setCollapsed: (collapsed: boolean) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isCollapsed: false,
      isMobileOpen: false,

      toggleCollapse: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
      toggleMobile: () => set((state) => ({ isMobileOpen: !state.isMobileOpen })),
      setMobileOpen: (open) => set({ isMobileOpen: open }),
      setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
    }),
    {
      name: 'assetops_sidebar_store',
      partialize: (state) => ({
        isCollapsed: state.isCollapsed,
      }),
    }
  )
);
