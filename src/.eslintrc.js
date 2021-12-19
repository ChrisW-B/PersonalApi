const path = require('path');

module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    '../.eslintrc.js',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  parserOptions: {
    project: [path.resolve(__dirname, '..', 'tsconfig.json')],
    sourceType: 'module',
    extraFileExtensions: ['.yaml', '.json', '.yml', '.gql', '.html', '.graphql'],
  },
  env: { node: true },
};
