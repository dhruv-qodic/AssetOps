import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React, { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '@/components/common/ErrorFallback';

// Helper component that throws an error conditionally
const ProblemChild: React.FC<{ shouldThrow?: boolean; message?: string }> = ({
  shouldThrow = true,
  message = 'Test render error',
}) => {
  if (shouldThrow) {
    throw new Error(message);
  }
  return <div>Healthy Child Content</div>;
};

// State-driven wrapper to test error recovery / reset via resetErrorBoundary
const ErrorRecoveryWrapper: React.FC<{ onResetSpy?: () => void }> = ({ onResetSpy }) => {
  const [hasError, setHasError] = useState(true);

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        setHasError(false);
        if (onResetSpy) onResetSpy();
      }}
    >
      {hasError ? <ProblemChild shouldThrow={true} /> : <div>Recovered Content</div>}
    </ErrorBoundary>
  );
};

describe('react-error-boundary with ErrorFallback Component', () => {
  // Suppress console.error in tests for expected thrown errors
  const originalError = console.error;
  beforeEach(() => {
    console.error = vi.fn();
  });
  afterEach(() => {
    console.error = originalError;
  });

  it('should render children normally when no error occurs', () => {
    render(
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <div>Normal Content</div>
      </ErrorBoundary>,
    );

    expect(screen.getByText('Normal Content')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should catch error and render default fallback UI with message and retry button', () => {
    render(
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ProblemChild message="Critical component breakdown" />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Critical component breakdown')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reload page/i })).toBeInTheDocument();
  });

  it('should support custom title, message, and fullScreen styling via fallbackRender', () => {
    const { container } = render(
      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <ErrorFallback
            error={error}
            resetErrorBoundary={resetErrorBoundary}
            fullScreen
            title="Custom Failure Title"
            message="Custom detailed message"
          />
        )}
      >
        <ProblemChild />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Custom Failure Title')).toBeInTheDocument();
    expect(screen.getByText('Custom detailed message')).toBeInTheDocument();
    const alertWrapper = container.querySelector('div[role="alert"]');
    expect(alertWrapper).toHaveClass('fixed', 'inset-0', 'min-h-screen');
  });

  it('should support disabling the reload button when requested', () => {
    render(
      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <ErrorFallback
            error={error}
            resetErrorBoundary={resetErrorBoundary}
            showReloadButton={false}
          />
        )}
      >
        <ProblemChild />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /reload page/i })).not.toBeInTheDocument();
  });

  it('should call onError callback when child throws an error', () => {
    const onErrorSpy = vi.fn();

    render(
      <ErrorBoundary FallbackComponent={ErrorFallback} onError={onErrorSpy}>
        <ProblemChild message="Tracked error" />
      </ErrorBoundary>,
    );

    expect(onErrorSpy).toHaveBeenCalledTimes(1);
    expect(onErrorSpy).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Tracked error' }),
      expect.anything(),
    );
  });

  it('should reset error state and call onReset when Try Again button is clicked', () => {
    const onResetSpy = vi.fn();

    render(<ErrorRecoveryWrapper onResetSpy={onResetSpy} />);

    expect(screen.getByRole('alert')).toBeInTheDocument();

    const tryAgainButton = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(tryAgainButton);

    expect(onResetSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Recovered Content')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
