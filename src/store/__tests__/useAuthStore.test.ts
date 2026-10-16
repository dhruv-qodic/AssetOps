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
      registeredUsers: [],
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

  describe('User Registration & Role-Based Login', () => {
    it('should successfully register a new user with chosen role', async () => {
      const regPromise = useAuthStore.getState().register({
        name: 'Alice Developer',
        email: 'alice@assetops.com',
        password: 'securepassword123',
        confirmPassword: 'securepassword123',
        role: 'MANAGER',
      });

      await vi.advanceTimersByTimeAsync(400);
      const result = await regPromise;

      expect(result.success).toBe(true);
      const state = useAuthStore.getState();
      expect(state.registeredUsers).toHaveLength(1);
      expect(state.registeredUsers[0].email).toBe('alice@assetops.com');
      expect(state.registeredUsers[0].name).toBe('Alice Developer');
      expect(state.registeredUsers[0].role).toBe('MANAGER');
      expect(state.registeredUsers[0].passwordHash).toBeDefined();
      expect(
        (state.registeredUsers[0] as unknown as { password?: string }).password,
      ).toBeUndefined();
    });

    it('should reject registration when email is already in use by seed accounts', async () => {
      const regPromise = useAuthStore.getState().register({
        name: 'Imposter Admin',
        email: 'admin@assetops.com',
        password: 'password123',
        confirmPassword: 'password123',
        role: 'ADMIN',
      });

      await vi.advanceTimersByTimeAsync(400);
      const result = await regPromise;

      expect(result.success).toBe(false);
      expect(result.error).toBe('An account with this email already exists.');
    });

    it('should allow newly registered user to log in and preserve role permissions', async () => {
      // 1. Register user
      const regPromise = useAuthStore.getState().register({
        name: 'Bob Inspector',
        email: 'bob@assetops.com',
        password: 'mypassword123',
        confirmPassword: 'mypassword123',
        role: 'VIEWER',
      });
      await vi.advanceTimersByTimeAsync(400);
      await regPromise;

      // 2. Log in with registered credentials
      const loginPromise = useAuthStore.getState().login({
        email: 'bob@assetops.com',
        password: 'mypassword123',
        rememberMe: false,
      });
      await vi.advanceTimersByTimeAsync(500);
      const loginResult = await loginPromise;

      expect(loginResult).toBe(true);
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user?.name).toBe('Bob Inspector');
      expect(state.user?.role).toBe('VIEWER');
      expect(state.user?.email).toBe('bob@assetops.com');
      expect((state.user as unknown as { passwordHash?: string }).passwordHash).toBeUndefined();
    });

    it('should fail login for registered user when password is wrong', async () => {
      // 1. Register user
      const regPromise = useAuthStore.getState().register({
        name: 'Charlie Admin',
        email: 'charlie@assetops.com',
        password: 'correctpassword',
        confirmPassword: 'correctpassword',
        role: 'ADMIN',
      });
      await vi.advanceTimersByTimeAsync(400);
      await regPromise;

      // 2. Attempt login with wrong password
      const loginPromise = useAuthStore.getState().login({
        email: 'charlie@assetops.com',
        password: 'wrongpassword',
        rememberMe: false,
      });
      await vi.advanceTimersByTimeAsync(500);
      const loginResult = await loginPromise;

      expect(loginResult).toBe(false);
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(useAuthStore.getState().error).toBe(
        'Invalid email address or password. Please try again.',
      );
    });
  });
});
