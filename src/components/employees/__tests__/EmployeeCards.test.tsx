import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmployeeCards } from '../EmployeeCards';
import { useEmployeeStore } from '@/store/useEmployeeStore';

describe('EmployeeCards Component', () => {
  beforeEach(() => {
    useEmployeeStore.setState({
      employees: [
        {
          id: 'e1',
          employeeId: 'EMP001',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          department: 'Engineering',
          position: 'Senior Engineer',
          status: 'active',
          type: 'full-time',
          avatar: '',
          phone: '123',
          location: 'HQ',
          assignedAssets: ['A1001', 'A1002'],
          allocatedAssetsCount: 2,
          joinDate: '2023-01-01',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
        {
          id: 'e2',
          employeeId: 'EMP002',
          firstName: 'Sarah',
          lastName: 'Connor',
          email: 'sarah@example.com',
          department: 'Security',
          position: 'Security Lead',
          status: 'inactive',
          type: 'full-time',
          avatar: '',
          phone: '456',
          location: 'HQ',
          assignedAssets: ['A1003'],
          allocatedAssetsCount: 1,
          joinDate: '2023-02-01',
          createdAt: '2023-02-01T00:00:00Z',
          updatedAt: '2023-02-01T00:00:00Z',
        },
      ],
    });
  });

  it('should render all 4 employee summary metric cards', () => {
    render(<EmployeeCards />);

    expect(screen.getByText('Total Employees')).toBeInTheDocument();
    expect(screen.getByText('Active Employees')).toBeInTheDocument();
    expect(screen.getByText('Inactive & Terminated')).toBeInTheDocument();
    expect(screen.getByText('Full-Time Staff')).toBeInTheDocument();

    expect(screen.getByText('Total workforce headcount')).toBeInTheDocument();
    expect(screen.getByText('Currently active workforce')).toBeInTheDocument();
  });
});
