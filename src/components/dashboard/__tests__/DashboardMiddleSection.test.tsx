import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DashboardMiddleSection } from '../DashboardMiddleSection';
import { useDashboardStore } from '@/store/useDashboardStore';
import { useAssetStore } from '@/store/useAssetStore';
import { useActivityStore } from '@/store/useActivityStore';
import { MOCK_ASSETS } from '@/mocks/seed/assets';

describe('DashboardMiddleSection Component', () => {
  beforeEach(() => {
    useAssetStore.setState({
      assets: [...MOCK_ASSETS],
      isLoading: false,
      error: null,
    });

    useActivityStore.setState({
      activities: [],
    });

    useDashboardStore.setState({
      visibleWidgetIds: ['distribution_pie_chart', 'recent_activity'],
      selectedLocation: 'All',
    });
  });

  it('should render both Pie Chart and Recent Activity feed when both are visible', async () => {
    render(
      <MemoryRouter>
        <DashboardMiddleSection />
      </MemoryRouter>,
    );

    // Recent activity is eagerly loaded
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();

    // Pie chart is lazy loaded
    expect(
      await screen.findByText('Asset Status Distribution', {}, { timeout: 4000 }),
    ).toBeInTheDocument();
  });

  it('should render only Recent Activity when Pie Chart is not in visibleWidgetIds', () => {
    useDashboardStore.setState({
      visibleWidgetIds: ['recent_activity'],
    });

    render(
      <MemoryRouter>
        <DashboardMiddleSection />
      </MemoryRouter>,
    );

    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    expect(screen.queryByText('Asset Status Distribution')).not.toBeInTheDocument();
  });

  it('should render only Pie Chart when Recent Activity is hidden', async () => {
    useDashboardStore.setState({
      visibleWidgetIds: ['distribution_pie_chart'],
    });

    render(
      <MemoryRouter>
        <DashboardMiddleSection />
      </MemoryRouter>,
    );

    expect(
      await screen.findByText('Asset Status Distribution', {}, { timeout: 4000 }),
    ).toBeInTheDocument();
    expect(screen.queryByText('Recent Activity')).not.toBeInTheDocument();
  });

  it('should render null when neither widget is visible', () => {
    useDashboardStore.setState({
      visibleWidgetIds: [],
    });

    const { container } = render(
      <MemoryRouter>
        <DashboardMiddleSection />
      </MemoryRouter>,
    );

    expect(container.firstChild).toBeNull();
  });
});
