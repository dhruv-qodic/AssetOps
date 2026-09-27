import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DashboardHeader } from '../DashboardHeader';
import { useDashboardStore } from '@/store/useDashboardStore';

describe('DashboardHeader Component', () => {
  const mockOpenCustomization = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useDashboardStore.setState({
      openCustomization: mockOpenCustomization,
    });
  });

  it('should render header title and description', () => {
    render(<DashboardHeader />);

    expect(screen.getByText('AssetOps Dashboard')).toBeInTheDocument();
    expect(
      screen.getByText(/real-time overview of hardware inventory, operational health/i),
    ).toBeInTheDocument();
  });

  it('should render Customize button and call openCustomization when clicked', async () => {
    const user = userEvent.setup();
    render(<DashboardHeader />);

    const customizeBtn = screen.getByRole('button', { name: /customize/i });
    expect(customizeBtn).toBeInTheDocument();

    await user.click(customizeBtn);
    expect(mockOpenCustomization).toHaveBeenCalledTimes(1);
  });
});
