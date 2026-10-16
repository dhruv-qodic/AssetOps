import { z } from 'zod';

export type PasswordRequirementId = 'length' | 'uppercase' | 'lowercase' | 'number' | 'special';

export interface PasswordRequirement {
  id: PasswordRequirementId;
  label: string;
  errorMessage: string;
  test: (password: string) => boolean;
}

export const PASSWORD_REQUIREMENTS: readonly PasswordRequirement[] = [
  {
    id: 'length',
    label: 'At least 8 characters',
    errorMessage: 'Password must be at least 8 characters long',
    test: (password: string) => password.length >= 8,
  },
  {
    id: 'uppercase',
    label: 'One uppercase letter',
    errorMessage: 'Password must contain at least one uppercase letter (A-Z)',
    test: (password: string) => /[A-Z]/.test(password),
  },
  {
    id: 'lowercase',
    label: 'One lowercase letter',
    errorMessage: 'Password must contain at least one lowercase letter (a-z)',
    test: (password: string) => /[a-z]/.test(password),
  },
  {
    id: 'number',
    label: 'One number',
    errorMessage: 'Password must contain at least one number (0-9)',
    test: (password: string) => /[0-9]/.test(password),
  },
  {
    id: 'special',
    label: 'One special character',
    errorMessage: 'Password must contain at least one special character (e.g. @, #, $, !)',
    test: (password: string) => /[^A-Za-z0-9]/.test(password),
  },
] as const;

export interface RequirementValidationResult extends PasswordRequirement {
  met: boolean;
}

export interface PasswordValidationStatus {
  requirements: RequirementValidationResult[];
  isValid: boolean;
  metCount: number;
  totalCount: number;
}

/**
 * Validates a password against all defined requirements.
 * Used for live indicators and popover displays.
 */
export function validatePassword(password: string): PasswordValidationStatus {
  const pwd = password || '';
  const requirements = PASSWORD_REQUIREMENTS.map((req) => ({
    ...req,
    met: req.test(pwd),
  }));

  const metCount = requirements.filter((r) => r.met).length;
  const isValid = metCount === PASSWORD_REQUIREMENTS.length;

  return {
    requirements,
    isValid,
    metCount,
    totalCount: PASSWORD_REQUIREMENTS.length,
  };
}

/**
 * Zod schema derived from PASSWORD_REQUIREMENTS to guarantee
 * 100% synchronization between UI popover and backend/form validation.
 */
export const registerPasswordSchema = PASSWORD_REQUIREMENTS.reduce(
  (schema, req) =>
    schema.refine(req.test, {
      message: req.errorMessage,
    }),
  z.string().min(1, { message: 'Password is required' }),
);
