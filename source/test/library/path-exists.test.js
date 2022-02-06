import { PathExists } from '@virtualpatterns/mablung-makefile/test'
import Path from 'path'
import Test from 'ava'
import URL from 'url'

const FolderPath = Path.dirname(URL.fileURLToPath(import.meta.url))

Test(`${Path.relative('', Path.resolve(FolderPath, 'path-exists.js'))} returns true`, async (test) => {

  let sourcePath = Path.resolve(FolderPath, 'path-exists.js')
  let item = await PathExists(sourcePath)
    
  test.is(item.path, sourcePath)
  test.true(item.exists)

})

Test(`${Path.relative('', FolderPath)} returns true`, async (test) => {

  let sourcePath = FolderPath
  let item = await PathExists(sourcePath)

  test.is(item.path, sourcePath)
  test.true(item.exists)

})

Test(`${Path.relative('', FolderPath)} vs ${Path.relative('', Path.resolve(FolderPath, '../../../source/test/library'))} returns false`, async (test) => {

  let sourcePath = FolderPath
  let targetPath = Path.resolve(FolderPath, '../../../source/test/library')
  let item = await PathExists(sourcePath, targetPath)

  // test.log(item)
  test.is(item.path, Path.resolve(targetPath, 'index.test.js.map'))
  test.false(item.exists)

})

Test(`${Path.relative('', FolderPath)} vs ${Path.relative('', Path.resolve(FolderPath, '../../../source/test/library'))} returns true`, async (test) => {

  let sourcePath = FolderPath
  let targetPath = Path.resolve(FolderPath, '../../../source/test/library')
  let item = await PathExists(sourcePath, targetPath, (sourcePath, targetPath) => /\.js\.map$/.test(sourcePath) ? [] : [ targetPath ])

  test.is(item.path, targetPath)
  test.true(item.exists)

})

Test(`${Path.relative('', Path.resolve(FolderPath, '../../../source/test/library'))} vs ${Path.relative('', FolderPath)} returns true`, async (test) => {

  let sourcePath = Path.resolve(FolderPath, '../../../source/test/library')
  let targetPath = FolderPath
  let item = await PathExists(sourcePath, targetPath, (sourcePath, targetPath) => /\.js$/.test(sourcePath) ? [ targetPath, targetPath.concat('.map') ] : [ targetPath ])

  test.is(item.path, targetPath)
  test.true(item.exists)

})
