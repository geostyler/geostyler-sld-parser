module.exports = {
  "presets": [
    ["@babel/env", {
      "useBuiltIns": "usage"
    }],
    "@babel/preset-typescript"
  ],
  "plugins": [
    "@babel/proposal-class-properties",
    "@babel/proposal-object-rest-spread"
  ]
};
