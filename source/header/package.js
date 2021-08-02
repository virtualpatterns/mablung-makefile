import { createRequire as CreateRequire } from 'module'
import FileSystem from 'fs-extra'

const Process = process
const Require = CreateRequire(import.meta.url)

const Package = FileSystem.readJsonSync(Require.resolve(`${Process.cwd()}/package.json`), { 'encoding': 'utf-8' })

export { Package }