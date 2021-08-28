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
  test.is(Shell.exec(`make 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 0)
})

Test.serial('null', (test) => {
  // an invalid target fails
  test.is(Shell.exec(`make null 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 2)
})

Test.serial('null (dry-run)', (test) => {
  // an invalid target fails even when --dry-run
  test.is(Shell.exec(`make --dry-run null 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 2)
})

;[
  'message',
  'm'
].forEach((variable) => {

  Test(`commit ${variable}=... (dry-run, dirty)`, (test) => {

    let name = `${DateTime.utc().toFormat('yyyyLLddHHmmssSSS')}-test`

    Shell.touch(name)

    try {
      test.is(Shell.exec(`make --dry-run commit ${variable}=test 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 0)
    } finally {
      Shell.rm(name)
    }

  })

})

Test.serial('commit (dry-run, dirty)', (test) => {

  let name = `${DateTime.utc().toFormat('yyyyLLddHHmmssSSS')}-test`

  Shell.touch(name)

  try {
    test.is(Shell.exec(`make --dry-run commit 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 2)
  } finally {
    Shell.rm(name)
  }

})

Test.serial('commit (dry-run, non-dirty)', (test) => {
  test.is(Shell.exec(`make --dry-run commit 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 0)
})

Test.serial('update (dry-run)', (test) => {
  test.is(Shell.exec(`make --dry-run update 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 0)
})

Test.serial('version', (test) => {
  test.is(Shell.exec(`make version 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 0)
})

Test.serial('install (dry-run)', (test) => {
  test.is(Shell.exec(`make --dry-run install 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 0)
})

Test.serial('re-install (dry-run)', (test) => {
  test.is(Shell.exec(`make --dry-run re-install 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 0)
})

Test.serial('clean (dry-run)', (test) => {
  test.is(Shell.exec(`make --dry-run clean 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 0)
})

;[
  'parameter',
  'p'
].forEach((variable) => {

  Test(`run ${variable}="..."`, (test) => {
    test.is(Shell.exec(`make run ${variable}="release/command/mablung-makefile.js get-version" 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 0)
  })

})

Test.serial('run', (test) => {
  test.is(Shell.exec(`make run 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 2)
})

Test.serial('cover (dry-run)', (test) => {
  test.is(Shell.exec(`make --dry-run cover 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 0)
})

;[
  'parameter',
  'p'
].forEach((variable) => {

  Test(`cover ${variable}=... (dry-run)`, (test) => {
    test.is(Shell.exec(`make --dry-run cover ${variable}=release/test/make.test.js 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 0)
  })

})

Test.serial('test (dry-run)', (test) => {
  test.is(Shell.exec(`make --dry-run test 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 0)
})

;[
  'parameter',
  'p'
].forEach((variable) => {

  Test(`test ${variable}=... (dry-run)`, (test) => {
    test.is(Shell.exec(`make --dry-run test ${variable}=release/test/make.test.js 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 0)
  })

})

;[
  'version',
  'v'
].forEach((variable) => {

  Test(`release ${variable}=... (dry-run, non-dirty)`, (test) => {
    test.is(Shell.exec(`make --dry-run release ${variable}=prerelease 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 0)
  })

})

;(Process.env.version ? Test.skip : Test)('release (dry-run, non-dirty)', (test) => {
  test.is(Shell.exec(`make --dry-run release 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 2)
})

Test.serial('release (dry-run, dirty)', (test) => {

  let name = `${DateTime.utc().toFormat('yyyyLLddHHmmssSSS')}-test`

  Shell.touch(name)

  try {
    test.is(Shell.exec(`make --dry-run release 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 2)
  } finally {
    Shell.rm(name)
  }

})

Test.serial('build (dry-run)', (test) => {
  test.is(Shell.exec(`make --dry-run build 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 0)
})

Test.serial('debug (dry-run)', (test) => {
  test.is(Shell.exec(`make --dry-run debug 1>> ${LogPath} 2>> ${LogPath}`, { 'silent': true }).code, 0)
})
