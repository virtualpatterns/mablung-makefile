import { createRequire as CreateRequire } from 'module'
import FileSystem from 'fs-extra'
import JSON5 from 'json5'

const Require = CreateRequire(import.meta.url)

const Package = JSON5.parse(FileSystem.readFileSync(Require.resolve('../../package.json')), { 'encoding': 'utf-8' })

export default Package.eslintConfig