module.exports = {
  extends: ['airbnb-base', 'eslint:recommended', 'prettier'],
  env: { es2020: true },
  settings: {
    'import/resolver': { node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] } },
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
