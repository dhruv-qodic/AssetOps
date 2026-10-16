import { AUTH_BRANDING, AUTH_FEATURES, AUTH_LIVE_STATUS } from '@/constant/auth.constants';

export const REGISTER_PAGE_CONSTANTS = {
  BRANDING: AUTH_BRANDING,
  FEATURES: AUTH_FEATURES,
  LIVE_STATUS: AUTH_LIVE_STATUS,
  FORM: {
    TITLE: 'Create Account',
    SUBTITLE: 'Join AssetOps and start managing assets',
    NAME_LABEL: 'Full Name',
    NAME_PLACEHOLDER: 'Enter your full name',
    EMAIL_LABEL: 'Email Address',
    EMAIL_PLACEHOLDER: 'Enter your email address',
    PASSWORD_LABEL: 'Password',
    PASSWORD_PLACEHOLDER: 'Choose a strong password',
    CONFIRM_PASSWORD_LABEL: 'Confirm Password',
    CONFIRM_PASSWORD_PLACEHOLDER: 'Re-enter your password',
    ROLE_LABEL: 'Role',
    ROLE_PLACEHOLDER: 'Select your role',
    SUBMIT_BUTTON: 'Create Account',
    SUBMITTING_BUTTON: 'Creating Account...',
    HIDE_PASSWORD_ARIA: 'Hide password',
    SHOW_PASSWORD_ARIA: 'Show password',
    HIDE_CONFIRM_ARIA: 'Hide confirm password',
    SHOW_CONFIRM_ARIA: 'Show confirm password',
  },
  NAVIGATION: {
    LOGIN_PROMPT: 'Already have an account?',
    LOGIN_LINK: 'Sign in',
    LOGIN_PATH: '/login',
  },
  ROLES: {
    ADMIN: 'Admin',
    MANAGER: 'Manager',
    VIEWER: 'Viewer',
  },
  TOAST: {
    SUCCESS: (name: string) => `Welcome, ${name}! Your account has been created.`,
    DUPLICATE_EMAIL: 'An account with this email already exists.',
    GENERIC_ERROR: 'Registration failed. Please try again.',
  },
} as const;
