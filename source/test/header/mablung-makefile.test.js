import FileSystem from 'fs-extra'
import Path from 'path'
import Test from 'ava'
import URL from 'url'

import { MablungMakefileProcess } from './mablung-makefile-process.js'

const FilePath = URL.fileURLToPath(import.meta.url)
const FolderPath = Path.dirname(FilePath)
const LogPath = Path.resolve(`${FolderPath}/../../../data/header/mablung-makefile.log`)

Test.before(async () => {
  await FileSystem.ensureDir(Path.dirname(LogPath))
  await FileSystem.remove(LogPath)
})

Test('default', async (test) => {
  let process = new MablungMakefileProcess(LogPath)
  test.is(await process.whenExit(), 0)
})
