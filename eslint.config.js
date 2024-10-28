const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const react = require('eslint-plugin-react');
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');

module.exports = [
  eslintPluginPrettierRecommended,
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
        'prettier/prettier': 'error',
        '@typescript-eslint/no-explicit-any': 'warn',
     },
  }
];