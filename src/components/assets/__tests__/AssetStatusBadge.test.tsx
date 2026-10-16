import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AssetStatusBadge } from '../AssetStatusBadge';
import type { AssetStatus } from '@/types/asset';

describe('AssetStatusBadge Component', () => {
  it('should render correct label and styles for Allocated status', () => {
    render(<AssetStatusBadge status="Allocated" />);
    const badge = screen.getByText('Allocated');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('text-[#1FA653]');
  });

  it('should render correct label and styles for Available status', () => {
    render(<AssetStatusBadge status="Available" />);
    const badge = screen.getByText('Available');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('text-[#2F6FEB]');
  });

  it('should render correct label and styles for Maintenance status', () => {
    render(<AssetStatusBadge status="Maintenance" />);
    const badge = screen.getByText('Maintenance');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('text-[#E08A1E]');
  });

  it('should render correct label and styles for Retired status', () => {
    render(<AssetStatusBadge status="Retired" />);
    const badge = screen.getByText('Retired');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('text-slate-600');
  });

  it('should render correct label and styles for Lost status', () => {
    render(<AssetStatusBadge status="Lost" />);
    const badge = screen.getByText('Lost');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('text-rose-600');
  });

  it('should fallback to default styles for unrecognized status', () => {
    render(<AssetStatusBadge status={'Unknown' as AssetStatus} />);
    const badge = screen.getByText('Unknown');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-slate-100');
  });

  it('should allow custom className overrides', () => {
    render(<AssetStatusBadge status="Available" className="my-custom-badge" />);
    const badge = screen.getByText('Available');
    expect(badge).toHaveClass('my-custom-badge');
  });
});
