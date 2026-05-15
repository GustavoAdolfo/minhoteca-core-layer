module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: './',
  testMatch: ['**/tests/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/layer/nodejs/src/$1',
  },
  collectCoverageFrom: [
    'layer/nodejs/src/**/*.ts',
    '!layer/nodejs/src/**/*.d.ts',
    '!layer/nodejs/src/**/*.interface.ts',
    '!layer/nodejs/src/**/*.type.ts',
    '!layer/nodejs/src/**/index.ts',
    '!tests/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
