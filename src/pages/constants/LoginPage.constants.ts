import { AUTH_BRANDING, AUTH_FEATURES, AUTH_LIVE_STATUS } from '@/constant/auth.constants';

export const LOGIN_PAGE_CONSTANTS = {
  FEATURES: AUTH_FEATURES,
  TOAST: {
    INVALID_CREDENTIALS: 'Invalid email or password. Please try again.',
    LOGIN_SUCCESS: 'Signed in successfully!',
  },
  BRANDING: AUTH_BRANDING,
  LIVE_STATUS: AUTH_LIVE_STATUS,
  FORM: {
    TITLE: 'Welcome Back',
    SUBTITLE: 'Sign in to access your AssetOps workspace',
    EMAIL_LABEL: 'Email Address',
    EMAIL_PLACEHOLDER: 'Enter your email address',
    PASSWORD_LABEL: 'Password',
    PASSWORD_PLACEHOLDER: 'Enter your password',
    HIDE_PASSWORD_ARIA: 'Hide password',
    SHOW_PASSWORD_ARIA: 'Show password',
    REMEMBER_ME: 'Remember me',
    FORGOT_PASSWORD: 'Forgot password?',
    SUBMIT_BUTTON: 'Sign In',
    SUBMITTING_BUTTON: 'Authenticating...',
  },
  DEMO_ACCOUNTS: {
    TITLE: 'Demo Accounts:',
    SUBTITLE: 'Click to 1-click login',
    TOOLTIP: (role: string) => `Click to login as ${role}`,
  },
  NAVIGATION: {
    REGISTER_PROMPT: "Don't have an account?",
    REGISTER_LINK: 'Create one',
    REGISTER_PATH: '/register',
  },
} as const;
