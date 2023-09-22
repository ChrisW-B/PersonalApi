module.exports = {
  extends: ['airbnb-base', 'eslint:recommended', 'prettier'],
  env: { es2020: true },
  settings: {
    'import/resolver': { typescript: { alwaysTryType: true } },
  },
  rules: {
    'import/extensions': [
      'error',
      'never',
      { pattern: { html: 'always', json: 'always', gql: 'always' } },
    ],
    'no-unneeded-ternary': 'error',
    'no-nested-ternary': 'off',
  },
};
