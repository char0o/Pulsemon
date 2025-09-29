module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    '@typescript-eslint/semi': ['error', 'always'],

    '@typescript-eslint/quotes': ['error', 'single'],

    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

    '@typescript-eslint/indent': ['error', 2], 
  },
};