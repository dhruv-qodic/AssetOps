import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { AssetHeader } from '../AssetHeader';
import { useAssetStore } from '@/store/useAssetStore';
import { useAssetFilterStore, INITIAL_ASSET_FILTER_STATE } from '@/store/useAssetFilterStore';
import { useAuthStore } from '@/store/useAuthStore';

describe('AssetHeader Component', () => {
  beforeEach(() => {
    useAssetFilterStore.setState({
      ...INITIAL_ASSET_FILTER_STATE,
    });
    useAssetStore.setState({
      filters: {
        search: '',
        category: 'All',
        status: 'All',
        location: 'All',
        sortBy: 'recently_added',
        page: 1,
        pageSize: 10,
      },
      isAddModalOpen: false,
      isImportModalOpen: false,
    });
    // Set default user role as admin with CREATE_ASSET permission
    useAuthStore.setState({
      user: {
        id: 'usr-1',
        name: 'Admin User',
        email: 'admin@assetops.com',
        role: 'ADMIN',
      },
    });
  });

  it('should render page title and subtitle', () => {
    render(<AssetHeader />);

    expect(screen.getByRole('heading', { name: 'Assets Management' })).toBeInTheDocument();
    expect(screen.getByText("Manage your company's assets with ease")).toBeInTheDocument();
  });

  it('should render search bar and update searchKeyword in filter store on typing', () => {
    render(<AssetHeader />);

    const searchInput = screen.getByPlaceholderText('Search keyword...');
    expect(searchInput).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: 'MacBook' } });
    expect(useAssetFilterStore.getState().searchKeyword).toBe('MacBook');
    expect(useAssetStore.getState().filters.page).toBe(1);
  });

  it('should show clear button when searchKeyword is present and clear it on click', () => {
    useAssetFilterStore.setState({ searchKeyword: 'Dell' });
    render(<AssetHeader />);

    const clearButton = screen.getByRole('button', { name: 'Clear search' });
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);
    expect(useAssetFilterStore.getState().searchKeyword).toBe('');
    expect(useAssetStore.getState().filters.page).toBe(1);
  });

  it('should open Add Asset modal when Add Asset button is clicked', () => {
    render(<AssetHeader />);

    const addBtn = screen.getByRole('button', { name: /Add Asset/i });
    fireEvent.click(addBtn);

    expect(useAssetStore.getState().isAddModalOpen).toBe(true);
  });

  it('should open Import modal when Import button is clicked', () => {
    render(<AssetHeader />);

    const importBtn = screen.getByRole('button', { name: /Import/i });
    fireEvent.click(importBtn);

    expect(useAssetStore.getState().isImportModalOpen).toBe(true);
  });

  it('should hide Add Asset and Import buttons if user lacks CREATE_ASSET permission', () => {
    useAuthStore.setState({
      user: {
        id: 'usr-2',
        name: 'Viewer User',
        email: 'viewer@assetops.com',
        role: 'VIEWER',
      },
    });

    render(<AssetHeader />);

    expect(screen.queryByRole('button', { name: /Add Asset/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Import/i })).not.toBeInTheDocument();
  });
});
