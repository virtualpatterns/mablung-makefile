import FileSystem from 'fs-extra'
import Path from 'path'
import Test from 'ava'
import URL from 'url'

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

Test('update-configuration', async (test) => {
  let process = new MablungMakefileProcess({ 'update-configuration': true })
  test.is(await process.whenExit(), 0)
})

Test('update-configuration configuration-0', async (test) => {

  let sourcePath = `${FolderPath}/../../../configuration`
  let sourceCheckPath = `${sourcePath}/check.json`
  let sourceCompilePath = `${sourcePath}/compile.json`

  let targetPath = `${FolderPath}/resource/configuration-0`
  let targetCheckPath = `${targetPath}/check.json`
  let targetCompilePath = `${targetPath}/compile.json`

  let [
    sourceCheckConfiguration,
    sourceCompileConfiguration
  ] = await Promise.all([
    FileSystem.readJson(sourceCheckPath, { 'encoding': 'utf-8' }),
    FileSystem.readJson(sourceCompilePath, { 'encoding': 'utf-8' })
  ])

  let process = new MablungMakefileProcess({ 'update-configuration': targetPath })

  try {

    test.is(await process.whenExit(), 0)

    let [
      targetCheckConfigurationAfter,
      targetCompileConfigurationAfter
    ] = await Promise.all([
      FileSystem.readJson(targetCheckPath, { 'encoding': 'utf-8' }),
      FileSystem.readJson(targetCompilePath, { 'encoding': 'utf-8' })
    ])

    test.deepEqual(targetCheckConfigurationAfter, sourceCheckConfiguration)
    test.deepEqual(targetCompileConfigurationAfter.overrides[1].exclude, [])

    sourceCompileConfiguration.overrides[1].exclude = []
    test.deepEqual(targetCompileConfigurationAfter, sourceCompileConfiguration)

  } finally {

    await Promise.all([
      FileSystem.remove(targetCheckPath),
      FileSystem.remove(targetCompilePath)
    ])

  }

})

Test('update-configuration configuration-1', async (test) => {

  let sourcePath = `${FolderPath}/../../../configuration`
  let sourceCheckPath = `${sourcePath}/check.json`
  let sourceCompilePath = `${sourcePath}/compile.json`

  let targetPath = `${FolderPath}/resource/configuration-1`
  let targetCheckPath = `${targetPath}/check.json`
  let targetCompilePath = `${targetPath}/compile.json`

  let [
    sourceCheckConfiguration,
    sourceCompileConfiguration,
    targetCheckConfigurationBefore,
    targetCompileConfigurationBefore
  ] = await Promise.all([
    FileSystem.readJson(sourceCheckPath, { 'encoding': 'utf-8' }),
    FileSystem.readJson(sourceCompilePath, { 'encoding': 'utf-8' }),
    FileSystem.readJson(targetCheckPath, { 'encoding': 'utf-8' }),
    FileSystem.readJson(targetCompilePath, { 'encoding': 'utf-8' })
  ])

  let process = new MablungMakefileProcess({ 'update-configuration': targetPath })

  try {

    test.is(await process.whenExit(), 0)

    let [
      targetCheckConfigurationAfter,
      targetCompileConfigurationAfter
    ] = await Promise.all([
      FileSystem.readJson(targetCheckPath, { 'encoding': 'utf-8' }),
      FileSystem.readJson(targetCompilePath, { 'encoding': 'utf-8' })
    ])

    test.deepEqual(targetCheckConfigurationAfter, sourceCheckConfiguration)
    test.deepEqual(targetCompileConfigurationAfter.overrides[1].exclude, targetCompileConfigurationBefore.overrides[1].exclude)

    sourceCompileConfiguration.overrides[1].exclude = []
    targetCompileConfigurationAfter.overrides[1].exclude = []
    test.deepEqual(targetCompileConfigurationAfter, sourceCompileConfiguration)

  } finally {

    await Promise.all([
      FileSystem.writeJson(targetCheckPath, targetCheckConfigurationBefore, { 'encoding': 'utf-8', 'spaces': 2 }),
      FileSystem.writeJson(targetCompilePath, targetCompileConfigurationBefore, { 'encoding': 'utf-8', 'spaces': 2 })
    ])

  }

})
