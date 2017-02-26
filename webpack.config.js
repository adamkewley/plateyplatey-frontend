var path = require('path');

module.exports = {
  entry: './src/platey.js',
  output: {
    filename: 'platey.js',
    path: path.resolve(__dirname, 'bin')
  },
  resolve: {
    modules: ["src", "node_modules"]
  }
};
