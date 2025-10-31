import path from "path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [],
  test: {
    setupFiles: [path.join(__dirname, "setupTests.ts")],
    include: ["./test/**/*.test.ts"],
    globals: true,
    coverage: {
       include: ['src/**/*.{ts,tsx}'],
       exclude: ['db/**', '**/node_modules/**', '**/dist/**', 'types.ts', 'typescript/**']
    },
  },

  resolve: {
    alias: {
      "@template/basic/test": path.join(__dirname, "test"),
      "@template/basic": path.join(__dirname, "src")
    }
  }
})
