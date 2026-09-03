import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Tell React 19 testing environment that act() is supported
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

// Automatically cleanup DOM after each test case
afterEach(() => {
  cleanup();
});

