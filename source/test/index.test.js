import FileSystem from 'fs-extra'
import Path from 'path'
import Test from 'ava'
import URL from 'url'

const FolderPath = Path.dirname(URL.fileURLToPath(import.meta.url))

const EmptyPathExists = FileSystem.pathExistsSync(Path.resolve(FolderPath, '../../source/test/resource/empty'))

Test('index.js', async (test) => {
  test.true((await import('../index.js')).OK)
})

Test('./resource/index.cjs', async (test) => {
  test.true((await import('./resource/index.cjs')).OK)
})

Test('./resource/index.js', async (test) => {
  test.true((await import('./resource/index.js')).OK)
})

Test('./resource/index.json', async (test) => {
  test.true((await FileSystem.readJson(Path.resolve(FolderPath, './resource/index.json'), { 'encoding': 'utf-8' })).OK)
})

;(EmptyPathExists ? Test : Test.skip)('./resource/empty', async (test) => {
  test.true(await FileSystem.pathExists(Path.resolve(FolderPath, './resource/empty')))
})

Test('./resource/ignore', async (test) => {
  test.false(await FileSystem.pathExists(Path.resolve(FolderPath, './resource/ignore')))
})
