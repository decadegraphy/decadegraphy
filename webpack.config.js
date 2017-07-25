var path = require('path'),
  BundleTracker = require('webpack-bundle-tracker'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  webpack = require('webpack');

module.exports = {
  context: __dirname,
  entry: [
    //'webpack-dev-server/client?http://localhost:3000',
    //'webpack/hot/only-dev-server',
    './tenyears/static/js/index'
  ],
  output: {
    path: path.resolve('./tenyears/static/webpack_bundles/'),
    filename: '[name].dev.js'
  },
  module: {
    rules: [
    {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['react', 'es2015']
        }
      }]
    },
    {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        use: 'css-loader'
      })
    },
    {test: /\.(jpg|png|svg|ttf|woff|woff2|eot)\??.*$/, use: [{loader: 'url-loader?limit=50000&name=[path][name].[ext]'}]}
      ]
  },
  plugins: [
    new BundleTracker({filename: './webpack-stats.json'}),
    new ExtractTextPlugin('[name].css')
  ]
};
