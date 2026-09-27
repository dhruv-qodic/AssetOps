import { z } from 'zod';

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

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Full name is required' })
    .min(2, { message: 'Name must be at least 2 characters long' }),
  email: z
    .string()
    .min(1, { message: 'Email address is required' })
    .pipe(z.email({ message: 'Please enter a valid email address' })),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters long' }),
  role: z.enum(['ADMIN', 'MANAGER', 'VIEWER'], {
    error: 'Please select a valid role',
  }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
