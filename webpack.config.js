

module.exports = {
  optimization: { minimize: false },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-typescript', ['@babel/env', { targets: { node: 'current' } }]],
            plugins: [
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-transform-object-assign',
              '@babel/plugin-proposal-object-rest-spread',
            ],
            env: {
              production: {
                presets: [
                  [
                    '@babel/env',
                    {
                      targets: { node: 'current' },
                      forceAllTransforms: true,
                      useBuiltIns: 'usage',
                    },
                  ],
                ],
              },
            },
          },
        },
      },
    ],
  },
};
