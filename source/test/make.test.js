import { CreateLoggedProcess } from '@virtualpatterns/mablung-worker/test'
import { SpawnedProcess } from '@virtualpatterns/mablung-worker'
import FileSystem from 'fs-extra'
import Is from '@pwn/is'
import Path from 'path'
import Test from 'ava'
import URL from 'url'

async function main() {

  const FilePath = URL.fileURLToPath(import.meta.url)
  const Process = process

  const LogPath = FilePath.replace('/release/', '/data/').replace(/\.test\.c?js$/, '.log')
  const LoggedProcess = CreateLoggedProcess(SpawnedProcess, LogPath)

  const IsDirty = Is.equal(Process.env.GIT_IS_DIRTY, 'true')

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
    let process = new LoggedProcess(Process.env.MAKE_PATH, [ '--dry-run', 'commit', 'message=test' ])
    test.is(await process.whenExit(), 0)
  })

  Test.serial('commit', async (test) => {

    if (Process.env.message) { test.log(`Process.env.message = '${Process.env.message}'`) }

    let process = new LoggedProcess(Process.env.MAKE_PATH, ['--dry-run', 'commit'])
    ;(Process.env.message ? test.is.skip : test.is)(await process.whenExit(), IsDirty ? 2 : 0)
    
  })

  Test.serial('update', async (test) => {
    let process = new LoggedProcess(Process.env.MAKE_PATH, [ '--dry-run', 'update' ])
    test.is(await process.whenExit(), 0)
  })

  Test.serial('version', async (test) => {
    let process = new LoggedProcess(Process.env.MAKE_PATH, [ 'version' ])
    test.is(await process.whenExit(), 0)
  })

  Test.serial('install', async (test) => {
    let process = new LoggedProcess(Process.env.MAKE_PATH, [ '--dry-run', 'install' ])
    test.is(await process.whenExit(), 0)
  })

  Test.serial('re-install', async (test) => {
    let process = new LoggedProcess(Process.env.MAKE_PATH, [ '--dry-run', 're-install' ])
    test.is(await process.whenExit(), 0)
  })

  Test.serial('run argument="..."', async (test) => {
    let process = new LoggedProcess(Process.env.MAKE_PATH, [ 'run', 'argument=release/command/index.js get-version' ])
    test.is(await process.whenExit(), 0)
  })

  Test.serial('run ...', async (test) => {

    if (Process.env.argument) { test.log(`Process.env.argument = '${Process.env.argument}'`) }

    let process = new LoggedProcess(Process.env.MAKE_PATH, [ 'run', 'release/command/index.js', 'get-version' ])
    ;(Process.env.argument ? test.is.skip : test.is)(await process.whenExit(), 0)
      
  })

  Test.serial('run', async (test) => {

    if (Process.env.argument) { test.log(`Process.env.argument = '${Process.env.argument}'`) }

    let process = new LoggedProcess(Process.env.MAKE_PATH, [ 'run' ])
    ;(Process.env.argument ? test.is.skip : test.is)(await process.whenExit(), 2)

  })

  Test.serial('cover', async (test) => {
 
    if (Process.env.argument) { test.log(`Process.env.argument = '${Process.env.argument}'`) }

    let process = new LoggedProcess(Process.env.MAKE_PATH, [ '--dry-run', 'cover' ])
    ;(Process.env.argument ? test.is.skip : test.is)(await process.whenExit(), 0)

  })

  Test.serial('test', async (test) => {

    if (Process.env.argument) { test.log(`Process.env.argument = '${Process.env.argument}'`) }

    let process = new LoggedProcess(Process.env.MAKE_PATH, [ '--dry-run', 'test' ])
    ;(Process.env.argument ? test.is.skip : test.is)(await process.whenExit(), 0)

  })

  Test.serial('release version=...', async (test) => {

    if (IsDirty) { test.log(`IsDirty = ${IsDirty}`) }

    let process = new LoggedProcess(Process.env.MAKE_PATH, [ '--dry-run', 'release', 'version=prerelease' ])
    ;(IsDirty ? test.is.skip : test.is)(await process.whenExit(), 0)

  })

  Test.serial('release', async (test) => {

    if (IsDirty) { test.log(`IsDirty = ${IsDirty}`) }
    if (Process.env.version) { test.log(`Process.env.version = '${Process.env.version}'`) }

    let process = new LoggedProcess(Process.env.MAKE_PATH, [ '--dry-run', 'release' ])
    ;(IsDirty || Process.env.version ? test.is.skip : test.is)(await process.whenExit(), 2)

  })

  Test.serial('build', async (test) => {
    let process = new LoggedProcess(Process.env.MAKE_PATH, [ 'build' ])
    test.is(await process.whenExit(), 0)
  })

  Test.serial('clean', async (test) => {
    let process = new LoggedProcess(Process.env.MAKE_PATH, ['--dry-run', 'clean'])
    test.is(await process.whenExit(), 0)
  })

  Test.serial('debug', async (test) => {
    let process = new LoggedProcess(Process.env.MAKE_PATH, [ 'debug' ])
    test.is(await process.whenExit(), 0)
  })

}

main()
