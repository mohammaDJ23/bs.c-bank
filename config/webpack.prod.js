const { merge } = require('webpack-merge');
const webpack = require('webpack');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const commonConfig = require('./webpack.common');

module.exports = merge(commonConfig, {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }),
    new FaviconsWebpackPlugin({
      logo: './public/app-logo-48.png',
      favicons: {
        path: `${process.env.BANK_APP}/bank/static/assets/`,
        icons: {
          android: true,
          appleIcon: true,
          favicons: true,
        },
      },
    }),
  ],
  output: {
    publicPath: `${process.env.BANK_APP}/bank/static/`,
  },
});
