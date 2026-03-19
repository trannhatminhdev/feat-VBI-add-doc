import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'

export default [
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: {
          allowDefaultProject: ['tests/*.ts', 'tests/*/*.ts'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ignores: [
      'dist/',
      'coverage/',
      'node_modules/',
      'tsconfig.*',
      'eslint.config.mjs',
      'rslib.config.ts',
      'vite.config.ts',
    ],
  },
  ...defineConfig(js.configs.recommended, tseslint.configs.recommended),
  {
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': 'error',
    },
  },
]
