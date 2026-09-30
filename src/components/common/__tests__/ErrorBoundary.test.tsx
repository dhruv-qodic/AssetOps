import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React, { useState } from 'react';
import { ErrorBoundary } from '../ErrorBoundary';

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

// State-driven wrapper to test error recovery / reset
const ErrorRecoveryWrapper: React.FC<{ onResetSpy?: () => void }> = ({ onResetSpy }) => {
  const [hasError, setHasError] = useState(true);

  return (
    <ErrorBoundary
      onReset={() => {
        setHasError(false);
        if (onResetSpy) onResetSpy();
      }}
    >
      {hasError ? <ProblemChild shouldThrow={true} /> : <div>Recovered Content</div>}
    </ErrorBoundary>
  );
};

describe('ErrorBoundary Component', () => {
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
      <ErrorBoundary>
        <div>Normal Content</div>
      </ErrorBoundary>,
    );

    expect(screen.getByText('Normal Content')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should catch error and render default fallback UI with message', () => {
    render(
      <ErrorBoundary>
        <ProblemChild message="Critical component breakdown" />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Critical component breakdown')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reload page/i })).toBeInTheDocument();
  });

  it('should support custom title, message, and fullScreen styling', () => {
    const { container } = render(
      <ErrorBoundary fullScreen title="Custom Failure Title" message="Custom detailed message">
        <ProblemChild />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Custom Failure Title')).toBeInTheDocument();
    expect(screen.getByText('Custom detailed message')).toBeInTheDocument();
    const alertWrapper = container.querySelector('div[role="alert"]');
    expect(alertWrapper).toHaveClass('fixed', 'inset-0', 'min-h-screen');
  });

  it('should render custom fallback element when provided as ReactNode', () => {
    render(
      <ErrorBoundary fallback={<div data-testid="custom-fallback">Custom Fallback Node</div>}>
        <ProblemChild />
      </ErrorBoundary>,
    );

    expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
    expect(screen.getByText('Custom Fallback Node')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('should render custom fallback when provided as render function and handle reset', () => {
    let resetFn: (() => void) | null = null;

    render(
      <ErrorBoundary
        fallback={(err, reset) => {
          resetFn = reset;
          return (
            <div>
              <span>Error received: {err.message}</span>
              <button onClick={reset}>Custom Reset</button>
            </div>
          );
        }}
      >
        <ProblemChild message="Custom error text" />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Error received: Custom error text')).toBeInTheDocument();
    expect(typeof resetFn).toBe('function');
  });

  it('should call onError callback when child throws an error', () => {
    const onErrorSpy = vi.fn();

    render(
      <ErrorBoundary onError={onErrorSpy}>
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
