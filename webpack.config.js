var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './src/platey.js',

  output: {
    filename: 'platey.js',
    path: path.resolve(__dirname, 'bin')
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
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin({ filename: 'css/platey.css', allChunks: true })
  ]
};
