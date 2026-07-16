/// <reference types="node" />
// Vitest config scoped to the Growth Admin suite only.
// Namespaced so it never collides with the shared vitest/vite config owned by
// the src/forms session. Run: npx vitest run -c vitest.admin.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    include: ['src/admin/**/*.test.{ts,tsx}'],
    environment: 'jsdom',
    globals: false,
    setupFiles: ['src/admin/test/setup.ts'],
    css: false,
    restoreMocks: true,
    clearMocks: true,
  },
});
