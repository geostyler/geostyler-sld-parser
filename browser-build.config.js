const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
require("@babel/polyfill");

module.exports = {
  entry: [
    "@babel/polyfill",
    path.join(__dirname, "src", "SldStyleParser.ts")
  ],
  mode: 'production',
  output: {
    filename: "sldStyleParser.js",
    path: path.join(__dirname, "browser"),
    library: "GeoStylerSLDParser"
  },
  resolve: {
    extensions: [".ts", ".js", ".json"],
    fallback: {
      string_decoder: require.resolve("string_decoder"),
      buffer: require.resolve("buffer")
    }
  },
  optimization: {
    minimizer: [
      new TerserPlugin()
    ]
  },
  module: {
    rules: [
      // All files with a '.ts'
      {
        test: /\.ts$/,
        include: path.join(__dirname, 'src'),
        use: [
          {
            loader: require.resolve('babel-loader')
          }
        ]
      }
    ]
  }
};
