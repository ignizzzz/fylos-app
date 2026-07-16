// Global setup for the Growth Admin vitest suite: registers the jest-dom
// matchers (toBeInTheDocument, ...) and unmounts rendered trees after each
// test (needed because this suite runs with globals disabled, so
// testing-library's automatic cleanup is not auto-registered).
import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});
