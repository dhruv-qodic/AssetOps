import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DashboardCustomizationModal } from '../DashboardCustomizationModal';
import { useDashboardStore } from '@/store/useDashboardStore';

describe('DashboardCustomizationModal Component', () => {
  const mockOnClose = vi.fn();
  const mockToggleCard = vi.fn();
  const mockToggleWidget = vi.fn();
  const mockResetLayoutToDefault = vi.fn();
  const mockSelectAllCardsAndWidgets = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useDashboardStore.setState({
      visibleCardIds: ['total_assets', 'available_assets'],
      visibleWidgetIds: ['activity_stream'],
      toggleCard: mockToggleCard,
      toggleWidget: mockToggleWidget,
      resetLayoutToDefault: mockResetLayoutToDefault,
      selectAllCardsAndWidgets: mockSelectAllCardsAndWidgets,
    });
  });

  it('should render dialog title, description, and action buttons when open', () => {
    render(<DashboardCustomizationModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText('Customize Dashboard Layout & Widgets')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search metrics and charts...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset defaults/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /apply & done/i })).toBeInTheDocument();
  });

  it('should filter cards and widgets when typing into search input', async () => {
    const user = userEvent.setup();
    render(<DashboardCustomizationModal isOpen={true} onClose={mockOnClose} />);

    const searchInput = screen.getByPlaceholderText('Search metrics and charts...');
    await user.type(searchInput, 'Total Assets');

    expect(screen.getByText('Total Assets')).toBeInTheDocument();
    expect(screen.queryByText('Maintenance Assets')).not.toBeInTheDocument();
  });

  it('should trigger resetLayoutToDefault when Reset Defaults button is clicked', async () => {
    const user = userEvent.setup();
    render(<DashboardCustomizationModal isOpen={true} onClose={mockOnClose} />);

    const resetBtn = screen.getByRole('button', { name: /reset defaults/i });
    await user.click(resetBtn);

    expect(mockResetLayoutToDefault).toHaveBeenCalledTimes(1);
  });

  it('should trigger selectAllCardsAndWidgets when Show All button is clicked', async () => {
    const user = userEvent.setup();
    render(<DashboardCustomizationModal isOpen={true} onClose={mockOnClose} />);

    const showAllBtn = screen.getByRole('button', { name: /show all/i });
    await user.click(showAllBtn);

    expect(mockSelectAllCardsAndWidgets).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when Apply & Done is clicked', async () => {
    const user = userEvent.setup();
    render(<DashboardCustomizationModal isOpen={true} onClose={mockOnClose} />);

    const applyBtn = screen.getByRole('button', { name: /apply & done/i });
    await user.click(applyBtn);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
