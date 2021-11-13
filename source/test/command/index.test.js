import { CreateLoggedProcess } from '@virtualpatterns/mablung-worker/test'
import { createRequire as CreateRequire } from 'module'
import { ForkedProcess } from '@virtualpatterns/mablung-worker'
import FileSystem from 'fs-extra'
import Path from 'path'
import Test from 'ava'
import URL from 'url'

const FilePath = URL.fileURLToPath(import.meta.url)
const FolderPath = Path.dirname(FilePath)
const Process = process
const Require = CreateRequire(import.meta.url)

const LogPath = FilePath.replace('/release/', '/data/').replace(/\.test\.c?js$/, '.log')
const LoggedProcess = CreateLoggedProcess(ForkedProcess, LogPath)

Test.before(async () => {
  await FileSystem.ensureDir(Path.dirname(LogPath))
  return FileSystem.remove(LogPath)
})

Test.serial('default', async (test) => {
  let process = new LoggedProcess(Require.resolve('../../command/index.js'))
  test.is(await process.whenExit(), 1)
})

Test.serial('get-version', async (test) => {
  let process = new LoggedProcess(Require.resolve('../../command/index.js'), { 'get-version': true })
  test.is(await process.whenExit(), 0)
})

Test.serial('get-version throws Error', async (test) => {
  let process = new LoggedProcess(Require.resolve('../../command/index.js'), { 'get-version': true }, { 'execArgv': [ ...Process.execArgv, '--require', Require.resolve('./require/get-version.cjs') ] })
  test.is(await process.whenExit(), 1)
})

Test.serial('get-path', async (test) => {
  let process = new LoggedProcess(Require.resolve('../../command/index.js'), { 'get-path': true })
  test.is(await process.whenExit(), 0)
})

Test.serial('get-path throws Error', async (test) => {
  let process = new LoggedProcess(Require.resolve('../../command/index.js'), { 'get-path': true }, { 'execArgv': [ ...Process.execArgv, '--require', Require.resolve('./require/get-path.cjs') ] })
  test.is(await process.whenExit(), 1)
})

Test.serial('get-header', async (test) => {
  let process = new LoggedProcess(Require.resolve('../../command/index.js'), { 'get-header': true })
  test.is(await process.whenExit(), 0)
})

Test.serial('get-header throws Error', async (test) => {
  let process = new LoggedProcess(Require.resolve('../../command/index.js'), { 'get-header': true }, { 'execArgv': [ ...Process.execArgv, '--require', Require.resolve('./require/get-header.cjs') ] })
  test.is(await process.whenExit(), 1)
})

Test.serial('update', async (test) => {
  let process = new LoggedProcess(Require.resolve('../../command/index.js'), { 'update': true })
  test.is(await process.whenExit(), 1)
})

Test.serial('update target-0', async (test) => {

  let sourcePath = `${FolderPath}/../../..`
  let sourceCheckPath = `${sourcePath}/.eslintrc.json`
  let sourceCompilePath = `${sourcePath}/babel.config.json`

  let targetPath = `${FolderPath}/resource/target-0`
  let targetCheckPath = `${targetPath}/.eslintrc.json`
  let targetCompilePath = `${targetPath}/babel.config.json`
  let targetGetHeaderPath = `${targetPath}/get-header.js`

  let [
    sourceCheck,
    sourceCompile
  ] = await Promise.all([
    FileSystem.readJson(sourceCheckPath, { 'encoding': 'utf-8' }),
    FileSystem.readJson(sourceCompilePath, { 'encoding': 'utf-8' })
  ])

  let process = new LoggedProcess(Require.resolve('../../command/index.js'), { 'update': targetPath })

  try {

    test.is(await process.whenExit(), 0)

    test.deepEqual(await Promise.all([
      FileSystem.pathExists(targetCheckPath),
      FileSystem.pathExists(targetCompilePath),
      FileSystem.pathExists(targetGetHeaderPath)
    ]), [
      true,
      true,
      true
    ])
    
    let [
      targetCheckAfter,
      targetCompileAfter
    ] = await Promise.all([
      FileSystem.readJson(targetCheckPath, { 'encoding': 'utf-8' }),
      FileSystem.readJson(targetCompilePath, { 'encoding': 'utf-8' })
    ])

    test.deepEqual(targetCheckAfter, sourceCheck)
    test.deepEqual(targetCompileAfter.overrides[1].exclude, [])

    sourceCompile.overrides[1].exclude = []
    test.deepEqual(targetCompileAfter, sourceCompile)

  } finally {

    await Promise.all([
      FileSystem.remove(targetCheckPath),
      FileSystem.remove(targetCompilePath),
      FileSystem.remove(targetGetHeaderPath)
    ])

  }

})

Test.serial('update target-1', async (test) => {

  let sourcePath = `${FolderPath}/../../..`
  let sourceCheckPath = `${sourcePath}/.eslintrc.json`
  let sourceCompilePath = `${sourcePath}/babel.config.json`
  let sourceGetHeaderPath = `${sourcePath}/get-header.js`

  let targetPath = `${FolderPath}/resource/target-1`
  let targetCheckPath = `${targetPath}/.eslintrc.json`
  let targetCompilePath = `${targetPath}/babel.config.json`
  let targetGetHeaderPath = `${targetPath}/get-header.js`

  let [
    sourceCheck,
    sourceCompile,
    sourceGetHeader,
    targetCheckBefore,
    targetCompileBefore,
    targetGetHeaderBefore
  ] = await Promise.all([
    FileSystem.readJson(sourceCheckPath, { 'encoding': 'utf-8' }),
    FileSystem.readJson(sourceCompilePath, { 'encoding': 'utf-8' }),
    FileSystem.readFile(sourceGetHeaderPath, { 'encoding': 'utf-8' }),
    FileSystem.readJson(targetCheckPath, { 'encoding': 'utf-8' }),
    FileSystem.readJson(targetCompilePath, { 'encoding': 'utf-8' }),
    FileSystem.readFile(targetGetHeaderPath, { 'encoding': 'utf-8' })
  ])

  let process = new LoggedProcess(Require.resolve('../../command/index.js'), { 'update': targetPath })

  try {

    test.is(await process.whenExit(), 0)

    let [
      targetCheckAfter,
      targetCompileAfter,
      targetGetHeaderAfter
    ] = await Promise.all([
      FileSystem.readJson(targetCheckPath, { 'encoding': 'utf-8' }),
      FileSystem.readJson(targetCompilePath, { 'encoding': 'utf-8' }),
      FileSystem.readFile(targetGetHeaderPath, { 'encoding': 'utf-8' })
    ])

    test.deepEqual(targetCheckAfter, sourceCheck)
    test.deepEqual(targetCompileAfter.overrides[1].exclude, targetCompileBefore.overrides[1].exclude)

    sourceCompile.overrides[1].exclude = []
    targetCompileAfter.overrides[1].exclude = []
    test.deepEqual(targetCompileAfter, sourceCompile)

    test.is(targetGetHeaderAfter, sourceGetHeader)

  } finally {

    await Promise.all([
      FileSystem.writeJson(targetCheckPath, targetCheckBefore, { 'encoding': 'utf-8', 'spaces': 2 }),
      FileSystem.writeJson(targetCompilePath, targetCompileBefore, { 'encoding': 'utf-8', 'spaces': 2 }),
      FileSystem.writeFile(targetGetHeaderPath, targetGetHeaderBefore, { 'encoding': 'utf-8' })
    ])

  }

})
