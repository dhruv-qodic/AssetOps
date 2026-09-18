import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AssetVisualizer } from '../AssetVisualizer';
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

describe('AssetVisualizer Row Selection', () => {
  it('should highlight row when clicked and update selection state', async () => {
    const user = userEvent.setup();
    render(<AssetVisualizer assets={MOCK_ASSETS} />);

    // Find row for A1001
    const firstRowText = screen.getByText('A1001');
    const firstRow = firstRowText.closest('[data-selected]') as HTMLElement;
    expect(firstRow).toBeInTheDocument();
    expect(firstRow).toHaveAttribute('data-selected', 'false');

    // Click the row
    await user.click(firstRowText);

    // Row should now be selected and highlighted
    expect(firstRow).toHaveAttribute('data-selected', 'true');
    expect(firstRow).toHaveAttribute('aria-selected', 'true');
    expect(firstRow.className).toContain('border-l-blue-600');
    expect(screen.getByText('1 row selected')).toBeInTheDocument();
  });

  it('should deselect a row when clicked a second time', async () => {
    const user = userEvent.setup();
    render(<AssetVisualizer assets={MOCK_ASSETS} />);

    const firstRowText = screen.getByText('A1001');
    const firstRow = firstRowText.closest('[data-selected]') as HTMLElement;

    // Click once to select
    await user.click(firstRowText);
    expect(firstRow).toHaveAttribute('data-selected', 'true');

    // Click again to deselect
    await user.click(firstRowText);
    expect(firstRow).toHaveAttribute('data-selected', 'false');
    expect(screen.queryByText('1 row selected')).not.toBeInTheDocument();
  });

  it('should select new row and deselect old row when a different row is clicked', async () => {
    const user = userEvent.setup();
    render(<AssetVisualizer assets={MOCK_ASSETS} />);

    const firstRowText = screen.getByText('A1001');
    const secondRowText = screen.getByText('A1002');
    const firstRow = firstRowText.closest('[data-selected]') as HTMLElement;
    const secondRow = secondRowText.closest('[data-selected]') as HTMLElement;

    // Select first row
    await user.click(firstRowText);
    expect(firstRow).toHaveAttribute('data-selected', 'true');
    expect(secondRow).toHaveAttribute('data-selected', 'false');

    // Click second row
    await user.click(secondRowText);
    expect(firstRow).toHaveAttribute('data-selected', 'false');
    expect(secondRow).toHaveAttribute('data-selected', 'true');
  });
});
