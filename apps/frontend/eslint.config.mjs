import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { fixupPluginRules } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import turboConfig from 'eslint-config-turbo/flat'
import codegen from 'eslint-plugin-codegen'
import _import from 'eslint-plugin-import'
import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import sortDestructureKeys from 'eslint-plugin-sort-destructure-keys'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

export default [
  ...turboConfig,
  {
    ignores: [
      '**/dist',
      '**/build',
      '**/docs',
      '**/*.md',
      '**/*.d.ts',
      '**/node_modules',
      '**/vitest.config.ts',
      '**/eslint.config.ts',
      'build',
      '.astro/**/*',
      '**/playwright-report/**',
      '**/test-results/**'
    ]
  },
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended'
  ),
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: './tsconfig.json'
      }
    }
  },
  {
    plugins: {
      import: fixupPluginRules(_import),
      'sort-destructure-keys': sortDestructureKeys,
      'simple-import-sort': simpleImportSort,
      codegen,
      '@stylistic': stylistic,
      'react': pluginReact,
      'react-hooks': pluginReactHooks
    },

    languageOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly'
      }
    },
    settings: {
      react: { version: '19.0' },
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx']
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true
        }
      }
    },

    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/no-unknown-property': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'curly': ['error', 'all'],
      'codegen/codegen': 'error',
      'no-fallthrough': 'off',
      'no-irregular-whitespace': 'off',
      'object-shorthand': 'error',
      'prefer-destructuring': 'off',
      'sort-imports': 'off',

      'no-restricted-syntax': ['error', {
        selector: 'CallExpression[callee.property.name=\'push\'] > SpreadElement.arguments',
        message: 'Do not use spread arguments in Array.push'
      }],

      'no-unused-vars': 'off',
      'prefer-rest-params': 'off',
      'prefer-spread': 'off',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'off',
      'import/no-unresolved': 'off',
      'import/order': 'off',
      'simple-import-sort/imports': 'error',
      'sort-destructure-keys/sort-destructure-keys': 'error',

      '@typescript-eslint/array-type': ['warn', {
        default: 'generic',
        readonly: 'generic'
      }],

      '@typescript-eslint/member-delimiter-style': 0,
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-interface': 'off',

      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],

      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/camelcase': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/no-array-constructor': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-namespace': 'off',

      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'never']
    }
  }
]
