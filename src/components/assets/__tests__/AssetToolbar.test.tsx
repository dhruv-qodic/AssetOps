import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { AssetToolbar } from '../AssetToolbar';
import { useAssetStore } from '@/store/useAssetStore';
import { useAssetFilterStore, INITIAL_ASSET_FILTER_STATE } from '@/store/useAssetFilterStore';

describe('AssetToolbar Component', () => {
  beforeEach(() => {
    useAssetStore.setState({
      viewMode: 'table',
      assets: [],
    });
    useAssetFilterStore.setState({
      ...INITIAL_ASSET_FILTER_STATE,
    });
  });

  it('should render total record count badge', () => {
    render(<AssetToolbar totalCount={42} />);

    expect(screen.getByText('Asset Records')).toBeInTheDocument();
    expect(screen.getByText('42 assets')).toBeInTheDocument();
  });

  it('should render singular asset count when totalCount is 1', () => {
    render(<AssetToolbar totalCount={1} />);

    expect(screen.getByText('1 asset')).toBeInTheDocument();
  });

  it('should show filtering indicator when isPending is true', () => {
    render(<AssetToolbar totalCount={10} isPending={true} />);

    expect(screen.getByTestId('asset-filtering-indicator')).toBeInTheDocument();
    expect(screen.getByText('Filtering...')).toBeInTheDocument();
  });

  it('should switch view modes between Table, Visualizer, and Hierarchy', () => {
    render(<AssetToolbar totalCount={10} />);

    const visualizerBtn = screen.getByRole('button', { name: /Visualizer/i });
    fireEvent.click(visualizerBtn);
    expect(useAssetStore.getState().viewMode).toBe('virtualized');

    const hierarchyBtn = screen.getByRole('button', { name: /Hierarchy/i });
    fireEvent.click(hierarchyBtn);
    expect(useAssetStore.getState().viewMode).toBe('tree');

    const tableBtn = screen.getByRole('button', { name: /Table/i });
    fireEvent.click(tableBtn);
    expect(useAssetStore.getState().viewMode).toBe('table');
  });

  it('should show Columns button in table view and open Column Visibility modal on click', () => {
    render(<AssetToolbar totalCount={10} />);

    const columnsBtn = screen.getByRole('button', { name: /Columns/i });
    expect(columnsBtn).toBeInTheDocument();

    fireEvent.click(columnsBtn);
    expect(screen.getByRole('heading', { name: /Column Visibility/i })).toBeInTheDocument();
  });
});
