import { PathExists } from '@virtualpatterns/mablung-makefile/test'
import FileSystem from 'fs-extra'
import Path from 'path'
import Test from 'ava'
import URL from 'url'

const FolderPath = Path.dirname(URL.fileURLToPath(import.meta.url))

const EmptyPathExists = FileSystem.pathExistsSync(Path.resolve(FolderPath, '../../source/test/resource/empty'))

Test('../.babelrc.json', async (test) => {
  test.false(await FileSystem.pathExists(Path.resolve(FolderPath, test.title)))
})

Test('../.eslintrc.json', async (test) => {
  test.false(await FileSystem.pathExists(Path.resolve(FolderPath, test.title)))
})

Test('../index.cjs', async (test) => {
  test.true((await import(test.title)).OK)
})

Test('../index.js', async (test) => {
  test.true((await import(test.title)).OK)
})

Test('../index.json', async (test) => {
  test.true((await FileSystem.readJson(Path.resolve(FolderPath, test.title), { 'encoding': 'utf-8' })).OK)
})

Test('../makefile', async (test) => {
  test.false(await FileSystem.pathExists(Path.resolve(FolderPath, test.title)))
})
Test('./resource/.babelrc.json', async (test) => {
  test.false(await FileSystem.pathExists(Path.resolve(FolderPath, test.title)))
})

Test('./resource/.eslintrc.json', async (test) => {
  test.false(await FileSystem.pathExists(Path.resolve(FolderPath, test.title)))
})

Test('./resource/index.cjs', async (test) => {
  test.true((await import(test.title)).OK)
})

Test('./resource/index.js', async (test) => {
  test.true((await import(test.title)).OK)
})

Test('./resource/index.json', async (test) => {
  test.true((await FileSystem.readJson(Path.resolve(FolderPath, test.title), { 'encoding': 'utf-8' })).OK)
})

Test('./resource/copy', async (test) => {
  test.true(await PathExists(Path.resolve(FolderPath, '../../source/test', test.title), Path.resolve(FolderPath, test.title), (sourcePath, targetPath) => /makefile$/.test(sourcePath) ? [] : [ targetPath ]).then(({ exists }) => exists))
})

Test('./resource/custom', async (test) => {
  test.false(await FileSystem.pathExists(Path.resolve(FolderPath, './resource/custom/.eslintrc.json')))
  test.false(await FileSystem.pathExists(Path.resolve(FolderPath, './resource/custom/index.js')))
  test.false(await FileSystem.pathExists(Path.resolve(FolderPath, './resource/custom/makefile')))
  test.true(await FileSystem.pathExists(Path.resolve(FolderPath, './resource/custom/folder/file')))
})

;(EmptyPathExists ? Test : Test.skip)('./resource/empty', async (test) => {
  test.true(await FileSystem.pathExists(Path.resolve(FolderPath, test.title)))
})

Test('./resource/ignore', async (test) => {
  test.false(await FileSystem.pathExists(Path.resolve(FolderPath, test.title)))

})
