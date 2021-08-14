import FileSystem from 'fs-extra'
import Path from 'path'
import Test from 'ava'
import URL from 'url'

import { Package } from '../../library/package.js'

import { MablungMakefileProcess } from './mablung-makefile-process.js'

const FilePath = URL.fileURLToPath(import.meta.url)
const FolderPath = Path.dirname(FilePath)

Test('(default)', async (test) => {
  let process = new MablungMakefileProcess()
  test.is(await process.whenExit(), 1)
})

Test('get-version', async (test) => {
  let process = new MablungMakefileProcess({ 'get-version': true })
  test.is(await process.whenExit(), 0)
})

Test('get-path', async (test) => {
  let process = new MablungMakefileProcess({ 'get-path': true })
  test.is(await process.whenExit(), 0)
})

Test('update-package', async (test) => {
  let process = new MablungMakefileProcess({ 'update-package': true })
  test.is(await process.whenExit(), 1)
})

Test('update-package package-0.json', async (test) => {

  let _path = `${FolderPath}/resource/package-0.json`
  let _packageBefore = await FileSystem.readJson(_path, { 'encoding': 'utf-8' })

  let process = new MablungMakefileProcess({ 'update-package': _path })

  try {

    test.is(await process.whenExit(), 0)

    let _packageAfter = await FileSystem.readJson(_path, { 'encoding': 'utf-8' })

    test.deepEqual(_packageAfter.babel.overrides[1].exclude, [])

    _packageAfter.babel.overrides[1].exclude = Package.babel.overrides[1].exclude
    test.deepEqual(_packageAfter.babel, Package.babel)
    test.deepEqual(_packageAfter.eslintConfig, Package.eslintConfig)

  } finally {
    await FileSystem.writeJson(_path, _packageBefore, { 'encoding': 'utf-8', 'spaces': 2 })
  }

})

Test('update-package package-1.json', async (test) => {

  let _path = `${FolderPath}/resource/package-1.json`
  let _packageBefore = await FileSystem.readJson(_path, { 'encoding': 'utf-8' })

  let process = new MablungMakefileProcess({ 'update-package': _path })

  try {

    test.is(await process.whenExit(), 0)

    let _packageAfter = await FileSystem.readJson(_path, { 'encoding': 'utf-8' })

    test.deepEqual(_packageAfter.babel.overrides[1].exclude, _packageBefore.babel.overrides[1].exclude)

    _packageAfter.babel.overrides[1].exclude = Package.babel.overrides[1].exclude
    test.deepEqual(_packageAfter.babel, Package.babel)
    test.deepEqual(_packageAfter.eslintConfig, Package.eslintConfig)

  } finally {
    await FileSystem.writeJson(_path, _packageBefore, { 'encoding': 'utf-8', 'spaces': 2 })
  }

})
