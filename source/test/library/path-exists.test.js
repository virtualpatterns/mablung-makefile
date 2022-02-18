import { PathExists } from '@virtualpatterns/mablung-makefile/test'
import Path from 'path'
import Test from 'ava'
import URL from 'url'

const ReleaseFolderPath = Path.dirname(URL.fileURLToPath(import.meta.url))
const SourceFolderPath = ReleaseFolderPath.replace('/release/', '/source/')

Test(`${Path.relative('', Path.resolve(ReleaseFolderPath, 'path-exists.js'))} returns true`, async (test) => {

  let sourcePath = Path.resolve(ReleaseFolderPath, 'path-exists.js')
  let item = await PathExists(sourcePath)
    
  test.is(item.path, sourcePath)
  test.true(item.exists)

})

Test(`${Path.relative('', ReleaseFolderPath)} returns true`, async (test) => {

  let sourcePath = ReleaseFolderPath
  let item = await PathExists(sourcePath)

  test.is(item.path, sourcePath)
  test.true(item.exists)

})

Test(`${Path.relative('', ReleaseFolderPath)} vs ${Path.relative('', SourceFolderPath)} returns false`, async (test) => {

  let sourcePath = ReleaseFolderPath
  let targetPath = SourceFolderPath
  let item = await PathExists(sourcePath, targetPath)

  // test.log(item)
  test.is(item.path, Path.resolve(SourceFolderPath, 'path-exists.js.map'))
  test.false(item.exists)

})

Test(`${Path.relative('', ReleaseFolderPath)} vs ${Path.relative('', SourceFolderPath)} returns true`, async (test) => {

  let sourcePath = ReleaseFolderPath
  let targetPath = SourceFolderPath
  let item = await PathExists(sourcePath, targetPath, (sourcePath, targetPath) => /\.js\.map$/.test(sourcePath) ? [] : [ targetPath ])

  // test.log(item)
  test.is(item.path, targetPath)
  test.true(item.exists)

})

Test(`${Path.relative('', SourceFolderPath)} vs ${Path.relative('', ReleaseFolderPath)} returns true`, async (test) => {

  let sourcePath = SourceFolderPath
  let targetPath = ReleaseFolderPath
  let item = await PathExists(sourcePath, targetPath, (sourcePath, targetPath) => /\.js$/.test(sourcePath) ? [ targetPath, targetPath.concat('.map') ] : [ targetPath ])

  // test.log(item)
  test.is(item.path, targetPath)
  test.true(item.exists)

})
