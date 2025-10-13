import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import {defineConfig, globalIgnores} from 'eslint/config';
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig([
    {
        files: ['src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        plugins: {js},
        extends: ['js/recommended'],
        languageOptions: {globals: globals.browser},
        settings: {
            react: {version: '19.0'}
        }
    },
    tseslint.configs.recommended,
    {
        ...pluginReact.configs.flat.recommended,
        settings: {
            ...(pluginReact.configs.flat.recommended.settings || {}),
            react: {version: '19.0'}
        }
    },
    globalIgnores([
        'node_modules/*',
        '.astro',
        'tests',
        'vitest.config.ts',
        'eslint.config.ts'
    ]),
    stylistic.configs.customize({
        quotes: 'single',
        semi: false,
    }),
]);
