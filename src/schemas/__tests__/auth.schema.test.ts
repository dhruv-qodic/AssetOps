import { describe, it, expect } from 'vitest';
import { loginSchema } from '../auth.schema';

describe('auth.schema - loginSchema', () => {
  it('should pass validation with valid email and password', () => {
    const validData = {
      email: 'admin@assetops.com',
      password: 'password123',
      rememberMe: true,
    };

    const result = loginSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validData);
    }
  });

  it('should fail validation when email is empty', () => {
    const data = {
      email: '',
      password: 'password123',
      rememberMe: false,
    };

    const result = loginSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      const emailError = result.error.format().email?._errors[0];
      expect(emailError).toBe('Email address is required');
    }
  });

  it('should fail validation when email format is invalid', () => {
    const data = {
      email: 'invalid-email-format',
      password: 'password123',
      rememberMe: false,
    };

    const result = loginSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      const emailError = result.error.format().email?._errors[0];
      expect(emailError).toBe('Please enter a valid email address');
    }
  });

  it('should fail validation when password is empty', () => {
    const data = {
      email: 'user@example.com',
      password: '',
      rememberMe: false,
    };

    const result = loginSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      const passwordErrors = result.error.format().password?._errors;
      expect(passwordErrors).toContain('Password is required');
    }
  });

  it('should fail validation when password is shorter than 6 characters', () => {
    const data = {
      email: 'user@example.com',
      password: '123',
      rememberMe: false,
    };

    const result = loginSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      const passwordErrors = result.error.format().password?._errors;
      expect(passwordErrors).toContain('Password must be at least 6 characters long');
    }
  });

  it('should default or parse rememberMe boolean properly', () => {
    const data = {
      email: 'user@example.com',
      password: 'password123',
      rememberMe: false,
    };

    const result = loginSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.rememberMe).toBe(false);
    }
  });
});
