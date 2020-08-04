module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'func-call-spacing': 'off',
    'block-scoped-var': 'error',
    'array-bracket-spacing': ['error', 'never'],
    curly: ['error', 'all'],
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/await-thenable': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        singleline: {
          requireLast: false,
        },
      },
    ],
  },
};
