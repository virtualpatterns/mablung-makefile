#!/usr/bin/env node

import { createRequire as CreateRequire } from 'module'
import Command from 'commander'
import FileSystem from 'fs-extra'
import Is from '@pwn/is'
import Path from 'path'
import URL from 'url'

import { Package as ThisPackage } from './library/this-package.js'
import { Package as ThatPackage } from './library/that-package.js'

import { UpdateConfigurationError } from './error/update-configuration-error.js'

const FilePath = URL.fileURLToPath(import.meta.url)
const FolderPath = Path.dirname(FilePath)
const Process = process
const Require = CreateRequire(import.meta.url)

Command
  .name(ThisPackage.name.replace(/^(.*)\/(.*)$/, '$2'))
  .version(ThisPackage.version)

Command
  .command('get-version')
  .description('Return the name and version of the @virtualpatterns/mablung-makefile package.')
  .action(() => {

    Process.exitCode = 0

    try {
      console.log(`${ThisPackage.name}@${ThisPackage.version}`)
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
      console.log(Require.resolve('../../makefile'))
    } catch (error) {
      Process.exitCode = 1
      console.error(error)
    }

  })

Command
  .command('get-header')
  .description('Return the name, description, etc. of the package.')
  .action(() => {

    Process.exitCode = 0

    try {

      console.log()
      console.log(`Package:     ${ThatPackage.name}`)
      console.log(`Description: ${ThatPackage.description}`)
      console.log(`Version:     ${ThatPackage.version}`)
      console.log(`License:     ${ThatPackage.license}`)
      console.log(`Author:      ${ThatPackage.author}`)
      console.log(`Repository:  ${ThatPackage.repository.url}`)
      console.log(`Source:      ${Process.env.SOURCE_PATH}`)

    } catch (error) {
      Process.exitCode = 1
      console.error(error)
    }

  })

Command
  .command('update-configuration')
  .argument('[path]', 'Path to update', '.')
  .description('Update the .eslintrc.json and babel.config.json files at the given path.')
  .action(async (path) => {

    Process.exitCode = 0

    try {

      let sourcePath = Path.resolve(`${FolderPath}/../..`)
      let targetPath = Path.resolve(path)

      if (Is.not.equal(targetPath, sourcePath)) {

        await FileSystem.ensureDir(targetPath)

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
        throw new UpdateConfigurationError(path)
      }

    } catch (error) {
      Process.exitCode = 1
      console.error(error)
    }

  })

Command
  .parse(Process.argv)
