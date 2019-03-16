const path = require('path');
module.exports = {
  cacheDirectory: '/tmp/jest',
  testMatch: ['/**/test/**/*.test.js'],
  moduleDirectories: ['node_modules', 'core', 'utils'],
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 20,
      lines: 50,
      statements: 50
    }
  }
};
