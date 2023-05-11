module.exports = {
  root: true,
  extends: ['@cto.af/eslint-config/typescript'],
  ignorePatterns: [
    'coverage/',
    'docs/',
    'lib/',
    't.js'
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
    '@typescript-eslint/no-unused-vars': ['error', {
      varsIgnorePattern: '_',
    }],
  },
  overrides: [
    {
      files: ['*.js'],
      extends: [
        '@cto.af/eslint-config/modules',
      ],
    },
  ],
}
