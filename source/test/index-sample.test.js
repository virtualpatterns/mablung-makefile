import FileSystem from 'fs-extra'
import Path from 'path'
import Test from 'ava'
import URL from 'url'

const FolderPath = Path.dirname(URL.fileURLToPath(import.meta.url))

Test('../sample.babelrc.json', async (test) => {
  test.true((await FileSystem.readJson(Path.resolve(FolderPath, '../sample.babelrc.json'), { 'encoding': 'utf-8' })).OK)
})

Test('../sample.DS_Store', async (test) => {
  test.true(await FileSystem.pathExists(Path.resolve(FolderPath, '../sample.DS_Store')))
})

Test('../sample.eslintrc.json', async (test) => {
  test.true((await FileSystem.readJson(Path.resolve(FolderPath, '../sample.eslintrc.json'), { 'encoding': 'utf-8' })).OK)
})

Test('./resource/sample.babelrc.json', async (test) => {
  test.true((await FileSystem.readJson(Path.resolve(FolderPath, './resource/sample.babelrc.json'), { 'encoding': 'utf-8' })).OK)
})

Test('./resource/sample.DS_Store', async (test) => {
  test.true(await FileSystem.pathExists(Path.resolve(FolderPath, './resource/sample.DS_Store')))
})

Test('./resource/sample.eslintrc.json', async (test) => {
  test.true((await FileSystem.readJson(Path.resolve(FolderPath, './resource/sample.eslintrc.json'), { 'encoding': 'utf-8' })).OK)
})
