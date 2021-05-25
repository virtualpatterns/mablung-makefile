import { createRequire as CreateRequire } from 'module'
import FileSystem from 'fs-extra'
import JSON5 from 'json5'
import Path from 'path'
import Test from 'ava'
import URL from 'url'

const FilePath = URL.fileURLToPath(import.meta.url)
const FolderPath = Path.dirname(FilePath)
const Require = CreateRequire(import.meta.url)

Test('.babelrc.json', async (test) => {
  test.false(await FileSystem.pathExists(`${FolderPath}/../.babelrc.json`))
})

Test('.eslintrc.json', async (test) => {
  test.false(await FileSystem.pathExists(`${FolderPath}/../.eslintrc.json`))
})

Test('index.cjs', async (test) => {
  test.true((await import('../index.cjs')).OK)
})

Test('index.js', async (test) => {
  test.true((await import('../index.js')).OK)
})

Test('index.json', async (test) => {
  test.true(JSON5.parse(await FileSystem.readFile(Require.resolve('../index.json'), { 'encoding': 'utf-8' })).OK)
})

Test('index.mjs', async (test) => {
  test.true((await import('../index.mjs')).OK)
})

Test('resource/package.json', async (test) => {
  test.true(JSON5.parse(await FileSystem.readFile(Require.resolve('../resource/package.json'), { 'encoding': 'utf-8' })).OK)
})
