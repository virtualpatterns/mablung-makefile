#!/usr/bin/env node

import Command from 'commander'
import FileSystem from 'fs-extra'
import Is from '@pwn/is'
import Path from 'path'
import URL from 'url'

import { LoadPackageSync } from '../library/load-package.js'

import { UpdateError } from './error/update-error.js'

const FilePath = URL.fileURLToPath(import.meta.url)
const FolderPath = Path.dirname(FilePath)
const Process = process

const Package = LoadPackageSync(Path.resolve(FolderPath, '../../package.json'))

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

Command
  .command('update')
  .argument('[path]', 'Path to update', '.')
  .description('Update the .eslintrc.json and babel.config.json files at the given path.\nNOTE:  Designed to be used by the pre-build step of the @virtualpatterns/babel-preset-mablung-makefile and @virtualpatterns/eslint-config-mablung-makefile projects.')
  .action(async (path) => {

    Process.exitCode = 0

    try {

      let sourcePath = Path.resolve(FolderPath, '../..')
      let targetPath = Path.resolve(path)

      if (Is.not.equal(targetPath, sourcePath)) {

        await FileSystem.ensureDir(targetPath)

        let sourceCheckPath = Path.resolve(sourcePath, '.eslintrc.json')
        let sourceCheck = await FileSystem.readJson(sourceCheckPath, { 'encoding': 'utf-8' })

        await FileSystem.writeJson(Path.resolve(targetPath, '.eslintrc.json'), sourceCheck, { 'encoding': 'utf-8', 'spaces': 2 })

        let sourceCompilePath = Path.resolve(sourcePath, 'babel.config.json')
        let sourceCompile = await FileSystem.readJson(sourceCompilePath, { 'encoding': 'utf-8' })

        await FileSystem.writeJson(Path.resolve(targetPath, 'babel.config.json'), sourceCompile, { 'encoding': 'utf-8', 'spaces': 2 })
        
      } else {
        throw new UpdateError(path)
      }

    } catch (error) {
      Process.exitCode = 1
      console.error(error)
    }

  })

Command
  .parse(Process.argv)
