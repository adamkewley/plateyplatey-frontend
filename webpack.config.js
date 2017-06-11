var path = require('path');
var ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var webpack = require("webpack");

// Used to establish whether a dependency is from an
// external vendor or is part of the project
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
  entry: {
    main: './src/platey.js'
  },

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
        loader: "babel-loader!ts-loader",
        exclude: [/node_modules/]
      },
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: [
          // This prevents the "Cannot find source file compiler.es5.ts" error
          // see: https://github.com/angular-redux/store/issues/64
          path.join(__dirname, 'node_modules', '@angular/compiler')
        ],
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
    // This removes angular library warnings from
    // typescript strict null checks.
    new ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)@angular/,
      path.resolve(__dirname, '../src')
    ),

    // This bundles any dependencies from the node_modules
    // folder together into one chunk. Means that all external
    // code ends up in a separate vendors.js file.
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      minChunks: function(module) {
        return isExternal(module);
      }
    }),

    new webpack.optimize.CommonsChunkPlugin({ name: "polyfills", path: './src/polyfills.js' }),

    new UglifyJSPlugin()
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
