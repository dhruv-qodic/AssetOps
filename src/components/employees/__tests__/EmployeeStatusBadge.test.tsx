import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EmployeeStatusBadge } from '../EmployeeStatusBadge';

describe('EmployeeStatusBadge Component', () => {
  it('should render active status with Active label and emerald styling', () => {
    render(<EmployeeStatusBadge status="active" />);

    const badge = screen.getByText('Active');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('emerald');
  });

  it('should render inactive status with Inactive label and rose styling', () => {
    render(<EmployeeStatusBadge status="inactive" />);

    const badge = screen.getByText('Inactive');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('rose');
  });

  it('should render terminated status with Terminated label and slate styling', () => {
    render(<EmployeeStatusBadge status="terminated" />);

    const badge = screen.getByText('Terminated');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('slate');
  });

  it('should append custom className to the badge element', () => {
    render(<EmployeeStatusBadge status="active" className="custom-test-class" />);

    const badge = screen.getByText('Active');
    expect(badge.className).toContain('custom-test-class');
  });
});
