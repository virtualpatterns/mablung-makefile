import { createRequire as CreateRequire } from 'module';
import FileSystem from 'fs-extra';
import JSON5 from 'json5';
import Path from 'path';
import Test from 'ava';
import URL from 'url';

const FilePath = URL.fileURLToPath(import.meta.url);
const FolderPath = Path.dirname(FilePath);
const Process = process;
const Require = CreateRequire(import.meta.url);

Test('MAKEFILE_PATH', (test) => {
  test.deepEqual(Process.env['MAKEFILE_PATH'].split(' '), [
  Require.resolve('../../makefile'),
  Require.resolve('../../include/common'),
  Require.resolve('../../include/build/common'),
  Require.resolve('../../include/build/build'),
  Require.resolve('../../include/build/debug')]);

});

Test('.babelrc.json', async (test) => {
  test.false(await FileSystem.pathExists(`${FolderPath}/../.babelrc.json`));
});

Test('.eslintrc.json', async (test) => {
  test.false(await FileSystem.pathExists(`${FolderPath}/../.eslintrc.json`));
});

Test('resource/index.cjs', async (test) => {
  test.true((await import('./resource/index.cjs')).OK);
});

Test('resource/index.js', async (test) => {
  test.true((await import('./resource/index.js')).OK);
});

Test('resource/index.json', async (test) => {
  test.true(JSON5.parse(await FileSystem.readFile(Require.resolve('./resource/index.json'), { 'encoding': 'utf-8' })).OK);
});

Test('resource/copy/makefile', async (test) => {
  test.false(await FileSystem.pathExists(`${FolderPath}/resource/copy/makefile`));
});

Test('resource/copy/index.json', async (test) => {
  test.true(JSON5.parse(await FileSystem.readFile(Require.resolve('./resource/copy/index.json'), { 'encoding': 'utf-8' })).OK);
});

Test('resource/empty', async (test) => {
  test.true(await FileSystem.pathExists(`${FolderPath}/resource/empty`));
});

Test('resource/ignore', async (test) => {
  test.false(await FileSystem.pathExists(`${FolderPath}/resource/ignore`));
});

//# sourceMappingURL=index.test.js.map