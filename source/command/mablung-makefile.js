#!/usr/bin/env node

import '../library/source-map-support.js'

import { createRequire as CreateRequire } from 'module'
import Command from 'commander'
import FileSystem from 'fs-extra'
import Path from 'path'

import { Package } from '../library/package.js'

import { UpdatePackageError } from './error/update-package-error.js'

const Process = process
const Require = CreateRequire(import.meta.url)

Command
  .version(Package.version)

Command
  .command('get-version')
  .description('Return the name and version of the makefile package.')
  .action(() => {

    process.exitCode = 0

    try {
      console.log(`${Package.name}@${Package.version}`)
    /* c8 ignore next 4 */
    } catch (error) {
      console.error(error)
      process.exitCode = 1
    }

  })

Command
  .command('get-path')
  .description('Return the path of the makefile.')
  .action(() => {

    process.exitCode = 0

    try {
      console.log(Require.resolve('../../makefile'))
    /* c8 ignore next 4 */
    } catch (error) {
      console.error(error)
      process.exitCode = 1
    }

  })

Command
  .command('update-package')
  .argument('[path]', 'Path to update', './package.json')
  .description('Update the babel and eslintConfig keys of the package.json at the given path.')
  .action(async (path) => {

    process.exitCode = 0

    try {

      let _path = Require.resolve(Path.resolve(path))
      let _package = await FileSystem.readJson(_path, { 'encoding': 'utf-8' })

      if (_package.name !== Package.name) {

        _package.babel = Package.babel
        _package.eslintConfig = Package.eslintConfig

        await FileSystem.writeJson(_path, _package, { 'encoding': 'utf-8', 'spaces': 2 })

      } else {
        throw new UpdatePackageError(path)
      }

    /* c8 ignore next 4 */
    } catch (error) {
      console.error(error)
      process.exitCode = 1
    }

  })

Command
  .parse(Process.argv)
