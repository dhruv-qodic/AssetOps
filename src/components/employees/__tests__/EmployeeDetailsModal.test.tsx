import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { EmployeeDetailsModal } from '../EmployeeDetailsModal';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { useAssetStore } from '@/store/useAssetStore';
import type { Employee } from '@/types/employee';
import type { Asset } from '@/types/asset';

describe('EmployeeDetailsModal Component', () => {
  const sampleEmployee: Employee = {
    id: 'emp-view-1',
    employeeId: 'E105',
    firstName: 'Marcus',
    lastName: 'Vance',
    email: 'marcus.vance@company.com',
    phone: '+1 555-8392',
    department: 'Finance',
    position: 'Financial Analyst',
    status: 'active',
    type: 'full-time',
    location: 'New York Office',
    assignedAssets: ['asset-1'],
    createdAt: '2026-02-15T10:00:00.000Z',
    updatedAt: '2026-02-15T10:00:00.000Z',
  };

  const sampleAsset: Asset = {
    id: 'asset-1',
    assetId: 'AST-770',
    name: 'ThinkPad X1 Carbon',
    category: 'Laptop',
    status: 'Allocated',
    location: 'New York Office',
    serialNumber: 'SN-TP-770',
    purchaseDate: '2026-01-10',
    assignedTo: {
      id: 'emp-view-1',
      employeeId: 'E105',
      name: 'Marcus Vance',
      department: 'Finance',
    },
    createdAt: '2026-01-10',
    updatedAt: '2026-01-10',
  };

  beforeEach(() => {
    useEmployeeStore.setState({
      selectedEmployee: sampleEmployee,
      isViewModalOpen: true,
      isEditModalOpen: false,
    });
    useAssetStore.setState({
      assets: [sampleAsset],
    });
  });

  it('should render employee profile information accurately', () => {
    render(<EmployeeDetailsModal />);

    expect(screen.getByText('Employee Profile')).toBeInTheDocument();
    expect(screen.getAllByText('Marcus Vance').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('E105').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('marcus.vance@company.com')).toBeInTheDocument();
    expect(screen.getByText('+1 555-8392')).toBeInTheDocument();
    expect(screen.getByText('Finance')).toBeInTheDocument();
    expect(screen.getByText('Financial Analyst')).toBeInTheDocument();
    expect(screen.getByText('New York Office')).toBeInTheDocument();
    expect(screen.getAllByText('Active').length).toBeGreaterThanOrEqual(1);
  });

  it('should list all assets currently assigned to this employee', () => {
    render(<EmployeeDetailsModal />);

    expect(screen.getByText('Assigned Equipment (1)')).toBeInTheDocument();
    expect(screen.getByText('ThinkPad X1 Carbon')).toBeInTheDocument();
    expect(screen.getByText(/AST-770/)).toBeInTheDocument();
  });

  it('should display empty assets message when employee has no assigned assets', () => {
    useAssetStore.setState({ assets: [] });
    render(<EmployeeDetailsModal />);

    expect(
      screen.getByText('No organization assets currently assigned to this employee.'),
    ).toBeInTheDocument();
  });

  it('should switch to edit modal when Edit Profile button is clicked', () => {
    render(<EmployeeDetailsModal />);

    const editBtn = screen.getByRole('button', { name: /Edit Profile/i });
    fireEvent.click(editBtn);

    expect(useEmployeeStore.getState().isEditModalOpen).toBe(true);
    expect(useEmployeeStore.getState().isViewModalOpen).toBe(false);
  });

  it('should close the modal when Close button is clicked', () => {
    render(<EmployeeDetailsModal />);

    const closeButtons = screen.getAllByRole('button', { name: 'Close' });
    fireEvent.click(closeButtons[0]);

    expect(useEmployeeStore.getState().isViewModalOpen).toBe(false);
  });
});
