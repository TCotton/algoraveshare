/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    test: {
        environment: 'jsdom', // required for DOM APIs
        globals: true,
        setupFiles: ['./src/tests/setup.ts'], // optional setup file
        include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
        coverage: {
            reporter: ['text', 'json', 'html'],
        },
    },
});
