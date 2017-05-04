var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
var webpack = require("webpack");

function isExternal(module) {
  var userRequest = module.userRequest;

  if (typeof userRequest !== 'string') {
    return false;
  }

  return userRequest.indexOf('bower_components') >= 0 ||
    userRequest.indexOf('node_modules') >= 0 ||
    userRequest.indexOf('libraries') >= 0;
}

module.exports = {
  entry: './src/platey.js',

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },

  resolve: {
    modules: ["src", ".", "node_modules"],
    extensions: [".ts", ".js", ".json"],
    alias: { "lib": "node_modules" }
  },

  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!sass-loader'
      },
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ["es2015"]
        }
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      },
      {
        test: /\.(otf|eot|svg|ttf|woff|woff2)$/,
        loader: "url-loader"
      }
    ]
  },

  plugins: [
    // This removes angular library warnings
    new ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)@angular/,
      path.resolve(__dirname, '../src')
    ),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      minChunks: function(module) {
        return isExternal(module);
      }
    })
  ],

  devtool: "source-map",

  devServer: {
    port: (process.env.PORT || 8090),
    proxy: {
      "/api": {
        target: "http://localhost:8080",
          secure: false,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  }
};
