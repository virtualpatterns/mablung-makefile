import { CreateLoggedProcess, SpawnedProcess } from '@virtualpatterns/mablung-worker'
import FileSystem from 'fs-extra'
import Is from '@pwn/is'
import Path from 'path'
import Shell from 'shelljs'
import Test from 'ava'
import URL from 'url'

const FilePath = URL.fileURLToPath(import.meta.url)
const FolderPath = Path.dirname(FilePath)
const IsDirty = Is.not.emptyString(Shell.exec('git status --porcelain ', { 'silent': true }).stdout)
const LogPath = FilePath.replace(/\/release\//, '/data/').replace(/\.c?js$/, '.log')
const Process = process

const LoggedProcess = CreateLoggedProcess(SpawnedProcess, LogPath)

Test.before(async () => {
  await FileSystem.ensureDir(Path.dirname(LogPath))
  await FileSystem.remove(LogPath)
})

Test.serial('default', async (test) => {
  let process = new LoggedProcess(Process.env.MAKE_PATH, [])
  test.is(await process.whenExit(), 0)
})

Test.serial('null', async (test) => {
  // an invalid target fails
  let process = new LoggedProcess(Process.env.MAKE_PATH, [ 'null' ])
  test.is(await process.whenExit(), 2)
})

Test.serial('commit message=...', async (test) => {
  let process = new LoggedProcess(Process.env.MAKE_PATH, [
    '--dry-run',
    'commit',
    'message=test'
  ])
  test.is(await process.whenExit(), 0)
  // test.is(Shell.exec(`${Process.env.MAKE_PATH} --dry-run commit message=test`, { 'silent': true }).code, 0)
})

/* c8 ignore next 3 */
;(Process.env.message ? Test.serial.skip : Test.serial)('commit', async (test) => {
  let process = new LoggedProcess(Process.env.MAKE_PATH, [
    '--dry-run',
    'commit'
  ])
  test.is(await process.whenExit(), 2)
  // test.is(Shell.exec(`${Process.env.MAKE_PATH} --dry-run commit`, { 'silent': true }).code, IsDirty ? 2 : 0)
})

// Test.serial('update', async (test) => {
//   test.is(Shell.exec(`${Process.env.MAKE_PATH} --dry-run update`, { 'silent': true }).code, 0)
// })

// Test.serial('version', async (test) => {
//   test.is(Shell.exec(`${Process.env.MAKE_PATH} --dry-run version`, { 'silent': true }).code, 0)
// })

// Test.serial('install', async (test) => {
//   test.is(Shell.exec(`${Process.env.MAKE_PATH} --dry-run install`, { 'silent': true }).code, 0)
// })

// Test.serial('re-install', async (test) => {
//   test.is(Shell.exec(`${Process.env.MAKE_PATH} --dry-run re-install`, { 'silent': true }).code, 0)
// })

// Test.serial('clean', async (test) => {
//   test.is(Shell.exec(`${Process.env.MAKE_PATH} --dry-run clean`, { 'silent': true }).code, 0)
// })

// Test.serial('run argument="..."', async (test) => {
//   test.is(Shell.exec(`${Process.env.MAKE_PATH} --dry-run run argument="release/command/mablung-makefile.js get-version"`, { 'silent': true }).code, 0)
// })

// /* c8 ignore next 3 */
// ;(Process.env.argument ? Test.serial.skip : Test.serial)('run ...', async (test) => {
//   test.is(Shell.exec(`${Process.env.MAKE_PATH} --dry-run run release/command/mablung-makefile.js get-version`, { 'silent': true }).code, 0)
// })

// /* c8 ignore next 3 */
// ;(Process.env.argument ? Test.serial.skip : Test.serial)('run', async (test) => {
//   test.is(Shell.exec(`${Process.env.MAKE_PATH} --dry-run run`, { 'silent': true }).code, 2)
// })

// /* c8 ignore next 3 */
// ;(Process.env.argument ? Test.serial.skip : Test.serial)('cover', async (test) => {
//   test.is(Shell.exec(`${Process.env.MAKE_PATH} --dry-run cover`, { 'silent': true }).code, 0)
// })

// /* c8 ignore next 3 */
// ;(Process.env.argument ? Test.serial.skip : Test.serial)('test', async (test) => {
//   test.is(Shell.exec(`${Process.env.MAKE_PATH} --dry-run test`, { 'silent': true }).code, 0)
// })

// /* c8 ignore next 3 */
// ;(IsDirty ? Test.serial.skip : Test.serial)('release version=...', async (test) => {
//   test.is(Shell.exec(`${Process.env.MAKE_PATH} --dry-run release version=prerelease`, { 'silent': true }).code, 0)
// })

// /* c8 ignore next 3 */
// ;(IsDirty || Process.env.version ? Test.serial.skip : Test.serial)('release', async (test) => {
//   test.is(Shell.exec(`${Process.env.MAKE_PATH} --dry-run release`, { 'silent': true }).code, 2)
// })

// Test.serial('build', async (test) => {
//   test.is(Shell.exec(`${Process.env.MAKE_PATH} --dry-run build`, { 'silent': true }).code, 0)
// })

// Test.serial('debug', async (test) => {
//   test.is(Shell.exec(`${Process.env.MAKE_PATH} --dry-run debug`, { 'silent': true }).code, 0)
// })
