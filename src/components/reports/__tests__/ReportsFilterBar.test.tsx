import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReportsFilterBar } from '../ReportsFilterBar';

describe('ReportsFilterBar Component', () => {
  const defaultProps = {
    reportType: 'Asset Overview',
    setReportType: vi.fn(),
    timeRange: 'Last 30 Days',
    setTimeRange: vi.fn(),
    department: 'All',
    setDepartment: vi.fn(),
    onGenerateReport: vi.fn(),
  };

  it('should render filter labels and Generate Report button', () => {
    render(<ReportsFilterBar {...defaultProps} />);

    expect(screen.getByText('Report Type')).toBeInTheDocument();
    expect(screen.getByText('Time Range')).toBeInTheDocument();
    expect(screen.getByText('Department')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate report/i })).toBeInTheDocument();
  });

  it('should call onGenerateReport when Generate Report button is clicked', async () => {
    const user = userEvent.setup();
    const handleGenerate = vi.fn();

    render(<ReportsFilterBar {...defaultProps} onGenerateReport={handleGenerate} />);

    const generateBtn = screen.getByRole('button', { name: /generate report/i });
    await user.click(generateBtn);

    expect(handleGenerate).toHaveBeenCalledTimes(1);
  });
});
