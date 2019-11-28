const path = require('path');
const ManifestPlugin = require('webpack-manifest-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { buildDirName } = require('./utils/config');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  // webpack options
  mode: isProd ? "production" : "development",
  entry: {
    application: './views/packs/application.js',
  },
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, `./public${buildDirName}`),
    publicPath: !isProd ? buildDirName : '', // 线上环境打包不需要包含这个目录
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
          "sass-loader"
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ManifestPlugin(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // all options are optional
      filename: '[name].[hash].css',
      chunkFilename: '[name].[hash].css',
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),
  ]
}