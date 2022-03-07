import { CreateLoggedProcess } from '@virtualpatterns/mablung-worker/test'
import { SpawnedProcess } from '@virtualpatterns/mablung-worker'
import FileSystem from 'fs-extra'
import Path from 'path'
import Test from 'ava'
import URL from 'url'

import { CreateRandomId } from './library/create-random-id.js'

const FilePath = URL.fileURLToPath(import.meta.url)
const Process = process

const DataPath = FilePath.replace('/release/', '/data/').replace('.test.js', '')
const LogPath = DataPath.concat('.log')
const LoggedProcess = CreateLoggedProcess(SpawnedProcess, LogPath)

const DebugContent = 'include makefile\n\ndefault:: debug clean;'
const IgnoreContent = 'include makefile\n\ndefault:: ignore;'

Test.before(async () => {
  await FileSystem.ensureDir(Path.dirname(LogPath))
  return FileSystem.remove(LogPath)
})

Test('clean', async (test) => {

  let process = new LoggedProcess(Process.env.MAKE_PATH, [
    '--dry-run',
    'clean'
  ])
  
  test.is(await process.whenExit(), 0)

})

Test('clean data/id', async (test) => {

  let id = await CreateRandomId()
  let dataPath = Path.resolve(DataPath, id)

  await FileSystem.ensureDir(dataPath)

  let process = new LoggedProcess(Process.env.MAKE_PATH, [
    'clean',
    'is-cleaning=true',
    `current-clean-folder=${dataPath}`
  ])

  test.is(await process.whenExit(), 0)
  test.is(await FileSystem.pathExists(dataPath), false)

})

Test('clean data/id/file.json', async (test) => {

  let id = await CreateRandomId()
  let dataPath = Path.resolve(DataPath, id)

  let path = Path.resolve(dataPath, 'file.json')

  await FileSystem.ensureFile(path)

  let process = new LoggedProcess(Process.env.MAKE_PATH, [
    'clean',
    'is-cleaning=true',
    `current-clean-folder=${dataPath}`
  ])

  test.is(await process.whenExit(), 0)

  test.is(await FileSystem.pathExists(path), false)
  test.is(await FileSystem.pathExists(dataPath), false)

})

Test('clean data/id/folder/file.json', async (test) => {

  let id = await CreateRandomId()
  let dataPath = Path.resolve(DataPath, id)

  let path = Path.resolve(dataPath, 'folder/file.json')

  await FileSystem.ensureFile(path)

  let process = new LoggedProcess(Process.env.MAKE_PATH, [
    'clean',
    'is-cleaning=true',
    `current-clean-folder=${dataPath}`
  ])

  test.is(await process.whenExit(), 0)

  test.is(await FileSystem.pathExists(path), false)
  test.is(await FileSystem.pathExists(dataPath), false)

})

Test('clean when debugged', async (test) => {

  let id = await CreateRandomId()
  let dataPath = Path.resolve(DataPath, id)

  let path = [
    Path.resolve(dataPath, 'folder/file.json'),
    Path.resolve(dataPath, 'folder/makefile')
  ]

  await Promise.all([
    FileSystem.ensureFile(path[0]),
    FileSystem.outputFile(path[1], DebugContent, { 'encoding': 'utf-8' })
  ])

  let process = new LoggedProcess(Process.env.MAKE_PATH, [
    'clean',
    'is-cleaning=true',
    `current-clean-folder=${dataPath}`
  ])

  test.is(await process.whenExit(), 0)

  test.is(await FileSystem.pathExists(path[0]), false)
  test.is(await FileSystem.pathExists(path[1]), false)
  test.is(await FileSystem.pathExists(dataPath), false)

})

Test('clean when ignored', async (test) => {

  let id = await CreateRandomId()
  let dataPath = Path.resolve(DataPath, id)

  let path = [
    Path.resolve(dataPath, 'folder/file.json'),
    Path.resolve(dataPath, 'folder/makefile')
  ]

  await Promise.all([
    FileSystem.ensureFile(path[0]),
    FileSystem.outputFile(path[1], IgnoreContent, { 'encoding': 'utf-8' })
  ])

  try {

    let process = new LoggedProcess(Process.env.MAKE_PATH, [
      'clean',
      'is-cleaning=true',
      `current-clean-folder=${dataPath}`
    ])

    test.is(await process.whenExit(), 0)

    test.is(await FileSystem.pathExists(path[0]), true)
    test.is(await FileSystem.pathExists(path[1]), true)
    test.is(await FileSystem.pathExists(DataPath), true)

  } finally {
    await FileSystem.remove(dataPath)
  }

})
