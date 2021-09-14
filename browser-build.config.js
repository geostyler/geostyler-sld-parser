const TerserPlugin = require('terser-webpack-plugin');
require("@babel/polyfill");

module.exports = {
  entry: ["@babel/polyfill", "./src/SldStyleParser.ts"],
  mode: 'production',
  output: {
    filename: "sldStyleParser.js",
    path: __dirname + "/browser",
    library: "GeoStylerSLDParser",
    chunkFormat: "array-push"
  },
  resolve: {
    extensions: [".ts", ".js", ".json"],
    fallback: {
      'string_decoder': require.resolve("string_decoder"),
      emitter: require.resolve("emitter"),
      buffer: require.resolve("buffer")
    }
  },
  optimization: {
    minimizer: [
      new TerserPlugin()
    ]
  },
  target: 'es5',
  module: {
    rules: [
      {
        test: /\.(ts|js)$/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};
