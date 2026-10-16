import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import HistoryPage from '../HistoryPage';
import { useActivityStore } from '@/store/useActivityStore';
import { useAssetStore } from '@/store/useAssetStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { toast } from 'sonner';
import * as historyExportUtils from '@/utils/historyExport';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

const renderHistoryPage = () => {
  return render(
    <MemoryRouter>
      <HistoryPage />
    </MemoryRouter>,
  );
};

describe('HistoryPage Component', () => {
  beforeEach(() => {
    useActivityStore.getState().clearActivities();
  });

  it('should render page header with title, subtitle, and action buttons', () => {
    renderHistoryPage();

    expect(screen.getByRole('heading', { name: 'Activity History' })).toBeInTheDocument();
    expect(
      screen.getByText(/Comprehensive audit logs, lifecycle events, and operational tracking/i),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Export Audit Log/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Refresh/i })).toBeInTheDocument();
  });

  it('should display "No history found" when there is no activity history', () => {
    renderHistoryPage();

    expect(screen.getByText('No history found')).toBeInTheDocument();
    expect(
      screen.getByText(
        /No activity logs match your current search and filter criteria, or no actions have been performed yet./i,
      ),
    ).toBeInTheDocument();
  });

  it('should render all 4 KPI cards with dynamic metrics for Total History, Asset, Employee, and Allocation actions', () => {
    act(() => {
      useActivityStore.getState().logActivity({
        category: 'asset',
        actionType: 'asset_created',
        title: 'New Hardware Log',
        entityName: 'MacBook Pro 16"',
        isUnread: true,
      });
      useActivityStore.getState().logActivity({
        category: 'employee',
        actionType: 'employee_onboarded',
        title: 'New Employee Log',
        entityName: 'John Doe',
        isUnread: true,
      });
      useActivityStore.getState().logActivity({
        category: 'allocation',
        actionType: 'allocation_assigned',
        title: 'New Allocation Log',
        entityName: 'MacBook Pro 16"',
        isUnread: true,
      });
    });

    renderHistoryPage();

    expect(screen.getByTestId('history-kpi-cards')).toBeInTheDocument();
    expect(screen.getByText('Total History')).toBeInTheDocument();
    expect(screen.getByText('Asset Actions')).toBeInTheDocument();
    expect(screen.getByText('Employee Actions')).toBeInTheDocument();
    expect(screen.getByText('Allocation Actions')).toBeInTheDocument();

    const summary = useActivityStore.getState().getKpiSummary();
    expect(screen.getByTestId('history-kpi-total')).toHaveTextContent(
      summary.totalHistory.toLocaleString(),
    );
    expect(screen.getByTestId('history-kpi-asset')).toHaveTextContent(
      summary.assetActions.toLocaleString(),
    );
    expect(screen.getByTestId('history-kpi-employee')).toHaveTextContent(
      summary.employeeActions.toLocaleString(),
    );
    expect(screen.getByTestId('history-kpi-allocation')).toHaveTextContent(
      summary.allocationActions.toLocaleString(),
    );
  });

  it('should render all four history tabs with dynamic unread count badges', () => {
    act(() => {
      useActivityStore.getState().logActivity({
        category: 'asset',
        actionType: 'asset_created',
        title: 'New Hardware Log',
        entityName: 'MacBook Pro 16"',
        isUnread: true,
      });
      useActivityStore.getState().logActivity({
        category: 'employee',
        actionType: 'employee_onboarded',
        title: 'New Employee Log',
        entityName: 'John Doe',
        isUnread: true,
      });
    });

    renderHistoryPage();

    const allTab = screen.getByRole('button', { name: /All History/i });
    const assetTab = screen.getByRole('button', { name: /Asset History/i });
    const employeeTab = screen.getByRole('button', { name: /Employee History/i });
    const allocationTab = screen.getByRole('button', { name: /Allocation History/i });

    expect(allTab).toBeInTheDocument();
    expect(assetTab).toBeInTheDocument();
    expect(employeeTab).toBeInTheDocument();
    expect(allocationTab).toBeInTheDocument();

    const kpi = useActivityStore.getState().getKpiSummary();
    expect(screen.getByText(`${kpi.unreadCounts.all} New`)).toBeInTheDocument();
  });

  it('should filter records when clicking Asset History, Employee History, and Allocation History tabs', () => {
    act(() => {
      useActivityStore.getState().logActivity({
        id: 'HIST-ALLOC-01',
        category: 'allocation',
        actionType: 'allocation_assigned',
        title: 'Allocated MacBook Pro 16" to Sarah Connor',
        entityName: 'MacBook Pro 16"',
      });
      useActivityStore.getState().logActivity({
        id: 'HIST-EMP-01',
        category: 'employee',
        actionType: 'employee_onboarded',
        title: 'Onboarded John Doe to Engineering Team',
        entityName: 'John Doe',
      });
      useActivityStore.getState().logActivity({
        id: 'HIST-AST-01',
        category: 'asset',
        actionType: 'asset_created',
        title: 'Registered iPhone 15 Pro in Asset Registry',
        entityName: 'iPhone 15 Pro',
      });
    });

    renderHistoryPage();

    // Default All History shows items across categories
    expect(
      screen.getAllByText(/Allocated MacBook Pro 16" to Sarah Connor/i).length,
    ).toBeGreaterThanOrEqual(1);

    // Switch to Employee History
    const employeeTab = screen.getByRole('button', { name: /Employee History/i });
    fireEvent.click(employeeTab);

    expect(
      screen.getAllByText(/Onboarded John Doe to Engineering Team/i).length,
    ).toBeGreaterThanOrEqual(1);
    expect(
      screen.queryByText(/Allocated MacBook Pro 16" to Sarah Connor/i),
    ).not.toBeInTheDocument();

    // Switch to Asset History
    const assetTab = screen.getByRole('button', { name: /Asset History/i });
    fireEvent.click(assetTab);

    expect(
      screen.getAllByText(/Registered iPhone 15 Pro in Asset Registry/i).length,
    ).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText(/Onboarded John Doe to Engineering Team/i)).not.toBeInTheDocument();
  });

  it('should filter history records via search bar input', () => {
    act(() => {
      useActivityStore.getState().logActivity({
        id: 'HIST-ALLOC-01',
        category: 'allocation',
        actionType: 'allocation_assigned',
        title: 'Allocated MacBook Pro 16" to Sarah Connor',
        entityName: 'MacBook Pro 16"',
      });
      useActivityStore.getState().logActivity({
        id: 'HIST-AST-01',
        category: 'asset',
        actionType: 'asset_created',
        title: 'Registered iPhone 15 Pro in Asset Registry',
        entityName: 'iPhone 15 Pro',
      });
    });

    renderHistoryPage();

    const searchInput = screen.getByPlaceholderText(
      /Search history by action, asset, employee, or actor.../i,
    );

    fireEvent.change(searchInput, { target: { value: 'iPhone 15 Pro' } });

    expect(
      screen.getAllByText(/Registered iPhone 15 Pro in Asset Registry/i).length,
    ).toBeGreaterThanOrEqual(1);
    expect(
      screen.queryByText(/Allocated MacBook Pro 16" to Sarah Connor/i),
    ).not.toBeInTheDocument();
  });

  it('should open detail modal when clicking a history row or View button', () => {
    act(() => {
      useActivityStore.getState().logActivity({
        id: 'HIST-TEST-1089',
        category: 'allocation',
        actionType: 'allocation_assigned',
        title: 'Allocated MacBook Pro 16" to Sarah Connor',
        entityName: 'MacBook Pro 16"',
        actor: {
          name: 'Admin User',
          email: 'admin@assetops.com',
          role: 'IT Administrator',
          avatarInitials: 'AU',
        },
        metadata: {
          'Allocation Code': 'AL1001',
        },
      });
    });

    renderHistoryPage();

    const viewButton = screen.getByRole('button', {
      name: /View details for log HIST-TEST-1089/i,
    });
    fireEvent.click(viewButton);

    expect(
      screen.getAllByText(/Allocated MacBook Pro 16" to Sarah Connor/i).length,
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Executed By (Actor)')).toBeInTheDocument();
    expect(screen.getAllByText('Admin User').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Action Attributes & Payload')).toBeInTheDocument();
  });

  it('should dynamically add and display new action log when asset action is triggered', () => {
    renderHistoryPage();

    act(() => {
      useAssetStore.getState().addAsset({
        name: 'Quantum Server X9000',
        assetId: 'SRV-9000',
        category: 'Desktop',
        status: 'Available',
        location: 'Data Center Alpha',
        serialNumber: 'SN-QNT-9900',
        purchaseDate: '2026-10-01',
      });
    });

    // New item appears in the rendered history table live without refresh
    expect(
      screen.getByText(/Registered Quantum Server X9000 in Asset Registry/i),
    ).toBeInTheDocument();
  });

  it('should dynamically add and display new employee onboard action log', () => {
    renderHistoryPage();

    act(() => {
      useEmployeeStore.getState().addEmployee({
        firstName: 'Gordon',
        lastName: 'Freeman',
        email: 'gordon.freeman@assetops.com',
        department: 'Research',
        position: 'Research Scientist',
        status: 'active',
        type: 'full-time',
        location: 'Headquarters',
      });
    });

    expect(screen.getByText(/Onboarded Gordon Freeman to Research Team/i)).toBeInTheDocument();
  });

  describe('History Export Functionality', () => {
    beforeEach(() => {
      vi.spyOn(window.URL, 'createObjectURL').mockReturnValue('blob:mock-url');
      vi.spyOn(window.URL, 'revokeObjectURL').mockReturnValue();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should show error notification when attempting to export with zero history logs', () => {
      renderHistoryPage();

      const exportBtn = screen.getByRole('button', { name: /Export Audit Log/i });
      fireEvent.click(exportBtn);

      expect(toast.error).toHaveBeenCalledWith(
        'No history records available to export with current criteria.',
      );
    });

    it('should successfully export all records to Excel when in All History view', () => {
      const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

      act(() => {
        useActivityStore.getState().logActivity({
          id: 'HIST-EXP-1',
          category: 'asset',
          actionType: 'asset_created',
          title: 'Registered ThinkPad X1 Carbon',
          entityName: 'ThinkPad X1',
        });
        useActivityStore.getState().logActivity({
          id: 'HIST-EXP-2',
          category: 'employee',
          actionType: 'employee_onboarded',
          title: 'Onboarded Alice Smith',
          entityName: 'Alice Smith',
        });
      });

      renderHistoryPage();

      const exportBtn = screen.getByRole('button', { name: /Export Audit Log/i });
      fireEvent.click(exportBtn);

      expect(clickSpy).toHaveBeenCalledTimes(1);
      expect(toast.success).toHaveBeenCalledWith(
        expect.stringMatching(/Successfully exported 2 history logs to AssetOps_History_/i),
      );
    });

    it('should respect category tab filter and only export filtered records', () => {
      const exportSpy = vi.spyOn(historyExportUtils, 'exportHistoryToExcel');

      act(() => {
        useActivityStore.getState().logActivity({
          id: 'HIST-AST-1',
          category: 'asset',
          actionType: 'asset_created',
          title: 'Registered Server A',
          entityName: 'Server A',
        });
        useActivityStore.getState().logActivity({
          id: 'HIST-EMP-1',
          category: 'employee',
          actionType: 'employee_onboarded',
          title: 'Onboarded Jane',
          entityName: 'Jane',
        });
      });

      renderHistoryPage();

      // Switch to Employee tab
      const employeeTab = screen.getByRole('button', { name: /Employee History/i });
      fireEvent.click(employeeTab);

      const exportBtn = screen.getByRole('button', { name: /Export Audit Log/i });
      fireEvent.click(exportBtn);

      expect(exportSpy).toHaveBeenCalled();
      const exportedRecords = exportSpy.mock.calls[0][0];
      expect(exportedRecords.length).toBe(1);
      expect(exportedRecords[0].id).toBe('HIST-EMP-1');
      expect(exportedRecords[0].category).toBe('employee');
    });

    it('should respect search input filter and export only matching records', () => {
      const exportSpy = vi.spyOn(historyExportUtils, 'exportHistoryToExcel');

      act(() => {
        useActivityStore.getState().logActivity({
          id: 'HIST-SEARCH-1',
          category: 'asset',
          actionType: 'asset_created',
          title: 'Registered iPad Pro 12.9',
          entityName: 'iPad Pro',
        });
        useActivityStore.getState().logActivity({
          id: 'HIST-SEARCH-2',
          category: 'asset',
          actionType: 'asset_created',
          title: 'Registered Dell Latitude',
          entityName: 'Dell Latitude',
        });
      });

      renderHistoryPage();

      const searchInput = screen.getByPlaceholderText(
        /Search history by action, asset, employee, or actor.../i,
      );
      fireEvent.change(searchInput, { target: { value: 'iPad' } });

      const exportBtn = screen.getByRole('button', { name: /Export Audit Log/i });
      fireEvent.click(exportBtn);

      expect(exportSpy).toHaveBeenCalled();
      const exportedRecords = exportSpy.mock.calls[0][0];
      expect(exportedRecords.length).toBe(1);
      expect(exportedRecords[0].entityName).toBe('iPad Pro');
    });

    it('should export all matching records even when total records exceed single page size', () => {
      const exportSpy = vi.spyOn(historyExportUtils, 'exportHistoryToExcel');

      // Create 15 records (table page size is 10)
      act(() => {
        for (let i = 1; i <= 15; i++) {
          useActivityStore.getState().logActivity({
            id: `HIST-PAGE-${i}`,
            category: 'asset',
            actionType: 'asset_created',
            title: `Asset Record ${i}`,
            entityName: `Device ${i}`,
          });
        }
      });

      renderHistoryPage();

      const exportBtn = screen.getByRole('button', { name: /Export Audit Log/i });
      fireEvent.click(exportBtn);

      expect(exportSpy).toHaveBeenCalled();
      const exportedRecords = exportSpy.mock.calls[0][0];
      // All 15 matching records are exported, not just the first page of 10
      expect(exportedRecords.length).toBe(15);
    });

    it('should handle export errors gracefully and show error toast', () => {
      vi.spyOn(historyExportUtils, 'exportHistoryToExcel').mockImplementationOnce(() => {
        throw new Error('Workbook generation failure');
      });

      act(() => {
        useActivityStore.getState().logActivity({
          id: 'HIST-ERR-1',
          category: 'asset',
          actionType: 'asset_created',
          title: 'Test Asset',
          entityName: 'Test Asset',
        });
      });

      renderHistoryPage();

      const exportBtn = screen.getByRole('button', { name: /Export Audit Log/i });
      fireEvent.click(exportBtn);

      expect(toast.error).toHaveBeenCalledWith('Workbook generation failure');
    });
  });
});
