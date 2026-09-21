import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ColumnVisibilityModal } from '../ColumnVisibilityModal';
import { AVAILABLE_ASSET_COLUMNS } from '@/constans/asset.constants';
import { useColumnVisibilityStore } from '@/store/useColumnVisibilityStore';

describe('ColumnVisibilityModal Component', () => {
  beforeEach(() => {
    useColumnVisibilityStore.getState().resetToDefault();
  });

  it('should render dialog title, description, and action buttons when open', () => {
    const handleClose = vi.fn();
    render(<ColumnVisibilityModal isOpen={true} onClose={handleClose} />);

    expect(screen.getByRole('heading', { name: /column visibility/i })).toBeInTheDocument();
    expect(
      screen.getByText(/select and manage which data columns are displayed/i),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /done/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('should display initial default selected columns in the top selected area', () => {
    render(<ColumnVisibilityModal isOpen={true} onClose={vi.fn()} />);

    // Default visible columns include Asset ID, Asset Name, Category, Status, Location, etc.
    const defaultCols = AVAILABLE_ASSET_COLUMNS.filter((c) => c.defaultVisible);

    // Selected columns count header
    expect(
      screen.getByText(new RegExp(`Selected Columns \\(${defaultCols.length}\\)`, 'i')),
    ).toBeInTheDocument();

    // Verify chips in selected area
    defaultCols.forEach((col) => {
      expect(screen.getAllByText(col.label).length).toBeGreaterThanOrEqual(1);
    });
  });

  it('should allow adding an unselected column to the top selected area when clicked', async () => {
    const user = userEvent.setup();
    render(<ColumnVisibilityModal isOpen={true} onClose={vi.fn()} />);

    // Serial Number is defaultVisible: false
    const initialSelectedCount = AVAILABLE_ASSET_COLUMNS.filter((c) => c.defaultVisible).length;
    expect(
      screen.getByText(new RegExp(`Selected Columns \\(${initialSelectedCount}\\)`, 'i')),
    ).toBeInTheDocument();

    // Click on Serial Number card
    const serialNumberCard = screen
      .getByText('Serial Number')
      .closest('div[class*="cursor-pointer"]');
    expect(serialNumberCard).toBeInTheDocument();
    if (serialNumberCard) {
      await user.click(serialNumberCard);
    }

    // Count should now be +1
    expect(
      screen.getByText(new RegExp(`Selected Columns \\(${initialSelectedCount + 1}\\)`, 'i')),
    ).toBeInTheDocument();
  });

  it('should remove a column from top selected area when its remove X button is clicked', async () => {
    const user = userEvent.setup();
    render(<ColumnVisibilityModal isOpen={true} onClose={vi.fn()} />);

    const initialSelectedCount = AVAILABLE_ASSET_COLUMNS.filter((c) => c.defaultVisible).length;

    // Find remove button for "Asset ID"
    const removeAssetIdBtn = screen.getByTitle(/remove asset id/i);
    await user.click(removeAssetIdBtn);

    // Count should now be -1
    expect(
      screen.getByText(new RegExp(`Selected Columns \\(${initialSelectedCount - 1}\\)`, 'i')),
    ).toBeInTheDocument();
  });

  it('should clear all selected columns when Clear all button is clicked', async () => {
    const user = userEvent.setup();
    render(<ColumnVisibilityModal isOpen={true} onClose={vi.fn()} />);

    const clearAllBtn = screen.getByRole('button', { name: /clear all/i });
    await user.click(clearAllBtn);

    expect(screen.getByText(/selected columns \(0\)/i)).toBeInTheDocument();
    expect(
      screen.getByText(/no columns selected\. click columns below to add them to this list\./i),
    ).toBeInTheDocument();
  });

  it('should reset to default columns when Reset Default button is clicked', async () => {
    const user = userEvent.setup();
    render(<ColumnVisibilityModal isOpen={true} onClose={vi.fn()} />);

    const defaultCount = AVAILABLE_ASSET_COLUMNS.filter((c) => c.defaultVisible).length;

    // Clear all first
    const clearAllBtn = screen.getByRole('button', { name: /clear all/i });
    await user.click(clearAllBtn);
    expect(screen.getByText(/selected columns \(0\)/i)).toBeInTheDocument();

    // Click reset default
    const resetDefaultBtn = screen.getByRole('button', { name: /reset default/i });
    await user.click(resetDefaultBtn);
    expect(
      screen.getByText(new RegExp(`selected columns \\(${defaultCount}\\)`, 'i')),
    ).toBeInTheDocument();
  });

  it('should filter available columns when searching by name', async () => {
    const user = userEvent.setup();
    render(<ColumnVisibilityModal isOpen={true} onClose={vi.fn()} />);

    const searchInput = screen.getByPlaceholderText(/search available columns/i);
    await user.type(searchInput, 'Warranty');

    expect(screen.getByText('Warranty Expiry')).toBeInTheDocument();
    expect(screen.queryByText('Serial Number')).not.toBeInTheDocument();
  });

  it('should call onClose when Cancel or Done button is clicked', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(<ColumnVisibilityModal isOpen={true} onClose={handleClose} />);

    const doneBtn = screen.getByRole('button', { name: /done/i });
    await user.click(doneBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
