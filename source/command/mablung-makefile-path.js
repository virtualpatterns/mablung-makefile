#!/usr/bin/env node

import { createRequire as CreateRequire } from 'module'
import Command from 'commander'
import FileSystem from 'fs-extra'
import JSON5 from 'json5'

import { Path } from '../library/path.js'

const Process = process
const Require = CreateRequire(import.meta.url)

const Package = JSON5.parse(FileSystem.readFileSync(Require.resolve('../../package.json')), { 'encoding': 'utf-8' })

Command
  .version(Package.version)
  .action(() => {

    try {
      console.log(Path)
    } catch (error) {
      console.error(error)
      process.exitCode = 1
    }

  })

Command.parse(Process.argv)
