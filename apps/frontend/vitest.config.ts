import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**', '**.astro', 'astro.config.mjs'],
    coverage: {
        include: ['src/**/*.{ts,tsx}'],
        exclude: ['**/node_modules/**', '**/dist/**', '**.astro', 'astro.config.mjs', 'types.ts', 'typescript/**']
    },
  },
});
