import { createRequire as CreateRequire } from 'module'
import FileSystem from 'fs-extra'
import Path from 'path'
import Test from 'ava'
import URL from 'url'

const FilePath = URL.fileURLToPath(import.meta.url)
const FolderPath = Path.dirname(FilePath)
const Process = process
const Require = CreateRequire(import.meta.url)

Test('index.js', async (test) => {
  test.true((await import('../index.js')).OK)
})

Test('MAKEFILE_PATH', (test) => {
  test.deepEqual(Process.env['MAKEFILE_PATH'].split(' '), [
    Require.resolve('../../makefile'),
    Require.resolve('../../include/common'),
    Require.resolve('../../include/build'),
    Require.resolve('../../include/debug')
  ])
})

Test('compile.json', async (test) => {
  test.false(await FileSystem.pathExists(Path.resolve(`${FolderPath}/../compile.json`)))
})

Test('check.json', async (test) => {
  test.false(await FileSystem.pathExists(Path.resolve(`${FolderPath}/../check.json`)))
})

Test('sample.babelrc.json', async (test) => {
  test.true((await FileSystem.readJson(Require.resolve('../sample.babelrc.json'), { 'encoding': 'utf-8' })).OK)
})

Test('sample.DS_Store', async (test) => {
  test.true(await FileSystem.pathExists(Require.resolve('../sample.DS_Store')))
})

Test('sample.eslintrc.json', async (test) => {
  test.true((await FileSystem.readJson(Require.resolve('../sample.eslintrc.json'), { 'encoding': 'utf-8' })).OK)
})

Test('resource/index.cjs', async (test) => {
  test.true((await import('./resource/index.cjs')).OK)
})

Test('resource/index.js', async (test) => {
  test.true((await import('./resource/index.js')).OK)
})

Test('resource/index.json', async (test) => {
  test.true((await FileSystem.readJson(Require.resolve('./resource/index.json'), { 'encoding': 'utf-8' })).OK)
})

Test('resource/sample.babelrc.json', async (test) => {
  test.true((await FileSystem.readJson(Require.resolve('./resource/sample.babelrc.json'), { 'encoding': 'utf-8' })).OK)
})

Test('resource/sample.DS_Store', async (test) => {
  test.true(await FileSystem.pathExists(Require.resolve('./resource/sample.DS_Store')))
})

Test('resource/sample.eslintrc.json', async (test) => {
  test.true((await FileSystem.readJson(Require.resolve('./resource/sample.eslintrc.json'), { 'encoding': 'utf-8' })).OK)
})

Test('resource/copy/makefile', async (test) => {
  test.false(await FileSystem.pathExists(`${FolderPath}/resource/copy/makefile`))
})

Test('resource/copy/index.json', async (test) => {
  test.true((await FileSystem.readJson(Require.resolve('./resource/copy/index.json'), { 'encoding': 'utf-8' })).OK)
})

Test('resource/empty', async (test) => {
  test.true(await FileSystem.pathExists(`${FolderPath}/resource/empty`))
})

Test('resource/ignore', async (test) => {
  test.false(await FileSystem.pathExists(`${FolderPath}/resource/ignore`))
})
