import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import HistoryPage from '../HistoryPage';

const renderHistoryPage = () => {
  return render(
    <MemoryRouter>
      <HistoryPage />
    </MemoryRouter>,
  );
};

describe('HistoryPage Component', () => {
  beforeEach(() => {
    // any initial state if needed
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

  it('should render all 4 KPI cards with metrics for Total History, Asset, Employee, and Allocation actions', () => {
    renderHistoryPage();

    expect(screen.getByTestId('history-kpi-cards')).toBeInTheDocument();
    expect(screen.getByText('Total History')).toBeInTheDocument();
    expect(screen.getByText('Asset Actions')).toBeInTheDocument();
    expect(screen.getByText('Employee Actions')).toBeInTheDocument();
    expect(screen.getByText('Allocation Actions')).toBeInTheDocument();

    // Check KPI values
    expect(screen.getByText('1,248')).toBeInTheDocument();
    expect(screen.getByText('584')).toBeInTheDocument();
    expect(screen.getByText('312')).toBeInTheDocument();
    expect(screen.getByText('352')).toBeInTheDocument();
  });

  it('should render all four history tabs with unread/new count badges', () => {
    renderHistoryPage();

    const allTab = screen.getByRole('button', { name: /All History/i });
    const assetTab = screen.getByRole('button', { name: /Asset History/i });
    const employeeTab = screen.getByRole('button', { name: /Employee History/i });
    const allocationTab = screen.getByRole('button', { name: /Allocation History/i });

    expect(allTab).toBeInTheDocument();
    expect(assetTab).toBeInTheDocument();
    expect(employeeTab).toBeInTheDocument();
    expect(allocationTab).toBeInTheDocument();

    // Check badges
    expect(screen.getByText('5 New')).toBeInTheDocument();
    expect(screen.getAllByText('2 New').length).toBe(2); // Asset and Allocation have 2 New
    expect(screen.getByText('1 New')).toBeInTheDocument();
  });

  it('should filter records when clicking Asset History, Employee History, and Allocation History tabs', () => {
    renderHistoryPage();

    // Default All History shows items across categories
    expect(screen.getByText(/Allocated MacBook Pro 16" to Sarah Connor/i)).toBeInTheDocument();

    // Switch to Employee History
    const employeeTab = screen.getByRole('button', { name: /Employee History/i });
    fireEvent.click(employeeTab);

    expect(screen.getByText(/Onboarded John Doe to Engineering Team/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/Allocated MacBook Pro 16" to Sarah Connor/i),
    ).not.toBeInTheDocument();

    // Switch to Asset History
    const assetTab = screen.getByRole('button', { name: /Asset History/i });
    fireEvent.click(assetTab);

    expect(screen.getByText(/Registered iPhone 15 Pro in Asset Registry/i)).toBeInTheDocument();
    expect(screen.queryByText(/Onboarded John Doe to Engineering Team/i)).not.toBeInTheDocument();
  });

  it('should filter history records via search bar input', () => {
    renderHistoryPage();

    const searchInput = screen.getByPlaceholderText(
      /Search history by action, asset, employee, or actor.../i,
    );

    fireEvent.change(searchInput, { target: { value: 'iPhone 15 Pro' } });

    expect(screen.getByText(/Registered iPhone 15 Pro in Asset Registry/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/Allocated MacBook Pro 16" to Sarah Connor/i),
    ).not.toBeInTheDocument();
  });

  it('should open detail modal when clicking a history row or View button', () => {
    renderHistoryPage();

    const viewButton = screen.getByRole('button', { name: /View details for log HIST-1089/i });
    fireEvent.click(viewButton);

    expect(
      screen.getAllByText(/Allocated MacBook Pro 16" to Sarah Connor/i).length,
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Executed By (Actor)')).toBeInTheDocument();
    expect(screen.getAllByText('Admin User').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Action Attributes & Payload')).toBeInTheDocument();
  });
});
