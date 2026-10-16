import { z } from 'zod';
import type { Role } from '@/types/auth';
import { registerPasswordSchema } from '@/utils/passwordValidation';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email address is required' })
    .pipe(z.email({ message: 'Please enter a valid email address' })),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters long' }),
  rememberMe: z.boolean(),
});

export const ROLE_OPTIONS: Role[] = ['ADMIN', 'MANAGER', 'VIEWER'];

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: 'Full name is required' })
      .refine((val) => val.trim().length > 0, { message: 'Name cannot be only whitespace' }),
    email: z
      .string()
      .min(1, { message: 'Email address is required' })
      .pipe(z.email({ message: 'Please enter a valid email address' })),
    password: registerPasswordSchema,
    confirmPassword: z.string().min(1, { message: 'Please confirm your password' }),
    role: z.enum(['ADMIN', 'MANAGER', 'VIEWER'], {
      message: 'Please select a valid role',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
