import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: { index: 'src/index.ts', browser: 'src/browser.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: true,
    treeshake: true,
    target: 'es2021',
  },
  {
    // Zero-build drop-in for static HTML pages: <script src="fylos-analytics.global.js">.
    // Exposes window.FylosAnalytics and window.FylosConsent.
    entry: { 'fylos-analytics': 'src/browser.ts' },
    format: ['iife'],
    globalName: 'FylosAnalyticsBundle',
    sourcemap: true,
    minify: true,
    clean: false,
    target: 'es2021',
    outExtension() {
      return { js: '.global.js' };
    },
  },
]);
