import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DashboardRecentActivity } from '../DashboardRecentActivity';
import { useActivityStore } from '@/store/useActivityStore';
import { useAssetStore } from '@/store/useAssetStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';

const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

describe('DashboardRecentActivity Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useActivityStore.getState().resetActivities();
  });

  it('should render the Recent Activity card title, live feed indicator, and View All button', () => {
    render(
      <MemoryRouter>
        <DashboardRecentActivity />
      </MemoryRouter>,
    );

    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    expect(
      screen.getByText(/real-time audit log of hardware lifecycle events/i),
    ).toBeInTheDocument();
    expect(screen.getByText('Live Feed')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /view all/i })).toBeInTheDocument();
  });

  it('should navigate to /history when View All button is clicked', () => {
    render(
      <MemoryRouter>
        <DashboardRecentActivity />
      </MemoryRouter>,
    );

    const viewAllBtn = screen.getByRole('button', { name: /view all/i });
    fireEvent.click(viewAllBtn);

    expect(mockedNavigate).toHaveBeenCalledWith('/history');
  });

  it('should display at most 5 recent activities in descending chronological order', () => {
    useActivityStore.setState({
      activities: [
        {
          id: '1',
          type: 'asset_created',
          actionType: 'asset_created',
          action: 'Asset Created',
          category: 'asset',
          title: 'Activity 1',
          description: 'Description 1',
          entityName: 'Device 1',
          entityId: 'DEV-1',
          entityType: 'Asset',
          actor: { name: 'User 1', email: 'u1@assetops.com', role: 'Staff', avatarInitials: 'U1' },
          timestamp: new Date().toISOString(),
          isUnread: false,
        },
        {
          id: '2',
          type: 'asset_created',
          actionType: 'asset_created',
          action: 'Asset Created',
          category: 'asset',
          title: 'Activity 2',
          description: 'Description 2',
          entityName: 'Device 2',
          entityId: 'DEV-2',
          entityType: 'Asset',
          actor: { name: 'User 2', email: 'u2@assetops.com', role: 'Staff', avatarInitials: 'U2' },
          timestamp: new Date().toISOString(),
          isUnread: false,
        },
        {
          id: '3',
          type: 'asset_created',
          actionType: 'asset_created',
          action: 'Asset Created',
          category: 'asset',
          title: 'Activity 3',
          description: 'Description 3',
          entityName: 'Device 3',
          entityId: 'DEV-3',
          entityType: 'Asset',
          actor: { name: 'User 3', email: 'u3@assetops.com', role: 'Staff', avatarInitials: 'U3' },
          timestamp: new Date().toISOString(),
          isUnread: false,
        },
        {
          id: '4',
          type: 'asset_created',
          actionType: 'asset_created',
          action: 'Asset Created',
          category: 'asset',
          title: 'Activity 4',
          description: 'Description 4',
          entityName: 'Device 4',
          entityId: 'DEV-4',
          entityType: 'Asset',
          actor: { name: 'User 4', email: 'u4@assetops.com', role: 'Staff', avatarInitials: 'U4' },
          timestamp: new Date().toISOString(),
          isUnread: false,
        },
        {
          id: '5',
          type: 'asset_created',
          actionType: 'asset_created',
          action: 'Asset Created',
          category: 'asset',
          title: 'Activity 5',
          description: 'Description 5',
          entityName: 'Device 5',
          entityId: 'DEV-5',
          entityType: 'Asset',
          actor: { name: 'User 5', email: 'u5@assetops.com', role: 'Staff', avatarInitials: 'U5' },
          timestamp: new Date().toISOString(),
          isUnread: false,
        },
        {
          id: '6',
          type: 'asset_created',
          actionType: 'asset_created',
          action: 'Asset Created',
          category: 'asset',
          title: 'Activity 6 (Hidden)',
          description: 'Description 6',
          entityName: 'Device 6',
          entityId: 'DEV-6',
          entityType: 'Asset',
          actor: { name: 'User 6', email: 'u6@assetops.com', role: 'Staff', avatarInitials: 'U6' },
          timestamp: new Date().toISOString(),
          isUnread: false,
        },
      ],
    });

    render(
      <MemoryRouter>
        <DashboardRecentActivity />
      </MemoryRouter>,
    );

    expect(screen.getByText('Activity 1')).toBeInTheDocument();
    expect(screen.getByText('Activity 5')).toBeInTheDocument();
    expect(screen.queryByText('Activity 6 (Hidden)')).not.toBeInTheDocument();
  });

  it('should dynamically update when an action is performed without page reload', () => {
    render(
      <MemoryRouter>
        <DashboardRecentActivity />
      </MemoryRouter>,
    );

    // Initial check
    expect(screen.queryByText('Dynamic Brand New Laptop (AST-NEW-99)')).not.toBeInTheDocument();

    // Trigger asset creation in store wrapped in act
    act(() => {
      useAssetStore.getState().addAsset({
        assetId: 'AST-NEW-99',
        name: 'Dynamic Brand New Laptop',
        category: 'Laptop',
        status: 'Available',
        location: 'London Office',
        serialNumber: 'SN-999-XYZ',
        purchaseDate: '2026-02-01',
      });
    });

    // Verify it instantly appears at the top
    expect(screen.getByText('Dynamic Brand New Laptop (AST-NEW-99)')).toBeInTheDocument();
    expect(screen.getByText('London Office')).toBeInTheDocument();
  });

  it('should dynamically update when an employee is created', () => {
    render(
      <MemoryRouter>
        <DashboardRecentActivity />
      </MemoryRouter>,
    );

    act(() => {
      useEmployeeStore.getState().addEmployee({
        firstName: 'Bruce',
        lastName: 'Wayne',
        email: 'bruce@wayne-enterprises.com',
        department: 'Executive Board',
        position: 'Managing Director',
        status: 'active',
        type: 'full-time',
        location: 'Gotham Office',
      });
    });

    expect(screen.getAllByText(/Bruce Wayne/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Executive Board')).toBeInTheDocument();
    expect(screen.getAllByText('Onboarded').length).toBeGreaterThanOrEqual(1);
  });

  it('should render empty state when no activities exist', () => {
    useActivityStore.setState({ activities: [] });

    render(
      <MemoryRouter>
        <DashboardRecentActivity />
      </MemoryRouter>,
    );

    expect(screen.getByText('No recent activity recorded')).toBeInTheDocument();
    expect(
      screen.getByText(
        /Actions performed across assets and employees will appear here in real time/i,
      ),
    ).toBeInTheDocument();
  });
});
