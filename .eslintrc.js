module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
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
