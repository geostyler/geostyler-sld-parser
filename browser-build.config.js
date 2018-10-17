const webpack = require("webpack");
require("@babel/polyfill");

module.exports = {
  entry: ['@babel/polyfill', './src/SldStyleParser.ts'],
  output: {
    filename: "sldStyleParser.js",
    path: __dirname + "/browser",
    library: "GeoStylerSLDParser"
  },
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.ts$/,
        include: /src/,
        loader: "awesome-typescript-loader"
      },
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
  ]
};
