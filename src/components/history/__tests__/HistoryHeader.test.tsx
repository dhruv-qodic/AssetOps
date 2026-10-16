import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { HistoryHeader } from '../HistoryHeader';
import { useActivityStore } from '@/store/useActivityStore';
import { toast } from 'sonner';
import * as historyExportUtils from '@/utils/historyExport';
import type { HistoryRecord } from '@/types/activity';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe('HistoryHeader Component', () => {
  const sampleRecord: HistoryRecord = {
    id: 'HIST-HDR-1',
    category: 'asset',
    action: 'New Asset Added',
    actionType: 'asset_created',
    title: 'Asset Added',
    description: 'Added test asset',
    entityName: 'Server 1',
    entityId: 'AST-1',
    entityType: 'Asset',
    actor: { name: 'Admin', email: 'admin@assetops.com', role: 'Admin', avatarInitials: 'AD' },
    timestamp: '2026-10-09T10:00:00Z',
  };

  beforeEach(() => {
    useActivityStore.getState().clearActivities();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render title, description, refresh, and export buttons', () => {
    render(<HistoryHeader />);

    expect(screen.getByRole('heading', { name: 'Activity History' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Refresh/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Export Audit Log/i })).toBeInTheDocument();
  });

  it('should call onRefresh and trigger refresh notification when Refresh button is clicked', () => {
    const onRefreshSpy = vi.fn();
    render(<HistoryHeader onRefresh={onRefreshSpy} />);

    const refreshBtn = screen.getByRole('button', { name: /Refresh/i });
    fireEvent.click(refreshBtn);

    expect(onRefreshSpy).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith('Activity history refreshed');
  });

  it('should show error notification if export is triggered with no records', () => {
    render(<HistoryHeader filteredRecords={[]} />);

    const exportBtn = screen.getByRole('button', { name: /Export Audit Log/i });
    fireEvent.click(exportBtn);

    expect(toast.error).toHaveBeenCalledWith(
      'No history records available to export with current criteria.',
    );
  });

  it('should invoke exportHistoryToExcel with filteredRecords when clicked', () => {
    const exportSpy = vi.spyOn(historyExportUtils, 'exportHistoryToExcel').mockReturnValue({
      success: true,
      count: 1,
      filename: 'AssetOps_History_2026-10-09.xlsx',
    });

    render(<HistoryHeader filteredRecords={[sampleRecord]} activeTab="asset" />);

    const exportBtn = screen.getByRole('button', { name: /Export Audit Log/i });
    fireEvent.click(exportBtn);

    expect(exportSpy).toHaveBeenCalledWith([sampleRecord], { category: 'asset' });
    expect(toast.success).toHaveBeenCalledWith(
      'Successfully exported 1 history log to AssetOps_History_2026-10-09.xlsx',
    );
  });

  it('should display error toast if export throws an error', () => {
    vi.spyOn(historyExportUtils, 'exportHistoryToExcel').mockImplementationOnce(() => {
      throw new Error('Export generation failed');
    });

    render(<HistoryHeader filteredRecords={[sampleRecord]} />);

    const exportBtn = screen.getByRole('button', { name: /Export Audit Log/i });
    fireEvent.click(exportBtn);

    expect(toast.error).toHaveBeenCalledWith('Export generation failed');
  });
});
