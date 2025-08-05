module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
  moduleFileExtensions: ['js', 'ts', 'json', 'vue'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.vue$': '@vue/vue3-jest',
  },
  testMatch: ['**/__tests__/**/manual-verification.test.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^vue-draggable-next$': '<rootDir>/src/index.ts',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,vue}',
    '!src/**/*.d.ts',
    '!src/types.ts', // Type definitions don't need coverage
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'lcov', 'text'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/demo/'],
  extensionsToTreatAsEsm: ['.ts'],
  transformIgnorePatterns: ['node_modules/(?!(.*\\.mjs$))'],
}
