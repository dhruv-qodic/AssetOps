import { render, screen, fireEvent, act, within } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import HistoryPage from '@/pages/HistoryPage';
import { useActivityStore } from '@/store/useActivityStore';
import { useAssetStore } from '@/store/useAssetStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { MOCK_ASSETS } from '@/mocks/seed/assets';
import { MOCK_EMPLOYEES } from '@/mocks/seed/employees';
import type { Asset } from '@/types/asset';
import type { Employee } from '@/types/employee';

const renderHistoryPage = () => {
  return render(
    <MemoryRouter>
      <HistoryPage />
    </MemoryRouter>,
  );
};

describe('HistoryPage - Undo / Redo Integration', () => {
  beforeEach(() => {
    useActivityStore.getState().clearActivities();
    useAssetStore.setState({
      assets: JSON.parse(JSON.stringify(MOCK_ASSETS)) as Asset[],
    });
    useEmployeeStore.setState({
      employees: JSON.parse(JSON.stringify(MOCK_EMPLOYEES)) as Employee[],
    });
  });

  it('should render Undo and Redo buttons in the toolbar with correct disabled states initially', () => {
    renderHistoryPage();

    const undoButton = screen.getByTestId('history-undo-button');
    const redoButton = screen.getByTestId('history-redo-button');

    expect(undoButton).toBeInTheDocument();
    expect(redoButton).toBeInTheDocument();
    expect(undoButton).toBeDisabled();
    expect(redoButton).toBeDisabled();
  });

  it('should enable Undo button when an action has been recorded', () => {
    act(() => {
      useActivityStore.getState().logActivity({
        title: 'Allocated Dell Monitor to Alice',
        entityName: 'Dell Monitor',
      });
    });

    renderHistoryPage();

    const undoButton = screen.getByTestId('history-undo-button');
    const redoButton = screen.getByTestId('history-redo-button');

    expect(undoButton).toBeEnabled();
    expect(redoButton).toBeDisabled();
    expect(screen.getByTestId('undo-count-badge')).toHaveTextContent('1');
  });

  it('should show confirmation modal when Undo is clicked with target action details', () => {
    act(() => {
      useActivityStore.getState().logActivity({
        id: 'HIST-CONFIRM-99',
        title: 'Allocated MacBook Pro to Bob',
        description: 'Assigned hardware asset A1006 to Bob in IT.',
        entityName: 'MacBook Pro 16"',
        actor: {
          name: 'Sarah Connor',
          email: 'sarah@assetops.com',
          role: 'IT Lead',
          avatarInitials: 'SC',
        },
      });
    });

    renderHistoryPage();

    const undoButton = screen.getByTestId('history-undo-button');
    fireEvent.click(undoButton);

    // Confirmation Modal appears
    const modal = screen.getByTestId('undo-confirm-modal');
    expect(modal).toBeInTheDocument();
    expect(within(modal).getByText('Undo History Action')).toBeInTheDocument();
    expect(within(modal).getByText('Allocated MacBook Pro to Bob')).toBeInTheDocument();
    expect(within(modal).getByText('HIST-CONFIRM-99')).toBeInTheDocument();
    expect(within(modal).getByText('By Sarah Connor')).toBeInTheDocument();
  });

  it('should not undo action if user cancels the confirmation modal', () => {
    act(() => {
      useActivityStore.getState().logActivity({
        id: 'HIST-KEEP-1',
        title: 'Allocated Mouse to Charlie',
        entityName: 'Wireless Mouse',
      });
    });

    renderHistoryPage();

    const undoButton = screen.getByTestId('history-undo-button');
    fireEvent.click(undoButton);

    const cancelButton = screen.getByTestId('undo-confirm-cancel');
    fireEvent.click(cancelButton);

    expect(screen.queryByTestId('undo-confirm-modal')).not.toBeInTheDocument();
    expect(screen.getAllByText(/Allocated Mouse to Charlie/i).length).toBeGreaterThanOrEqual(1);
    expect(useActivityStore.getState().activities).toHaveLength(1);
  });

  it('should perform undo when confirmed in modal and update redo count & undone indicator', () => {
    act(() => {
      useActivityStore.getState().logActivity({
        id: 'HIST-UNDO-ME',
        title: 'Allocated Keyboard to David',
        entityName: 'Mechanical Keyboard',
      });
    });

    renderHistoryPage();

    const undoButton = screen.getByTestId('history-undo-button');
    fireEvent.click(undoButton);

    const confirmButton = screen.getByTestId('undo-confirm-submit');
    fireEvent.click(confirmButton);

    // Modal closed
    expect(screen.queryByTestId('undo-confirm-modal')).not.toBeInTheDocument();

    // Redo button is now enabled with count 1
    const redoButton = screen.getByTestId('history-redo-button');
    expect(redoButton).toBeEnabled();
    expect(screen.getByTestId('redo-count-badge')).toHaveTextContent('1');
    expect(screen.getByTestId('undone-count-indicator')).toHaveTextContent(/1\s*action undone/);
  });

  it('should redo undone action when Redo button is clicked and add back to history', () => {
    act(() => {
      useActivityStore.getState().logActivity({
        id: 'HIST-REDO-ME',
        title: 'Allocated Headset to Emma',
        entityName: 'Jabra Headset',
      });
    });

    renderHistoryPage();

    // 1. Undo
    fireEvent.click(screen.getByTestId('history-undo-button'));
    fireEvent.click(screen.getByTestId('undo-confirm-submit'));

    expect(screen.queryByText(/Allocated Headset to Emma/i)).not.toBeInTheDocument();

    // 2. Redo
    const redoButton = screen.getByTestId('history-redo-button');
    fireEvent.click(redoButton);

    // Record is restored in table
    expect(screen.getAllByText(/Allocated Headset to Emma/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByTestId('history-redo-button')).toBeDisabled();
  });

  it('should trigger Undo via Ctrl+Z keyboard shortcut', () => {
    act(() => {
      useActivityStore.getState().logActivity({
        id: 'HIST-SHORTCUT-1',
        title: 'Registered New Monitor in Registry',
        entityName: 'Dell 27" 4K',
      });
    });

    renderHistoryPage();

    // Press Ctrl+Z
    fireEvent.keyDown(window, {
      key: 'z',
      ctrlKey: true,
      shiftKey: false,
    });

    // Confirmation modal opens
    const modal = screen.getByTestId('undo-confirm-modal');
    expect(modal).toBeInTheDocument();
    expect(within(modal).getByText('Registered New Monitor in Registry')).toBeInTheDocument();
  });

  it('should trigger Redo via Ctrl+Shift+Z keyboard shortcut', () => {
    act(() => {
      useActivityStore.getState().logActivity({
        id: 'HIST-SHORTCUT-2',
        title: 'Updated MacBook Pro Specifications',
        entityName: 'MacBook Pro 16"',
      });
      useActivityStore.getState().undo();
    });

    renderHistoryPage();

    expect(useActivityStore.getState().canRedo()).toBe(true);

    // Press Ctrl+Shift+Z
    fireEvent.keyDown(window, {
      key: 'z',
      ctrlKey: true,
      shiftKey: true,
    });

    expect(useActivityStore.getState().activities).toHaveLength(1);
    expect(
      screen.getAllByText(/Updated MacBook Pro Specifications/i).length,
    ).toBeGreaterThanOrEqual(1);
  });
});
