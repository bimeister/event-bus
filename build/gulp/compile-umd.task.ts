import { executeCommandWithLogging } from '@bimeister/utilities';
import type { TaskFunction } from 'gulp';

export function compileUmd(): TaskFunction {
  const tsConfigSuffix: string = 'umd';
  const command: string = `tsc --project tsconfig.lib-${tsConfigSuffix}.json`;

  return (onDone: Function): void => {
    executeCommandWithLogging(command, {
      onDone,
      printDefaultOutput: true
    });
  };
}
