import { deleteFolderWithFiles } from '@bimeister/utilities/commonjs/common';
import type { TaskFunction } from 'gulp';
import { cwd } from 'process';

export const cleanUpDistFolder: TaskFunction = (done: Function): void => {
  const currentPath: string = cwd();
  const distFolderPath: string = `${currentPath}/dist`;

  deleteFolderWithFiles(distFolderPath);
  done();
};
