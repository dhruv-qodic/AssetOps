import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AssetFilterDropdown } from '../AssetFilterDropdown';
import { useAssetFilterStore, INITIAL_ASSET_FILTER_STATE } from '@/store/useAssetFilterStore';
import {
  useActiveAllocationFilterStore,
  INITIAL_ACTIVE_ALLOCATION_FILTER_STATE,
} from '@/store/useActiveAllocationFilterStore';
import { useAssetFilterPresetStore } from '@/store/useAssetFilterPresetStore';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe('AssetFilterDropdown Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAssetFilterStore.setState({
      ...INITIAL_ASSET_FILTER_STATE,
    });
    useActiveAllocationFilterStore.setState({
      ...INITIAL_ACTIVE_ALLOCATION_FILTER_STATE,
    });
    useAssetFilterPresetStore.setState({
      presets: [],
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render Filter button and toggle dropdown popup on click', () => {
    render(<AssetFilterDropdown />);

    const filterButton = screen.getByRole('button', { name: /Filter/i });
    expect(filterButton).toBeInTheDocument();

    // Click to open popup
    fireEvent.click(filterButton);

    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Category/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Status/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Department/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cost Range/i })).toBeInTheDocument();
  });

  it('should switch between tabs and allow selecting category filter checkboxes', () => {
    render(<AssetFilterDropdown />);

    fireEvent.click(screen.getByRole('button', { name: /Filter/i }));

    // By default Category tab is active
    expect(screen.getByText('Laptop')).toBeInTheDocument();
    expect(screen.getByText('Monitor')).toBeInTheDocument();

    const laptopCheckbox = screen.getByLabelText('Laptop');
    fireEvent.click(laptopCheckbox);

    expect(useAssetFilterStore.getState().selectedCategories).toContain('Laptop');
  });

  it('should allow selecting status filters', () => {
    render(<AssetFilterDropdown />);

    fireEvent.click(screen.getByRole('button', { name: /Filter/i }));

    // Click Status tab
    const statusTab = screen.getByRole('button', { name: /Status/i });
    fireEvent.click(statusTab);

    expect(screen.getByText('Available')).toBeInTheDocument();
    expect(screen.getByText('Allocated')).toBeInTheDocument();

    const availableCheckbox = screen.getByLabelText('Available');
    fireEvent.click(availableCheckbox);

    expect(useAssetFilterStore.getState().selectedStatuses).toContain('Available');
  });

  it('should allow setting cost range filters', () => {
    render(<AssetFilterDropdown />);

    fireEvent.click(screen.getByRole('button', { name: /Filter/i }));

    const costTab = screen.getByRole('button', { name: /Cost Range/i });
    fireEvent.click(costTab);

    expect(screen.getByPlaceholderText('0')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('5000')).toBeInTheDocument();

    const minInput = screen.getByPlaceholderText('0');
    fireEvent.change(minInput, { target: { value: '500' } });

    expect(useAssetFilterStore.getState().costRange.min).toBe(500);
  });

  it('should reset all filters when Reset button is clicked', () => {
    useAssetFilterStore.setState({
      selectedCategories: ['Laptop', 'Mobile'],
      selectedStatuses: ['Available'],
      costRange: { min: 200, max: null },
    });

    render(<AssetFilterDropdown />);

    fireEvent.click(screen.getByRole('button', { name: /Filter/i }));

    const resetBtn = screen.getByRole('button', { name: 'Reset all filters' });
    fireEvent.click(resetBtn);

    expect(useAssetFilterStore.getState().selectedCategories).toEqual([]);
    expect(useAssetFilterStore.getState().selectedStatuses).toEqual([]);
    expect(useAssetFilterStore.getState().costRange).toEqual({ min: null, max: null });
  });

  it('should allow selecting department filters', () => {
    render(<AssetFilterDropdown />);

    fireEvent.click(screen.getByRole('button', { name: /Filter/i }));

    const deptTab = screen.getByRole('button', { name: /Department/i });
    fireEvent.click(deptTab);

    expect(screen.getByText('IT')).toBeInTheDocument();
    const itCheckbox = screen.getByLabelText('IT');
    fireEvent.click(itCheckbox);

    expect(useAssetFilterStore.getState().selectedDepartments).toContain('IT');
  });

  it('should support allocations mode and update ActiveAllocationFilterStore', () => {
    render(<AssetFilterDropdown mode="allocations" />);

    fireEvent.click(screen.getByRole('button', { name: /Filter/i }));

    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Location$/i })).toBeInTheDocument();

    const laptopCheckbox = screen.getByLabelText('Laptop');
    fireEvent.click(laptopCheckbox);

    expect(useActiveAllocationFilterStore.getState().selectedCategories).toContain('Laptop');

    const locTab = screen.getByRole('button', { name: /^Location$/i });
    fireEvent.click(locTab);

    const nyCheckbox = screen.getByLabelText('New York Office');
    fireEvent.click(nyCheckbox);
    expect(useActiveAllocationFilterStore.getState().selectedLocations).toContain(
      'New York Office',
    );
  });
});
