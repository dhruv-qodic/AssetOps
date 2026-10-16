import { describe, it, expect, beforeEach } from 'vitest';
import i18n, { defaultNS, fallbackLng, supportedLanguages } from '../index';
import enAuth from '@/locales/en/auth';
import enAsset from '@/locales/en/asset';
import enEmployee from '@/locales/en/employee';
import enAllocation from '@/locales/en/allocation';
import enReport from '@/locales/en/report';
import enHistory from '@/locales/en/history';
import enDashboard from '@/locales/en/dashboard';
import enSetting from '@/locales/en/setting';

import guAuth from '@/locales/gu/auth';
import guAsset from '@/locales/gu/asset';
import guEmployee from '@/locales/gu/employee';
import guAllocation from '@/locales/gu/allocation';
import guReport from '@/locales/gu/report';
import guHistory from '@/locales/gu/history';
import guDashboard from '@/locales/gu/dashboard';
import guSetting from '@/locales/gu/setting';

import hiAuth from '@/locales/hi/auth';
import hiAsset from '@/locales/hi/asset';
import hiEmployee from '@/locales/hi/employee';
import hiAllocation from '@/locales/hi/allocation';
import hiReport from '@/locales/hi/report';
import hiHistory from '@/locales/hi/history';
import hiDashboard from '@/locales/hi/dashboard';
import hiSetting from '@/locales/hi/setting';

import { useThemeStore } from '@/store/useThemeStore';

/**
 * Helper to recursively extract all keys from a nested object
 */
function extractKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  let keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      keys = keys.concat(extractKeys(value as Record<string, unknown>, fullPath));
    } else {
      keys.push(fullPath);
    }
  }
  return keys.sort();
}

