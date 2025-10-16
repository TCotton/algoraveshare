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
        },
        rules: {
            "react/no-unknown-property": ["error", { ignore: ["tsx"] }],
            "@typescript-eslint/no-explicit-any": "warn",
            "curly": ["error", "multi"],
            '@stylistic/brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
        },
    },
    tseslint.configs.recommended,
    {
        ...pluginReact.configs.flat.recommended,
        settings: {
            ...(pluginReact.configs.flat.recommended.settings || {}),
            react: {version: '19.0'}
        }
    },
    stylistic.configs.customize({
        quotes: 'single',
        semi: false,
    }),
    {
        files: ['tests/**/*.{ts,tsx,spec.ts}'],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            }
        },
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "react/react-in-jsx-scope": "off",
        },
    },
    globalIgnores([
        'node_modules/*',
        '.astro',
        'vitest.config.ts',
        'eslint.config.ts'
    ]),
]);
