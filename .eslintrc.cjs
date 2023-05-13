module.exports = {
  root: true,
  extends: ['@cto.af/eslint-config/modules'],
  ignorePatterns: [
    'coverage/',
    'docs/'
  ],
  env: {
    es2020: true,
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2022,
    project: 'tsconfig.json',
  },
  rules: {
    'no-unused-vars': [
      'error', {
        args: 'none',
        argsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^ignore',
        varsIgnorePattern: '^_',
      },
    ],
  },
}
