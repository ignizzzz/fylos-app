import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Test config is scoped to the form system. The rest of the repo has no tests.
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/forms/vitest.setup.ts'],
    include: ['src/forms/**/*.test.{ts,tsx}'],
    css: false,
  },
})
