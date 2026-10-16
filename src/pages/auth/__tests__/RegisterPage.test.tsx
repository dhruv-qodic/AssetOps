import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import RegisterPage from '@/pages/auth/RegisterPage';
import { useAuthStore } from '@/store/useAuthStore';

describe('RegisterPage Component & Live Password Validation Popover', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      registeredUsers: [],
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render all form controls, inputs, and links', () => {
    render(
      <MemoryRouter initialEntries={['/register']}>
        <RegisterPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your full name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your email address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/choose a strong password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/re-enter your password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute('href', '/login');
  });

  it('should toggle password and confirm-password visibility', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <MemoryRouter initialEntries={['/register']}>
        <RegisterPage />
      </MemoryRouter>,
    );

    const passwordInput = screen.getByPlaceholderText(/choose a strong password/i);
    const confirmInput = screen.getByPlaceholderText(/re-enter your password/i);

    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmInput).toHaveAttribute('type', 'password');

    const showPasswordBtn = screen.getByRole('button', { name: /^show password$/i });
    const showConfirmBtn = screen.getByRole('button', { name: /^show confirm password$/i });

    await user.click(showPasswordBtn);
    expect(passwordInput).toHaveAttribute('type', 'text');

    await user.click(showConfirmBtn);
    expect(confirmInput).toHaveAttribute('type', 'text');
  });

  it('should open validation popover on password input focus', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <MemoryRouter initialEntries={['/register']}>
        <RegisterPage />
      </MemoryRouter>,
    );

    const passwordInput = screen.getByPlaceholderText(/choose a strong password/i);
    expect(
      screen.queryByRole('region', { name: /password validation requirements/i }),
    ).not.toBeInTheDocument();

    await user.click(passwordInput);

    await waitFor(() => {
      expect(
        screen.getByRole('region', { name: /password validation requirements/i }),
      ).toBeInTheDocument();
    });
    expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/one uppercase letter/i)).toBeInTheDocument();
    expect(screen.getByText(/one lowercase letter/i)).toBeInTheDocument();
    expect(screen.getByText(/one number/i)).toBeInTheDocument();
    expect(screen.getByText(/one special character/i)).toBeInTheDocument();
    expect(screen.getByTestId('password-requirements-count')).toHaveTextContent('0 of 5 met');
  });

  it('should update each validation indicator live while typing', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <MemoryRouter initialEntries={['/register']}>
        <RegisterPage />
      </MemoryRouter>,
    );

    const passwordInput = screen.getByPlaceholderText(/choose a strong password/i);
    await user.click(passwordInput);

    await waitFor(() => {
      expect(screen.getByTestId('req-length')).toBeInTheDocument();
    });

    // Initial state: all unmet
    expect(screen.getByTestId('req-length')).toHaveAttribute('data-met', 'false');
    expect(screen.getByTestId('req-uppercase')).toHaveAttribute('data-met', 'false');
    expect(screen.getByTestId('req-lowercase')).toHaveAttribute('data-met', 'false');
    expect(screen.getByTestId('req-number')).toHaveAttribute('data-met', 'false');
    expect(screen.getByTestId('req-special')).toHaveAttribute('data-met', 'false');

    // Type lowercase letter
    await user.type(passwordInput, 'p');
    expect(screen.getByTestId('req-lowercase')).toHaveAttribute('data-met', 'true');
    expect(screen.getByTestId('icon-check-lowercase')).toBeInTheDocument();

    // Type uppercase letter
    await user.type(passwordInput, 'A');
    expect(screen.getByTestId('req-uppercase')).toHaveAttribute('data-met', 'true');
    expect(screen.getByTestId('icon-check-uppercase')).toBeInTheDocument();

    // Type digit
    await user.type(passwordInput, '1');
    expect(screen.getByTestId('req-number')).toHaveAttribute('data-met', 'true');
    expect(screen.getByTestId('icon-check-number')).toBeInTheDocument();

    // Type special character
    await user.type(passwordInput, '!');
    expect(screen.getByTestId('req-special')).toHaveAttribute('data-met', 'true');
    expect(screen.getByTestId('icon-check-special')).toBeInTheDocument();

    // Still less than 8 chars ('pA1!' is 4 chars)
    expect(screen.getByTestId('req-length')).toHaveAttribute('data-met', 'false');
    expect(screen.getByTestId('password-requirements-count')).toHaveTextContent('4 of 5 met');

    // Type 4 more characters to reach 8
    await user.type(passwordInput, 'word');
    expect(screen.getByTestId('req-length')).toHaveAttribute('data-met', 'true');
    expect(screen.getByTestId('icon-check-length')).toBeInTheDocument();
    expect(screen.getByTestId('password-requirements-count')).toHaveTextContent('5 of 5 met');
  });

  it('should revert indicators when a requirement becomes invalid', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <MemoryRouter initialEntries={['/register']}>
        <RegisterPage />
      </MemoryRouter>,
    );

    const passwordInput = screen.getByPlaceholderText(/choose a strong password/i);
    await user.click(passwordInput);

    await user.type(passwordInput, 'Password123!');
    await waitFor(() => {
      expect(screen.getByTestId('password-requirements-count')).toHaveTextContent('5 of 5 met');
    });
    expect(screen.getByTestId('req-special')).toHaveAttribute('data-met', 'true');

    // Backspace special character '!'
    await user.type(passwordInput, '{backspace}');
    expect(screen.getByTestId('req-special')).toHaveAttribute('data-met', 'false');
    expect(screen.getByTestId('icon-pending-special')).toBeInTheDocument();
    expect(screen.getByTestId('password-requirements-count')).toHaveTextContent('4 of 5 met');

    // Delete multiple characters so length < 8
    await user.type(passwordInput, '{backspace}{backspace}{backspace}{backspace}');
    expect(screen.getByTestId('req-length')).toHaveAttribute('data-met', 'false');
    expect(screen.getByTestId('icon-pending-length')).toBeInTheDocument();
  });

  it('should display validation errors when submitting an empty form', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <MemoryRouter initialEntries={['/register']}>
        <RegisterPage />
      </MemoryRouter>,
    );

    const submitBtn = screen.getByRole('button', { name: /create account/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email address is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      expect(screen.getByText(/please confirm your password/i)).toBeInTheDocument();
      expect(screen.getByText(/please select a valid role/i)).toBeInTheDocument();
    });
  });

  it('should block registration when any password requirement fails', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <MemoryRouter initialEntries={['/register']}>
        <RegisterPage />
      </MemoryRouter>,
    );

    await user.type(screen.getByPlaceholderText(/enter your full name/i), 'Alice Walker');
    await user.type(screen.getByPlaceholderText(/enter your email address/i), 'alice@assetops.com');

    // Select role
    const dropdownTrigger = screen.getByRole('button', { name: /select your role/i });
    await user.click(dropdownTrigger);
    const viewerOption = screen.getByRole('option', { name: /viewer/i });
    await user.click(viewerOption);

    // Enter password missing special character
    await user.type(screen.getByPlaceholderText(/choose a strong password/i), 'Password123');
    await user.type(screen.getByPlaceholderText(/re-enter your password/i), 'Password123');

    const submitBtn = screen.getByRole('button', { name: /create account/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/password must contain at least one special character/i),
      ).toBeInTheDocument();
    });

    const storeState = useAuthStore.getState();
    expect(storeState.registeredUsers.some((u) => u.email === 'alice@assetops.com')).toBe(false);
  });

  it('should display password mismatch error when passwords do not match', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <MemoryRouter initialEntries={['/register']}>
        <RegisterPage />
      </MemoryRouter>,
    );

    await user.type(screen.getByPlaceholderText(/enter your full name/i), 'Test User');
    await user.type(screen.getByPlaceholderText(/enter your email address/i), 'test@example.com');
    await user.type(screen.getByPlaceholderText(/choose a strong password/i), 'Password123!');
    await user.type(
      screen.getByPlaceholderText(/re-enter your password/i),
      'DifferentPassword123!',
    );

    // Select role so all other field-level validations pass
    const dropdownTrigger = screen.getByRole('button', { name: /select your role/i });
    await user.click(dropdownTrigger);
    const viewerOption = screen.getByRole('option', { name: /viewer/i });
    await user.click(viewerOption);

    const submitBtn = screen.getByRole('button', { name: /create account/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('should allow user to select a role from dropdown', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <MemoryRouter initialEntries={['/register']}>
        <RegisterPage />
      </MemoryRouter>,
    );

    const dropdownTrigger = screen.getByRole('button', { name: /select your role/i });
    await user.click(dropdownTrigger);

    const managerOption = screen.getByRole('option', { name: /manager/i });
    expect(managerOption).toBeInTheDocument();
    await user.click(managerOption);

    expect(screen.getByText(/manage assets & staff/i)).toBeInTheDocument();
  });

  it('should handle keyboard escape and focus interactions for popover', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <MemoryRouter initialEntries={['/register']}>
        <RegisterPage />
      </MemoryRouter>,
    );

    const passwordInput = screen.getByPlaceholderText(/choose a strong password/i);
    const confirmInput = screen.getByPlaceholderText(/re-enter your password/i);

    // Focus via click/tab
    await user.click(passwordInput);
    await waitFor(() => {
      expect(
        screen.getByRole('region', { name: /password validation requirements/i }),
      ).toBeInTheDocument();
    });

    // Escape key closes popover
    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(
        screen.queryByRole('region', { name: /password validation requirements/i }),
      ).not.toBeInTheDocument();
    });

    // Re-focus opens popover again
    await user.click(passwordInput);
    await waitFor(() => {
      expect(
        screen.getByRole('region', { name: /password validation requirements/i }),
      ).toBeInTheDocument();
    });

    // Tab / click confirm input blurs password container and closes popover
    await user.click(confirmInput);
    await waitFor(() => {
      expect(
        screen.queryByRole('region', { name: /password validation requirements/i }),
      ).not.toBeInTheDocument();
    });
  });

  it('should register successfully and navigate to /login when all requirements pass', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(
      <MemoryRouter initialEntries={['/register']}>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<div>Login Page Target</div>} />
        </Routes>
      </MemoryRouter>,
    );

    await user.type(screen.getByPlaceholderText(/enter your full name/i), 'Jane Doe');
    await user.type(screen.getByPlaceholderText(/enter your email address/i), 'jane@assetops.com');
    await user.type(screen.getByPlaceholderText(/choose a strong password/i), 'Secure123!');
    await user.type(screen.getByPlaceholderText(/re-enter your password/i), 'Secure123!');

    // Select role
    const dropdownTrigger = screen.getByRole('button', { name: /select your role/i });
    await user.click(dropdownTrigger);
    const adminOption = screen.getByRole('option', { name: /admin/i });
    await user.click(adminOption);

    const submitBtn = screen.getByRole('button', { name: /create account/i });

    await act(async () => {
      await user.click(submitBtn);
      await vi.advanceTimersByTimeAsync(400);
    });

    await waitFor(() => {
      expect(screen.getByText('Login Page Target')).toBeInTheDocument();
    });

    const storeState = useAuthStore.getState();
    expect(storeState.registeredUsers.some((u) => u.email === 'jane@assetops.com')).toBe(true);
  });
});
