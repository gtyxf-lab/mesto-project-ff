const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/scripts/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    publicPath: '/', 
    clean: true,
    assetModuleFilename: 'assets/[name][ext]', 
  },
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    compress: true,
    port: 8080,
    open: true,
  },
  module: {
    rules: [

      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },

      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { importLoaders: 1 },
          },
          'postcss-loader',
        ],
      },

      {
        test: /\.(png|svg|jpg|jpeg|gif|woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'main.css',
    }),
  ],
  optimization: {
    minimize: false, 
    minimizer: [`...`, new CssMinimizerPlugin()], 
  },
  devtool: 'development' ? 'eval-source-map' : false,
};