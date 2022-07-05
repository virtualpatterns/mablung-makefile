import { PathCompare } from '@virtualpatterns/mablung-makefile/test' // './library/path-compare.js'
import FileSystem from 'fs-extra'
import Path from 'path'
import Test from 'ava'
import URL from 'url'

const ReleaseFolderPath = Path.dirname(URL.fileURLToPath(import.meta.url))
const SourceFolderPath = ReleaseFolderPath.replace('/release/', '/source/')

const EmptyPathExists = FileSystem.pathExistsSync(Path.resolve(SourceFolderPath, 'resource/empty'))

;[
  'CreateRandomId',
  'PathCompare'
].forEach((name) => {

  Test(name, async (test) => {
    test.truthy(await import('@virtualpatterns/mablung-makefile/test').then((module) => module[name]))
  })
  
})

Test('../.babelrc.json', async (test) => {
  test.false(await FileSystem.pathExists(Path.resolve(ReleaseFolderPath, test.title)))
})

Test('../.eslintrc.json', async (test) => {
  test.false(await FileSystem.pathExists(Path.resolve(ReleaseFolderPath, test.title)))
})

Test('../index.cjs', async (test) => {
  test.true(await import(test.title).then((module) => module.OK))
})

Test('../index.js', async (test) => {
  test.true(await import(test.title).then((module) => module.OK))
})

Test('../index.json', async (test) => {
  test.true(await FileSystem.readJson(Path.resolve(ReleaseFolderPath, test.title), { 'encoding': 'utf-8' }).then((content) => content.OK))
})

Test('../makefile', async (test) => {
  test.false(await FileSystem.pathExists(Path.resolve(ReleaseFolderPath, test.title)))
})

Test('./resource/.babelrc.json', async (test) => {
  test.false(await FileSystem.pathExists(Path.resolve(ReleaseFolderPath, test.title)))
})

Test('./resource/.eslintrc.json', async (test) => {
  test.false(await FileSystem.pathExists(Path.resolve(ReleaseFolderPath, test.title)))
})

Test('./resource/index.cjs', async (test) => {
  test.true(await import(test.title).then((module) => module.OK))
})

Test('./resource/index.js', async (test) => {
  test.true(await import(test.title).then((module) => module.OK))
})

Test('./resource/index.json', async (test) => {
  test.true(await FileSystem.readJson(Path.resolve(ReleaseFolderPath, test.title), { 'encoding': 'utf-8' }).then((content) => content.OK))
})

Test('./resource/copy', async (test) => {
  test.true(await PathCompare(Path.resolve(SourceFolderPath, test.title), Path.resolve(ReleaseFolderPath, test.title), (sourcePath, targetPath) => /makefile$/.test(sourcePath) ? [] : [ targetPath ]).then(({ exists }) => exists))
})

Test('./resource/custom', async (test) => {

  test.false(await FileSystem.pathExists(Path.resolve(ReleaseFolderPath, './resource/custom/.eslintrc.json')))
  test.false(await FileSystem.pathExists(Path.resolve(ReleaseFolderPath, './resource/custom/index.js')))
  test.false(await FileSystem.pathExists(Path.resolve(ReleaseFolderPath, './resource/custom/makefile')))

  test.true(await FileSystem.pathExists(Path.resolve(ReleaseFolderPath, './resource/custom/folder')))
  test.true(await FileSystem.pathExists(Path.resolve(ReleaseFolderPath, './resource/custom/folder/file')))

})

;(EmptyPathExists ? Test : Test.skip)('./resource/empty', async (test) => {
  test.true(await FileSystem.pathExists(Path.resolve(ReleaseFolderPath, test.title)))
})

Test('./resource/ignore', async (test) => {
  test.false(await FileSystem.pathExists(Path.resolve(ReleaseFolderPath, test.title)))
})
