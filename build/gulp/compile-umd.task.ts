import { executeCommandWithLogging } from '@bimeister/utilities/commonjs/common';
import type { TaskFunction } from 'gulp';

export function compileUmd(): TaskFunction {
  const tsConfigSuffix: string = 'umd';
  const command: string = `tsc --project tsconfig.lib-${tsConfigSuffix}.json`;

  return (onDone: VoidFunction): void => {
    executeCommandWithLogging(command, {
      onDone,
      printDefaultOutput: true
    });
  };
}
