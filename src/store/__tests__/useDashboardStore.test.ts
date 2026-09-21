import { describe, it, expect, beforeEach } from 'vitest';
import { useDashboardStore } from '../useDashboardStore';
import { DASHBOARD_CARDS, DASHBOARD_WIDGETS } from '@/constans/dashboard.constants';

describe('useDashboardStore', () => {
  beforeEach(() => {
    useDashboardStore.getState().resetLayoutToDefault();
    useDashboardStore.setState({
      timeRange: 'Last 30 Days',
      selectedLocation: 'All',
      isCustomizationOpen: false,
    });
  });

  it('should initialize with default visible cards and widgets', () => {
    const state = useDashboardStore.getState();
    expect(state.visibleCardIds.length).toBe(DASHBOARD_CARDS.length);
    expect(state.visibleWidgetIds.length).toBe(DASHBOARD_WIDGETS.length);
    expect(state.timeRange).toBe('Last 30 Days');
    expect(state.selectedLocation).toBe('All');
    expect(state.isCustomizationOpen).toBe(false);
  });

  it('should toggle card visibility correctly', () => {
    const { toggleCard } = useDashboardStore.getState();

    // Toggle off
    toggleCard('total_assets');
    expect(useDashboardStore.getState().visibleCardIds).not.toContain('total_assets');

    // Toggle back on
    toggleCard('total_assets');
    expect(useDashboardStore.getState().visibleCardIds).toContain('total_assets');
  });

  it('should toggle widget visibility correctly', () => {
    const { toggleWidget } = useDashboardStore.getState();

    // Toggle off
    toggleWidget('growth_line_chart');
    expect(useDashboardStore.getState().visibleWidgetIds).not.toContain('growth_line_chart');

    // Toggle back on
    toggleWidget('growth_line_chart');
    expect(useDashboardStore.getState().visibleWidgetIds).toContain('growth_line_chart');
  });

  it('should update time range and location filter', () => {
    const { setTimeRange, setSelectedLocation } = useDashboardStore.getState();

    setTimeRange('Last 90 Days');
    expect(useDashboardStore.getState().timeRange).toBe('Last 90 Days');

    setSelectedLocation('New York Office');
    expect(useDashboardStore.getState().selectedLocation).toBe('New York Office');
  });

  it('should open and close customization modal', () => {
    const { openCustomization, closeCustomization } = useDashboardStore.getState();

    openCustomization();
    expect(useDashboardStore.getState().isCustomizationOpen).toBe(true);

    closeCustomization();
    expect(useDashboardStore.getState().isCustomizationOpen).toBe(false);
  });

  it('should reset layout to default', () => {
    const { toggleCard, toggleWidget, resetLayoutToDefault } = useDashboardStore.getState();

    toggleCard('total_assets');
    toggleWidget('recent_activity');
    expect(useDashboardStore.getState().visibleCardIds).not.toContain('total_assets');

    resetLayoutToDefault();
    expect(useDashboardStore.getState().visibleCardIds).toContain('total_assets');
    expect(useDashboardStore.getState().visibleWidgetIds).toContain('recent_activity');
  });
});
