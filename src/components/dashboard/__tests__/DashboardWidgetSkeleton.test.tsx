import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DashboardWidgetSkeleton } from '../DashboardWidgetSkeleton';

describe('DashboardWidgetSkeleton Component', () => {
  it('should render default chart skeleton with accessible role and label', () => {
    render(
      <DashboardWidgetSkeleton title="Loading lifecycle telemetry..." minHeight="min-h-[360px]" />,
    );

    const skeleton = screen.getByRole('status');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute('aria-label', 'Loading lifecycle telemetry...');
    expect(skeleton).toHaveClass('min-h-[360px]');
    expect(skeleton).toHaveClass('rounded-2xl');
  });

  it('should render pie chart skeleton variant with dark theme styling and donut container', () => {
    render(<DashboardWidgetSkeleton variant="pie" minHeight="min-h-[380px]" />);

    const skeleton = screen.getByRole('status');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass('bg-[#101726]');
    expect(skeleton).toHaveClass('min-h-[380px]');
  });

  it('should render depreciation chart skeleton variant with KPI metric slots', () => {
    render(<DashboardWidgetSkeleton variant="depreciation" minHeight="min-h-[420px]" />);

    const skeleton = screen.getByRole('status');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass('min-h-[420px]');
    expect(skeleton).toHaveClass('rounded-2xl');
  });

  it('should apply custom className correctly', () => {
    render(<DashboardWidgetSkeleton className="custom-test-widget-skeleton" />);

    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveClass('custom-test-widget-skeleton');
  });
});
