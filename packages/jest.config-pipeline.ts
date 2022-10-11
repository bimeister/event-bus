import type { Config } from '@jest/types';
import baseConfig from './jest.config-base';

const pipelineConfig: Config.InitialOptions = {
  ...baseConfig,
  collectCoverage: true,
  reporters: [
    [
      'jest-junit',
      {
        outputDirectory: '<rootDir>/../coverage',
        suiteName: 'Unit Tests'
      }
    ]
  ]
};
export default pipelineConfig;
