import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ReportsKpiCards } from '../ReportsKpiCards';
import { useAssetStore } from '@/store/useAssetStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';

describe('ReportsKpiCards Component', () => {
  beforeEach(() => {
    useAssetStore.setState({
      assets: [
        {
          id: 'a1',
          assetId: 'A1001',
          name: 'Asset 1',
          category: 'Laptop',
          status: 'Allocated',
          location: 'HQ',
          purchaseCost: 1000,
          purchaseDate: '2023-01-01',
          assignedTo: { id: 'e1', name: 'John Doe', department: 'Engineering' },
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
        {
          id: 'a2',
          assetId: 'A1002',
          name: 'Asset 2',
          category: 'Monitor',
          status: 'Available',
          location: 'HQ',
          purchaseCost: 400,
          purchaseDate: '2023-02-01',
          assignedTo: null,
          createdAt: '2023-02-01T00:00:00Z',
          updatedAt: '2023-02-01T00:00:00Z',
        },
      ],
    });
    useEmployeeStore.setState({
      employees: [
        {
          id: 'e1',
          employeeId: 'EMP001',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          department: 'Engineering',
          position: 'Engineer',
          status: 'active',
          avatar: '',
          phone: '',
          location: 'HQ',
          joinDate: '2023-01-01',
          allocatedAssetsCount: 1,
        },
      ],
    });
  });

  it('should render all 4 reports KPI cards with calculated metrics', () => {
    render(<ReportsKpiCards />);

    expect(screen.getByText('Total Assets')).toBeInTheDocument();
    expect(screen.getByText('Allocated')).toBeInTheDocument();
    expect(screen.getByText('Available')).toBeInTheDocument();
    expect(screen.getByText('Maintenance')).toBeInTheDocument();
  });
});
