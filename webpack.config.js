const path = require('path');
const webpack = require('webpack');

const production = process.env.NODE_ENV === 'production';

module.exports = {
  entry: {
    'background-script': './src/background-script.ts',
    'popup': './src/Popup/popup.tsx',
    'options': './src/Options/page.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'extension/built'),
    publicPath: 'built/',
    filename: '[name].js'
  },
  target: "web",
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    modules: ['node_modules', './src'],
  },
  module: {
    loaders: [
      {
        test: [
          /typedi\/.*\/Require.js$/,
        ],
        use: 'ignore-loader',
      },
      {
        test: /\.tsx?$/,
        use: [
          'awesome-typescript-loader',
          {
            loader: 'tslint-loader',
            options: {
              // disable for day-to-day development as it is too slow - should be checked in CI
              typeCheck: production,
            },
          },
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
      {
        test: /\.(jpe?g|png|gif|svg|eot|woff2?|ttf)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: '[name].[ext]'
            },
          }
        ],
      }
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

if (production) {
  const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
  module.exports.plugins.push(new UglifyJSPlugin());
  delete module.exports.devtool;
}