/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
  clearMocks: true,
  collectCoverageFrom: ['src/**/*.ts', '!src/server.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        diagnostics: {
          ignoreCodes: [151002]
        }
      }
    ]
  }
};

module.exports = config;
