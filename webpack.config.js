var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './src/platey.js',

  output: {
    filename: 'platey.js',
    path: path.resolve(__dirname, 'dist')
  },

  resolve: {
    modules: ["src", "."],
    alias: { "lib": "node_modules" }
  },

  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('css-loader!sass-loader')
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
        loader: ExtractTextPlugin.extract("css-loader")
      },
      {
        test: /\.(otf|eot|svg|ttf|woff|woff2)$/,
        loader: "url-loader"
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin({ filename: 'css/platey.css', allChunks: true })
  ],

  devtool: "source-map",

  devServer: {
    port: 8090,
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
