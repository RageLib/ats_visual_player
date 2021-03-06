const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const CopyPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader'
          }, {
            loader: 'css-loader'
          }, {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.txt$/i,
        use: 'raw-loader',
      }
    ]
  },
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  target:'node',
  plugins: [
    new CopyPlugin(
      {
        patterns: [
          { from: 'src/assets', to: 'assets' },
          { from: 'src/library.json', to: '' },
          { from: 'src/settings.txt', to: '' },
          { from: 'src/locales', to: 'locales' },
          { from: 'src/ATSV', to: 'ATSV' }
        ]
      })
  ]
})
