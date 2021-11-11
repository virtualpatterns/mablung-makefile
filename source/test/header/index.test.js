import { CreateLoggedProcess } from '@virtualpatterns/mablung-worker/test'
import { createRequire as CreateRequire } from 'module'
import { ForkedProcess } from '@virtualpatterns/mablung-worker'
import FileSystem from 'fs-extra'
import Path from 'path'
import Test from 'ava'
import URL from 'url'

const FilePath = URL.fileURLToPath(import.meta.url)
const Require = CreateRequire(import.meta.url)

const LogPath = FilePath.replace('/release/', '/data/').replace(/\.test\.c?js$/, '.log')
const LoggedProcess = CreateLoggedProcess(ForkedProcess, LogPath)

Test.before(async () => {
  await FileSystem.ensureDir(Path.dirname(LogPath))
  return FileSystem.remove(LogPath)
})

Test.serial('default', async (test) => {
  let process = new LoggedProcess(Require.resolve('@virtualpatterns/mablung-makefile/header'))
  test.is(await process.whenExit(), 0)
})
