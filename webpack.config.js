// const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: './src/scripts/app/main.js',
  output: { clean: true },
  experiments: { topLevelAwait: true },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: '3d-assets', to: '3d-assets', context: 'src' },
        { from: 'css', to: 'css', context: 'src' },
        { from: 'images', to: 'images', context: 'src' },
        { from: 'scripts/app/iframe-capture.js', to: 'scripts/app/iframe-capture.js', context: 'src' },
        { from: 'src/*.html', to: '[name][ext]' },
      ],
    }),
  ],
  devServer: { static: './dist' },
};
