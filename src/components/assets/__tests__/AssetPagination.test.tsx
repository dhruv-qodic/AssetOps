import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { AssetPagination } from '../AssetPagination';
import { useAssetStore } from '@/store/useAssetStore';

describe('AssetPagination Component', () => {
  beforeEach(() => {
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
    });
  });

  it('should render pagination text with item ranges and entity label', () => {
    const { container } = render(
      <AssetPagination
        totalFiltered={25}
        startIndex={1}
        endIndex={10}
        totalPages={3}
        currentPage={1}
      />,
    );

    expect(container).toHaveTextContent('Showing 1 to 10 of 25 assets');
  });

  it('should call setPage in useAssetStore when page button is clicked', () => {
    render(
      <AssetPagination
        totalFiltered={25}
        startIndex={1}
        endIndex={10}
        totalPages={3}
        currentPage={1}
      />,
    );

    const nextButton = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);

    expect(useAssetStore.getState().filters.page).toBe(2);
  });
});
