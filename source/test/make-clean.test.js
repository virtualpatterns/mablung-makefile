import { CreateLoggedProcess } from '@virtualpatterns/mablung-worker/test'
import { SpawnedProcess } from '@virtualpatterns/mablung-worker'
import FileSystem from 'fs-extra'
import Path from 'path'
import Test from 'ava'
import URL from 'url'

const FilePath = URL.fileURLToPath(import.meta.url)
const Process = process

const DataPath = FilePath.replace('/release/', '/data/').replace('.test.js', '')
const LogPath = DataPath.concat('.log')
const LoggedProcess = CreateLoggedProcess(SpawnedProcess, LogPath)

const Content = 'include makefile\n\n.DEFAULT_GOAL := ignore'

Test.before(async () => {
  await FileSystem.ensureDir(Path.dirname(LogPath))
  return FileSystem.remove(LogPath)
})

Test.beforeEach(async () => {
  await FileSystem.remove(DataPath)
  return FileSystem.ensureDir(DataPath)
})

Test.serial('clean data', async (test) => {

  let process = new LoggedProcess(Process.env.MAKE_PATH, [
    'clean',
    'job-count=1',
    'verbose=true',
    `current-clean-folder=${DataPath}`
  ])

  test.is(await process.whenExit(), 0)

  test.is(await FileSystem.pathExists(DataPath), false)

})

Test.serial('clean data/0.json', async (test) => {

  let path = [ Path.resolve(DataPath, '0.json') ]

  await FileSystem.ensureFile(path[0])

  let process = new LoggedProcess(Process.env.MAKE_PATH, [
    'clean',
    'job-count=1',
    'verbose=true',
    `current-clean-folder=${DataPath}`
  ])

  test.is(await process.whenExit(), 0)

  test.is(await FileSystem.pathExists(path[0]), false)
  test.is(await FileSystem.pathExists(DataPath), false)

})

Test.serial('clean data/0/0.json', async (test) => {

  let path = [ Path.resolve(DataPath, '0/0.json') ]

  await FileSystem.ensureFile(path[0])

  let process = new LoggedProcess(Process.env.MAKE_PATH, [
    'clean',
    'job-count=1',
    'verbose=true',
    `current-clean-folder=${DataPath}`
  ])

  test.is(await process.whenExit(), 0)

  test.is(await FileSystem.pathExists(path[0]), false)
  test.is(await FileSystem.pathExists(Path.dirname(path[0])), false)
  test.is(await FileSystem.pathExists(DataPath), false)

})

Test.serial('clean data/0/makefile', async (test) => {

  let path = [
    Path.resolve(DataPath, '0/makefile'),
    Path.resolve(DataPath, '0/0.json')
  ]

  await FileSystem.outputFile(path[0], Content, { 'encoding': 'utf-8' })

  try {

    await FileSystem.ensureFile(path[1])

    let process = new LoggedProcess(Process.env.MAKE_PATH, [
      'clean',
      'job-count=1',
      'verbose=true',
      `current-clean-folder=${DataPath}`
    ])

    test.is(await process.whenExit(), 0)

    test.is(await FileSystem.pathExists(path[1]), true)
    test.is(await FileSystem.pathExists(path[0]), true)
    test.is(await FileSystem.pathExists(Path.dirname(path[0])), true)
    test.is(await FileSystem.pathExists(DataPath), true)

  } finally {
    await FileSystem.remove(path[0])
  }

})
