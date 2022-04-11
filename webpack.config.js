const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    index: [
      './index.js',
      './node_modules/whatsapp-web.js/index.js'
    ]
  }, 
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'whatsapp.js',
  },
  module: {
    rules: [
        {test: /\.js$/, use: 'raw-loader'},
    ]
  },    
  devtool: false,
  resolve: {    
    fallback: {
      "fs": false,
      "http": false,
      "url": false,
      "os": false,
      "zlib": false,      
      "https": false,
      "stream": false,
      "crypto": false,
      "assert": false,
      "readline": false,
      "child_process": false,
      "constants": false,
      "tls": false,
      "net": false
    } 
}
};