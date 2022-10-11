import { executeCommandWithLogging } from '@bimeister/utilities';
import type { TaskFunction } from 'gulp';

export function compileCommonJs(): TaskFunction {
  const tsConfigSuffix: string = 'commonjs';
  const command: string = `tsc --project tsconfig.lib-${tsConfigSuffix}.json`;

  return (onDone: Function): void => {
    executeCommandWithLogging(command, {
      onDone,
      printDefaultOutput: true
    });
  };
}
