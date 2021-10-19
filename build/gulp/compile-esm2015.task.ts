import { executeCommandWithLogging } from '@bimeister/utilities';
import type { TaskFunction } from 'gulp';

export function compileEsm2015(): TaskFunction {
  const tsConfigSuffix: string = 'esm2015';
  const command: string = `tsc --project tsconfig.lib-${tsConfigSuffix}.json`;

  return (onDone: Function): void => {
    executeCommandWithLogging(command, {
      onDone,
      printDefaultOutput: true
    });
  };
}
