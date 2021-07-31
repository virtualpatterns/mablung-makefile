import { createRequire as CreateRequire } from 'module'
import FileSystem from 'fs-extra'
import JSON5 from 'json5'

const Process = process
const Require = CreateRequire(import.meta.url)

const Package = JSON5.parse(FileSystem.readFileSync(Require.resolve(`${Process.cwd()}/package.json`)), { 'encoding': 'utf-8' })

export { Package }