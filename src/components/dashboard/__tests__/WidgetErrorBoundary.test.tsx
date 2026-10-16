import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from 'react-error-boundary';
import { WidgetErrorFallback, ErrorFallback } from '@/components/common/ErrorFallback';
import { DEFAULT_WIDGET_ERROR_TITLE } from '@/constant/error.constants';
import { DASHBOARD_WIDGET_TITLES } from '@/constant/dashboard.constants';

// Helper component that throws on demand
const ProblematicWidget: React.FC<{ shouldThrow?: boolean; message?: string }> = ({
  shouldThrow = false,
  message = 'Widget calculation failed',
}) => {
  if (shouldThrow) {
    throw new Error(message);
  }
  return <div data-testid="widget-content">Normal Widget Content</div>;
};

// Helper test wrapper simulating standard widget error boundary usage
const WidgetBoundaryTestWrapper: React.FC<{
  widgetTitle?: string;
  minHeight?: string;
  variant?: 'default' | 'pie' | 'depreciation';
  onRetry?: () => void;
  onError?: (error: unknown, info: React.ErrorInfo) => void;
  children: React.ReactNode;
}> = ({
  widgetTitle = DEFAULT_WIDGET_ERROR_TITLE,
  minHeight = 'min-h-[360px]',
  variant = 'default',
  onRetry,
  onError,
  children,
}) => (
  <ErrorBoundary
    onError={onError}
    onReset={onRetry}
    fallbackRender={({ error, resetErrorBoundary }) => (
      <WidgetErrorFallback
        error={error}
        resetErrorBoundary={resetErrorBoundary}
        widgetTitle={widgetTitle}
        minHeight={minHeight}
        variant={variant}
      />
    )}
  >
    {children}
  </ErrorBoundary>
);

