import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useAuthStore } from '../useAuthStore';

describe('store/useAuthStore', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Reset store state before each test
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with default empty authentication state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle successful login with valid credentials', async () => {
    const loginPromise = useAuthStore.getState().login({
      email: 'admin@assetops.com',
      password: 'password123',
      rememberMe: false,
    });

    // Check loading state immediately
    expect(useAuthStore.getState().isLoading).toBe(true);

    // Fast-forward past network latency delay (500ms)
    await vi.advanceTimersByTimeAsync(500);

    const result = await loginPromise;

    expect(result).toBe(true);
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.user).toEqual({
      id: 'usr_admin_01',
      name: 'Dhruv Faldu',
      email: 'admin@assetops.com',
      role: 'ADMIN',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      department: 'IT Administration',
      phone: '+1 (555) 019-2834',
      status: 'ACTIVE',
      joinedDate: '2023-01-15',
    });
    // Password must be stripped from user object in state
    expect((state.user as unknown as { password?: string }).password).toBeUndefined();
  });

  it('should support case-insensitive email authentication', async () => {
    const loginPromise = useAuthStore.getState().login({
      email: '  ADMIN@ASSETOPS.COM  ',
      password: 'password123',
      rememberMe: true,
    });

    await vi.advanceTimersByTimeAsync(500);
    const result = await loginPromise;

    expect(result).toBe(true);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().user?.email).toBe('admin@assetops.com');
  });

  it('should set error state and return false when credentials are incorrect', async () => {
    const loginPromise = useAuthStore.getState().login({
      email: 'wrong@assetops.com',
      password: 'wrongpassword',
      rememberMe: false,
    });

    await vi.advanceTimersByTimeAsync(500);
    const result = await loginPromise;

    expect(result).toBe(false);
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Invalid email address or password. Please try again.');
  });

  it('should reset user state upon logout', () => {
    useAuthStore.setState({
      user: {
        id: 'usr_admin_01',
        name: 'Dhruv Faldu',
        email: 'admin@assetops.com',
        role: 'ADMIN',
      },
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });

    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should clear error message when clearError is called', () => {
    useAuthStore.setState({
      error: 'Some error message',
    });

    useAuthStore.getState().clearError();

    expect(useAuthStore.getState().error).toBeNull();
  });

  it('should successfully register a new user and persist in localStorage', async () => {
    window.localStorage.clear();

    const registerPromise = useAuthStore.getState().register({
      name: 'Alice Wonder',
      email: 'alice@example.com',
      password: 'password123',
      role: 'MANAGER',
    });

    expect(useAuthStore.getState().isLoading).toBe(true);

    await vi.advanceTimersByTimeAsync(500);
    const result = await registerPromise;

    expect(result.success).toBe(true);
    expect(useAuthStore.getState().isLoading).toBe(false);
    expect(useAuthStore.getState().error).toBeNull();

    // Verify localStorage has the newly registered user
    const stored = JSON.parse(window.localStorage.getItem('assetops_registered_users') || '[]');
    expect(stored.length).toBe(1);
    expect(stored[0].name).toBe('Alice Wonder');
    expect(stored[0].email).toBe('alice@example.com');
    expect(stored[0].role).toBe('MANAGER');
  });

  it('should allow the newly registered user to log in and preserve role permissions', async () => {
    // Register
    const registerPromise = useAuthStore.getState().register({
      name: 'Bob Builder',
      email: 'bob@example.com',
      password: 'mypassword123',
      role: 'ADMIN',
    });
    await vi.advanceTimersByTimeAsync(500);
    await registerPromise;

    // Login
    const loginPromise = useAuthStore.getState().login({
      email: 'bob@example.com',
      password: 'mypassword123',
      rememberMe: false,
    });
    await vi.advanceTimersByTimeAsync(500);
    const loginResult = await loginPromise;

    expect(loginResult).toBe(true);
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.name).toBe('Bob Builder');
    expect(state.user?.email).toBe('bob@example.com');
    expect(state.user?.role).toBe('ADMIN');
  });

  it('should reject registration when email is already registered', async () => {
    const registerPromise = useAuthStore.getState().register({
      name: 'Duplicate Admin',
      email: 'admin@assetops.com', // Already in seed users
      password: 'password123',
      role: 'ADMIN',
    });

    await vi.advanceTimersByTimeAsync(500);
    const result = await registerPromise;

    expect(result.success).toBe(false);
    expect(result.error).toBe('An account with this email address already exists.');
    expect(useAuthStore.getState().error).toBe('An account with this email address already exists.');
  });
});
