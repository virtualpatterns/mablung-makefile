#!/usr/bin/env node

import { createRequire as CreateRequire } from 'module'
import Command from 'commander'
import FileSystem from 'fs-extra'
import JSON5 from 'json5'
import Upgrade from 'npm-check-updates'

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
    } catch (error) {
      console.error(error)
      process.exitCode = 1
    }

  })

Command
  .command('get-upgrade')
  .description('Return the version of the available upgrade or nothing if none is available.')
  .action(async () => {

    process.exitCode = 0

    try {

      let upgrade = await Upgrade.run({
        'filter': Package.name,
        'packageFile': `${Process.cwd()}/package.json`
      })

      if (upgrade[Package.name]) {
        console.log(upgrade[Package.name])
      }
      
    } catch (error) {
      console.error(error)
      process.exitCode = 1
    }

  })

Command
  .parse(Process.argv)