describe('AssetOps Multilingual i18n System', () => {
  beforeEach(async () => {
    localStorage.clear();
    await i18n.changeLanguage('en');
  });

  describe('1. Initialization & Defaults', () => {
    it('initializes i18next instance successfully', () => {
      expect(i18n.isInitialized).toBe(true);
    });

    it('sets English as the default and fallback language', () => {
      expect(fallbackLng).toBe('en');
      expect(i18n.language).toBe('en');
      expect(defaultNS).toBe('setting');
    });

    it('registers all 3 supported languages: English, Gujarati, Hindi', () => {
      expect(supportedLanguages).toEqual(['en', 'gu', 'hi']);
    });
  });

  describe('2. All 8 Namespaces Key Consistency Across en, gu, and hi', () => {
    const namespaces = [
      { name: 'auth', en: enAuth, gu: guAuth, hi: hiAuth },
      { name: 'asset', en: enAsset, gu: guAsset, hi: hiAsset },
      { name: 'employee', en: enEmployee, gu: guEmployee, hi: hiEmployee },
      { name: 'allocation', en: enAllocation, gu: guAllocation, hi: hiAllocation },
      { name: 'report', en: enReport, gu: guReport, hi: hiReport },
      { name: 'history', en: enHistory, gu: guHistory, hi: hiHistory },
      { name: 'dashboard', en: enDashboard, gu: guDashboard, hi: hiDashboard },
      { name: 'setting', en: enSetting, gu: guSetting, hi: hiSetting },
    ];

    namespaces.forEach(({ name, en, gu, hi }) => {
      it(`namespace "${name}" has consistent keys across English, Gujarati, and Hindi`, () => {
        const enKeys = extractKeys(en);
        const guKeys = extractKeys(gu);
        const hiKeys = extractKeys(hi);

        expect(enKeys.length).toBeGreaterThan(0);
        expect(guKeys).toEqual(enKeys);
        expect(hiKeys).toEqual(enKeys);
      });
    });
  });

  describe('3. Dynamic Language Switching & Immediate UI Strings Update', () => {
    it('returns natural Gujarati translations when language changes to "gu"', async () => {
      await i18n.changeLanguage('gu');
      expect(i18n.language).toBe('gu');

      // Auth
      expect(i18n.t('login.title', { ns: 'auth' })).toBe('પુનઃ સ્વાગત છે');
      expect(i18n.t('login.submitButton', { ns: 'auth' })).toBe('સાઇન ઇન');

      // Asset
      expect(i18n.t('title', { ns: 'asset' })).toBe('સંપત્તિ વ્યવસ્થાપન');
      expect(i18n.t('addAsset', { ns: 'asset' })).toBe('નવી સંપત્તિ ઉમેરો');

      // Setting
      expect(i18n.t('language.title', { ns: 'setting' })).toBe('ભાષા પસંદગી');
    });

    it('returns natural Hindi translations when language changes to "hi"', async () => {
      await i18n.changeLanguage('hi');
      expect(i18n.language).toBe('hi');

      // Auth
      expect(i18n.t('login.title', { ns: 'auth' })).toBe('वापसी पर स्वागत है');
      expect(i18n.t('login.submitButton', { ns: 'auth' })).toBe('साइन इन करें');

      // Asset
      expect(i18n.t('title', { ns: 'asset' })).toBe('परिसंपत्ति प्रबंधन');
      expect(i18n.t('addAsset', { ns: 'asset' })).toBe('परिसंपत्ति जोड़ें');

      // Setting
      expect(i18n.t('language.title', { ns: 'setting' })).toBe('भाषा प्राथमिकता');
    });

    it('interpolates dynamic variables in translations properly', async () => {
      await i18n.changeLanguage('en');
      expect(i18n.t('toasts.created', { ns: 'asset', name: 'MacBook Pro' })).toBe(
        'Asset MacBook Pro has been created successfully',
      );

      await i18n.changeLanguage('gu');
      expect(i18n.t('toasts.created', { ns: 'asset', name: 'MacBook Pro' })).toBe(
        'સંપત્તિ MacBook Pro સફળતાપૂર્વક ઉમેરવામાં આવી',
      );

      await i18n.changeLanguage('hi');
      expect(i18n.t('toasts.created', { ns: 'asset', name: 'MacBook Pro' })).toBe(
        'संपत्ति MacBook Pro सफलतापूर्वक बनाई गई',
      );
    });
  });

  describe('4. ThemeStore and LocalStorage Language Persistence', () => {
    it('synchronizes language changes via useThemeStore and persists to localStorage', () => {
      const { setLanguage } = useThemeStore.getState();

      setLanguage('gu');
      expect(useThemeStore.getState().language).toBe('gu');
      expect(i18n.language).toBe('gu');
      expect(localStorage.getItem('assetops_language')).toBe('gu');

      setLanguage('hi');
      expect(useThemeStore.getState().language).toBe('hi');
      expect(i18n.language).toBe('hi');
      expect(localStorage.getItem('assetops_language')).toBe('hi');

      setLanguage('en');
      expect(useThemeStore.getState().language).toBe('en');
      expect(i18n.language).toBe('en');
      expect(localStorage.getItem('assetops_language')).toBe('en');
    });
  });

  describe('5. Graceful Handling of Missing Keys', () => {
    it('falls back to key or default value when translation key is missing', () => {
      const fallback = i18n.t('nonExistentKey', {
        ns: 'auth',
        defaultValue: 'Default Fallback String',
      });
      expect(fallback).toBe('Default Fallback String');
    });
  });

  describe('6. Settings Page Language Options Match Requirements', () => {
    it('has exact radio option names: English, ગુજરાતી (Gujarati), हिन्दी (Hindi)', () => {
      expect(enSetting.language.english).toBe('English');
      expect(enSetting.language.gujarati).toBe('ગુજરાતી (Gujarati)');
      expect(enSetting.language.hindi).toBe('हिन्दी (Hindi)');

      expect(guSetting.language.gujarati).toBe('ગુજરાતી (Gujarati)');
      expect(hiSetting.language.hindi).toBe('हिन्दी (Hindi)');
    });
  });
});
