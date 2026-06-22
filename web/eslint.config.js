import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: ['dist', 'node_modules'],
  },
  {
    files: ['eslint.config.js', '*.config.js'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: globals.node,
    },
  },
  {
    files: ['src/**/*.{ts,tsx}', 'vite.config.ts'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'no-empty': ['error', { allowEmptyCatch: true }],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  {
    files: ['src/lib/motion.tsx', 'src/components/ui/datetime-picker.tsx', 'src/i18n/index.tsx'],
    rules: {
      // These modules intentionally mix component exports with shared helpers.
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    files: ['src/components/layout/ScrollableTabBar.tsx'],
    rules: {
      // Copied from the reference frontend; the pointer-up handler is intentionally document-scoped.
      'react-hooks/exhaustive-deps': 'off',
    },
  },
)
