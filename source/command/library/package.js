import { createRequire as CreateRequire } from 'module'
import FileSystem from 'fs-extra'

const Require = CreateRequire(import.meta.url)

const Package = FileSystem.readJsonSync(Require.resolve('../../../package.json'), { 'encoding': 'utf-8' })

export { Package }