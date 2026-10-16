import { describe, it, expect } from 'vitest';
import { employeeSchema } from '../employee.schema';

describe('employeeSchema Validation', () => {
  const validEmployeeData = {
    employeeId: 'EMP-101',
    firstName: 'Alex',
    lastName: 'Morgan',
    email: 'alex.morgan@company.com',
    phone: '+1-555-0199',
    department: 'Engineering',
    position: 'Senior Software Engineer',
    status: 'active' as const,
    type: 'full-time' as const,
    location: 'Headquarters',
  };

  it('should validate a complete valid employee data object', () => {
    const result = employeeSchema.safeParse(validEmployeeData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.employeeId).toBe('EMP-101');
      expect(result.data.email).toBe('alex.morgan@company.com');
      expect(result.data.status).toBe('active');
    }
  });

  it('should validate when optional phone is omitted or empty', () => {
    const withoutPhone = { ...validEmployeeData, phone: undefined };
    const result = employeeSchema.safeParse(withoutPhone);
    expect(result.success).toBe(true);
  });

  it('should fail when employeeId is empty or whitespace', () => {
    const invalid = { ...validEmployeeData, employeeId: '   ' };
    const result = employeeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Employee ID is required');
    }
  });

  it('should fail when firstName is missing', () => {
    const invalid = { ...validEmployeeData, firstName: '' };
    const result = employeeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('First name is required');
    }
  });

  it('should fail when lastName is missing', () => {
    const invalid = { ...validEmployeeData, lastName: '' };
    const result = employeeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Last name is required');
    }
  });

  it('should fail when email is empty', () => {
    const invalid = { ...validEmployeeData, email: '' };
    const result = employeeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Email address is required');
    }
  });

  it('should fail when email is invalid format', () => {
    const invalid = { ...validEmployeeData, email: 'not-an-email' };
    const result = employeeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Invalid email address');
    }
  });

  it('should fail when department is empty', () => {
    const invalid = { ...validEmployeeData, department: '' };
    const result = employeeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Department is required');
    }
  });

  it('should fail when position is empty', () => {
    const invalid = { ...validEmployeeData, position: '' };
    const result = employeeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Position is required');
    }
  });

  it('should fail when status is not active, inactive, or terminated', () => {
    const invalid = { ...validEmployeeData, status: 'on-leave' };
    const result = employeeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Please select a valid status');
    }
  });

  it('should fail when type is not full-time, contractor, or intern', () => {
    const invalid = { ...validEmployeeData, type: 'part-time' };
    const result = employeeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Please select a valid employment type');
    }
  });

  it('should fail when location is empty', () => {
    const invalid = { ...validEmployeeData, location: '' };
    const result = employeeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Location is required');
    }
  });
});
