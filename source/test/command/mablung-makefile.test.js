import FileSystem from 'fs-extra'
import Path from 'path'
import Test from 'ava'
import URL from 'url'

import { Package } from '../../library/package.js'

import { MablungMakefileProcess } from './mablung-makefile-process.js'

const FilePath = URL.fileURLToPath(import.meta.url)
const FolderPath = Path.dirname(FilePath)

Test.skip('(default)', async (test) => {
  let process = new MablungMakefileProcess()
  test.is(await process.whenExit(), 1)
})

Test.skip('get-version', async (test) => {
  let process = new MablungMakefileProcess({ 'get-version': true })
  test.is(await process.whenExit(), 0)
})

Test.skip('get-path', async (test) => {
  let process = new MablungMakefileProcess({ 'get-path': true })
  test.is(await process.whenExit(), 0)
})

Test.only('update-package [path]', async (test) => {

  let _path = `${FolderPath}/resource/package.json`

  let process = new MablungMakefileProcess({ 'update-package': _path })
  test.is(await process.whenExit(), 0)

  let _package = await FileSystem.readJson(_path, { 'encoding': 'utf-8' })

  test.deepEqual(_package.babel, Package.babel)
  test.deepEqual(_package.eslintConfig, Package.eslintConfig)

})
