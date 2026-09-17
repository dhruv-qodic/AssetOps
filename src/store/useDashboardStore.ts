import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import {
  DASHBOARD_CARDS,
  DASHBOARD_WIDGETS,
  type DashboardTimeRange,
} from '@/constans/dashboard.constants';

const DEFAULT_VISIBLE_CARD_IDS = DASHBOARD_CARDS.filter((c) => c.defaultVisible).map((c) => c.id);
const DEFAULT_VISIBLE_WIDGET_IDS = DASHBOARD_WIDGETS.filter((w) => w.defaultVisible).map(
  (w) => w.id,
);

export interface DashboardState {
  visibleCardIds: string[];
  visibleWidgetIds: string[];
  timeRange: DashboardTimeRange;
  selectedLocation: string;
  isCustomizationOpen: boolean;

  // Actions
  setVisibleCardIds: (ids: string[]) => void;
  toggleCard: (id: string) => void;
  setVisibleWidgetIds: (ids: string[]) => void;
  toggleWidget: (id: string) => void;
  setTimeRange: (range: DashboardTimeRange) => void;
  setSelectedLocation: (location: string) => void;
  openCustomization: () => void;
  closeCustomization: () => void;
  resetLayoutToDefault: () => void;
  selectAllCardsAndWidgets: () => void;

  // Helpers
  isCardVisible: (id: string) => boolean;
  isWidgetVisible: (id: string) => boolean;
}

const safeStorage: StateStorage = {
  getItem: (name: string): string | null => {
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      localStorage.setItem(name, value);
    } catch {
      // ignore
    }
  },
  removeItem: (name: string): void => {
    try {
      localStorage.removeItem(name);
    } catch {
      // ignore
    }
  },
};

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      visibleCardIds: DEFAULT_VISIBLE_CARD_IDS,
      visibleWidgetIds: DEFAULT_VISIBLE_WIDGET_IDS,
      timeRange: 'Last 30 Days',
      selectedLocation: 'All',
      isCustomizationOpen: false,

      setVisibleCardIds: (ids) => set({ visibleCardIds: ids }),
      toggleCard: (id) =>
        set((state) => ({
          visibleCardIds: state.visibleCardIds.includes(id)
            ? state.visibleCardIds.filter((item) => item !== id)
            : [...state.visibleCardIds, id],
        })),

      setVisibleWidgetIds: (ids) => set({ visibleWidgetIds: ids }),
      toggleWidget: (id) =>
        set((state) => ({
          visibleWidgetIds: state.visibleWidgetIds.includes(id)
            ? state.visibleWidgetIds.filter((item) => item !== id)
            : [...state.visibleWidgetIds, id],
        })),

      setTimeRange: (timeRange) => set({ timeRange }),
      setSelectedLocation: (selectedLocation) => set({ selectedLocation }),

      openCustomization: () => set({ isCustomizationOpen: true }),
      closeCustomization: () => set({ isCustomizationOpen: false }),

      resetLayoutToDefault: () =>
        set({
          visibleCardIds: DEFAULT_VISIBLE_CARD_IDS,
          visibleWidgetIds: DEFAULT_VISIBLE_WIDGET_IDS,
        }),

      selectAllCardsAndWidgets: () =>
        set({
          visibleCardIds: DASHBOARD_CARDS.map((c) => c.id),
          visibleWidgetIds: DASHBOARD_WIDGETS.map((w) => w.id),
        }),

      isCardVisible: (id) => get().visibleCardIds.includes(id),
      isWidgetVisible: (id) => get().visibleWidgetIds.includes(id),
    }),
    {
      name: 'assetops_dashboard_preferences_v1',
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({
        visibleCardIds: state.visibleCardIds,
        visibleWidgetIds: state.visibleWidgetIds,
        timeRange: state.timeRange,
        selectedLocation: state.selectedLocation,
      }),
    },
  ),
);
