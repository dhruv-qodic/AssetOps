import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React, { Suspense, lazy } from 'react';
import { SuspenseLoader } from '../SuspenseLoader';

describe('SuspenseLoader Component', () => {
  it('should render default loading message and spinner', () => {
    render(<SuspenseLoader />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render custom message when provided', () => {
    render(<SuspenseLoader message="Initializing financial telemetry..." size="lg" />);

    expect(screen.getByText('Initializing financial telemetry...')).toBeInTheDocument();
  });

  it('should apply fullScreen fixed styling when fullScreen is true', () => {
    const { container } = render(<SuspenseLoader fullScreen />);

    const loaderWrapper = container.querySelector('div[role="status"]');
    expect(loaderWrapper).toHaveClass('fixed', 'inset-0', 'min-h-screen');
  });

  it('should apply custom className and support small size', () => {
    const { container } = render(
      <SuspenseLoader message="Fetching..." size="sm" className="custom-loader-class" />,
    );

    const loaderWrapper = container.querySelector('div[role="status"]');
    expect(loaderWrapper).toHaveClass('custom-loader-class');
    expect(screen.getByText('Fetching...')).toBeInTheDocument();
  });

  it('should work seamlessly as a Suspense fallback for lazy components', async () => {
    // Simulated lazy component
    const LazyComponent = lazy(
      () =>
        new Promise<{ default: React.FC }>((resolve) => {
          setTimeout(() => {
            resolve({
              default: () => <div>Lazy Loaded Content</div>,
            });
          }, 50);
        }),
    );

    render(
      <Suspense fallback={<SuspenseLoader message="Loading lazy component..." />}>
        <LazyComponent />
      </Suspense>,
    );

    // Initial loading state
    expect(screen.getByText('Loading lazy component...')).toBeInTheDocument();

    // After resolution
    const resolvedContent = await screen.findByText('Lazy Loaded Content');
    expect(resolvedContent).toBeInTheDocument();
  });
});
