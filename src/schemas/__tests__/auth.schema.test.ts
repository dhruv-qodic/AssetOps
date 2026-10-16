import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema } from '../auth.schema';
import { validatePassword } from '@/utils/passwordValidation';

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
      const emailError = result.error.issues.find((i) => i.path.includes('email'))?.message;
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
      const emailError = result.error.issues.find((i) => i.path.includes('email'))?.message;
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
      const passwordErrors = result.error.issues
        .filter((i) => i.path.includes('password'))
        .map((i) => i.message);
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
      const passwordErrors = result.error.issues
        .filter((i) => i.path.includes('password'))
        .map((i) => i.message);
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

describe('passwordValidation utility', () => {
  it('should validate all 5 password rules correctly', () => {
    const emptyStatus = validatePassword('');
    expect(emptyStatus.isValid).toBe(false);
    expect(emptyStatus.metCount).toBe(0);
    expect(emptyStatus.totalCount).toBe(5);

    const partialStatus = validatePassword('Pass');
    expect(partialStatus.isValid).toBe(false);
    // 'Pass' has uppercase and lowercase -> 2 met
    expect(partialStatus.metCount).toBe(2);

    const fullStatus = validatePassword('Password123!');
    expect(fullStatus.isValid).toBe(true);
    expect(fullStatus.metCount).toBe(5);
    expect(fullStatus.requirements.every((r) => r.met)).toBe(true);
  });

  it('should test individual requirement validators', () => {
    expect(validatePassword('12345678').requirements.find((r) => r.id === 'length')?.met).toBe(
      true,
    );
    expect(validatePassword('short').requirements.find((r) => r.id === 'length')?.met).toBe(false);

    expect(validatePassword('ABC').requirements.find((r) => r.id === 'uppercase')?.met).toBe(true);
    expect(validatePassword('abc').requirements.find((r) => r.id === 'uppercase')?.met).toBe(false);

    expect(validatePassword('abc').requirements.find((r) => r.id === 'lowercase')?.met).toBe(true);
    expect(validatePassword('ABC').requirements.find((r) => r.id === 'lowercase')?.met).toBe(false);

    expect(validatePassword('abc1').requirements.find((r) => r.id === 'number')?.met).toBe(true);
    expect(validatePassword('abc').requirements.find((r) => r.id === 'number')?.met).toBe(false);

    expect(validatePassword('abc@').requirements.find((r) => r.id === 'special')?.met).toBe(true);
    expect(validatePassword('abc#').requirements.find((r) => r.id === 'special')?.met).toBe(true);
    expect(validatePassword('abc$').requirements.find((r) => r.id === 'special')?.met).toBe(true);
    expect(validatePassword('abc!').requirements.find((r) => r.id === 'special')?.met).toBe(true);
    expect(validatePassword('abc123').requirements.find((r) => r.id === 'special')?.met).toBe(
      false,
    );
  });
});

describe('auth.schema - registerSchema', () => {
  const validRegisterData = {
    name: 'Jane Doe',
    email: 'jane@assetops.com',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    role: 'ADMIN' as const,
  };

  it('should pass validation when all fields and password requirements are met', () => {
    const result = registerSchema.safeParse(validRegisterData);
    expect(result.success).toBe(true);
  });

  it('should fail when password is less than 8 characters', () => {
    const result = registerSchema.safeParse({
      ...validRegisterData,
      password: 'Pass1!',
      confirmPassword: 'Pass1!',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('at least 8 characters');
    }
  });

  it('should fail when password is missing uppercase letter', () => {
    const result = registerSchema.safeParse({
      ...validRegisterData,
      password: 'password123!',
      confirmPassword: 'password123!',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('uppercase letter');
    }
  });

  it('should fail when password is missing lowercase letter', () => {
    const result = registerSchema.safeParse({
      ...validRegisterData,
      password: 'PASSWORD123!',
      confirmPassword: 'PASSWORD123!',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('lowercase letter');
    }
  });

  it('should fail when password is missing number', () => {
    const result = registerSchema.safeParse({
      ...validRegisterData,
      password: 'Password!!!!',
      confirmPassword: 'Password!!!!',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('number');
    }
  });

  it('should fail when password is missing special character', () => {
    const result = registerSchema.safeParse({
      ...validRegisterData,
      password: 'Password1234',
      confirmPassword: 'Password1234',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('special character');
    }
  });

  it('should fail when confirm password does not match', () => {
    const result = registerSchema.safeParse({
      ...validRegisterData,
      confirmPassword: 'DifferentPassword123!',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Passwords do not match');
      expect(result.error.issues[0].path).toContain('confirmPassword');
    }
  });
});
