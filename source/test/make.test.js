import { CreateLoggedProcess } from '@virtualpatterns/mablung-worker/test'
import { SpawnedProcess } from '@virtualpatterns/mablung-worker'
import FileSystem from 'fs-extra'
import Is from '@pwn/is'
import Path from 'path'
import Test from 'ava'
import URL from 'url'

const FilePath = URL.fileURLToPath(import.meta.url)
const Process = process

const DataPath = FilePath.replace('/release/', '/data/').replace('.test.js', '')
const LogPath = DataPath.concat('.log')
const LoggedProcess = CreateLoggedProcess(SpawnedProcess, LogPath)

const IsDirty = Is.equal(Process.env.IS_DIRTY, 'true')

Test.before(async () => {
  await FileSystem.ensureDir(Path.dirname(LogPath))
  return FileSystem.remove(LogPath)
})

Test('default', async (test) => {
  let process = new LoggedProcess(Process.env.MAKE_PATH, [])
  test.is(await process.whenExit(), 0)
})

Test('null', async (test) => {
  // an invalid target fails
  let process = new LoggedProcess(Process.env.MAKE_PATH, [ '--dry-run', 'null' ])
  test.is(await process.whenExit(), 2)
})

Test('commit message=...', async (test) => {
  let process = new LoggedProcess(Process.env.MAKE_PATH, [ '--dry-run', 'commit', 'message=test' ])
  test.is(await process.whenExit(), 0)
})

;(Is.nil(Process.env.message) ? Test : Test.skip)('commit', async (test) => {
  let process = new LoggedProcess(Process.env.MAKE_PATH, [ '--dry-run', 'commit' ])
  test.is(await process.whenExit(), IsDirty ? 2 : 0)
})

Test('update', async (test) => {
  let process = new LoggedProcess(Process.env.MAKE_PATH, [ '--dry-run', 'update' ])
  test.is(await process.whenExit(), 0)
})

Test('version', async (test) => {
  let process = new LoggedProcess(Process.env.MAKE_PATH, [ '--dry-run', 'version' ])
  test.is(await process.whenExit(), 0)
})

Test('install', async (test) => {
  let process = new LoggedProcess(Process.env.MAKE_PATH, [ '--dry-run', 'install' ])
  test.is(await process.whenExit(), 0)
})

Test('re-install', async (test) => {
  let process = new LoggedProcess(Process.env.MAKE_PATH, [ '--dry-run', 're-install' ])
  test.is(await process.whenExit(), 0)
})

Test('run argument="..."', async (test) => {
  let process = new LoggedProcess(Process.env.MAKE_PATH, [ '--dry-run', 'run', 'argument=release/command/index.js get-version' ])
  test.is(await process.whenExit(), 0)
})

;(Is.nil(Process.env.argument) ? Test : Test.skip)('run ...', async (test) => {
  let process = new LoggedProcess(Process.env.MAKE_PATH, [ '--dry-run', 'run', 'release/command/index.js', 'get-version' ])
  test.is(await process.whenExit(), 0)
})

;(Is.nil(Process.env.argument) ? Test : Test.skip)('run', async (test) => {
  let process = new LoggedProcess(Process.env.MAKE_PATH, [ '--dry-run', 'run' ])
  test.is(await process.whenExit(), 2)
})

;(Is.nil(Process.env.argument) ? Test : Test.skip)('cover', async (test) => {
  let process = new LoggedProcess(Process.env.MAKE_PATH, [ '--dry-run', 'cover' ])
  test.is(await process.whenExit(), 0)
})

;(Is.nil(Process.env.argument) ? Test : Test.skip)('test', async (test) => {
  let process = new LoggedProcess(Process.env.MAKE_PATH, [ '--dry-run', 'test' ])
  test.is(await process.whenExit(), 0)
})

;(IsDirty ? Test.skip : Test)('release version=...', async (test) => {
  let process = new LoggedProcess(Process.env.MAKE_PATH, [ '--dry-run', 'release', 'version=prerelease' ])
  test.is(await process.whenExit(), 0)
})

/* c8 ignore next 4 */
;(IsDirty || Is.not.nil(Process.env.version) ? Test.skip : Test)('release', async (test) => {
  let process = new LoggedProcess(Process.env.MAKE_PATH, [ '--dry-run', 'release' ])
  test.is(await process.whenExit(), 2)
})

Test('lint', async (test) => {
  let process = new LoggedProcess(Process.env.MAKE_PATH, [ '--dry-run', 'lint' ])
  test.is(await process.whenExit(), 0)
})

Test('build', async (test) => {
  let process = new LoggedProcess(Process.env.MAKE_PATH, [ '--dry-run', 'build' ])
  test.is(await process.whenExit(), 0)
})
