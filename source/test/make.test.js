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

const IsDirty = Is.equal(Process.env.GIT_IS_DIRTY, 'true')

Test.before(async (test) => {

  test.timeout(15000)

  await FileSystem.ensureDir(Path.dirname(LogPath))
  return FileSystem.remove(LogPath)

})

Test('default', async (test) => {
  let process = new LoggedProcess(Process.env.MAKE_PATH, [])
  test.is(await process.whenExit(), 0)
})

Test('null', async (test) => {
  // an invalid target fails
  let process = new LoggedProcess(Process.env.MAKE_PATH, [ 'null' ])
  test.is(await process.whenExit(), 2)
})

Test('commit message=...', async (test) => {
  let process = new LoggedProcess(Process.env.MAKE_PATH, [ '--dry-run', 'commit', 'message=test' ])
  test.is(await process.whenExit(), 0)
})

;(Is.nil(Process.env.message) ? Test.serial : Test.serial.skip)('commit', async (test) => {
  let process = new LoggedProcess(Process.env.MAKE_PATH, ['--dry-run', 'commit'])
  test.is(await process.whenExit(), IsDirty ? 2 : 0)
})

Test('update', async (test) => {
  let process = new LoggedProcess(Process.env.MAKE_PATH, [ '--dry-run', 'update' ])
  test.is(await process.whenExit(), 0)
})

Test('version', async (test) => {
  let process = new LoggedProcess(Process.env.MAKE_PATH, [ 'version' ])
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
  let process = new LoggedProcess(Process.env.MAKE_PATH, [ 'run', 'argument=release/command/index.js get-version' ])
  test.is(await process.whenExit(), 0)
})

;(Is.nil(Process.env.argument) ? Test.serial : Test.serial.skip)('run ...', async (test) => {
  let process = new LoggedProcess(Process.env.MAKE_PATH, [ 'run', 'release/command/index.js', 'get-version' ])
  test.is(await process.whenExit(), 0)
})

;(Is.nil(Process.env.argument) ? Test.serial : Test.serial.skip)('run', async (test) => {
  let process = new LoggedProcess(Process.env.MAKE_PATH, [ 'run' ])
  test.is(await process.whenExit(), 2)
})

;(Is.nil(Process.env.argument) ? Test.serial : Test.serial.skip)('cover', async (test) => {
  let process = new LoggedProcess(Process.env.MAKE_PATH, [ '--dry-run', 'cover' ])
  test.is(await process.whenExit(), 0)
})

;(Is.nil(Process.env.argument) ? Test.serial : Test.serial.skip)('test', async (test) => {
  let process = new LoggedProcess(Process.env.MAKE_PATH, [ '--dry-run', 'test' ])
  test.is(await process.whenExit(), 0)
})

;(IsDirty ? Test.serial.skip : Test.serial)('release version=...', async (test) => {
  let process = new LoggedProcess(Process.env.MAKE_PATH, [ '--dry-run', 'release', 'version=prerelease' ])
  test.is(await process.whenExit(), 0)
})

/* c8 ignore next 4 */
;(IsDirty || Is.not.nil(Process.env.version) ? Test.serial.skip : Test.serial)('release', async (test) => {
  let process = new LoggedProcess(Process.env.MAKE_PATH, [ '--dry-run', 'release' ])
  test.is(await process.whenExit(), 2)
})

Test('build', async (test) => {
  let process = new LoggedProcess(Process.env.MAKE_PATH, [ 'build' ])
  test.is(await process.whenExit(), 0)
})

Test('clean', async (test) => {
  let process = new LoggedProcess(Process.env.MAKE_PATH, ['--dry-run', 'clean'])
  test.is(await process.whenExit(), 0)
})
