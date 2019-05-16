module.exports = {
  "moduleFileExtensions": [
    "ts",
    "js"
  ],
  "transform": {
    "^.+\\.ts$": "<rootDir>/node_modules/babel-jest"
  },
  "testRegex": "/src/.*\\.spec.(ts|js)$",
  "collectCoverageFrom": [
    "src/*.ts"
  ]
};
