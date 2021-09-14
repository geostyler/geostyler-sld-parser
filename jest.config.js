const testRegex = 'src/.*\\.spec.ts$';

module.exports = {
  moduleFileExtensions: [
    'ts',
    'js'
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(geostyler-style)/)'
  ],
  testRegex: testRegex,
  collectCoverageFrom: [
    'src/*.ts',
    '!' + testRegex
  ],
  moduleNameMapper: {
    // to work with npm link on geostyler-style
    'core-js': '<rootDir>/node_modules/core-js'
  }
};
