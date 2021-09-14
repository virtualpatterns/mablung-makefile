import { CreateLoggedProcess, SpawnedProcess } from '@virtualpatterns/mablung-worker'
import FileSystem from 'fs-extra'
import Git from 'nodegit'
import Path from 'path'
import Test from 'ava'
import URL from 'url'

async function main() {

  const FilePath = URL.fileURLToPath(import.meta.url)
  const FolderPath = Path.dirname(FilePath)
  const LogPath = FilePath.replace(/\/release\//, '/data/').replace(/\.c?js$/, '.log')
  const Process = process

  const LoggedProcess = CreateLoggedProcess(SpawnedProcess, LogPath)

  const Repository = await Git.Repository.open(Path.resolve(`${FolderPath}/../..`))
  const Status = await Repository.getStatus()
  const IsDirty = Status.length > 0 ? true : false

  Test.before(async (test) => {
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

  ;(Process.env.message ? Test.serial.skip : Test.serial)('commit', async (test) => {
    let process = new LoggedProcess(Process.env.MAKE_PATH, [ '--dry-run', 'commit' ])
    test.is(await process.whenExit(), IsDirty ? 2 : 0)
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

  Test.serial('clean', async (test) => {
    let process = new LoggedProcess(Process.env.MAKE_PATH, [ '--dry-run', 'clean' ])
    test.is(await process.whenExit(), 0)
  })

  Test.serial('run argument="..."', async (test) => {
    let process = new LoggedProcess(Process.env.MAKE_PATH, [ 'run', 'argument=release/command/index.js get-version' ])
    test.is(await process.whenExit(), 0)
  })

  ;(Process.env.argument ? Test.serial.skip : Test.serial)('run ...', async (test) => {
    let process = new LoggedProcess(Process.env.MAKE_PATH, [ 'run', 'release/command/index.js', 'get-version' ])
    test.is(await process.whenExit(), 0)
  })

  ;(Process.env.argument ? Test.serial.skip : Test.serial)('run', async (test) => {
    let process = new LoggedProcess(Process.env.MAKE_PATH, [ 'run' ])
    test.is(await process.whenExit(), 2)
  })

  ;(Process.env.argument ? Test.serial.skip : Test.serial)('cover', async (test) => {
    let process = new LoggedProcess(Process.env.MAKE_PATH, [ '--dry-run', 'cover' ])
    test.is(await process.whenExit(), 0)
  })

  ;(Process.env.argument ? Test.serial.skip : Test.serial)('test', async (test) => {
    let process = new LoggedProcess(Process.env.MAKE_PATH, [ '--dry-run', 'test' ])
    test.is(await process.whenExit(), 0)
  })

  ;(IsDirty ? Test.serial.skip : Test.serial)('release version=...', async (test) => {
    let process = new LoggedProcess(Process.env.MAKE_PATH, [ '--dry-run', 'release', 'version=prerelease' ])
    test.is(await process.whenExit(), 0)
  })

  ;(IsDirty || Process.env.version ? Test.serial.skip : Test.serial)('release', async (test) => {
    let process = new LoggedProcess(Process.env.MAKE_PATH, [ '--dry-run', 'release' ])
    test.is(await process.whenExit(), 2)
  })

  Test.serial('build', async (test) => {
    let process = new LoggedProcess(Process.env.MAKE_PATH, [ 'build' ])
    test.is(await process.whenExit(), 0)
  })

  Test.serial('debug', async (test) => {
    let process = new LoggedProcess(Process.env.MAKE_PATH, [ 'debug' ])
    test.is(await process.whenExit(), 0)
  })

}

main()
