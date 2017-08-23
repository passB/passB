const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        'background-script': './src/background-script.ts',
        'popup': './src/popup.tsx',
    },
    output: {
        path: path.resolve(__dirname, 'extension/built'),
        filename: '[name].js'
    },
    target: "web",
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    module: {
        rules: [
            {enforce: 'pre', test: /\.tsx?$/, loader: 'tslint-loader'},
            {test: /\.tsx?$/, loader: 'awesome-typescript-loader'},
            {enforce: 'pre', test: /\.js$/, loader: 'source-map-loader'}
        ]
    },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('web'),
      },
    }),
  ],
};