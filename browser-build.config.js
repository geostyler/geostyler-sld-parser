const TerserPlugin = require('terser-webpack-plugin');
require("@babel/polyfill");

module.exports = {
  entry: ["@babel/polyfill", "./src/SldStyleParser.ts"],
  mode: 'production',
  output: {
    filename: "sldStyleParser.js",
    path: __dirname + "/browser",
    library: "GeoStylerSLDParser"
  },
  resolve: {
    // Add '.ts' as resolvable extensions.
    extensions: [".ts", ".js", ".json"]
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
        include: [
          __dirname + '/src',
          __dirname + '/node_modules/geostyler-style'
        ],
        use: [
          {
            loader: require.resolve('ts-loader'),
            options: {
              allowTsInNodeModules: true,
              compilerOptions: {
                "declaration": false,
                "outDir": "browser",
                "rootDir": "."
              }
            }
          }
        ],
      }
    ]
  }
};
