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

Test('../index.js', async (test) => {
  test.true((await import(test.title)).OK)
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

;(EmptyPathExists ? Test : Test.skip)('./resource/empty', async (test) => {
  test.true(await FileSystem.pathExists(Path.resolve(FolderPath, test.title)))
})

Test('./resource/ignore', async (test) => {
  test.false(await FileSystem.pathExists(Path.resolve(FolderPath, test.title)))
})
