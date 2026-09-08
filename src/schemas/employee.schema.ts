import { z } from 'zod';

export const employeeSchema = z.object({
  employeeId: z
    .string()
    .trim()
    .min(1, { message: 'Employee ID is required' }),
  firstName: z
    .string()
    .trim()
    .min(1, { message: 'First name is required' }),
  lastName: z
    .string()
    .trim()
    .min(1, { message: 'Last name is required' }),
  email: z
    .string()
    .trim()
    .min(1, { message: 'Email address is required' })
    .email({ message: 'Invalid email address' }),
  phone: z.string().trim().optional(),
  department: z.string().trim().min(1, { message: 'Department is required' }),
  position: z.string().trim().min(1, { message: 'Position is required' }),
  status: z.enum(['active', 'inactive', 'terminated'] as const, {
    error: 'Please select a valid status',
  }),
  type: z.enum(['full-time', 'contractor', 'intern'] as const, {
    error: 'Please select a valid employment type',
  }),
  location: z.string().trim().min(1, { message: 'Location is required' }),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;
