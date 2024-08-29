import {
  buildBundleTypings,
  buildPackageJson,
  Dependencies,
  getGroupedSourceFileDataByPackageName,
  PackageJson,
  PackageJsonExports,
  PackageJsonExportsItem,
  SourceFileData,
} from '@bimeister/utilities/build';
import { getAllNestedFilePaths } from '@bimeister/utilities/filesystem';
import { build, BuildOptions } from 'esbuild';
import { readFile, rm, writeFile } from 'fs/promises';

const distFolderPath: string = `${__dirname}/dist`;
const packagesFolderPath: string = `${__dirname}/packages`;
const tsConfigFilePath: string = './tsconfig.json';
const rootPackageJsonFilePath: string = `${__dirname}/package.json`;

const esBuildConfig: BuildOptions = {
  chunkNames: 'chunks/[name]-[hash]',
  bundle: true,
  splitting: true,
  external: ['rxjs'],
  minify: true,
  platform: 'neutral',
  sourcemap: 'external',
  target: 'esnext',
  format: 'esm',
  treeShaking: true,
  tsconfig: tsConfigFilePath,
  mainFields: ['module', 'main', 'browser'],
  color: true,
  metafile: true,
  legalComments: 'none',
};
const notBundledPackages: Set<string> = new Set<string>(['internal', 'testing']);

const typeOnlyFileEndings: Set<string> = new Set<string>(
  ['type', 'interface', 'trait'].flatMap((prefix: string) => [`.${prefix}.ts`, `${prefix}s/index.ts`])
);

const outDirByPackageName: Map<string, string> = new Map<string, string>([
  ['event-bus-native', 'native'],
  ['event-bus-rxjs', 'rxjs'],
]);

getAllNestedFilePaths(packagesFolderPath).then((sourceFilePaths: string[]) => {
  const tsSourceFilePaths: string[] = sourceFilePaths.filter(
    (filePath: string) => filePath.includes('/src/') && filePath.endsWith('.ts') && !filePath.endsWith('.spec.ts')
  );

  const sourceFilesDataByPackageName: Map<string, SourceFileData[]> =
    getGroupedSourceFileDataByPackageName(tsSourceFilePaths);

  return Promise.resolve()
    .then(() => rm(distFolderPath, { force: true, recursive: true }))
    .then(() => generateBundle(sourceFilesDataByPackageName))
    .then(() => generateTypings(sourceFilesDataByPackageName))
    .then(() => generatePackageJson(sourceFilePaths, sourceFilesDataByPackageName));
});

async function generateBundle(sourceFilesDataByPackageName: Map<string, SourceFileData[]>): Promise<void> {
  sourceFilesDataByPackageName.forEach(async (filesData: SourceFileData[], packageName: string) => {
    if (notBundledPackages.has(packageName)) {
      return;
    }

    const entryPoints: string[] = filesData
      .map((fileData: SourceFileData) => fileData.filePath)
      .filter((filePath: string) => {
        const invalidEndings: string[] = Array.from(typeOnlyFileEndings);
        const isTypeOnlyFile: boolean = invalidEndings.some((ending: string) => filePath.endsWith(ending));
        return !isTypeOnlyFile;
      });

    const outdir: string = outDirByPackageName.has(packageName)
      ? `${distFolderPath}/${outDirByPackageName.get(packageName)}/`
      : `${distFolderPath}/${packageName}/`;
    const buildConfig: BuildOptions = {
      ...esBuildConfig,
      outdir,
      entryPoints,
    };

    const commonJsConfig: BuildOptions = {
      ...buildConfig,
      splitting: false,
      format: 'cjs',
      outExtension: { '.js': '.cjs' },
    };

    const esModuleConfig: BuildOptions = {
      ...buildConfig,
      splitting: true,
      format: 'esm',
      outExtension: { '.js': '.mjs' },
    };

    await build(commonJsConfig);
    await build(esModuleConfig);
  });
}

async function generateTypings(sourceFilesDataByPackageName: Map<string, SourceFileData[]>): Promise<void> {
  sourceFilesDataByPackageName.forEach(async (_filesData: SourceFileData[], packageName: string) => {
    if (notBundledPackages.has(packageName)) {
      return;
    }

    const packageDir: string = outDirByPackageName.has(packageName)
      ? `${outDirByPackageName.get(packageName)}`
      : `${packageName}`;

    const mainFilePath: string = `${packagesFolderPath}/${packageName}/src/index.ts`;
    const bundleTypingsFilePath: string = `${distFolderPath}/${packageDir}/index.d.ts`;

    await buildBundleTypings({
      configPath: tsConfigFilePath,
      inputPath: mainFilePath,
      outputPath: bundleTypingsFilePath,
    });

    if (packageName === 'rxjs-operators') {
      await patchOperatorsTypings(bundleTypingsFilePath);
    }
  });
}

