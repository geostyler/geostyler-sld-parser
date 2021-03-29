module.exports = {
  'moduleFileExtensions': [
    'ts',
    'js'
  ],
  // 'transform': {
  //   '^.+\\.ts$': '<rootDir>/node_modules/babel-jest'
  // },
  'transformIgnorePatterns': [
    'node_modules/(?!(geostyler-style)/)'
  ],
  'testRegex': '/src/.*\\.spec.(ts|js)$',
  'collectCoverageFrom': [
    'src/*.ts'
  ]
};
