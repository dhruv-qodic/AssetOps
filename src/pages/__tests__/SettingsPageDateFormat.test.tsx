import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SettingsPage from '../SettingsPage';
import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore } from '@/store/useThemeStore';
import { formatDate } from '@/utils/date';

const renderSettingsPage = (initialEntries = ['/settings']) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <SettingsPage />
    </MemoryRouter>,
  );

describe('SettingsPage Date Format Configuration', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({
      user: {
        id: 'usr_admin_01',
        name: 'Admin User',
        email: 'admin@assetops.com',
        role: 'ADMIN',
      },
      isAuthenticated: true,
    });
    useThemeStore.setState({
      currency: 'USD',
      theme: 'light',
      language: 'en',
      dateFormat: 'YYYY-MM-DD',
    });
  });

  describe('Date Format Tab Navigation', () => {
    it('should render the Date Format navigation tab in settings', () => {
      renderSettingsPage();
      expect(screen.getByTestId('settings-tab-dateFormat')).toBeInTheDocument();
    });

    it('should switch to Date Format tab when clicked', () => {
      renderSettingsPage();

      // Initially on Appearance tab
      expect(screen.getByTestId('theme-settings-section')).toBeInTheDocument();
      expect(screen.queryByTestId('date-format-settings-section')).not.toBeInTheDocument();

      // Click Date Format tab
      fireEvent.click(screen.getByTestId('settings-tab-dateFormat'));
      expect(screen.getByTestId('date-format-settings-section')).toBeInTheDocument();
      expect(screen.queryByTestId('theme-settings-section')).not.toBeInTheDocument();
    });

    it('should initialize Date Format tab when URL query param contains ?tab=dateFormat', () => {
      renderSettingsPage(['/settings?tab=dateFormat']);
      expect(screen.getByTestId('date-format-settings-section')).toBeInTheDocument();
    });
  });

  describe('Date Format Selection & Persistence', () => {
    it('should render all supported date format options in the grid', () => {
      renderSettingsPage(['/settings?tab=dateFormat']);

      expect(screen.getByTestId('date-format-option-YYYY-MM-DD')).toBeInTheDocument();
      expect(screen.getByTestId('date-format-option-DD/MM/YYYY')).toBeInTheDocument();
      expect(screen.getByTestId('date-format-option-MM/DD/YYYY')).toBeInTheDocument();
      expect(screen.getByTestId('date-format-option-DD-MM-YYYY')).toBeInTheDocument();
      expect(screen.getByTestId('date-format-option-MMM d, yyyy')).toBeInTheDocument();
      expect(screen.getByTestId('date-format-option-d MMM yyyy')).toBeInTheDocument();
      expect(screen.getByTestId('date-format-option-MMMM d, yyyy')).toBeInTheDocument();
    });

    it('should render live format preview matching the active format', () => {
      renderSettingsPage(['/settings?tab=dateFormat']);

      const previewElement = screen.getByTestId('date-format-live-preview');
      expect(previewElement).toBeInTheDocument();
      expect(previewElement.textContent).toBe(formatDate(new Date(), '-', 'YYYY-MM-DD'));
    });

    it('should update date format to DD/MM/YYYY when clicked', () => {
      renderSettingsPage(['/settings?tab=dateFormat']);

      const ddmmyyyyButton = screen.getByTestId('date-format-option-DD/MM/YYYY');
      fireEvent.click(ddmmyyyyButton);

      expect(useThemeStore.getState().dateFormat).toBe('DD/MM/YYYY');
      expect(localStorage.getItem('assetops_date_format')).toBe('DD/MM/YYYY');
    });

    it('should update date format to MMM d, yyyy when clicked', () => {
      renderSettingsPage(['/settings?tab=dateFormat']);

      const mmmButton = screen.getByTestId('date-format-option-MMM d, yyyy');
      fireEvent.click(mmmButton);

      expect(useThemeStore.getState().dateFormat).toBe('MMM d, yyyy');
      expect(localStorage.getItem('assetops_date_format')).toBe('MMM d, yyyy');
    });

    it('should display active date format in the header quick pill', () => {
      useThemeStore.setState({ dateFormat: 'DD/MM/YYYY' });
      renderSettingsPage();

      const quickPill = screen.getByTestId('quick-pill-date-format');
      expect(quickPill).toBeInTheDocument();
      expect(quickPill.textContent).toContain('DD/MM/YYYY');
    });

    it('should display active date format in Organization Information tab', () => {
      useThemeStore.setState({ dateFormat: 'MM/DD/YYYY' });
      renderSettingsPage(['/settings?tab=organization']);

      const orgFormatValue = screen.getByTestId('org-date-format-value');
      expect(orgFormatValue).toBeInTheDocument();
      expect(orgFormatValue.textContent).toContain('MM/DD/YYYY');
    });
  });
});
