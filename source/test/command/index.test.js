import { CreateLoggedProcess } from '@virtualpatterns/mablung-worker/test'
import { ForkedProcess } from '@virtualpatterns/mablung-worker'
import FileSystem from 'fs-extra'
import Path from 'path'
import Test from 'ava'
import URL from 'url'

const FilePath = URL.fileURLToPath(import.meta.url)
const FolderPath = Path.dirname(FilePath)
const Process = process

const DataPath = FilePath.replace('/release/', '/data/').replace('.test.js', '')
const LogPath = DataPath.concat('.log')
const LoggedProcess = CreateLoggedProcess(ForkedProcess, LogPath)

Test.before(async () => {
  await FileSystem.ensureDir(Path.dirname(LogPath))
  return FileSystem.remove(LogPath)
})

Test('default', async (test) => {
  let process = new LoggedProcess(Path.resolve(FolderPath, '../../command/index.js'))
  test.is(await process.whenExit(), 1)
})

Test('get-version', async (test) => {
  let process = new LoggedProcess(Path.resolve(FolderPath, '../../command/index.js'), { 'get-version': true })
  test.is(await process.whenExit(), 0)
})

Test('get-version throws Error', async (test) => {
  let process = new LoggedProcess(Path.resolve(FolderPath, '../../command/index.js'), { 'get-version': true }, { 'execArgv': [ ...Process.execArgv, '--require', Path.resolve(FolderPath, 'require/get-version.cjs') ] })
  test.is(await process.whenExit(), 1)
})

Test('get-path', async (test) => {
  let process = new LoggedProcess(Path.resolve(FolderPath, '../../command/index.js'), { 'get-path': true })
  test.is(await process.whenExit(), 0)
})

Test('get-path throws Error', async (test) => {
  let process = new LoggedProcess(Path.resolve(FolderPath, '../../command/index.js'), { 'get-path': true }, { 'execArgv': [ ...Process.execArgv, '--require', Path.resolve(FolderPath, 'require/get-path.cjs') ] })
  test.is(await process.whenExit(), 1)
})

// Test('update', async (test) => {
//   let process = new LoggedProcess(Path.resolve(FolderPath, '../../command/index.js'), { 'update': true })
//   test.is(await process.whenExit(), 1)
// })

// Test('update target-0', async (test) => {

//   let sourcePath = Path.resolve(FolderPath, '../../..')
//   let sourceCheckPath = Path.resolve(sourcePath, '.eslintrc.json')
//   let sourceCompilePath = Path.resolve(sourcePath, 'babel.config.json')

//   let targetPath = Path.resolve(FolderPath, 'resource/target-0')
//   let targetCheckPath = Path.resolve(targetPath, '.eslintrc.json')
//   let targetCompilePath = Path.resolve(targetPath, 'babel.config.json')

//   let [
//     sourceCheck,
//     sourceCompile
//   ] = await Promise.all([
//     FileSystem.readJson(sourceCheckPath, { 'encoding': 'utf-8' }),
//     FileSystem.readJson(sourceCompilePath, { 'encoding': 'utf-8' })
//   ])

//   let process = new LoggedProcess(Path.resolve(FolderPath, '../../command/index.js'), { 'update': targetPath })

//   try {

//     test.is(await process.whenExit(), 0)

//     test.deepEqual(await Promise.all([
//       FileSystem.pathExists(targetCheckPath),
//       FileSystem.pathExists(targetCompilePath)
//     ]), [
//       true,
//       true
//     ])
    
//     let [
//       targetCheckAfter,
//       targetCompileAfter
//     ] = await Promise.all([
//       FileSystem.readJson(targetCheckPath, { 'encoding': 'utf-8' }),
//       FileSystem.readJson(targetCompilePath, { 'encoding': 'utf-8' })
//     ])

//     test.deepEqual(targetCheckAfter, sourceCheck)
//     test.deepEqual(targetCompileAfter, sourceCompile)

//   } finally {

//     await Promise.all([
//       FileSystem.remove(targetCheckPath),
//       FileSystem.remove(targetCompilePath)
//     ])

//   }

// })

// Test('update target-1', async (test) => {

//   let sourcePath = Path.resolve(FolderPath, '../../..')
//   let sourceCheckPath = Path.resolve(sourcePath, '.eslintrc.json')
//   let sourceCompilePath = Path.resolve(sourcePath, 'babel.config.json')

//   let targetPath = Path.resolve(FolderPath, 'resource/target-1')
//   let targetCheckPath = Path.resolve(targetPath, '.eslintrc.json')
//   let targetCompilePath = Path.resolve(targetPath, 'babel.config.json')

//   let [
//     sourceCheck,
//     sourceCompile,
//     targetCheckBefore,
//     targetCompileBefore
//   ] = await Promise.all([
//     FileSystem.readJson(sourceCheckPath, { 'encoding': 'utf-8' }),
//     FileSystem.readJson(sourceCompilePath, { 'encoding': 'utf-8' }),
//     FileSystem.readJson(targetCheckPath, { 'encoding': 'utf-8' }),
//     FileSystem.readJson(targetCompilePath, { 'encoding': 'utf-8' })
//   ])

//   let process = new LoggedProcess(Path.resolve(FolderPath, '../../command/index.js'), { 'update': targetPath })

//   try {

//     test.is(await process.whenExit(), 0)

//     let [
//       targetCheckAfter,
//       targetCompileAfter
//     ] = await Promise.all([
//       FileSystem.readJson(targetCheckPath, { 'encoding': 'utf-8' }),
//       FileSystem.readJson(targetCompilePath, { 'encoding': 'utf-8' })
//     ])

//     test.deepEqual(targetCheckAfter, sourceCheck)
//     test.deepEqual(targetCompileAfter, sourceCompile)

//   } finally {

//     await Promise.all([
//       FileSystem.writeJson(targetCheckPath, targetCheckBefore, { 'encoding': 'utf-8', 'spaces': 2 }),
//       FileSystem.writeJson(targetCompilePath, targetCompileBefore, { 'encoding': 'utf-8', 'spaces': 2 })
//     ])

//   }

// })
