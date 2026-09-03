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
});
