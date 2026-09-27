import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AssetListPage from '../AssetListPage';
import { useAssetStore } from '@/store/useAssetStore';
import { useAssetFilterStore, INITIAL_ASSET_FILTER_STATE } from '@/store/useAssetFilterStore';
import { MOCK_ASSETS } from '@/mocks/seed/assets';

vi.mock('@tanstack/react-virtual', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-virtual')>();
  return {
    ...actual,
    useVirtualizer: ({ count }: { count: number }) => ({
      getTotalSize: () => count * 56,
      getVirtualItems: () =>
        Array.from({ length: Math.min(count, 15) }, (_, index) => ({
          index,
          start: index * 56,
          size: 56,
          key: index,
        })),
    }),
  };
});

const renderAssetListPage = () => {
  return render(
    <MemoryRouter>
      <AssetListPage />
    </MemoryRouter>,
  );
};

describe('AssetListPage Component with Multi-Facet Filtering', () => {
  beforeEach(() => {
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

  it('should render Asset List page header, filter panel, and table', () => {
    renderAssetListPage();

    expect(screen.getByText('Assets Management')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search keyword...')).toBeInTheDocument();

    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Department')).toBeInTheDocument();
    expect(screen.getByText('Cost Range')).toBeInTheDocument();
  });

  it('should filter asset records when typing in search keyword', async () => {
    renderAssetListPage();

    const searchInput = screen.getByPlaceholderText('Search keyword...');

    fireEvent.change(searchInput, {
      target: { value: 'iPhone 15' },
    });

    // Pending indicator appears while search is debouncing/deferred.
    expect(screen.getByTestId('asset-filtering-indicator')).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.queryByText('Dell Laptop')).not.toBeInTheDocument();
        expect(screen.getByText('iPhone 15')).toBeInTheDocument();

        expect(screen.queryByTestId('asset-filtering-indicator')).not.toBeInTheDocument();
      },
      { timeout: 1500 },
    );
  });

  it('should filter assets when selecting category checkbox', () => {
    renderAssetListPage();

    const laptopCheckbox = screen.getByRole('checkbox', {
      name: 'Laptop',
    });

    fireEvent.click(laptopCheckbox);

    expect(useAssetFilterStore.getState().selectedCategories).toContain('Laptop');

    const { allFilteredAssets } = useAssetStore.getState().getFilteredAssets();

    expect(allFilteredAssets.length).toBeGreaterThan(0);

    expect(allFilteredAssets.every((asset) => asset.category === 'Laptop')).toBe(true);
  });

  it('should show empty state when filters yield no matches and allow clearing', async () => {
    renderAssetListPage();

    const searchInput = screen.getByPlaceholderText('Search keyword...');

    fireEvent.change(searchInput, {
      target: {
        value: 'non_existing_random_xyz_asset_query_123',
      },
    });

    await waitFor(
      () => {
        expect(screen.getByText('No assets found')).toBeInTheDocument();
      },
      { timeout: 1500 },
    );

    const clearButton = screen.getByRole('button', {
      name: /clear filters/i,
    });

    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);

    expect(useAssetFilterStore.getState().searchKeyword).toBe('');

    await waitFor(() => {
      expect(screen.queryByText('No assets found')).not.toBeInTheDocument();
    });
  });

  it('should clear all filters when reset button is clicked in Filter Panel', () => {
    renderAssetListPage();

    const searchInput = screen.getByPlaceholderText('Search keyword...');

    fireEvent.change(searchInput, {
      target: { value: 'Laptop' },
    });

    const resetButton = screen.getByRole('button', {
      name: 'Reset',
    });

    expect(resetButton).toBeInTheDocument();

    fireEvent.click(resetButton);

    expect(useAssetFilterStore.getState().searchKeyword).toBe('');
  });

  it('should render pending indicator in visualizer mode when filtering is deferred', async () => {
    useAssetStore.setState({
      viewMode: 'virtualized',
    });

    renderAssetListPage();

    const searchInput = screen.getByPlaceholderText('Search keyword...');

    fireEvent.change(searchInput, {
      target: { value: 'MacBook' },
    });

    expect(screen.getByTestId('visualizer-pending-indicator')).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.queryByTestId('visualizer-pending-indicator')).not.toBeInTheDocument();
      },
      { timeout: 2500 },
    );
  });
});
