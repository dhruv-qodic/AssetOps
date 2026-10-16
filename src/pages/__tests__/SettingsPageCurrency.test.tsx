import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SettingsPage from '../SettingsPage';
import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore } from '@/store/useThemeStore';

const renderSettingsPage = (initialEntries = ['/settings']) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <SettingsPage />
    </MemoryRouter>,
  );

describe('SettingsPage Tabs & Currency Configuration', () => {
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
    });
  });

  describe('Tab Navigation', () => {
    it('should render all settings navigation tabs', () => {
      renderSettingsPage();

      expect(screen.getByTestId('settings-tab-appearance')).toBeInTheDocument();
      expect(screen.getByTestId('settings-tab-language')).toBeInTheDocument();
      expect(screen.getByTestId('settings-tab-currency')).toBeInTheDocument();
      expect(screen.getByTestId('settings-tab-organization')).toBeInTheDocument();
    });

    it('should switch between tabs and show corresponding content below', () => {
      renderSettingsPage();

      // Default active tab is Appearance
      expect(screen.getByTestId('theme-settings-section')).toBeInTheDocument();
      expect(screen.queryByTestId('language-settings-section')).not.toBeInTheDocument();

      // Click Language tab
      fireEvent.click(screen.getByTestId('settings-tab-language'));
      expect(screen.getByTestId('language-settings-section')).toBeInTheDocument();
      expect(screen.queryByTestId('theme-settings-section')).not.toBeInTheDocument();

      // Click Currency tab
      fireEvent.click(screen.getByTestId('settings-tab-currency'));
      expect(screen.getByTestId('currency-settings-section')).toBeInTheDocument();
      expect(screen.queryByTestId('language-settings-section')).not.toBeInTheDocument();

      // Click Organization tab
      fireEvent.click(screen.getByTestId('settings-tab-organization'));
      expect(screen.getByTestId('org-settings-section')).toBeInTheDocument();
      expect(screen.queryByTestId('currency-settings-section')).not.toBeInTheDocument();
    });

    it('should initialize active tab from URL query parameter', () => {
      renderSettingsPage(['/settings?tab=currency']);

      expect(screen.getByTestId('currency-settings-section')).toBeInTheDocument();
      expect(screen.queryByTestId('theme-settings-section')).not.toBeInTheDocument();
    });

    it('should render language options and allow switching language in language tab', () => {
      renderSettingsPage(['/settings?tab=language']);

      expect(screen.getByTestId('language-settings-section')).toBeInTheDocument();
      expect(screen.getByTestId('language-option-en')).toBeInTheDocument();
      expect(screen.getByTestId('language-option-gu')).toBeInTheDocument();
      expect(screen.getByTestId('language-option-hi')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('language-option-gu'));
      expect(useThemeStore.getState().language).toBe('gu');
    });
  });

  describe('Currency Selection', () => {
    it('should render the Currency Preference section with all supported options', () => {
      renderSettingsPage(['/settings?tab=currency']);

      expect(screen.getByTestId('currency-settings-section')).toBeInTheDocument();
      expect(screen.getByTestId('currency-option-USD')).toBeInTheDocument();
      expect(screen.getByTestId('currency-option-INR')).toBeInTheDocument();
      expect(screen.getByTestId('currency-option-EUR')).toBeInTheDocument();
      expect(screen.getByTestId('currency-option-GBP')).toBeInTheDocument();
    });

    it('should update currency to INR when INR option is clicked', () => {
      renderSettingsPage(['/settings?tab=currency']);

      const inrButton = screen.getByTestId('currency-option-INR');
      fireEvent.click(inrButton);

      expect(useThemeStore.getState().currency).toBe('INR');
      expect(localStorage.getItem('assetops_currency')).toBe('INR');
    });

    it('should switch back to USD when USD option is clicked', () => {
      useThemeStore.setState({ currency: 'INR' });
      renderSettingsPage(['/settings?tab=currency']);

      const usdButton = screen.getByTestId('currency-option-USD');
      fireEvent.click(usdButton);

      expect(useThemeStore.getState().currency).toBe('USD');
      expect(localStorage.getItem('assetops_currency')).toBe('USD');
    });

    it('should display active currency in Organization Information card', () => {
      useThemeStore.setState({ currency: 'INR' });
      renderSettingsPage(['/settings?tab=organization']);

      expect(screen.getByText(/INR \(₹\)/i)).toBeInTheDocument();
    });
  });
});
