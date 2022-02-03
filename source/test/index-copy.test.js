import FileSystem from 'fs-extra'
import Path from 'path'
import Test from 'ava'
import URL from 'url'

const FolderPath = Path.dirname(URL.fileURLToPath(import.meta.url))

Test('./resource/copy/folder/index.js', async (test) => {
  test.true(await FileSystem.pathExists(Path.resolve(FolderPath, test.title)))
})

Test('./resource/copy/folder/index.json', async (test) => {
  test.true((await FileSystem.readJson(Path.resolve(FolderPath, test.title), { 'encoding': 'utf-8' })).OK)
})

Test('./resource/copy/.babelrc.json', async (test) => {
  test.true(await FileSystem.pathExists(Path.resolve(FolderPath, test.title)))
})

Test('./resource/copy/.eslintrc.json', async (test) => {
  test.true(await FileSystem.pathExists(Path.resolve(FolderPath, test.title)))
})

Test('./resource/copy/index.js', async (test) => {
  test.true(await FileSystem.pathExists(Path.resolve(FolderPath, test.title)))
})

Test('./resource/copy/index.json', async (test) => {
  test.true((await FileSystem.readJson(Path.resolve(FolderPath, test.title), { 'encoding': 'utf-8' })).OK)
})

Test('./resource/copy/makefile', async (test) => {
  test.false(await FileSystem.pathExists(Path.resolve(FolderPath, test.title)))
})
