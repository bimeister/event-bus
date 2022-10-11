import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.spec.json'
    }
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  modulePathIgnorePatterns: [],
  reporters: [
    [
      'jest-junit',
      {
        outputDirectory: 'coverage',
        suiteName: 'Unit Tests'
      }
    ]
  ],
  roots: ['<rootDir>/src'],
  testRegex: '(\\.|/)(spec)\\.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  verbose: true
};
export default config;
