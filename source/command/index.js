#!/usr/bin/env node

import { program as Command } from 'commander'
// import FileSystem from 'fs-extra'
// import Is from '@pwn/is'
import Path from 'path'
import SourceMapSupport from 'source-map-support'
import URL from 'url'

import { Package } from '../library/package.js'

// import { UpdateError } from './error/update-error.js'

SourceMapSupport.install({
  'handleUncaughtExceptions': false
})

const FolderPath = Path.dirname(URL.fileURLToPath(import.meta.url))
const Process = process

Command
  .name(Package.name.replace(/^(.*)\/(.*)$/, '$2'))
  .version(Package.version)

Command
  .command('get-version')
  .description('Return the name and version of the @virtualpatterns/mablung-makefile package.')
  .action(() => {

    Process.exitCode = 0

    try {
      console.log(`${Package.name}@${Package.version}`)
    } catch (error) {
      Process.exitCode = 1
      console.error(error)
    }

  })

Command
  .command('get-path')
  .description('Return the path of the @virtualpatterns/mablung-makefile makefile.')
  .action(() => {

    Process.exitCode = 0

    try {
      console.log(Path.resolve(FolderPath, '../../makefile'))
    } catch (error) {
      Process.exitCode = 1
      console.error(error)
    }

  })

// Command
//   .command('update')
//   .argument('[path]', 'Path to update', '.')
//   .description('Update the .eslintrc.json and babel.config.json files at the given path.\nNOTE:  Designed to be used by the pre-build step of the @virtualpatterns/babel-preset-mablung-makefile and @virtualpatterns/eslint-config-mablung-makefile projects.')
//   .action(async (path) => {

//     Process.exitCode = 0

//     try {

//       let sourcePath = Path.resolve(FolderPath, '../..')
//       let targetPath = Path.resolve(path)

//       if (Is.not.equal(targetPath, sourcePath)) {

//         await FileSystem.ensureDir(targetPath)

//         await Promise.all([
//           FileSystem.copy(Path.resolve(sourcePath, '.eslintrc.json'), Path.resolve(targetPath, '.eslintrc.json'), { 'overwrite': true }),
//           FileSystem.copy(Path.resolve(sourcePath, 'babel.config.json'), Path.resolve(targetPath, 'babel.config.json'), { 'overwrite': true })
//         ])

//       } else {
//         throw new UpdateError(path)
//       }

//     } catch (error) {
//       Process.exitCode = 1
//       console.error(error)
//     }

//   })

Command
  .parse(Process.argv)
