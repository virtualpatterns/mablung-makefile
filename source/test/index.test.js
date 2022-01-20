import FileSystem from 'fs-extra'
import Path from 'path'
import Test from 'ava'
import URL from 'url'

const FilePath = URL.fileURLToPath(import.meta.url)
const FolderPath = Path.dirname(FilePath)
const Process = process

const EmptyPathExists = FileSystem.pathExistsSync(Path.resolve(FolderPath, '../../source/test/resource/empty'))

;[
  'LoadPackage',
  'LoadPackageSync'
].forEach((name) => {

  Test(name, async (test) => {
    let index = await import('@virtualpatterns/mablung-makefile')
    test.truthy(index[name])
  })

})

Test('MAKE_PATH', (test) => {
  test.not(Process.env.MAKE_PATH, undefined)
})

Test('MAKEFILE_PATH', (test) => {
  test.not(Process.env.MAKEFILE_PATH, undefined)
  test.deepEqual(Process.env.MAKEFILE_PATH.split(' '), [
    Path.resolve(FolderPath, '../../makefile'),
    Path.resolve(FolderPath, '../../include/common'),
    Path.resolve(FolderPath, '../../include/build'),
    Path.resolve(FolderPath, '../../include/clean')
  ])
})

Test('GIT_IS_DIRTY', (test) => {
  test.not(Process.env.GIT_IS_DIRTY, undefined)
})

Test('sample.babelrc.json', async (test) => {
  test.true((await FileSystem.readJson(Path.resolve(FolderPath, '../sample.babelrc.json'), { 'encoding': 'utf-8' })).OK)
})

Test('sample.DS_Store', async (test) => {
  test.true(await FileSystem.pathExists(Path.resolve(FolderPath, '../sample.DS_Store')))
})

Test('sample.eslintrc.json', async (test) => {
  test.true((await FileSystem.readJson(Path.resolve(FolderPath, '../sample.eslintrc.json'), { 'encoding': 'utf-8' })).OK)
})

Test('resource/index.cjs', async (test) => {
  test.true((await import('./resource/index.cjs')).OK)
})

Test('resource/index.js', async (test) => {
  test.true((await import('./resource/index.js')).OK)
})

Test('resource/index.json', async (test) => {
  test.true((await FileSystem.readJson(Path.resolve(FolderPath, 'resource/index.json'), { 'encoding': 'utf-8' })).OK)
})

Test('resource/sample.babelrc.json', async (test) => {
  test.true((await FileSystem.readJson(Path.resolve(FolderPath, 'resource/sample.babelrc.json'), { 'encoding': 'utf-8' })).OK)
})

Test('resource/sample.DS_Store', async (test) => {
  test.true(await FileSystem.pathExists(Path.resolve(FolderPath, 'resource/sample.DS_Store')))
})

Test('resource/sample.eslintrc.json', async (test) => {
  test.true((await FileSystem.readJson(Path.resolve(FolderPath, 'resource/sample.eslintrc.json'), { 'encoding': 'utf-8' })).OK)
})

Test('resource/copy/makefile', async (test) => {
  test.false(await FileSystem.pathExists(Path.resolve(FolderPath, 'resource/copy/makefile')))
})

Test('resource/copy/index.cjs', async (test) => {
  test.true((await import('./resource/copy/index.cjs')).OK)
})

Test('resource/copy/index.js', async (test) => {
  test.true((await import('./resource/copy/index.js')).OK)
})

Test('resource/copy/index.json', async (test) => {
  test.true((await FileSystem.readJson(Path.resolve(FolderPath, 'resource/copy/index.json'), { 'encoding': 'utf-8' })).OK)
})

Test('resource/copy/folder/index.cjs', async (test) => {
  test.true((await import('./resource/copy/folder/index.cjs')).OK)
})

Test('resource/copy/folder/index.js', async (test) => {
  test.true((await import('./resource/copy/folder/index.js')).OK)
})

Test('resource/copy/folder/index.json', async (test) => {
  test.true((await FileSystem.readJson(Path.resolve(FolderPath, 'resource/copy/folder/index.json'), { 'encoding': 'utf-8' })).OK)
})

;(EmptyPathExists ? Test : Test.skip)('resource/empty', async (test) => {
  test.true(await FileSystem.pathExists(Path.resolve(FolderPath, 'resource/empty')))
})

Test('resource/ignore', async (test) => {
  test.false(await FileSystem.pathExists(Path.resolve(FolderPath, 'resource/ignore')))
})
