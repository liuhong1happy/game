var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var DashboardPlugin = require('webpack-dashboard/plugin');

var APP_PATH = path.resolve(__dirname,'./src/index.js');
var BUILD_PATH = path.resolve(__dirname, './docs');
var TMP_PATH = path.resolve(__dirname,'./src/index.html');

module.exports = {
  mode: 'development',
  entry: APP_PATH,
  output: {
    path: BUILD_PATH,
    filename: '[name].js' //输出js
  },
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: "async",
      minSize: 300000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
          vendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10
          },
          default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true
          }
      }
    }
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'build.min.css',
      allChunks: true,
    }),
    new HtmlWebpackPlugin({
        title: 'Game',
        template: TMP_PATH,
        filename: 'index.html',
        inject: 'body'
    }),
    new OpenBrowserPlugin({
      url: 'http://localhost:8080'
      // browser: 'chromium-browser' // mac调试时需要注释该行
    }),
    // webpack-dev-server enhancement plugins
    new DashboardPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    rules: [
      {
        test:  /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-transform-runtime', 'transform-class-properties']
            }
          }
        ],
      },
      {
        test: /\.less$/,
        use: [{
          loader: 'style-loader' // creates style nodes from JS strings
        }, {
          loader: 'css-loader' // translates CSS into CommonJS
        }, {
          loader: 'less-loader' // compiles Less to CSS
        }]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use:[
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: '[path][name].[ext]?[hash]'
            }
          }
        ]
      }
    ]
  }
};