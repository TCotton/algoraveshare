import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
        include: ['src/**/*.{ts,tsx}'],
        exclude: ['**/node_modules/**', '**/dist/**',  'astro.config.mjs', 'types.ts', 'typescript/**']
    },
  },
})