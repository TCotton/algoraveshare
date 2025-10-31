import * as js from '@eslint/js';
import * as globals from 'globals';
import tseslint from 'typescript-eslint';
import * as pluginReact from 'eslint-plugin-react';
import * as pluginReactHooks from 'eslint-plugin-react-hooks';
import stylistic from '@stylistic/eslint-plugin';

export default tseslint.config([
    {
        ignores: [
            'node_modules/*',
            '.astro',
            'vitest.config.ts',
            'eslint.config.ts',
            'dist/*',
            'eslint.config.mjs',
        ]
    },
    {
        files: ['src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}', 'tests/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        languageOptions: {
            globals: globals.browser
        },
        settings: {
            react: { version: '19.0' }
        },
        rules: {
            "@typescript-eslint/no-explicit-any": "warn",
            "curly": ["error", "all"],
            '@stylistic/brace-style': ['error', 'stroustrup', { allowSingleLine: false }],
        },
    },
    {
        files: ['src/**/*.{jsx,tsx}', 'tests/**/*.{jsx,tsx}'],
        ...pluginReact.configs.flat.recommended,
        settings: {
            react: { version: '19.0' }
        },
        rules: {
            'react/no-unknown-property': 'warn'
        }
    },
    {
        files: ['src/**/*.{jsx,tsx}', 'tests/**/*.{jsx,tsx}'],
        plugins: {
            'react-hooks': pluginReactHooks
        },
        rules: {
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn'
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
]);
