import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach } from 'vitest';
import i18n from '@/i18n';

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined;
}

// Tell React 19 testing environment that act() is supported
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

beforeEach(async () => {
  await i18n.changeLanguage('en');
});

// Automatically cleanup DOM after each test case
afterEach(() => {
  cleanup();
});
