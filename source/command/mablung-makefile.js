#!/usr/bin/env node

import '../header/library/source-map-support.js'

import { createRequire as CreateRequire } from 'module'
import Command from 'commander'
import FileSystem from 'fs-extra'
import Is from '@pwn/is'
import Path from 'path'
import URL from 'url'

import { Package } from '../library/package.js'

import { UpdatePackageError } from './error/update-package-error.js'

const FilePath = URL.fileURLToPath(import.meta.url)
const FolderPath = Path.dirname(FilePath)
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
  .command('update-configuration')
  .argument('[path]', 'Path to update', '.')
  .description('Update the .eslintrc.json and babel.config.json files at the given path.')
  .action(async (path) => {

    process.exitCode = 0

    try {

      let sourcePath = Path.resolve(`${FolderPath}/../..`)
      let targetPath = Path.resolve(path)

      if (Is.not.equal(targetPath, sourcePath)) {

        let sourceCheckPath = Require.resolve(`${sourcePath}/.eslintrc.json`)
        let sourceCheckConfiguration = await FileSystem.readJson(sourceCheckPath, { 'encoding': 'utf-8' })

        await FileSystem.writeJson(`${targetPath}/.eslintrc.json`, sourceCheckConfiguration, { 'encoding': 'utf-8', 'spaces': 2 })

        let sourceCompilePath = Require.resolve(`${sourcePath}/babel.config.json`)
        let sourceCompileConfiguration = await FileSystem.readJson(sourceCompilePath, { 'encoding': 'utf-8' })

        let targetCompilePath = `${targetPath}/babel.config.json`
        let targetCompileConfiguration = (await FileSystem.pathExists(targetCompilePath)) ? (await FileSystem.readJson(targetCompilePath, { 'encoding': 'utf-8' })) : { 'overrides': [ {}, { 'exclude': [] } ] }

        sourceCompileConfiguration.overrides[1].exclude = targetCompileConfiguration.overrides[1].exclude

        await FileSystem.writeJson(targetCompilePath, sourceCompileConfiguration, { 'encoding': 'utf-8', 'spaces': 2 })

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
