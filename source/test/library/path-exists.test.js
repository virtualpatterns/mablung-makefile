import { PathExists } from '@virtualpatterns/mablung-makefile/test'
import Path from 'path'
import Test from 'ava'
import URL from 'url'

const FolderPath = Path.dirname(URL.fileURLToPath(import.meta.url))

Test(`${Path.relative('', Path.resolve(FolderPath, './path-exists.js'))} returns true`, async (test) => {
  test.true(await PathExists(Path.resolve(FolderPath, './path-exists.js')).then(({ exists }) => exists))
})

Test(`${Path.relative('', FolderPath)} returns true`, async (test) => {
  test.true(await PathExists(FolderPath).then(({ exists }) => exists))
})

Test(`${Path.relative('', FolderPath)} vs ${Path.relative('', Path.resolve(FolderPath, '../../../source/test/library'))} returns false`, async (test) => {
  test.false(await PathExists(FolderPath, Path.resolve(FolderPath, '../../../source/test/library')).then(({ exists }) => exists))
})

Test(`${Path.relative('', FolderPath)} vs ${Path.relative('', Path.resolve(FolderPath, '../../../source/test/library'))} returns true`, async (test) => {
  test.true(await PathExists(FolderPath, Path.resolve(FolderPath, '../../../source/test/library'), (sourcePath, targetPath) => /\.js\.map$/.test(sourcePath) ? [] : [ targetPath ]).then(({ exists }) => exists))
})

Test(`${Path.relative('', Path.resolve(FolderPath, '../../../source/test/library'))} vs ${Path.relative('', FolderPath)} returns true`, async (test) => {
  test.true(await PathExists(Path.resolve(FolderPath, '../../../source/test/library'), FolderPath, (sourcePath, targetPath) => /\.js$/.test(sourcePath) ? [ targetPath, targetPath.concat('.map') ] : [ targetPath ]).then(({ exists }) => exists))
})
