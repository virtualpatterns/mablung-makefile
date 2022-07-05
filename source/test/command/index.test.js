import { CreateRandomId } from '@virtualpatterns/mablung-makefile/test'
import { LoggedForkedProcess } from '@virtualpatterns/mablung-worker/test'
import FileSystem from 'fs-extra'
import Path from 'path'
import Test from 'ava'
import URL from 'url'

const FilePath = URL.fileURLToPath(import.meta.url)
const FolderPath = Path.dirname(FilePath)
const Process = process

const DataPath = FilePath.replace('/release/', '/data/').replace('.test.js', '')

Test.before(() => {
  return FileSystem.emptyDir(DataPath)
})

Test.beforeEach(async (test) => {

  let id = await CreateRandomId()
  let logPath = Path.resolve(DataPath, `${id}.log`)

  test.context.logPath = logPath

})

Test('default', async (test) => {
  let process = new LoggedForkedProcess(test.context.logPath, Path.resolve(FolderPath, '../../command/index.js'))
  test.is(await process.whenExit(), 1)
})

Test('get-version', async (test) => {
  let process = new LoggedForkedProcess(test.context.logPath, Path.resolve(FolderPath, '../../command/index.js'), { 'get-version': true })
  test.is(await process.whenExit(), 0)
})

Test('get-version throws Error', async (test) => {
  let process = new LoggedForkedProcess(test.context.logPath, Path.resolve(FolderPath, '../../command/index.js'), { 'get-version': true }, { 'execArgv': [ ...Process.execArgv, '--require', Path.resolve(FolderPath, 'require/get-version.cjs') ] })
  test.is(await process.whenExit(), 1)
})

Test('get-path', async (test) => {
  let process = new LoggedForkedProcess(test.context.logPath, Path.resolve(FolderPath, '../../command/index.js'), { 'get-path': true })
  test.is(await process.whenExit(), 0)
})

Test('get-path throws Error', async (test) => {
  let process = new LoggedForkedProcess(test.context.logPath, Path.resolve(FolderPath, '../../command/index.js'), { 'get-path': true }, { 'execArgv': [ ...Process.execArgv, '--require', Path.resolve(FolderPath, 'require/get-path.cjs') ] })
  test.is(await process.whenExit(), 1)
})
