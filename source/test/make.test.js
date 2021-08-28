import { DateTime } from 'luxon'
import FileSystem from 'fs-extra'
import Shell from 'shelljs'
import Path from 'path'
import Test from 'ava'
import URL from 'url'

const FilePath = URL.fileURLToPath(import.meta.url)
const FolderPath = Path.dirname(FilePath)
const LogPath = Path.resolve(`${FolderPath}/../../data/make/make.log`)
const Process = process

Test.before(async () => {
  await FileSystem.ensureDir(Path.dirname(LogPath))
  await FileSystem.remove(LogPath)
})

Test.beforeEach((test) => {
  Shell.exec(`echo "${test.title.replace(/^beforeEach hook for (.*)$/, 'Test.serial(\'$1\', () => { ... })')}" >> ${LogPath}`, { 'silent': true })
})

Test.serial('default', (test) => {
  test.is(Shell.exec(`make --no-print-directory 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 0)
})

Test.serial('null', (test) => {
  // an invalid target fails
  test.is(Shell.exec(`make --no-print-directory null 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 2)
})

Test.serial('null (dry-run)', (test) => {
  // an invalid target fails even when --dry-run
  test.is(Shell.exec(`make --dry-run --no-print-directory null 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 2)
})

;[
  'message',
  'm'
].forEach((variable) => {

  Test.serial(`commit ${variable}=... (dry-run, dirty)`, (test) => {

    let name = `${DateTime.utc().toFormat('yyyyLLddHHmmssSSS')}-test`

    Shell.touch(name)

    try {
      test.is(Shell.exec(`make --dry-run --no-print-directory commit ${variable}=test 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 0)
    } finally {
      Shell.rm(name)
    }

  })

})

Test.serial('commit (dry-run, dirty)', (test) => {

  let name = `${DateTime.utc().toFormat('yyyyLLddHHmmssSSS')}-test`

  Shell.touch(name)

  try {
    test.is(Shell.exec(`make --dry-run --no-print-directory commit 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 2)
  } finally {
    Shell.rm(name)
  }

})

Test.serial('commit (dry-run, non-dirty)', (test) => {
  test.is(Shell.exec(`make --dry-run --no-print-directory commit 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 0)
})

Test.serial('update (dry-run)', (test) => {
  test.is(Shell.exec(`make --dry-run --no-print-directory update 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 0)
})

Test.serial('version', (test) => {
  test.is(Shell.exec(`make --no-print-directory version 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 0)
})

Test.serial('install (dry-run)', (test) => {
  test.is(Shell.exec(`make --dry-run --no-print-directory install 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 0)
})

Test.serial('re-install (dry-run)', (test) => {
  test.is(Shell.exec(`make --dry-run --no-print-directory re-install 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 0)
})

Test.serial('clean (dry-run)', (test) => {
  test.is(Shell.exec(`make --dry-run --no-print-directory clean 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 0)
})

;[
  'parameter',
  'p'
].forEach((variable) => {

  Test.serial(`run ${variable}="..."`, (test) => {
    test.is(Shell.exec(`make --no-print-directory run ${variable}="release/command/mablung-makefile.js get-version" 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 0)
  })

})

Test.serial('run', (test) => {
  test.is(Shell.exec(`make --no-print-directory run 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 2)
})

Test.serial('cover (dry-run)', (test) => {
  test.is(Shell.exec(`make --dry-run --no-print-directory cover 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 0)
})

;[
  'parameter',
  'p'
].forEach((variable) => {

  Test.serial(`cover ${variable}=... (dry-run)`, (test) => {
    test.is(Shell.exec(`make --dry-run --no-print-directory cover ${variable}=release/test/make.test.js 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 0)
  })

})

Test.serial('test (dry-run)', (test) => {
  test.is(Shell.exec(`make --dry-run --no-print-directory test 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 0)
})

;[
  'parameter',
  'p'
].forEach((variable) => {

  Test.serial(`test ${variable}=... (dry-run)`, (test) => {
    test.is(Shell.exec(`make --dry-run --no-print-directory test ${variable}=release/test/make.test.js 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 0)
  })

})

;[
  'version',
  'v'
].forEach((variable) => {

  Test.serial(`release ${variable}=... (dry-run, non-dirty)`, (test) => {
    test.is(Shell.exec(`make --dry-run --no-print-directory release ${variable}=prerelease 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 0)
  })

})

/* c8 ignore next 3 */
;(Process.env.version ? Test.serial.skip : Test.serial)('release (dry-run, non-dirty)', (test) => {
  test.is(Shell.exec(`make --dry-run --no-print-directory release 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 2)
})

Test.serial('release (dry-run, dirty)', (test) => {

  let name = `${DateTime.utc().toFormat('yyyyLLddHHmmssSSS')}-test`

  Shell.touch(name)

  try {
    test.is(Shell.exec(`make --dry-run --no-print-directory release 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 2)
  } finally {
    Shell.rm(name)
  }

})

Test.serial('build (dry-run)', (test) => {
  test.is(Shell.exec(`make --dry-run --no-print-directory build 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 0)
})

Test.serial('debug (dry-run)', (test) => {
  test.is(Shell.exec(`make --dry-run --no-print-directory debug 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 0)
})
