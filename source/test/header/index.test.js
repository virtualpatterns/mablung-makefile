import { CreateLoggedProcess, ForkedProcess } from '@virtualpatterns/mablung-worker'
import { createRequire as CreateRequire } from 'module'
import FileSystem from 'fs-extra'
import Path from 'path'
import Test from 'ava'
import URL from 'url'

const FilePath = URL.fileURLToPath(import.meta.url)
const LogPath = FilePath.replace(/\/release\//, '/data/').replace(/\.c?js$/, '.log')
const Require = CreateRequire(import.meta.url)

const LoggedProcess = CreateLoggedProcess(ForkedProcess, LogPath)

Test.before(async () => {
  await FileSystem.ensureDir(Path.dirname(LogPath))
  await FileSystem.remove(LogPath)
})

Test.serial('default', async (test) => {
  let process = new LoggedProcess(Require.resolve('../../header/index.js'))
  test.is(await process.whenExit(), 0)
})
