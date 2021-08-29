import FileSystem from 'fs-extra'
import Is from '@pwn/is'
import Shell from 'shelljs'
import Path from 'path'
import Test from 'ava'
import URL from 'url'

const FilePath = URL.fileURLToPath(import.meta.url)
const FolderPath = Path.dirname(FilePath)
const IsDirty = Is.not.emptyString(Shell.exec('git status --porcelain ', { 'silent': true }).stdout)
const LogPath = Path.resolve(`${FolderPath}/../../data/make/make.log`)
const Process = process

Test.before(async () => {
  await FileSystem.ensureDir(Path.dirname(LogPath))
  await FileSystem.remove(LogPath)
})

Test.beforeEach((test) => {
  Shell.exec(`echo "${test.title.replace(/^beforeEach hook for (.*)$/, 'Test.serial(\'$1\', (test) => { ... })')}" >> ${LogPath}`, { 'silent': true })
})

Test.serial('default', (test) => {
  test.is(Shell.exec(`make --dry-run 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 0)
})

Test.serial('null', (test) => {
  // an invalid target fails
  test.is(Shell.exec(`make --dry-run null 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 2)
})

Test.serial('commit message=...', (test) => {
  test.is(Shell.exec(`make --dry-run commit message=test 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 0)
})

/* c8 ignore next 3 */
;(Process.env.message ? Test.serial.skip : Test.serial)('commit', (test) => {
  test.is(Shell.exec(`make --dry-run commit 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, IsDirty ? 2 : 0)
})

Test.serial('update', (test) => {
  test.is(Shell.exec(`make --dry-run update 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 0)
})

Test.serial('version', (test) => {
  test.is(Shell.exec(`make --dry-run version 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 0)
})

Test.serial('install', (test) => {
  test.is(Shell.exec(`make --dry-run install 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 0)
})

Test.serial('re-install', (test) => {
  test.is(Shell.exec(`make --dry-run re-install 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 0)
})

Test.serial('clean', (test) => {
  test.is(Shell.exec(`make --dry-run clean 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 0)
})

Test.serial('run argument="..."', (test) => {
  test.is(Shell.exec(`make --dry-run run argument="release/command/mablung-makefile.js get-version" 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 0)
})

/* c8 ignore next 3 */
;(Process.env.argument ? Test.serial.skip : Test.serial)('run ...', (test) => {
  test.is(Shell.exec(`make --dry-run run release/command/mablung-makefile.js get-version 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 0)
})

/* c8 ignore next 3 */
;(Process.env.argument ? Test.serial.skip : Test.serial)('run', (test) => {
  test.is(Shell.exec(`make --dry-run run 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 2)
})

/* c8 ignore next 3 */
;(Process.env.argument ? Test.serial.skip : Test.serial)('cover', (test) => {
  test.is(Shell.exec(`make --dry-run cover 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 0)
})

/* c8 ignore next 3 */
;(Process.env.argument ? Test.serial.skip : Test.serial)('test', (test) => {
  test.is(Shell.exec(`make --dry-run test 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 0)
})

/* c8 ignore next 3 */
;(IsDirty ? Test.serial.skip : Test.serial)('release version=...', (test) => {
  test.is(Shell.exec(`make --dry-run release version=prerelease 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 0)
})

/* c8 ignore next 3 */
;(IsDirty || Process.env.version ? Test.serial.skip : Test.serial)('release', (test) => {
  test.is(Shell.exec(`make --dry-run release 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 2)
})

Test.serial('build', (test) => {
  test.is(Shell.exec(`make --dry-run build 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 0)
})

Test.serial('debug', (test) => {
  test.is(Shell.exec(`make --dry-run debug 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 0)
})

Test.afterEach(() => {
  Shell.exec(`echo >> ${LogPath}`, { 'silent': true })
})
