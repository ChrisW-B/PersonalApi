const path = require('path');

module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'no-relative-import-paths'],
  extends: [
    '../.eslintrc.js',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:@typescript-eslint/strict-type-checked',
  ],
  parserOptions: {
    project: [path.resolve(__dirname, '..', 'tsconfig.json')],
    sourceType: 'module',
    extraFileExtensions: ['.yaml', '.json', '.yml', '.gql', '.html', '.graphql'],
  },
  env: { node: true },
  rules: {
    'no-relative-import-paths/no-relative-import-paths': [
      'warn',
      { allowSameFolder: false, rootDir: 'src/functions/db', prefix: '~' },
    ],
    'import/no-anonymous-default-export': 'error',
    'no-console': 'error',
  },
};
