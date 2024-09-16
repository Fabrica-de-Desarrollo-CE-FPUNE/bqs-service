module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['<rootDir>/tests/**/*.test.ts', '<rootDir>/tests/**/*.test.tsx'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.json'
      }
    },
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
      "^.+\\.(js)$": "babel-jest"
    },
    moduleNameMapper: {
      '^@src/(.*)$': '<rootDir>/src/$1'
    },
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
  };
  