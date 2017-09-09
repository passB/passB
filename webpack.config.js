const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    'background-script': './src/background-script.ts',
    'popup': './src/Popup/popup.tsx',
    'options': './src/Options/page.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'extension/built'),
    filename: '[name].js'
  },
  target: "web",
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    modules: ['node_modules', './src'],
  },
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        use: [
          'awesome-typescript-loader',
          'tslint-loader',
        ]
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader", // creates style nodes from JS strings
          },
          {
            loader: "css-loader", // translates CSS into CommonJS
            options: {
              sourceMap: true,
              minimize: true
            },
          },
          {
            loader: "sass-loader", // compiles Sass to CSS
            options: {
              sourceMap: true,
              includePaths: [
                'node_modules',
              ],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader", // creates style nodes from JS strings
          },
          {
            loader: "css-loader", // translates CSS into CommonJS
            options: {
              sourceMap: true,
              minimize: true
            },
          },
        ]
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('web'),
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "shared",
      filename: "shared.js",
    }),
  ],
};