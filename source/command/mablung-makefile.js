#!/usr/bin/env node

import { createRequire as CreateRequire } from 'module'
import Command from 'commander'
import FileSystem from 'fs-extra'
import JSON5 from 'json5'

const Process = process
const Require = CreateRequire(import.meta.url)

const Package = JSON5.parse(FileSystem.readFileSync(Require.resolve('../../package.json')), { 'encoding': 'utf-8' })

Command
  .version(Package.version)

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
  .command('get-version')
  .description('Return the name and version of the package.')
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
  .parse(Process.argv)