async function patchOperatorsTypings(typingsFilePath: string): Promise<void> {
  const fileContent: string = await readFile(typingsFilePath, { encoding: 'utf8' });

  const declaredClassesNames: string[] = Array.from(
    new Set<string>(
      fileContent
        .split('\n')
        .filter((substring: string) => substring.includes('declare class'))
        .map((classDeclarationString: string) =>
          classDeclarationString.replace('declare class ', '').replace(new RegExp(/(<.*)? .*{/g), '')
        )
    )
  );

  const updatedFileContent: string = `
import { ${declaredClassesNames.join(', ')} } from './../rxjs';
${fileContent}`.replace(new RegExp(/^declare class .*{(\s*\n.*)*^}/gm), '');

  await writeFile(typingsFilePath, updatedFileContent, { encoding: 'utf8' });
}

async function generatePackageJson(
  sourceFilePaths: string[],
  sourceFilesDataByPackageName: Map<string, SourceFileData[]>
): Promise<void> {
  const packageJsonFilePaths: string[] = sourceFilePaths.filter((filePath: string) =>
    filePath.endsWith('package.json')
  );

  const collectedDependencies: Dependencies = await packageJsonFilePaths
    .concat([rootPackageJsonFilePath])
    .reduce(async (accumulatedData: Promise<Dependencies>, packageJsonFilePath: string) => {
      const fileContent: string = await readFile(packageJsonFilePath, { encoding: 'utf8' });
      const parsedFileContent: PackageJson = JSON.parse(fileContent);
      const accumulatedDependencies: Dependencies = await accumulatedData;

      const dependencies: Dependencies | undefined = parsedFileContent.dependencies;
      if (dependencies !== undefined) {
        Object.assign(accumulatedDependencies, dependencies);
      }

      const optionalDependencies: Dependencies | undefined = parsedFileContent.optionalDependencies;
      if (optionalDependencies !== undefined) {
        Object.assign(accumulatedDependencies, optionalDependencies);
      }

      const peerDependencies: Dependencies | undefined = parsedFileContent.peerDependencies;
      if (peerDependencies !== undefined) {
        Object.assign(accumulatedDependencies, peerDependencies);
      }

      return accumulatedData;
    }, Promise.resolve({}));

  const exportsEntries: [string, PackageJsonExportsItem][] = Array.from(sourceFilesDataByPackageName.values())
    .flat(1)
    .filter(({ packageName, filePath }: SourceFileData) => {
      const packageShouldBeExported: boolean = !notBundledPackages.has(packageName);
      const isBarrelExportFile: boolean = filePath.endsWith('/index.ts');
      return packageShouldBeExported && isBarrelExportFile;
    })
    .map(({ packageName, filePathFromPackageSrc }: SourceFileData) => {
      const packageDir: string = outDirByPackageName.has(packageName)
        ? `${outDirByPackageName.get(packageName)}`
        : `${packageName}`;

      const filePathWithoutExtension: string = `./${packageDir}${filePathFromPackageSrc}`.replace('.ts', '');

      const exportsItem: PackageJsonExportsItem = {
        import: `${filePathWithoutExtension}.mjs`,
        require: `${filePathWithoutExtension}.cjs`,
        fesm2020: `${filePathWithoutExtension}.mjs`,
        fesm2015: `${filePathWithoutExtension}.mjs`,
        esm2020: `${filePathWithoutExtension}.mjs`,
        module: `${filePathWithoutExtension}.mjs`,
        es2020: `${filePathWithoutExtension}.mjs`,
        main: `${filePathWithoutExtension}.cjs`,
        typings: `${filePathWithoutExtension}.d.ts`,
        default: `${filePathWithoutExtension}.cjs`,
      };

      if (packageName === 'event-bus-native') {
        return ['.', exportsItem];
      }

      const entryPoint: string = filePathWithoutExtension.replace('/index', '');
      return [entryPoint, exportsItem];
    });

  const rootTypesFilePath: string = `./native/index.d.ts`;
  const rootEsmFilePath: string = `./native/index.mjs`;
  const rootCommonJsFilePath: string = `./native/index.cjs`;
  const topLevelExports: [string, PackageJsonExportsItem][] = [
    [
      './package.json',
      {
        default: './package.json',
      },
    ],
  ];
  const exports: PackageJsonExports = Object.fromEntries(topLevelExports.concat(exportsEntries));

  await buildPackageJson({
    currentPackageJsonPath: rootPackageJsonFilePath,
    targetPackageJsonPath: `${distFolderPath}/package.json`,
    override: {
      optionalDependencies: collectedDependencies,
      exports,
      sideEffects: false,
      workspaces: [],
      fesm2020: rootEsmFilePath,
      fesm2015: rootEsmFilePath,
      esm2020: rootEsmFilePath,
      typings: rootTypesFilePath,
      module: rootEsmFilePath,
      es2020: rootEsmFilePath,
      main: rootCommonJsFilePath,
    },
  });
}
