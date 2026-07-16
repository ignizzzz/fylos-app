import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Scoped to the Email & Newsletter frontend. Separate from vitest.config.ts
// (src/forms) and vitest.admin.config.ts (src/admin) so the suites never mix.
// Run: npx vitest run -c vitest.email.config.ts
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/email/test/setup.ts'],
    include: ['src/email/**/*.{test,spec}.{ts,tsx}'],
    css: false,
  },
})
