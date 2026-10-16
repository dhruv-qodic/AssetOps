import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { EmployeePagination } from '../EmployeePagination';
import { useEmployeeStore } from '@/store/useEmployeeStore';

describe('EmployeePagination Component', () => {
  beforeEach(() => {
    useEmployeeStore.getState().resetFilters();
  });

  it('should render pagination range and total count with employee entity label', () => {
    render(
      <EmployeePagination
        totalFiltered={25}
        startIndex={1}
        endIndex={10}
        totalPages={3}
        currentPage={1}
      />,
    );

    expect(screen.getByText(/employees/i)).toHaveTextContent('Showing 1 to 10 of 25 employees');
  });

  it('should update store page when clicking page 2 button', () => {
    render(
      <EmployeePagination
        totalFiltered={25}
        startIndex={1}
        endIndex={10}
        totalPages={3}
        currentPage={1}
      />,
    );

    const page2Btn = screen.getByRole('button', { name: '2' });
    fireEvent.click(page2Btn);

    expect(useEmployeeStore.getState().filters.page).toBe(2);
  });
});