describe('react-error-boundary Widget Error Isolation & WidgetErrorFallback', () => {
  // Suppress console.error in tests for expected ErrorBoundary catches
  const originalError = console.error;
  beforeEach(() => {
    console.error = vi.fn();
    return () => {
      console.error = originalError;
    };
  });

  it('should render widget children normally when no error occurs', () => {
    render(
      <WidgetBoundaryTestWrapper widgetTitle="Lifecycle Chart">
        <ProblematicWidget shouldThrow={false} />
      </WidgetBoundaryTestWrapper>,
    );

    expect(screen.getByTestId('widget-content')).toBeInTheDocument();
    expect(screen.getByText('Normal Widget Content')).toBeInTheDocument();
    expect(screen.queryByTestId('widget-error-boundary')).not.toBeInTheDocument();
  });

  it('should catch error and render isolated widget error UI with title, message, and icon', () => {
    render(
      <WidgetBoundaryTestWrapper
        widgetTitle="Fleet Growth Trends"
        minHeight="min-h-[360px]"
        variant="default"
      >
        <ProblematicWidget shouldThrow={true} message="Out of memory in chart renderer" />
      </WidgetBoundaryTestWrapper>,
    );

    expect(screen.queryByTestId('widget-content')).not.toBeInTheDocument();

    const errorBoundary = screen.getByTestId('widget-error-boundary');
    expect(errorBoundary).toBeInTheDocument();
    expect(errorBoundary).toHaveClass('min-h-[360px]');
    expect(screen.getByText('Failed to load Fleet Growth Trends')).toBeInTheDocument();
    expect(screen.getByText('Out of memory in chart renderer')).toBeInTheDocument();

    const reloadButton = screen.getByTestId('widget-reload-button');
    expect(reloadButton).toBeInTheDocument();
    expect(reloadButton).toHaveTextContent('Reload Widget');
  });

  it('should apply pie variant styling for dark pie chart error UI', () => {
    render(
      <WidgetBoundaryTestWrapper
        widgetTitle={DASHBOARD_WIDGET_TITLES.DISTRIBUTION_PIE}
        variant="pie"
        minHeight="min-h-[380px]"
      >
        <ProblematicWidget shouldThrow={true} />
      </WidgetBoundaryTestWrapper>,
    );

    const errorBoundary = screen.getByTestId('widget-error-boundary');
    expect(errorBoundary).toBeInTheDocument();
    expect(errorBoundary).toHaveClass('bg-[#101726]');
    expect(errorBoundary).toHaveClass('min-h-[380px]');
  });

  it('should isolate error to only the failing widget while sibling widgets remain functional', () => {
    render(
      <div data-testid="dashboard-container" className="grid grid-cols-2 gap-4">
        {/* Widget A: Fails */}
        <WidgetBoundaryTestWrapper widgetTitle="Widget A (Failing)">
          <ProblematicWidget shouldThrow={true} message="API timeout" />
        </WidgetBoundaryTestWrapper>

        {/* Widget B: Succeeds */}
        <WidgetBoundaryTestWrapper widgetTitle="Widget B (Healthy)">
          <div data-testid="widget-b">Widget B is Healthy and Functional</div>
        </WidgetBoundaryTestWrapper>
      </div>,
    );

    // Widget A displays error UI
    expect(screen.getByText('Failed to load Widget A (Failing)')).toBeInTheDocument();
    expect(screen.getByText('API timeout')).toBeInTheDocument();

    // Widget B remains fully visible and mounted
    expect(screen.getByTestId('widget-b')).toBeInTheDocument();
    expect(screen.getByText('Widget B is Healthy and Functional')).toBeInTheDocument();
  });

  it('should retry loading and restore widget when Reload Widget button is clicked and error resolves', () => {
    let fail = true;
    const DynamicWidget = () => {
      if (fail) {
        throw new Error('Connection refused');
      }
      return <div data-testid="dynamic-content">Loaded Successfully</div>;
    };

    const onRetrySpy = vi.fn();

    render(
      <WidgetBoundaryTestWrapper widgetTitle="Dynamic Widget" onRetry={onRetrySpy}>
        <DynamicWidget />
      </WidgetBoundaryTestWrapper>,
    );

    expect(screen.getByText('Failed to load Dynamic Widget')).toBeInTheDocument();
    expect(screen.queryByTestId('dynamic-content')).not.toBeInTheDocument();

    // Fix the error state for next render
    fail = false;

    // Click Reload Widget
    const reloadBtn = screen.getByTestId('widget-reload-button');
    fireEvent.click(reloadBtn);

    expect(onRetrySpy).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('dynamic-content')).toBeInTheDocument();
    expect(screen.queryByTestId('widget-error-boundary')).not.toBeInTheDocument();
  });

  it('should show error state again if retry fails', () => {
    const onRetrySpy = vi.fn();

    render(
      <WidgetBoundaryTestWrapper widgetTitle="Persistent Failure" onRetry={onRetrySpy}>
        <ProblematicWidget shouldThrow={true} message="Persistent error" />
      </WidgetBoundaryTestWrapper>,
    );

    expect(screen.getByText('Failed to load Persistent Failure')).toBeInTheDocument();

    // Click Reload Widget
    const reloadBtn = screen.getByTestId('widget-reload-button');
    fireEvent.click(reloadBtn);

    expect(onRetrySpy).toHaveBeenCalledTimes(1);
    // Error UI is still present
    expect(screen.getByText('Failed to load Persistent Failure')).toBeInTheDocument();
    expect(screen.getByText('Persistent error')).toBeInTheDocument();
  });

  it('should call onError prop when an error is caught', () => {
    const onErrorSpy = vi.fn();
    const testError = new Error('Test Error Callback');

    const Thrower = () => {
      throw testError;
    };

    render(
      <WidgetBoundaryTestWrapper widgetTitle="Test Widget" onError={onErrorSpy}>
        <Thrower />
      </WidgetBoundaryTestWrapper>,
    );

    expect(onErrorSpy).toHaveBeenCalledTimes(1);
    const [caughtError, caughtInfo] = onErrorSpy.mock.calls[0] as [
      Error,
      { componentStack: string },
    ];
    expect(caughtError).toBe(testError);
    expect(caughtInfo.componentStack).toContain('Thrower');
  });

  it('should not interfere with the application global ErrorBoundary', () => {
    const GlobalThrower = () => {
      throw new Error('Critical Application Crash');
    };

    render(
      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <ErrorFallback
            error={error}
            resetErrorBoundary={resetErrorBoundary}
            title="Global Crash Handler"
          />
        )}
      >
        <div data-testid="app-root">
          <WidgetBoundaryTestWrapper widgetTitle="Widget 1">
            <div data-testid="widget-1">Widget 1 Content</div>
          </WidgetBoundaryTestWrapper>
          <GlobalThrower />
        </div>
      </ErrorBoundary>,
    );

    // Global ErrorBoundary catches errors that occur outside the widget boundary
    expect(screen.getByText('Global Crash Handler')).toBeInTheDocument();
    expect(screen.getByText('Critical Application Crash')).toBeInTheDocument();
    expect(screen.queryByTestId('app-root')).not.toBeInTheDocument();
  });
});
