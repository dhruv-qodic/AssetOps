import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import AssetListPage from '../AssetListPage';
import { useAssetStore } from '@/store/useAssetStore';
import { useAssetFilterStore, INITIAL_ASSET_FILTER_STATE } from '@/store/useAssetFilterStore';
import { MOCK_ASSETS } from '@/mocks/seed/assets';

describe('AssetListPage Component with Multi-Facet Filtering', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useAssetStore.setState({
      assets: [...MOCK_ASSETS],
      isLoading: false,
      error: null,
      viewMode: 'table',
      filters: {
        search: '',
        category: 'All',
        status: 'All',
        location: 'All',
        sortBy: 'recently_added',
        page: 1,
        pageSize: 10,
      },
    });
    useAssetFilterStore.setState({
      ...INITIAL_ASSET_FILTER_STATE,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render Asset List page header, filter panel, and table', () => {
    render(<AssetListPage />);

    expect(screen.getByText('Assets Management')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search keyword...')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Department')).toBeInTheDocument();
    expect(screen.getByText('Cost Range')).toBeInTheDocument();
  });

  it('should filter asset records when typing in search keyword after debounce delay', () => {
    render(<AssetListPage />);

    const searchInput = screen.getByPlaceholderText('Search keyword...');
    fireEvent.change(searchInput, { target: { value: 'iPhone 15' } });

    // Advance fake timers past 300ms debounce
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByText('iPhone 15')).toBeInTheDocument();
    expect(screen.queryByText('Dell Laptop')).not.toBeInTheDocument();
  });

  it('should filter assets when selecting category checkbox', () => {
    render(<AssetListPage />);

    const laptopCheckbox = screen.getByRole('checkbox', { name: 'Laptop' });
    fireEvent.click(laptopCheckbox);

    expect(useAssetFilterStore.getState().selectedCategories).toContain('Laptop');

    const { allFilteredAssets } = useAssetStore.getState().getFilteredAssets();
    expect(allFilteredAssets.length).toBeGreaterThan(0);
    expect(allFilteredAssets.every((a) => a.category === 'Laptop')).toBe(true);
  });

  it('should show empty state when filters yield no matches and allow clearing', () => {
    render(<AssetListPage />);

    const searchInput = screen.getByPlaceholderText('Search keyword...');
    fireEvent.change(searchInput, { target: { value: 'non_existing_random_xyz_asset_query_123' } });

    // Advance fake timers past 300ms debounce
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByText('No assets found')).toBeInTheDocument();
    const clearButton = screen.getByRole('button', { name: /clear filters/i });
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(useAssetFilterStore.getState().searchKeyword).toBe('');
    expect(screen.queryByText('No assets found')).not.toBeInTheDocument();
  });

  it('should clear all filters when reset button is clicked in Filter Panel', () => {
    render(<AssetListPage />);

    const searchInput = screen.getByPlaceholderText('Search keyword...');
    fireEvent.change(searchInput, { target: { value: 'Laptop' } });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    const resetButton = screen.getByRole('button', { name: /reset/i });
    expect(resetButton).toBeInTheDocument();

    fireEvent.click(resetButton);

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(useAssetFilterStore.getState().searchKeyword).toBe('');
  });
});
